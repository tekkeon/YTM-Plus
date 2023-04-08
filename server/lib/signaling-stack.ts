import * as cdk from "aws-cdk-lib";
import { Duration, Stack } from "aws-cdk-lib";
import { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Runtime, Function } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct, DependencyGroup } from "constructs";
import * as path from "path";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";

export class YTMSignalingStack extends cdk.Stack {
  private signalingApi: WebSocketApi;
  private signalingHandler: Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const roomsTable = new Table(this, "rooms-table", {
      tableName: "Room",
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
    });

    this.signalingHandler = new NodejsFunction(this, "signaling-handler", {
      functionName: "YTMSignalingHandler",
      entry: path.join(__dirname, "../src/signalingHandler.ts"),
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_18_X,
      environment: {
        ROOMS_TABLE: roomsTable.tableName,
      },
    });

    roomsTable.grantReadWriteData(this.signalingHandler);

    this.signalingApi = new WebSocketApi(this, "signaling-api", {
      apiName: "YTMSignalingApi",
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "ConnectIntegration",
          this.signalingHandler
        ),
        returnResponse: true,
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "DisconnectIntegration",
          this.signalingHandler
        ),
        returnResponse: true,
      },
      defaultRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "DefaultIntegration",
          this.signalingHandler
        ),
        returnResponse: true,
      },
    });

    this.signalingApi.grantManageConnections(this.signalingHandler);

    const stage = new WebSocketStage(this, "signaling-api-prod-stage", {
      webSocketApi: this.signalingApi,
      stageName: "wss",
      autoDeploy: true,
    });

    // Management endpoint is an http endpoint whereas stage.url is wss endpoint
    const apiGwManagementEndpoint = stage.url.replace("wss://", "https://");

    this.signalingHandler.addEnvironment(
      "APIGW_MANAGEMENT_ENDPOINT",
      apiGwManagementEndpoint
    );
  }
}
