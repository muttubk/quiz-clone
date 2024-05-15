import axios from 'axios'
import apiConfig from '../config/apiConfig'

const authApi = {
    registerUser: (userData) => axios.post(`${apiConfig.baseUrl}/user/register`, userData),
    loginUser: (userData) => axios.post(`${apiConfig.baseUrl}/user/login`, userData)
}

export default authApi;