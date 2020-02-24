// import {SIGN_IN} from "../constants/action-types";

// const initialState = {
//     signupSuccess:null,
//     signupMessage: null,
//     signinSuccess: null,
//     signinMessage: null,
//     type : null
// }
// export default function accountReducer(state = initialState, action) {
//     if(action.type === SIGN_IN) {
//         return Object.assign({}, state, {
//             signinSuccess:action.payload.signupSuccess,
//             type:action.payload.signupMessage            
//         });
//         return state;
//     }
// }