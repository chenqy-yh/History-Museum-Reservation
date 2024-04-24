import { get } from "./base";

export const getUserCancelTimes = () => {
  return get("/user/cancelTimes");
};
