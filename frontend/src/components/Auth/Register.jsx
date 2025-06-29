import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../apiBase";
import styles from "../Home/Home.module.css";
import stylesAuth from "./Login.module.css";

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErro(data.error || "Erro ao registrar");
        return;
      }
      const user = await res.json();
      onRegister(user);
    } catch {
      setErro("Erro de conexão");
    }
  };

  return (
    <>
      <div className={styles.header}>
        <Link to="/" className={styles.logo}>
          BeverageHub
        </Link>
        <div className={styles.headerSearch}></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <form className={stylesAuth.loginContainer} onSubmit={handleSubmit}>
          <h2 className={stylesAuth.loginTitle}>Register</h2>
          {erro && <div className={stylesAuth.error}>{erro}</div>}
          <input
            className={stylesAuth.input}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className={stylesAuth.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={stylesAuth.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className={stylesAuth.button} type="submit">
            Register
          </button>
          <div style={{ marginTop: "1.2rem", textAlign: "center" }}>
            <span style={{ color: "#bbb" }}>Already have an account?</span>
            <br />
            <Link
              to="/login"
              style={{
                color: "#efcb58",
                fontWeight: 500,
                textDecoration: "underline",
                fontSize: "1rem",
                marginTop: "0.5rem",
                display: "inline-block",
              }}
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
