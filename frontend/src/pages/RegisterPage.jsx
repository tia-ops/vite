import React, { useState } from "react";
import Chard from "../components/Chard";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      await axios.post(
        "https://sinyalrmb.net/backend/register.php", // ganti dengan domain backend kamu jika berbeda
        form
      );
      setMsg("Registrasi berhasil, silakan login");
    } catch {
      setMsg("Gagal daftar");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(135deg,#0f2027 0%,#2c5364 100%)" }}>
      <Chard>
        <h3 className="mb-4 text-center">Daftar</h3>
        <form style={{ minWidth: 260 }} onSubmit={handleSubmit}>
          <div className="mb-3">
            <input className="form-control" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          {msg && <div className="text-info mb-2">{msg}</div>}
          <button className="btn btn-primary w-100 mb-2" type="submit">Daftar</button>
        </form>
        <div className="text-center">
          <Link to="/">Sudah punya akun?</Link>
        </div>
      </Chard>
    </div>
  );
}
