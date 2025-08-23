"use client";

import { User } from "@/types/users";
import styles from "./PublicPage.module.css";

interface PublicPageProps {
  userData: User | null;
}

export default function PublicPage({ userData }: PublicPageProps) {
  return (
    <div className={styles.container}>
      <h1>Public Page</h1>
      <p>Username: {userData?.username}</p>
    </div>
  );
}
