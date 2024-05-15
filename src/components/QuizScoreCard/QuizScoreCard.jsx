import React from 'react'
import styles from './QuizScoreCard.module.css'

import trophy from '../../assets/images/trophy.png'

function QuizScoreCard(props) {
    return (
        <div className={styles.container}>
            {
                props.quizType === "QnA" ?
                    <>
                        <p className={styles.quizMessage}>Congrats Quiz is completed</p>
                        <div className={styles.trophyContainer}>
                            <img className={styles.trophy} src={trophy} alt="" />
                        </div>
                        <p className={styles.scoreContainer}>
                            Your Score is
                            <span> </span>
                            <span className={styles.score}>
                                {
                                    props.correctAnswers < 10 ?
                                        `0${props.correctAnswers}` :
                                        props.correctAnswers
                                }
                                /
                                {
                                    props.totalQuestions < 10 ?
                                        `0${props.totalQuestions}` :
                                        props.totalQuestions
                                }
                            </span>
                        </p>
                    </>
                    :
                    <>
                        <div className={styles.pollMessage}>
                            <p>
                                Thank you <br /> for participating in <br /> the Poll
                            </p>
                        </div>
                    </>
            }
        </div>
    )
}

export default QuizScoreCard