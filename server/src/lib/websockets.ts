import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

const { AWS_REGION, APIGW_MANAGEMENT_ENDPOINT } = process.env;

const apiGwClient = new ApiGatewayManagementApiClient({
  region: AWS_REGION,
  endpoint: APIGW_MANAGEMENT_ENDPOINT,
});

export const sendToConnection = async (message: any, connectionId: string) => {
  const sendToConnectionCommand = new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: Buffer.from(JSON.stringify(message)),
  });

  try {
    console.log("sending ws message", JSON.stringify(sendToConnectionCommand));
    const res = await apiGwClient.send(sendToConnectionCommand);
    console.log("successfully sent message", JSON.stringify(res));
  } catch (e) {
    console.error(
      "There was an error sending the message to the provided connection.",
      e
    );
    throw e;
  }
};
