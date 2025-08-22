import React, { useState, useRef, useEffect } from "react";
import SignOutButton from "@/components/SignOutButton/SignOutButton";
import ColorToggleButton from "@/components/ColorToggleButton";

import styles from "./ProfileButton.module.css";

const ProfileButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ bottom: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    if (!isMenuOpen && buttonRef.current) {
      // Calculate position before opening
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        bottom: window.innerHeight - rect.top + 10,
        left: rect.left + rect.width / 2 + 50, // Shifted right by 50px
      });
    }
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonWrapper}>
        {/* Popup Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className={styles.popupMenu}
            style={{
              bottom: `${menuPosition.bottom}px`,
              left: `${menuPosition.left}px`,
              transform: "translateX(-50%)",
            }}
          >
            <div className={styles.menuContent}>
              <SignOutButton />
              <ColorToggleButton />
            </div>
            <div className={styles.menuArrow}></div>
          </div>
        )}

        {/* Main trigger button */}
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className={styles.triggerButton}
        >
          <img
            className={styles.profileImage}
            src="https://68rdbf2n6t.ufs.sh/f/eFaWLjkdXdtlUmFpmNXcWR3rVUzBTD2ukjxYylC9Gm7iqA4o"
            alt="Profile"
          />
        </button>
      </div>
    </div>
  );
};

export default ProfileButton;
