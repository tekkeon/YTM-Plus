import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import * as RoomLib from "../lib/room";
import { WebSocketEvent } from "../types";

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

interface NegotiateBody {
  intent: "NEGOTIATE";
  peerConnectionId: string;
  message: {
    [key: string]: any;
  };
}

type Body = HostBody | ReopenBody | JoinBody | NegotiateBody;

const validateDefaultEvent = (event: APIGatewayProxyEvent): string | null => {
  if (!event.body) {
    return "You must include a body with an intent in your request.";
  }

  const body = JSON.parse(event.body) as Body;

  if (!body.intent) {
    return "You must specify an intent in the body of your request.";
  }

  if (body.intent === "HOST" && !body.deviceId) {
    return "You must provide a deviceId to host a room.";
  }

  if (body.intent === "JOIN" && !body.roomId) {
    return "You must specify a roomId to join.";
  }

  if (body.intent === "NEGOTIATE") {
    if (!body.peerConnectionId) {
      return "You must specify a peerConnectionId to negotiate with.";
    }

    if (!body.message) {
      return "You must specify a negotiation message.";
    }
  }

  return null;
};

const handleDefault = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  /**
   * TODO: Implement the below
   * 1. Collect connectionId from event.requestContext.connectionId
   * 2. Collect required intent from event.body.intent. This will be either "HOST" or "JOIN".
   * 3. If intent is "JOIN", collect required roomId from event.body.roomId. Then query DB
   *    for the roomId and get the room's host. Return the host's connectionId to the client.
   * 4. If intent is "HOST", collect required deviceId from event.body.deviceId and create
   *    a new roomId and return the new roomId to the client.
   * 5. If intent is "REOPEN", collect required deviceId from event.body.deviceId, check that
   *    roomId and deviceId are equal.
   *   a. If yes, update room with new hostDeviceId and maintain WS connection.
   *   b. If no, terminate WS connection.
   */

  const validationError = validateDefaultEvent(event);

  if (validationError) {
    return {
      statusCode: 400,
      body: `Validation Error: ${validationError}`,
    };
  }

  const connectionId = event.requestContext.connectionId!;
  const body = JSON.parse(event.body!) as Body;

  switch (body.intent) {
    case "HOST":
      try {
        const newRoom = await RoomLib.createRoom({
          hostConnectionId: connectionId,
          hostDeviceId: body.deviceId,
        });

        const responseEvent: WebSocketEvent = {
          type: "NewRoomCreated",
          newRoomId: newRoom.id,
        };

        return {
          statusCode: 200,
          body: JSON.stringify(responseEvent),
        };
      } catch (e) {
        const failedToStartHostEvent: WebSocketEvent = {
          type: "StartHostFailed",
        };

        return {
          statusCode: 500,
          body: JSON.stringify(failedToStartHostEvent),
        };
      }

    case "JOIN":
      try {
        await RoomLib.requestJoinRoom(body.roomId, connectionId);

        return {
          statusCode: 200,
        };
      } catch (e) {
        const requestJoinFailedEvent: WebSocketEvent = {
          type: "RequestJoinFailed",
        };

        return {
          statusCode: 500,
          body: JSON.stringify(requestJoinFailedEvent),
        };
      }

    case "NEGOTIATE":
      try {
        await RoomLib.negotiateWithPeer(
          body.message,
          connectionId,
          body.peerConnectionId
        );

        return {
          statusCode: 200,
        };
      } catch (e) {
        const negotiateFailedEvent: WebSocketEvent = {
          type: "NegotiateFailed",
        };

        return {
          statusCode: 500,
          body: JSON.stringify(negotiateFailedEvent),
        };
      }
  }

  return {
    statusCode: 200,
    body: "hello!",
  };
};

export default handleDefault;
