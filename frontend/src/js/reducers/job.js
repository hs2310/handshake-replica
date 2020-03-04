import { GET_JOBS } from "../constants/action-types";

const initialState = {
    jobs:[]
};

function jobReducer(state = initialState, action) {
    if (action.type === GET_JOBS) {
        console.log(action.payload)

        return {...state,jobs:action.payload}
        // return Object.assign({}, state, {
        //     jobs: Object.assign({}, state.jobs, action.payload)
        // });
    }

    return state;
}
export default jobReducer;
;