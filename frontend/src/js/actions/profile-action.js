import { GET_STUDENT} from "../constants/action-types";
export const getStudentData= (data) => ({
    type: GET_STUDENT,
    payload: {...data}
});
