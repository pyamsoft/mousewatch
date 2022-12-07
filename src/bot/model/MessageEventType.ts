export type MessageEventType =
  | MessageEventTypes.CREATE
  | MessageEventTypes.UPDATE
  | MessageEventTypes.REACTION;

export enum MessageEventTypes {
  CREATE = "messageCreate",
  UPDATE = "messageUpdate",
  REACTION = "messageReactionAdd",
}
