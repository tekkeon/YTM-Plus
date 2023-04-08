import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import * as RoomLib from "../lib/room";

interface HostBody {
  intent: "HOST";
  deviceId: string;
}

interface ReopenBody {
  intent: "REOPEN";
  deviceId: string;
  roomId: string;
}

interface JoinBody {
  intent: "JOIN";
  roomId: string;
}

type Body = HostBody | ReopenBody | JoinBody;

const validateConnectEvent = (event: APIGatewayProxyEvent): string | null => {
  if (!event.body) {
    return "You must include a body with an intent in your request.";
  }

  const body = JSON.parse(event.body) as Body;

  if (!body.intent) {
    return "You must specify an intent in the body of your request.";
  }

  if (body.intent === "JOIN" && !body.roomId) {
    return "You must specify a roomId to join.";
  }

  return null;
};

const handleConnect = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  return {
    statusCode: 200,
    body: "hello!",
  };
};

export default handleConnect;
