import { GET_STUDENT } from "../constants/action-types";

const initialState = {
    data: {
        sid: '',
        name: "",
        email: "",
        password: "",
        objective: "",
        dob: "",
        city: "",
        college: "",
        state: "",
        country: "",
        mob: "",
        profile_pic: "",
    },
    skills: [],
    skillSet: [],
    education: [],
    experience: []
};

function profileReducer(state = initialState, action) {
    if (action.type === GET_STUDENT) {
        console.log(action.payload)

        return Object.assign({}, state, {
            data: Object.assign({}, state.data, {
                sid: action.payload.sid,
                name: action.payload.name,
                email: action.payload.email,
                password: action.payload.password,
                objective: action.payload.objective,
                dob: action.payload.dob,
                city: action.payload.city,
                college: action.payload.college,
                state: action.payload.state,
                country: action.payload.country,
                mob: action.payload.mob,
                profile_pic: action.payload.profile_pic
            })
        });
    }

    return state;
}

export default profileReducer;