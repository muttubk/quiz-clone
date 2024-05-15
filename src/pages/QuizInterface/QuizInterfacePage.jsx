import React from 'react'
import styles from './QuizInterfacePage.module.css'
import QuizInterface from '../../components/QuizInterface/QuizInterface'

function QuizInterfacePage() {
    return (
        <div className={styles.container}>
            <QuizInterface />
        </div>
    )
}

export default QuizInterfacePage