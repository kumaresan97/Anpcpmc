
/* eslint-disable @typescript-eslint/no-var-requires*/

import * as React from 'react';

import styles from "./SuccessScreen.module.scss"
const success = require("../../../../ExternalRef/Images/checked.png")
const SuccessScreen = () => {
    return (
        <div className={styles.successWrapper}>
            <div className={styles.successCon}>
                <img src={success} alt="success img" />
                <h2 className={styles.successHead}>
                    Thank you for referring a lead! We’ll get back to you soon.
                    {/* Thanks for contacting us! We’ll get back to you soon. */}
                    {/* Successfully submitted — thank you! */}
                </h2>
            </div>
        </div>

    )
}
export default SuccessScreen;

