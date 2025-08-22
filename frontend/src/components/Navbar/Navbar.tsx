// src/components/Navbar/Navbar.tsx
"use client";

import React from "react";

import styles from "./Navbar.module.css";
import SignOutButton from "../SignOutButton/SignOutButton";
import ColorToggleButton from "../ColorToggleButton/ColorToggleButton";
import Sidebar from "../Sidebar";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Sidebar />
      </nav>
    </div>
  );
};

export default Navbar;
