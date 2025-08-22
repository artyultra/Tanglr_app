"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Settings } from "lucide-react";
import styles from "./Sidebar.module.css";
import { useAuth } from "@/hooks/auth/useAuth";
import ProfileButton from "../ProfileButton";

export default function Sidebar() {
  const pathname = usePathname();
  const session = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link
                href="/home"
                className={`${styles.a} ${pathname === "/home" ? styles.active : ""}`}
              >
                <Home />
              </Link>
            </li>
            {session?.user && (
              <>
                <li>
                  <Link
                    href="/settings"
                    className={pathname === "/settings" ? styles.active : ""}
                  >
                    <Settings size={20} />
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${session?.user?.username}`}
                    className={
                      pathname === `/${session?.user?.username}`
                        ? styles.active
                        : ""
                    }
                  >
                    <User size={20} />
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ProfileButton />
        </nav>
      </div>
    </aside>
  );
}
