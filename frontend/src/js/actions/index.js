import { LOGIN} from "../constants/action-types";
export function login(payload) {
  console.log("dispatching the action")
  return { type: LOGIN, payload };
}