import axios, { AxiosRequestConfig } from 'axios';
import Cookie from 'js-cookie'


const request = async (optional:AxiosRequestConfig, token?: undefined) => {
    const client: any = axios.create({ baseURL: process.env.DEV_URL })
    client.defaults.headers.common["Authorization"] = token || localStorage.getItem('token');
    client.defaults.responseType = "json"
    const onSuccess = (response: { data: any; }) => {
        return Promise.resolve(response.data);
    }
    const OnError = (error: { response: any; message: any; }) => {
        return Promise.reject(error.response || error.message)

    }
    return await client(optional).then(onSuccess).catch(OnError)
}
export default request;


