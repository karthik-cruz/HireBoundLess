import axios from 'axios'
import domain_URL from "../config/config"



let URL;
const createByApi = async (requestUrl, data, params) => {
    try {
        // Construct the URL based on the presence of params
        const URL = params ? `${domain_URL}/${requestUrl}/${params}` : `${domain_URL}/${requestUrl}`;

        // Make the POST request using axios and return the response data
        const response = await axios.post(URL, data, {
            headers: {
                'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        // Handle and throw the error so it can be caught in the calling function
        throw error.response ? error.response.data : new Error('Something went wrong');
    }
};




const readByApi = async (requestUrl, params) => {

    if (params) {
        URL = `${domain_URL}/${requestUrl}/${params}`
    } else {

        URL = `${domain_URL}/${requestUrl}`
    }

    return await axios.get(URL).then((response) =>
        response.data
    )
}

const readByIdApi = async (requestUrl, params) => {
    if (params) {
        URL = `${domain_URL}/${requestUrl}/${params}`
    } else {

        URL = `${domain_URL}/${requestUrl}`
    }

    return await axios.get(URL).then((response) =>
        response.data
    )
}

const updateByApi = async (requestUrl, data, params) => {
    if (params) {

        URL = `${domain_URL}/${requestUrl}/${params}`
    } else {

        URL = `${domain_URL}/${requestUrl}`
    }

    return await axios.put(URL, data).then((response) =>
        response.data
    )
}

const updateByIdApi = async (requestUrl, params, data) => {
    if (params) {

        URL = `${domain_URL}/${requestUrl}/${params}`
    } else {

        URL = `${domain_URL}/${requestUrl}`
    }

    return await axios.put(URL, data).then((response) =>
        response.data
    )
}

const deleteByIdApi = async (requestUrl, params) => {

    if (params) {
        URL = `${domain_URL}/${requestUrl}/${params}`
    } else {

        URL = `${domain_URL}/${requestUrl}`
    }

    return await axios.delete(URL).then((response) =>
        response.data
    )
}


export { createByApi, readByApi, updateByApi, updateByIdApi, deleteByIdApi, readByIdApi }