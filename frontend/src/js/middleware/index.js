import { LOGIN } from "../constants/action-types";

export function login({ dispatch }) {
  return function(next) {
    return function(action) {
      if (action.type === LOGIN) {
          action.payload.id = '1'
          action.payload.type = 'students'
      }
      return next(action);
    };
  };
}