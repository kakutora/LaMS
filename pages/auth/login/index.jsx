// pages/login.jsx

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Layout from "@/layouts/MainLayout";

import styles from "./index.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // ログインページにリダイレクト
        router.push("/");
      } else {
        console.error("Login failed.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <Layout user={null}>
      <div className={styles.loginForm}>
        <h1 className={styles.loginForm__title}>Login</h1>
        <form onSubmit={handleSubmit} className={styles.loginForm__form}>
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.loginForm__input}
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.loginForm__input}
          />
          <button type="submit" className={styles.loginForm__btn}>
            Login
          </button>
        </form>
      </div>
      <p className={styles.signup}>
        Don't have an account? <br /> You can create one &nbsp;
        <Link href="/auth/signup" className={styles.signup__link}>
          here
        </Link>
        .
      </p>
    </Layout>
  );
};

export default Login;
