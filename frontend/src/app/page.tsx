"use client";

import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

const LandingPage = () => {
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            tangl<span className={styles.accent}>r</span>
          </h1>
          <p className={styles.subtitle}>Connect. Share. Create.</p>
        </div>
        
        <div className={styles.actions}>
          <Link href="/login" className={styles.primaryButton}>
            Login
          </Link>
          <Link href="/register" className={styles.secondaryButton}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
