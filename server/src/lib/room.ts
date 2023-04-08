import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { customAlphabet } from "nanoid";
import { WebSocketEvent } from "../types";
import ddbDocClient from "./dynamodb";
import * as websockets from "./websockets";

/**
 * Generate a random Room ID.
 * @returns Randomly-generated Room ID string.
 */
const generateRoomId = customAlphabet(
  "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const generateUniqueRoomId = async (): Promise<string> => {
  let newRoomId: string;

  // Try generating a new ID
  while (true) {
    newRoomId = generateRoomId();
    const existingRoom = await getRoom(newRoomId);

    if (!existingRoom) {
      return newRoomId;
    }
  }
};

/**
 * Get a room obect by its ID.
 * @param roomId The ID of the room to retrieve.
 */
export const getRoom = async (roomId: string): Promise<Room | null> => {
  const getRoomByIdCommand = new QueryCommand({
    TableName: process.env.ROOMS_TABLE,
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": roomId,
    },
  });

  let room: Room | undefined;

  try {
    const result = await ddbDocClient.send(getRoomByIdCommand);
    room = (result.Items?.[0] as Room) || null;
  } catch (e: any) {
    const logErrorMessage = `There was an error querying for rooms. ${e}`;
    console.error(logErrorMessage);
    throw e;
  }

  return room;
};

/**
 * Create a new Room and store it to persistence.
 * @param props The properties of the room to create.
 */
export const createRoom = async (props: Omit<Room, "id">): Promise<Room> => {
  const newRoomId = await generateUniqueRoomId();

  const newRoom: Room = {
    id: newRoomId,
    ...props,
  };

  const createRoomCommand = new PutCommand({
    TableName: process.env.ROOMS_TABLE,
    Item: newRoom,
  });

  try {
    await ddbDocClient.send(createRoomCommand);
  } catch (e) {
    const logErrorMessage = `There was an error create a new room: ${newRoom}. ${e}`;
    console.error(logErrorMessage);
    throw e;
  }

  return newRoom;
};

/**
 * Request to join a room as a guest. This will relay a message to the host to request to
 * join, upon which we will wait for an acknowledgement from the host client.
 * @param roomId
 * @param guestConnectionId
 */
export const requestJoinRoom = async (
  roomId: string,
  guestConnectionId: string
) => {
  let room;

  try {
    room = await getRoom(roomId);
    console.log("Got room", JSON.stringify(room));
  } catch (e) {
    throw new Error("There was a problem joining the specified room.");
  }

  if (!room) {
    throw new Error("The specified roomId was not found.");
  }

  const { hostConnectionId } = room;

  const joinRequestEvent: WebSocketEvent = {
    type: "JoinRequested",
    guestConnectionId,
  };

  try {
    await websockets.sendToConnection(joinRequestEvent, hostConnectionId);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const negotiateWithPeer = async (
  message: any,
  connectionId: string,
  peerConnectionId: string
) => {
  const peerNegotiatiatedEvent: WebSocketEvent = {
    type: "PeerNegotiated",
    // Tell peer the sender's connection ID. To them, it will be the peer's connection ID, so we call
    // it peerConnectionId in the event.
    peerConnectionId: connectionId,
    message,
  };

  try {
    await websockets.sendToConnection(peerNegotiatiatedEvent, peerConnectionId);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
