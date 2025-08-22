"use client";

import { Search } from "lucide-react";
import styles from "./RightSidebar.module.css";

const RightSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.searchInputContainer}>
        <Search />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search"
        />
      </div>
      <div className={styles.recommendations}>
        <h4>Recommended Profiles</h4>
        <div className={styles.recommendationItems}></div>
      </div>
    </aside>
  );
};

export default RightSidebar;
