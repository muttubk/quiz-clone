import React from 'react'
import styles from './DashboardPage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Dashboard from '../../components/Dashboard/Dashboard'

function DashboardPage() {
    return (
        <div className={styles.container}>
            <Navbar page="dashboard" />
            <div className={styles.dashboardContainer}>
                <Dashboard />
            </div>
        </div>
    )
}

export default DashboardPage