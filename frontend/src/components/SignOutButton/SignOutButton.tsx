"use client";

import React from "react";
import { signOut } from "next-auth/react";

import styles from "./SignoutButton.module.css";
import { LogOut } from "lucide-react";

const SignOutButton = () => {
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <button className={styles.button} onClick={handleSignOut}>
      <LogOut color="var(--text)" size={32} />
    </button>
  );
};

export default SignOutButton;
