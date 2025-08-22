"use client";

import { usePathname } from "next/navigation";
import styles from "./AsideMenu.module.css";

export default function AsideMenu() {
  const pathname = usePathname();
  
  // Show aside menu on dashboard (/dashboard) and user profile pages (/[username])
  const shouldShowAside = 
    pathname === "/dashboard" || 
    (pathname.startsWith("/") && pathname.split("/").length === 2 && pathname !== "/dashboard");

  if (!shouldShowAside) {
    return null;
  }

  return (
    <aside className={styles.aside}>
      <div className={styles.content}>
        <h3>Menu</h3>
        <nav className={styles.nav}>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/settings">Settings</a></li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}