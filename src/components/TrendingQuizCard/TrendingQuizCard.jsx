import React from 'react'
import styles from './TrendingQuizCard.module.css'

import eyesIcon from '../../assets/images/eyes.svg'

function TrendingQuizCard(props) {
    const createdDate = new Date(props.createdDate)

    return (
        <div className={styles.container}>
            <div className={styles.nameAndImpressionContainer}>
                <p className={styles.quizName}>
                    {props.quizName}
                </p>
                <div className={styles.impressionsContainer}>
                    <p className={styles.impressions}>
                        {
                            props.impressions < 1000 ?
                                props.impressions :
                                `${(props.impressions / 1000).toFixed(1)}K`
                        }
                    </p>
                    <img src={eyesIcon} alt="" />
                </div>
            </div>
            <p className={styles.createdDate}>
                Created on : {
                    createdDate.getDate()
                    + " "
                    + createdDate.toLocaleString('en-US', { month: "short" })
                    + ", "
                    + createdDate.getFullYear()
                }
            </p>
        </div>
    )
}

export default TrendingQuizCard