import React, { useEffect, useState } from 'react'
import styles from './QuizInterface.module.css'

import cx from 'classnames'
import QuizScoreCard from '../QuizScoreCard/QuizScoreCard'
// import axios from 'axios'
import { useParams } from 'react-router-dom'
import quizApi from '../../api/quizApi'

function QuizInterface() {
    const { id } = useParams()
    const [quizType, setQuizType] = useState('')
    const [timer, setTimer] = useState('')
    const [questions, setQuestions] = useState([])

    useEffect(() => {
        (async () => {
            try {
                // const response = await axios.get(`http://localhost:5000/quiz/${id}`)
                const response = await quizApi.getQuiz(id)
                // console.log(response)
                setQuizType(response.data.quizData.quizType)
                setTimer(response.data.quizData.timer)
                setQuestions(response.data.quizData.questions)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [id])

    // const quizType = "Poll"
    // const timer = "OFF"
    // const questions = [
    //     {
    //         id: 'q1',
    //         question: 'Your question text comes here, its a sample text.',
    //         optionsType: 'image',
    //         options: {
    //             option1: {
    //                 text: '',
    //                 imageURL: 'https://tse1.mm.bing.net/th?id=OIP.PSWnfdqZ5mRQegCgDbjc7AHaJ4&pid=Api&P=0&h=180'
    //             },
    //             option2: {
    //                 text: '',
    //                 imageURL: 'https://tse1.mm.bing.net/th?id=OIP.UyYyWTuW4pdDMWjQ4C5WGAHaE7&pid=Api&P=0&h=180'
    //             },
    //         },
    //         correctAnswer: 'option2'
    //     },
    //     {
    //         id: 'q2',
    //         question: 'Question 2',
    //         optionsType: 'textAndImageURL',
    //         options: {
    //             option1: {
    //                 text: 'option 1',
    //                 imageURL: 'https://tse3.mm.bing.net/th?id=OIP.4BoYOYrHoeR9-IfbI1DoXgHaFj&pid=Api&P=0&h=180'
    //             },
    //             option2: {
    //                 text: 'option 2',
    //                 imageURL: 'https://tse3.mm.bing.net/th?id=OIP.eT9AZva5g9QVXjDOt1dRCwHaEj&pid=Api&P=0&h=180'
    //             },
    //             option3: {
    //                 text: 'option 3',
    //                 imageURL: 'https://tse4.mm.bing.net/th?id=OIP.drOheSp-hWHlX6dNXLKPmgHaE9&pid=Api&P=0&h=180'
    //             },
    //         },
    //         correctAnswer: 'option3'
    //     },
    //     {
    //         id: 'q3',
    //         question: 'Question 3',
    //         optionsType: 'text',
    //         options: {
    //             option1: {
    //                 text: 'option 1',
    //                 imageURL: ''
    //             },
    //             option2: {
    //                 text: 'option 2',
    //                 imageURL: ''
    //             },
    //             option3: {
    //                 text: 'option 3',
    //                 imageURL: ''
    //             },
    //             option4: {
    //                 text: 'option 4',
    //                 imageURL: ''
    //             }
    //         },
    //         correctAnswer: 'option2'
    //     },
    // ]
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [remainingSeconds, setRemainingSeconds] = useState(timer)
    const [correctAnswers, setCorrectAnswers] = useState(0)
    const [showScoreCard, setShowScoreCard] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            if (remainingSeconds > 0) {
                setRemainingSeconds(remainingSeconds - 1)
            }
        }, 1000);
        // clearing interval
        return () => clearInterval(timer);
    });

    useEffect(() => {
        if (remainingSeconds === 0) {
            if (currentQuestion + 1 === questions.length) {
                submitQuiz()
            } else {
                gotoNextQuestion()
            }
        }
    }, [remainingSeconds])

    useEffect(() => {
        setRemainingSeconds(timer)
    }, [currentQuestion, timer])

    const selectAnswer = (e) => {
        const { id } = e.target
        setSelectedAnswers({
            ...selectedAnswers,
            [questions[currentQuestion].id]: id
        })
        // console.log(id)
    }

    const gotoNextQuestion = () => {
        setCurrentQuestion(currentQuestion + 1)
    }

    const submitQuiz = async () => {
        // console.log(selectedAnswers)
        try {
            // const response = await axios.patch(`http://localhost:5000/quiz/submit/${id}`, {
            //     submittedAnswers: selectedAnswers
            // })
            const response = await quizApi.submitQuiz(id, {
                submittedAnswers: selectedAnswers
            })
            // console.log(response.data)
            setCorrectAnswers(response.data.score)
        } catch (error) {
            console.log(error)
        }
        // if (quizType === "QnA") {
        //     const correctAnsweredQuestion = questions.filter(q => q.correctAnswer === selectedAnswers[q.id])
        //     setCorrectAnswers(correctAnsweredQuestion.length)
        // }
        setShowScoreCard(true)
    }

    return (
        <>
            {
                !showScoreCard &&
                <div className={styles.container}>
                    <div className={styles.numberAndTimeContainer}>
                        <p className={styles.questionNumber}>
                            {
                                currentQuestion + 1 < 10 ?
                                    `0${currentQuestion + 1}` :
                                    currentQuestion + 1
                            }
                            /
                            {
                                questions.length < 10 ?
                                    `0${questions.length}` :
                                    questions.length
                            }
                        </p>
                        {
                            (!timer || timer !== "OFF") &&
                            <p className={styles.time}>
                                00:{
                                    remainingSeconds < 10 ?
                                        `0${remainingSeconds}` :
                                        remainingSeconds
                                }
                            </p>
                        }
                    </div>
                    <p className={styles.question}>
                        {questions[currentQuestion]?.question}
                    </p>
                    <div className={styles.optionsContainer}>
                        {
                            questions && questions[currentQuestion] &&
                            Object.keys(questions[currentQuestion].options).map((option) => (
                                (questions[currentQuestion].options[option].text ||
                                    questions[currentQuestion].options[option].imageURL) &&
                                <div className={cx(
                                    styles.option,
                                    questions[currentQuestion].optionsType === "textAndImageURL" && styles.textAndImageURL,
                                    selectedAnswers[questions[currentQuestion].id] === option && styles.selectedOption
                                )}
                                    key={option}
                                    id={option}
                                    onClick={selectAnswer}
                                >
                                    {
                                        questions[currentQuestion].options[option].text
                                    }
                                    {
                                        (questions[currentQuestion].optionsType === "imageURL" ||
                                            questions[currentQuestion].optionsType === "textAndImageURL") &&
                                        <div className={styles.imageContainer}>
                                            <img className={styles.optionImage}
                                                id={option}
                                                src={questions[currentQuestion].options[option].imageURL} alt=""
                                            />
                                        </div>
                                    }
                                </div>
                            ))
                        }
                    </div>
                    {
                        currentQuestion + 1 === questions.length ?
                            <button className={styles.submitBtn} onClick={submitQuiz}>
                                SUBMIT
                            </button>
                            :
                            <button className={styles.nextBtn} onClick={gotoNextQuestion}>
                                NEXT
                            </button>
                    }
                </div>
            }
            {
                showScoreCard &&
                <QuizScoreCard quizType={quizType} correctAnswers={correctAnswers} totalQuestions={questions.length} />
            }
        </>
    )
}

export default QuizInterface