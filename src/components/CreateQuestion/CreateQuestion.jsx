import React, { useEffect, useState } from 'react'
import styles from './CreateQuestion.module.css'
import { v4 as uuidv4 } from 'uuid'
import cx from 'classnames'

import deleteIcon from '../../assets/images/delete.svg'
import Timer from '../../components/Timer/Timer'
import QuizPublished from '../QuizPublished/QuizPublished'
import quizApi from '../../api/quizApi'

const correctOptionStyle = {
    backgroundColor: "#60B84B",
    color: "#fff"
}
const selectedQuestionStyle = {
    border: "2px solid #60B84B"
}

function CreateQuestion(props) {

    // individual question schema
    const questionSchema = {
        id: 'first-question',
        question: '',
        optionsType: 'text',
        options: {
            option1: {
                text: '',
                imageURL: ''
            },
            option2: {
                text: '',
                imageURL: ''
            },
        },
        correctAnswer: ''
    }

    // for storing all questions
    const [questions, setQuestions] = useState([questionSchema])
    // storing timer data
    const [timer, setTimer] = useState('OFF')
    // for selected question id
    const [selectedQuestion, setSelectedQuestion] = useState("first-question")
    // show/hide quiz published popup
    const [quizPublishedPopup, setQuizPublishedPopup] = useState(false)
    // for quiz link
    const [quizLink, setQuizLink] = useState('')
    // for errors
    const [error, setError] = useState({
        'first-question': false
    })

    // for complete quiz details
    const [quiz, setQuiz] = useState('')
    // for fetching details of editing quiz
    useEffect(() => {
        if (props.editQuizId) {
            (async () => {
                try {
                    const response = await quizApi.getQuizData(props.editQuizId, {
                        headers: {
                            'Authorization': localStorage.getItem("token")
                        }
                    })
                    setQuiz(response.data.quiz)
                } catch (error) {
                    console.log(error)
                }
            })()
        }
    }, [props.editQuizId])

    useEffect(() => {
        if (quiz) {
            setQuestions(quiz.questions)
            setTimer(quiz.timer)
            setSelectedQuestion(quiz.questions[0].id)
        }
    }, [quiz])

    // add qestion
    const handleAddQuestion = () => {
        const id = uuidv4()
        const newQuestions = [
            ...questions,
            { ...questionSchema, id: id }
        ]
        setQuestions(newQuestions)
        setSelectedQuestion(id)
    }

    // delete question
    const handleDeleteQuestion = (e) => {
        const newQuestions = questions.filter(q => q.id !== e.target.id)
        setQuestions(() => {
            setSelectedQuestion(newQuestions[newQuestions.length - 1].id)
            return newQuestions
        })
    }

    // select question
    const handleSelectQuestion = (e) => {
        setSelectedQuestion(e.target.id)
    }

    // get question input
    const handleQuestionInput = (e) => {
        const newQuestions = questions.map((question) => (
            question.id === selectedQuestion ?
                {
                    ...question,
                    question: e.target.value
                }
                : question
        ))
        setQuestions(newQuestions)
    }

    // for handling options on options type change
    const handleChangedOptionType = (options, type) => {
        let newOptions = { ...options }
        Object.keys(options).forEach(option => {
            if (option !== "_id") {
                if (type === "text") {
                    newOptions[option].imageURL = ""
                } else if (type === "imageURL") {
                    newOptions[option].text = ""
                }
            }
        })
        return newOptions
    }

    // options type
    const handleOptionsType = (e) => {
        const newQuestions = questions.map((question) => (
            question.id === selectedQuestion ?
                {
                    ...question,
                    optionsType: e.target.value,
                    options: handleChangedOptionType(question.options, e.target.value)
                }
                : question
        ))
        setQuestions(newQuestions)
    }

    // add option
    const handleAddOption = (e) => {
        const prevOptions = questions.find((q) => q.id === selectedQuestion).options
        const newOption = `option${Object.keys(prevOptions).filter(option => option !== "_id").length + 1}`
        const newQuestions = questions.map((question) => (
            question.id === selectedQuestion ?
                {
                    ...question,
                    options: {
                        ...prevOptions,
                        [newOption]: {
                            text: '',
                            imageURL: ''
                        }
                    }
                }
                : question
        ))
        setQuestions(newQuestions)
    }

    // handle delete option
    const handleDeleteOption = (e) => {
        const options = questions.find((q) => q.id === selectedQuestion).options
        if (e.target.id === 'option3' && Object.keys(options).filter(option => option !== "_id").length === 4) {
            const option4Value = { ...options.option4 }
            options.option3 = option4Value
            delete options.option4
        } else {
            delete options[e.target.id]
        }
        const newQuestions = questions.map((question) => (
            question.id === selectedQuestion ?
                {
                    ...question,
                    options: options
                }
                : question
        ))
        setQuestions(newQuestions)
    }

    // options input
    const handleOptionsInput = (e) => {
        const { id, name, value } = e.target
        const prevOptions = questions.find((q) => q.id === selectedQuestion).options
        const newQuestions = questions.map((question) => (
            question.id === selectedQuestion ?
                {
                    ...question,
                    options: {
                        ...prevOptions,
                        [name]: {
                            ...prevOptions[name],
                            [id]: value
                        }
                    }
                }
                : question
        ))
        setQuestions(newQuestions)
    }

    // get correct answer
    const handleCorrectAnswer = (e) => {
        const newQuestions = questions.map((question) => (
            question.id === selectedQuestion ?
                {
                    ...question,
                    correctAnswer: e.target.value
                }
                : question
        ))
        setQuestions(newQuestions)
    }

    // handle cancel button
    const handleCancel = () => {
        if (props.editQuizId) {
            props.setEditQuizPopup(false)
        } else {
            props.setQuestionsPopup(false)
        }
    }

    // for validating each questions options
    const validateOptions = (type, options) => {
        let validTextOptions = true
        let validImageOptions = true
        if (type === 'text' || type === 'textAndImageURL') {
            validTextOptions = Object.keys(options).every(option => options[option].text?.length !== 0)
        }
        if (type === 'imageURL' || type === 'textAndImageURL') {
            validImageOptions = Object.keys(options).every(option => options[option].imageURL?.length !== 0)
        }
        return validTextOptions && validImageOptions
    }
    // for validating each question
    const validateQuestion = (question) => {
        if (!question.question
            || (!question.correctAnswer && (props.quizType || quiz.quizType) === "QnA")
            || !validateOptions(question.optionsType, question.options)
        ) {
            setError((prev) => ({
                ...prev,
                [question.id]: true
            }))
            return false
        } else {
            setError((prev) => ({
                ...prev,
                [question.id]: false
            }))
            return true
        }
    }

    // for handling quiz creation and quiz edit/update
    const handleCreateQuiz = async () => {
        let valid = true
        questions.forEach(question => {
            if (valid === true) {
                valid = validateQuestion(question)
            } else {
                validateQuestion(question)
            }
        })
        const createdBy = localStorage.getItem("user")
        const formData = {
            quizName: props.quizName || quiz.quizName,
            quizType: props.quizType || quiz.quizType,
            questions,
            timer,
            createdBy
        }
        if (valid && props.editQuizId) {
            try {
                const response = await quizApi.updateQuiz(props.editQuizId,
                    { questions, timer },
                    {
                        headers: {
                            'Authorization': localStorage.getItem("token")
                        }
                    }
                )
                setQuizPublishedPopup(true)
                setQuizLink(`${window.location.origin}/quiz-interface/${response.data.updatedQuiz._id}`)
            } catch (error) {
                console.log(error)
            }
        } else if (valid) {
            try {
                const response = await quizApi.createQuiz(formData, {
                    headers: {
                        'Authorization': localStorage.getItem("token")
                    }
                })
                setQuizPublishedPopup(true)
                setQuizLink(`${window.location.origin}/quiz-interface/${response.data.id}`)
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log('error')
        }
    }


    return (
        <>
            {
                !quizPublishedPopup &&
                <div className={styles.container}>
                    <div className={styles.questionNumbersContainer}>
                        <div className={styles.questionNumbers}>
                            {
                                questions.map((question, idx) => (
                                    <button key={idx} id={question.id} className={styles.questionNumber}
                                        onClick={handleSelectQuestion}
                                        style={selectedQuestion === question.id ? selectedQuestionStyle : error[question.id] ? { border: "2px solid red" } : {}}
                                    >
                                        {idx + 1}
                                        {
                                            idx !== 0 &&
                                            <span className={styles.deleteQuestion} id={question.id}
                                                onClick={handleDeleteQuestion}
                                            >
                                                X
                                            </span>
                                        }
                                    </button>
                                ))
                            }
                            {
                                questions.length < 5 &&
                                <button className={styles.addQuestionBtn} onClick={handleAddQuestion}>
                                    +
                                </button>
                            }
                        </div>
                        <p className={styles.instructionText}>Max 5 questions</p>
                    </div>
                    <label htmlFor="" style={{ position: "relative" }}>
                        <input type="text"
                            className={cx(
                                styles.question,
                                error[selectedQuestion] && !questions.find(q => q.id === selectedQuestion).question && styles.errorBorder
                            )}
                            placeholder='Poll Question'
                            value={questions.find(q => q.id === selectedQuestion).question}
                            onChange={handleQuestionInput}
                        />
                        {
                            error[selectedQuestion] && !questions.find(q => q.id === selectedQuestion).question &&
                            <small className={styles.errorMessage} style={{ position: "absolute", bottom: "-1.5rem", left: "0" }}>Question required</small>
                        }
                    </label>
                    <div className={styles.optionTypesContainer}>
                        Option Type
                        <label htmlFor="text">
                            <input type="radio" value="text"
                                onChange={handleOptionsType}
                                checked={questions.find(q => q.id === selectedQuestion).optionsType === "text"}
                                name="questionType" id="text" /> Text
                        </label>
                        <label htmlFor="imageURL">
                            <input type="radio" value="imageURL"
                                onChange={handleOptionsType}
                                checked={questions.find(q => q.id === selectedQuestion).optionsType === "imageURL"}
                                name="questionType" id="imageURL" /> Image URL
                        </label>
                        <label htmlFor="textAndImageURL">
                            <input type="radio" value="textAndImageURL"
                                onChange={handleOptionsType}
                                checked={questions.find(q => q.id === selectedQuestion).optionsType === "textAndImageURL"}
                                name="questionType" id="textAndImageURL" /> Text & Image URL
                        </label>
                    </div>
                    <div className={styles.optionAndTimerContainer}>
                        <div className={styles.optionsContainer}>
                            {
                                error[selectedQuestion] &&
                                !questions.find(q => q.id === selectedQuestion).correctAnswer &&
                                (props.quizType === "QnA" || quiz.quizType === "QnA") &&
                                <small className={styles.errorMessage} style={{ position: "absolute", top: "-1.3rem", left: "0" }}>
                                    Select correct answer
                                </small>
                            }
                            {
                                Object.keys(questions.find(q => q.id === selectedQuestion).options).map((option, idx) => (
                                    option !== "_id" &&
                                    <div key={option} className={styles.option}>
                                        {
                                            (props.quizType === "QnA" || quiz.quizType === "QnA") &&
                                            <input type="radio" name="option"
                                                className={styles.optionRadioBtn}
                                                value={option}
                                                onChange={handleCorrectAnswer}
                                                checked={questions.find(q => q.id === selectedQuestion).correctAnswer === option}
                                            />
                                        }
                                        {
                                            (questions.find(q => q.id === selectedQuestion).optionsType === "text" ||
                                                questions.find(q => q.id === selectedQuestion).optionsType === "textAndImageURL") &&
                                            <input type="text"
                                                className={cx(
                                                    styles.optionInput,
                                                    error[selectedQuestion] && !questions.find(q => q.id === selectedQuestion).options[option].text && styles.errorBorder
                                                )}
                                                id="text"
                                                value={questions.find(q => q.id === selectedQuestion).options[option].text}
                                                onChange={handleOptionsInput}
                                                placeholder='Text' name={option}
                                                style={questions.find(q => q.id === selectedQuestion).correctAnswer === option ?
                                                    correctOptionStyle
                                                    : {}
                                                }
                                            />
                                        }
                                        {
                                            (questions.find(q => q.id === selectedQuestion).optionsType === "imageURL" ||
                                                questions.find(q => q.id === selectedQuestion).optionsType === "textAndImageURL") &&
                                            <input type="text"
                                                className={cx(
                                                    styles.optionInput,
                                                    error[selectedQuestion] && !questions.find(q => q.id === selectedQuestion).options[option].imageURL && styles.errorBorder
                                                )}
                                                id="imageURL"
                                                value={questions.find(q => q.id === selectedQuestion).options[option].imageURL}
                                                onChange={handleOptionsInput}
                                                placeholder='Image URL' name={option}
                                                style={questions.find(q => q.id === selectedQuestion).correctAnswer === option ?
                                                    correctOptionStyle
                                                    : {}
                                                }
                                            />
                                        }
                                        {
                                            idx >= 2 &&
                                            <img className={styles.deleteOptionIcon}
                                                id={option}
                                                src={deleteIcon} alt="delete quiz"
                                                onClick={handleDeleteOption}
                                            />
                                        }
                                    </div>
                                ))
                            }
                            {
                                Object.keys(questions.find(q => q.id === selectedQuestion).options).filter(option => option !== "_id").length < 4 &&
                                <button className={styles.addOptionBtn} onClick={handleAddOption}>Add option</button>
                            }
                        </div>
                        <div className={styles.timerContainer}>
                            {
                                (props.quizType === "QnA" || quiz.quizType === "QnA") &&
                                <Timer timer={quiz.timer} setTimer={setTimer} />
                            }
                        </div>
                    </div>
                    <div className={styles.cancelCreateBtns}>
                        <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                        <button className={styles.createBtn} onClick={handleCreateQuiz}>
                            {
                                props.editQuizId ? "Update Quiz" : "Create Quiz"
                            }
                        </button>
                    </div>
                </div >
            }
            {
                quizPublishedPopup &&
                <QuizPublished
                    setCreateQuizPage={props.setCreateQuizPage}
                    quizLink={quizLink}
                    setEditQuizPopup={props.setEditQuizPopup}
                />
            }
        </>
    )
}

export default CreateQuestion