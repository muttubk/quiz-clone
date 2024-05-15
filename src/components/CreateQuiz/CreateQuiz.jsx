import React, { useState } from 'react'
import styles from './CreateQuiz.module.css'
import CreateQuestion from '../CreateQuestion/CreateQuestion'
import QuizPublished from '../QuizPublished/QuizPublished'

const selectedQuizTypeStyle = {
    background: "#60B84B",
    color: "#fff"
}

function CreateQuiz(props) {

    // for quiz data
    const [quizData, setQuizData] = useState({
        quizName: '',
        quizType: ''
    })

    const [error, setError] = useState(false)

    // for show/hide create question pop up
    const [questionsPopup, setQuestionsPopup] = useState(false)
    // // show/hide quiz published popup
    // const [quizPublishedPopup, setQuizPublishedPopup] = useState(false)
    // // for quiz link
    // const [quizLink, setQuizLink] = useState('')

    // hide create quiz popup
    const handleCancel = () => {
        props.setCreateQuizPage(false)
    }

    // show create question popup
    const handleContinue = () => {
        if (!quizData.quizName || !quizData.quizType) {
            setError(true)
        } else {
            setError(false)
            setQuestionsPopup(true)
        }
        // setQuestionsPopup(true)
    }

    return (
        <>
            <div className={styles.container}>
                <label htmlFor="">
                    <input className={styles.quizNameInput}
                        type="text"
                        placeholder='Quiz name'
                        value={quizData.quizName}
                        onChange={(e) => setQuizData({ ...quizData, quizName: e.target.value })}
                        style={{ border: error && !quizData.quizName && "1.5px solid red" }}
                    />
                    {
                        error && !quizData.quizName &&
                        <small className={styles.errorMessage}>Quiz name required</small>
                    }
                </label>
                <div className={styles.quizTypeButtons}>
                    Quiz Type
                    <button className={styles.qnaTypeBtn}
                        onClick={() => setQuizData({ ...quizData, quizType: "QnA" })}
                        style={quizData.quizType === 'QnA' ? selectedQuizTypeStyle : {}}
                    >
                        Q & A
                    </button>
                    <button className={styles.pollTypeBtn}
                        onClick={() => setQuizData({ ...quizData, quizType: "Poll" })}
                        style={quizData.quizType === 'Poll' ? selectedQuizTypeStyle : {}}
                    >
                        Poll Type
                    </button>
                    {
                        error && !quizData.quizType &&
                        <small className={styles.errorMessage} style={{ position: "absolute", bottom: "-15px" }}>Quiz type required</small>
                    }
                </div>
                <div className={styles.cancelContinueBtns}>
                    <button className={styles.cancelBtn} onClick={handleCancel} >
                        Cancel
                    </button>
                    <button className={styles.continueBtn} onClick={handleContinue}>Continue</button>
                </div>
            </div>
            {
                questionsPopup &&
                <CreateQuestion
                    setQuestionsPopup={setQuestionsPopup}
                    // quizName={quizData.quizName}
                    // quizType={quizData.quizType}
                    {...quizData}
                    // setQuizPublishedPopup={setQuizPublishedPopup}
                    // setQuizLink={setQuizLink}
                    setCreateQuizPage={props.setCreateQuizPage}
                />
            }
            {/* {
                quizPublishedPopup &&
                <QuizPublished
                    setCreateQuizPage={props.setCreateQuizPage}
                    quizLink={quizLink}
                />
            } */}
        </>
    )
}

export default CreateQuiz