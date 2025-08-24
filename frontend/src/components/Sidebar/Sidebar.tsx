"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Settings, SquarePen } from "lucide-react";
import styles from "./Sidebar.module.css";
import { useAuth } from "@/hooks/auth/useAuth";
import ProfileButton from "../ProfileButton";

interface SidebarProps {
  onComposeClick: () => void;
}

const Sidebar = ({ onComposeClick }: SidebarProps) => {
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
                <Home size={20} />
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
                <li>
                  <button
                    className={styles.composeBtn}
                    onClick={onComposeClick}
                  >
                    <SquarePen size={20} />
                  </button>
                </li>
              </>
            )}
          </ul>
          <ProfileButton />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
