import { END_POINTS } from "./urls";
import { updateByIdApi } from "./action";


const updateCompany = async (params, data) => {
    return updateByIdApi(END_POINTS.companyUpdate, params, data)

}

const updatePassword = async (params, data) => {
    return updateByIdApi(END_POINTS.updatePassword, params, data)
}






export { updateCompany, updatePassword } 