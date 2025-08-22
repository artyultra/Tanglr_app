"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Registration successful but login failed. Please sign in manually",
        );
        router.push("/login");
      } else {
        router.push("/home");
        router.refresh();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
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

      <h2 className={styles.title}>Join us!</h2>
      <p className={styles.subtitle}>Create your account to get started</p>

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
            minLength={3}
            className={styles.input}
            placeholder="Choose a username"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={styles.input}
            placeholder="Enter your email"
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
            minLength={6}
            className={styles.input}
            placeholder="Create a password (min 6 characters)"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`${styles.button} ${styles.primaryButton}`}
        >
          {isLoading ? "Creating account..." : "Create account"}
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
            Sign up with GitHub
          </button>
          <button
            type="button"
            onClick={() => signIn("google")}
            className={styles.socialButton}
          >
            Sign up with Google
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link href="/login" className={styles.link}>
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
