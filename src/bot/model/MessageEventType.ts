export type MessageEventType =
  | MessageEventTypes.CREATE
  | MessageEventTypes.UPDATE;

export enum MessageEventTypes {
  CREATE = "messageCreate",
  UPDATE = "messageUpdate",
}
