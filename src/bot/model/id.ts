import { v4 } from "uuid";

export const generateRandomId = function (): string {
  return v4();
};
