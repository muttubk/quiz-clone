import axios from 'axios'
import apiConfig from '../config/apiConfig'

const quizApi = {
    getQuizs: (headers) => axios.get(`${apiConfig.baseUrl}/quiz`, headers),
    getQuizData: (quizId, headers) => axios.get(`${apiConfig.baseUrl}/quiz/analysis/${quizId}`, headers),
    updateQuiz: (quizId, quizData, headers) => axios.patch(`${apiConfig.baseUrl}/quiz/${quizId}`, quizData, headers),
    createQuiz: (quizData, headers) => axios.post(`${apiConfig.baseUrl}/quiz/create`, quizData, headers),
    deleteQuiz: (quizId, headers) => axios.delete(`${apiConfig.baseUrl}/quiz/${quizId}`, headers),
    getQuiz: (quizId) => axios.get(`${apiConfig.baseUrl}/quiz/${quizId}`),
    submitQuiz: (id, answers) => axios.patch(`${apiConfig.baseUrl}/quiz/submit/${id}`, answers)
}

export default quizApi;