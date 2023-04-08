import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";

const handleDisconnect = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  /**
   * TODO: Implement the below
   * 1. Collect connectionId from event.requestContext.connectionId.
   * 2. Query rooms table by connectionId GSI to get the associated room.
   * 3. If user is a guest of the room, do nothing. Simply terminate the connection.
   * 4. If user is host of the room, delete the room and then terminate the connection.
   */

  return {
    statusCode: 200,
    body: "hello!",
  };
};

export default handleDisconnect;
