"use client";

import { useState } from "react";
import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../auth.module.css";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      console.log("result", result);

      if (result?.error) {
        setError("Invalid username or password");
      } else if (result?.ok) {
        // router.push(`/${username}`);
        router.push("/home");
        router.refresh();
      } else {
        setError("An unexpected error occurred");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.logo}>
        <Link href="/" className={styles.logoText}>
          tangl<span className={styles.logoAccent}>r</span>
        </Link>
      </div>

      <h2 className={styles.title}>Welcome back</h2>
      <p className={styles.subtitle}>Sign in to your account</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className={styles.input}
            placeholder="Enter your username"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className={styles.input}
            placeholder="Enter your password"
          />
        </div>

        <div className={styles.links}>
          <Link href="/forgot-password" className={styles.link}>
            Forgot password?
          </Link>
          <Link href="/register" className={styles.link}>
            Create account
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`${styles.button} ${styles.primaryButton}`}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>or</span>
        </div>

        <div className={styles.socialButtons}>
          <button
            type="button"
            onClick={() => signIn("github")}
            className={styles.socialButton}
          >
            GitHub
          </button>
          <button
            type="button"
            onClick={() => signIn("google")}
            className={styles.socialButton}
          >
            Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
