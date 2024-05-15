import React from 'react'
import styles from './DeleteQuizPopup.module.css'

// import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import quizApi from '../../api/quizApi';

function DeleteQuizPopup(props) {
    const handleDeleteQuiz = async () => {
        try {
            // const response = await axios.delete(`http://localhost:5000/quiz/${props.quizId}`)
            const response = await quizApi.deleteQuiz(props.quizId, {
                headers: {
                    'Authorization': localStorage.getItem("token")
                }
            })
            // console.log(response)
            toast.success("Deleted quiz successfully")
            props.setDeletePopup(false)
        } catch (error) {
            console.log(error)
        }
    }
    const handleCancel = () => {
        props.setDeletePopup(false)
    }
    return (
        <div className={styles.container}>
            <div className={styles.popupCard}>
                <p className={styles.text}>Are you confirm you want to delete ?</p>
                <div className={styles.buttonsContainer}>
                    <button className={styles.deleteBtn} onClick={handleDeleteQuiz}>
                        Confirm Delete
                    </button>
                    <button className={styles.cancelBtn} onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default DeleteQuizPopup