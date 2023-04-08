interface Room {
  /**
   * Generated server side to identify a room.
   */
  id: string;
  /**
   * Generated by client as a persistent way to identify the client. The host client will disconnect
   * from WS after 5 min. If they re-open the room for connections, they will provide the same
   * hostDeviceId and we should not recreate the room.
   */
  hostDeviceId: string;
  /**
   * The temporary connection ID provided by APIG WebSockets. This is required to send messages
   * to the host.
   */
  hostConnectionId: string;
}

/**
 * FLOW:
 * 1. Host clicks button on client to create room
 * 2. Host client generates a device ID using IP address as a seed
 * 3. Host client connects to WS with "HOST" command and hostDeviceId
 *   a. Room with ID 123 is created, storing hostDeviceId and hostConnectionId
 *   b. Room ID 123 is returned to Host client
 * 4. Host client creates a link with room ID 123
 * 5. Host user shares link with friend
 * 6. Friend visits link with room ID 123
 * 7. Friend's client does not generate a device ID because we don't need persistence
 * 8. Friend's client connects to WS with "JOIN" command and roomId
 *   a. Message is sent to Host's client with Friend's connectionId requesting WebRTC initiation
 *   b. Host client sends acknowledgement message to WS, which is forwarded to guest with host connection ID.
 * 9. Both clients begin sending WebRTC negotiation messages, including the other's
 *    connection ID, and signaling server relays those messages to each other based on connection ID.
 * 10. The WebRTC connection is established
 * 11. Friend's client disconnects from WS
 * 12. After 5 min, if no new friends join, Host's client disconnects from WS.
 * 13. After initial disconnect, Host may reopen the room for new friends to join. Host client will
 *     "REOPEN" command with hostDeviceId and roomId.
 *   a. Signaling server will query for roomId, and the provided hostDeviceId must match to reopen
 * 14. Host may close the room, which will delete room from DB.
 * 15. If room is not explicitly closed, it will be deleted from DB after 24 hours.
 */
