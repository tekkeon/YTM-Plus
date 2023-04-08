import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import handleConnect from "./handlers/handleConnect";
import handleDefault from "./handlers/handleDefault";
import handleDisconnect from "./handlers/handleDisconnect";

exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  console.log(event);

  switch (event.requestContext.routeKey) {
    case "$connect":
      return handleConnect(event);

    case "$disconnect":
      return handleDisconnect(event);

    default:
      return handleDefault(event);
  }
};
