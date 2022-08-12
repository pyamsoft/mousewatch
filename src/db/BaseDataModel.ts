export interface BaseDataModel {
  id: string;
  createdAt: Date;
  userId: string;
  userName: string;
  messageId: string;
  channelId: string;
}

export const BaseDataModelRows = {
  ID: "_id",
  CREATED_AT: "created_at",
  USER_ID: "user_id",
  USER_NAME: "user_name",
  MESSAGE_ID: "message_id",
  CHANNEL_ID: "channel_id",
};
