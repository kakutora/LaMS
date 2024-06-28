// pages/signup.jsx

import { useState } from "react";
import { useRouter } from "next/router";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userNameError, setUserNameError] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    if (value.length < 1 || value.length >= 16) {
      setUserNameError("ユーザー名は1文字以上16文字以内でなければなりません。");
    } else {
      setUserNameError("");
    }
    setUserName(value);
  };

  const handleUserIdChange = (e) => {
    const value = e.target.value;
    const validPattern = /^[a-zA-Z0-9_]*$/;

    if (value.length < 1 || value.length > 16) {
      setUserIdError("ユーザーIDは1文字以上16文字以内でなければなりません。");
    } else if (!validPattern.test(value)) {
      setUserIdError(
        "ユーザーIDに使える文字は英数字とアンダースコアのみです。"
      );
    } else {
      setUserIdError("");
    }

    setUserId(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(value)) {
      setEmailError("");
    } else {
      setEmailError("emailの形式が正しくありません。");
    }
    setEmail(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/;

    if (passwordPattern.test(value)) {
      setPasswordError("");
    } else {
      setPasswordError(
        "パスワードは8-30文字、且つ大小英数字を含めなければなりません。"
      );
    }
    setPassword(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 入力値を再度検証
    let errors = [];

    if (userName.length < 1 || userName.length >= 16) {
      errors.push("ユーザー名の形式が正しくありません。");
    }
    if (
      userId.length < 1 ||
      userId.length > 16 ||
      !/^[a-zA-Z0-9_]*$/.test(userId)
    ) {
      errors.push("ユーザーIDの形式が正しくありません。");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("emailの形式が正しくありません。");
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/.test(password)) {
      errors.push("パスワードの形式が正しくありません。");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, userId, email, password }),
      });

      if (response.ok) {
        // ログインページにリダイレクト
        router.push("/auth/login");
      } else {
        console.error("Signup failed.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Username</label>
          <input type="text" value={userName} onChange={handleUserNameChange} />
          {userNameError && <p style={{ color: "red" }}>{userNameError}</p>}
        </div>
        <div>
          <label>Userid</label>
          <input type="text" value={userId} onChange={handleUserIdChange} />
          {userIdError && <p style={{ color: "red" }}>{userIdError}</p>}
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={handleEmailChange} />
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
