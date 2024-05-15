import React from 'react'
import styles from './QuizPublished.module.css'
import crossIcon from '../../assets/images/cross.svg'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function QuizPublished(props) {

    const handleShareLink = async () => {
        // console.log(props.quizLink)
        try {
            await navigator.clipboard.writeText(props.quizLink)
            toast.success("Link copied to Clipboard");
        } catch (error) {
            console.log(error)
        }
    }
    const handleCancel = () => {
        if (props.setEditQuizPopup) {
            props.setEditQuizPopup(false)
        }
        if (props.setCreateQuizPage) {
            props.setCreateQuizPage(false)
        }
    }

    return (
        <div className={styles.container}>
            <p className={styles.message}>Congrats your Quiz is Published!</p>
            <input className={styles.linkContainer} type="text"
                value={props.quizLink} readOnly
                placeholder="Your link is here"
            />
            <button className={styles.shareBtn} onClick={handleShareLink}>
                Share
            </button>
            <img className={styles.cancelBtn}
                src={crossIcon} alt="cancel"
                onClick={handleCancel}
            />
            <ToastContainer />
        </div>
    )
}

export default QuizPublished