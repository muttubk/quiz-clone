import React from 'react'
import styles from './Error404.module.css'

import pageNotFoundImage from '../../assets/images/pageNotFound.jpg'

function Error404() {
    return (
        <div className={styles.container}>
            <h1>Error 404</h1>
            <p>Page Not Found</p>
            <img src={pageNotFoundImage} alt="" />
        </div>
    )
}

export default Error404