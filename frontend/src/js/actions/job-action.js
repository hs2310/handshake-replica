import { GET_JOBS} from "../constants/action-types";
export const getJobs= (data) => ({
    type: GET_JOBS,
    payload: {...data}
});
