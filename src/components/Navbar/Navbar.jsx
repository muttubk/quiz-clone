import React, { useEffect, useState } from 'react'
import styles from './Navbar.module.css'

import Logo from '../Logo/Logo'
import { useNavigate } from 'react-router-dom'
import CreateQuizPage from '../../pages/CreateQuiz/CreateQuizPage'

function Navbar(props) {
    const navigate = useNavigate()

    // for show/hide create quiz popup
    const [createQuizPage, setCreateQuizPage] = useState(false)

    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token"))
    useEffect(() => {
        if (!loggedIn) {
            navigate('/')
        }
    }, [navigate, loggedIn])

    const gotoDashboard = () => {
        navigate('/dashboard')
    }
    const gotoAnalytics = () => {
        navigate('/analytics')
    }
    const gotoCreateQuiz = () => {
        setCreateQuizPage(true)
    }
    const handleLogout = () => {
        console.log("handle logout")
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        setLoggedIn(false)
    }
    return (
        <>
            <div className={styles.container}>
                <Logo size='3.5rem' />
                <div className={styles.menuOptions}>
                    <button className={styles.dashboardBtn}
                        style={{ boxShadow: props.page === 'dashboard' && "0px 0px 14px 0px rgba(0, 0, 0, 0.12)" }}
                        onClick={gotoDashboard}>
                        Dashboard
                    </button>
                    <button className={styles.analyticsBtn}
                        style={{ boxShadow: props.page === 'analytics' && "0px 0px 14px 0px rgba(0, 0, 0, 0.12)" }}
                        onClick={gotoAnalytics}>
                        Analytics
                    </button>
                    <button className={styles.createQuizBtn}
                        style={{ boxShadow: props.page === 'createQuiz' && "0px 0px 14px 0px rgba(0, 0, 0, 0.12)" }}
                        onClick={gotoCreateQuiz}>
                        Create Quiz
                    </button>
                </div>
                <div className={styles.logoutBtnContainer}>
                    <button className={styles.logoutBtn}
                        onClick={handleLogout}>
                        LOGOUT
                    </button>
                </div>
            </div>
            {
                createQuizPage &&
                <CreateQuizPage setCreateQuizPage={setCreateQuizPage} />
            }
        </>
    )
}

export default Navbar