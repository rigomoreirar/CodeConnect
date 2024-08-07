import React from "react";
import styles from "../styles/NotFound.module.css";

const NotFound = () => {
    return (
        <div className={styles["container"]}>
            <h1 className={styles["h1-not-found"]}>404</h1>
            <h2 className={styles["h2-not-found"]}>Not Found</h2>
        </div>
    );
};

export default NotFound;
