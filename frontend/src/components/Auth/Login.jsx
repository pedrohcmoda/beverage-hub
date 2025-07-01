import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Home/Home.module.css";
import stylesAuth from "./Login.module.css";
import Popup from "../Popup/Popup";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate("/");
    } else {
      setErro(result.error);
      setShowPopup(true);
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
          <h2 className={stylesAuth.loginTitle}>Login</h2>
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
            Sign in
          </button>
          <div style={{ marginTop: "1.2rem", textAlign: "center" }}>
            <span style={{ color: "#bbb" }}>Don't have an account?</span>
            <br />
            <Link
              to="/register"
              style={{
                color: "#efcb58",
                fontWeight: 500,
                textDecoration: "underline",
                fontSize: "1rem",
                marginTop: "0.5rem",
                display: "inline-block",
              }}
            >
              Create your account
            </Link>
          </div>
        </form>
        <Popup message={erro} show={showPopup && !!erro} onClose={() => setShowPopup(false)} />
      </div>
    </>
  );
}
