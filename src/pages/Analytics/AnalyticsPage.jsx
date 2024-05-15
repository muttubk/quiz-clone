import React from 'react'
import styles from './AnalyticsPage.module.css'
import { Outlet } from 'react-router-dom'

import Navbar from '../../components/Navbar/Navbar'

function AnalyticsPage() {
    return (
        <div className={styles.container}>
            <Navbar page="analytics" />
            <div className={styles.analyticsContainer}>
                <Outlet />
            </div>
        </div>
    )
}

export default AnalyticsPage