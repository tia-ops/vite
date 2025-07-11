import React, { useState } from "react";
import Card from "../components/Card"; // Menggunakan komponen Card yang baru dan fleksibel
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

      // Backend sekarang langsung mengembalikan peran (role) pengguna
      if (response.data && response.data.success && response.data.role) {
        onLogin(response.data.role);
      } else {
        // Fallback jika respons sukses tapi tidak ada data peran
        throw new Error("Gagal mendapatkan data peran pengguna dari server.");
      }
    } catch (error) {
      // Menampilkan pesan error yang lebih informatif dari backend atau error umum
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
      <Card type="chard" style={{ maxWidth: 380 }}> {/* Menggunakan Card dengan tipe 'chard' */}
        <h3 className="mb-4 text-center">Masuk</h3>
        <form style={{ minWidth: 280 }} onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              disabled={loading}
              required
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
              required
            />
          </div>
          {err && <div className="alert alert-danger small p-2">{err}</div>}
          <button
            className="btn btn-primary w-100 mb-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-2">
          <Link to="/register">Belum punya akun? Daftar</Link>
        </div>
      </Card>
    </div>
  );
}