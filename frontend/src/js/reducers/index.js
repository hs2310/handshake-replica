import { LOGIN } from "../constants/action-types";
const initialState = {
  id : '',
  type : ''
};
// function rootReducer(state = initialState, action) {
//   if (action.type === ADD_BOOK) {
//     state.books.push(action.payload);
//   }
//   return state;
// }
function rootReducer(state = initialState, action) {
    if (action.type === LOGIN) {
      console.log("processing in reducer")
      return Object.assign({}, state, {
        id : action.payload.id,
        type : action.payload.type
      });
    }
    return state;
  }
  
export default rootReducer;