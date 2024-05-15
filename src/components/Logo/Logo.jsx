import React from 'react'
import styles from './Logo.module.css'

function Logo({ size = "3rem" }) {
    return (
        <p className={styles.logoText} style={{ fontSize: size }} >QUIZZIE</p>
    )
}

export default Logo