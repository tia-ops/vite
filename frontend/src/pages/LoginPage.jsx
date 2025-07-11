import React, { useState } from "react";
import Chard from "../components/Chard";
import axios from "axios";
import { Link } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async e => {
    e.preventDefault();
    setErr("");
    try {
      await axios.post("/backend/login.php", { username, password });
      onLogin();
    } catch {
      setErr("Login gagal");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(135deg,#0f2027 0%,#2c5364 100%)" }}>
      <Chard>
        <h3 className="mb-4 text-center">Masuk</h3>
        <form style={{ minWidth: 260 }} onSubmit={handleLogin}>
          <div className="mb-3">
            <input className="form-control" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="Password" value={password} type="password" onChange={e => setPassword(e.target.value)} />
          </div>
          {err && <div className="text-danger mb-2">{err}</div>}
          <button className="btn btn-primary w-100 mb-2" type="submit">Login</button>
        </form>
        <div className="text-center">
          <Link to="/register">Daftar Akun</Link>
        </div>
      </Chard>
    </div>
  );
}
