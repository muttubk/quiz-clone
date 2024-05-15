import React, { useState, useEffect } from 'react'
import styles from './QuestionAnalysis.module.css'
import { useParams } from 'react-router-dom'
// import axios from 'axios'
import cx from 'classnames'
import quizApi from '../../api/quizApi'

function QuestionAnalysis() {
    const { id } = useParams()
    const [user] = useState(localStorage.getItem("user"))
    const [quiz, setQuiz] = useState()

    useEffect(() => {
        (async () => {
            try {
                // const response = await axios.get(`http://localhost:5000/quiz/analysis/${id}`, {
                //     headers: {
                //         'createdby': user
                //     }
                // })
                const response = await quizApi.getQuizData(id, {
                    headers: {
                        // 'createdby': user,
                        'Authorization': localStorage.getItem("token")
                    }
                })
                console.log(response)
                setQuiz(response.data.quiz)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [id, user])

    const peopleAttempted = (question) => {
        let count = 0
        Object.keys(question.options).forEach(option => {
            if (option !== "_id") {
                count += question.submissionCount[option]
            }
        })
        return count
    }

    const answeredCorrectly = (question) => {
        return question.submissionCount[question.correctAnswer]
    }

    return (
        <div className={styles.container}>
            <div className={styles.quizDetails} >
                <p className={styles.quizName}>
                    {quiz?.quizName} Question Analysis
                </p>
                <div>
                    <p className={styles.quizCreatedDate}>
                        Created on : {
                            new Date(quiz?.createdAt).getDate()
                            + " "
                            + new Date(quiz?.createdAt).toLocaleString('en-US', { month: "short" })
                            + ", "
                            + new Date(quiz?.createdAt).getFullYear()
                        }
                    </p>
                    <p className={styles.quizImpressions}>
                        Impressions : {
                            quiz?.impressions < 1000 ?
                                quiz?.impressions :
                                `${(quiz?.impressions / 1000).toFixed(1)}K`
                        }
                    </p>
                </div>
            </div>
            {
                quiz?.questions.map((question, idx) => (
                    <div className={styles.questionContainer} key={question.id}>
                        <p className={styles.question}>
                            Q.{idx + 1} {question.question}
                        </p>
                        {
                            quiz.quizType === "QnA" ?
                                <div className={styles.questionDetails} style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                                    <p className={styles.info}>
                                        <span className={styles.value}>
                                            {peopleAttempted(question)}
                                        </span><br />
                                        people Attempted the question
                                    </p>
                                    <p className={styles.info}>
                                        <span className={styles.value}>
                                            {answeredCorrectly(question)}
                                        </span><br />
                                        people Answered correctly
                                    </p>
                                    <p className={styles.info}>
                                        <span className={styles.value}>
                                            {
                                                peopleAttempted(question) - answeredCorrectly(question)
                                            }
                                        </span><br />
                                        people Answered incorrectly
                                    </p>
                                </div>
                                :
                                <div className={styles.questionDetails} style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
                                    {
                                        Object.keys(question.options).map((option, idx) => (
                                            option !== "_id" &&
                                            <p key={option} className={cx(styles.info, styles.option)}>
                                                <span className={styles.value}>
                                                    {
                                                        question.submissionCount[option]
                                                    }
                                                </span>
                                                Option {idx + 1}
                                            </p>
                                        ))
                                    }
                                </div>
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default QuestionAnalysis