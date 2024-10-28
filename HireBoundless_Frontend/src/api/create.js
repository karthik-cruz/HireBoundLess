import { END_POINTS } from "./urls";
import { createByApi } from "./action";

const loginUser = async (data) => {
    return await createByApi(END_POINTS.login, data)
}

const signupUser = async (data) => {
    return await createByApi(END_POINTS.signup, data)
}

const forgotPassword = async (data) => {
    return await createByApi(END_POINTS.forgotPassword, data)
}

const resetPassword = async (data) => {
    return await createByApi(END_POINTS.resetPassword, data)
}

const verifyOtp = async (data) => {
    return await createByApi(END_POINTS.verifyOtp, data)
}

const companyCreate = async (data) => {
    return await createByApi(END_POINTS.companyCreate, data)
}



const jobPost = async (data) => {
    return await createByApi(END_POINTS.jobPost, data)
}

const postApplication = async (data) => {
    return await createByApi(END_POINTS.applicationPost, data)
}

// const profileCreate = async (data) => {
//     return await createByApi(END_POINTS.profileCreate, data)
// }

export {
    loginUser,
    signupUser,
    forgotPassword,
    resetPassword,
    verifyOtp,
    companyCreate,
    // profileCreate,
    jobPost,
    postApplication
}