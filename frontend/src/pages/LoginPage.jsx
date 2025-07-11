import React, { useState } from "react";
import Chard from "../components/Chard";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/login.php`,
        { username, password },
        { withCredentials: true }
      );

      // Backend sekarang langsung mengembalikan role
      if (response.data && response.data.success && response.data.role) {
        onLogin(response.data.role);
      } else {
        // Jika response sukses tapi tidak ada role (sebagai fallback)
        throw new Error("Gagal mendapatkan data peran pengguna dari server.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Login gagal. Silakan coba lagi.";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg,#0f2027 0%,#2c5364 100%)" }}
    >
      <Chard>
        <h3 className="mb-4 text-center">Masuk</h3>
        <form style={{ minWidth: 260 }} onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {err && <div className="text-danger mb-2">{err}</div>}
          <button
            className="btn btn-primary w-100 mb-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
        <div className="text-center">
          <Link to="/register">Daftar Akun</Link>
        </div>
      </Chard>
    </div>
  );
}