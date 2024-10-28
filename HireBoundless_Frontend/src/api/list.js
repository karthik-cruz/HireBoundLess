import { END_POINTS } from "./urls";
import { readByIdApi } from "./action";

const getUser = async (data) => {
    return await readByIdApi(END_POINTS.getUser, data)
}

const getCompany = async (data) => {
    return await readByIdApi(END_POINTS.companyGet, data)
}

const getJobs = async (data) => {
    return await readByIdApi(END_POINTS.getJobs, data)
}


export { getUser, getCompany, getJobs } 