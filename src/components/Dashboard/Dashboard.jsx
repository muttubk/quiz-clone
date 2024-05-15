import React, { useEffect, useState } from 'react'
import styles from './Dashboard.module.css'
import TrendingQuizCard from '../TrendingQuizCard/TrendingQuizCard'
// import axios from 'axios'
import quizApi from '../../api/quizApi'

function Dashboard() {
    const [user] = useState(localStorage.getItem("user"))
    const [sortCondition] = useState({ impressions: -1 })

    const [quizs, setQuizs] = useState([])
    const [quizsCreated, setQuizsCreated] = useState(0)
    const [questionsCreated, setQuestionsCreated] = useState(0)
    const [totalImpressions, setTotalImpressions] = useState(0)

    useEffect(() => {
        (async () => {
            try {
                // const response = await axios.get("http://localhost:5000/quiz", {
                //     headers: {
                //         'createdby': user,
                //         'sortcondition': JSON.stringify(sortCondition)
                //     }
                // })
                const response = await quizApi.getQuizs({
                    headers: {
                        // 'createdby': user,
                        'Authorization': localStorage.getItem("token"),
                        'sortcondition': JSON.stringify(sortCondition)
                    }
                })
                // console.log(response.data)
                setQuizs(response.data.quizs)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [user, sortCondition])

    useEffect(() => {
        let totalQuestions = 0
        let impressions = 0
        quizs.forEach((quiz) => {
            totalQuestions += quiz.questions.length
            impressions += quiz.impressions
        })
        setQuizsCreated(quizs.length)
        setQuestionsCreated(totalQuestions)
        setTotalImpressions(impressions)
    }, [quizs])

    return (
        <div className={styles.container}>
            <div className={styles.topContainer}>
                <div className={styles.quiz}>
                    <span className={styles.numberSpan}>{quizsCreated}</span> Quiz <br />Created
                </div>
                <div className={styles.questions}>
                    <span className={styles.numberSpan}>{questionsCreated}</span> questions <br />Created
                </div>
                <div className={styles.impressions}>
                    <span className={styles.numberSpan}>
                        {
                            totalImpressions < 1000 ?
                                totalImpressions :
                                `${(totalImpressions / 1000).toFixed(1)}K`
                        }
                    </span> Total <br />Impressions
                </div>
            </div>
            <div className={styles.trendingQuizsContainer}>
                <p className={styles.trendingQuizsTitle}>Trending Quizs</p>
                <div className={styles.trendingQuizs}>
                    {
                        quizs.map((quiz) => (
                            <TrendingQuizCard key={quiz._id} quizName={quiz.quizName}
                                impressions={quiz.impressions}
                                createdDate={quiz.createdAt} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Dashboard