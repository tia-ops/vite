import React, { useState } from "react";
import Card from "../components/Card"; // Menggunakan komponen Card yang baru
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/register.php`,
        form,
        { withCredentials: true }
      );
      // Backend yang baik akan selalu mengembalikan data JSON
      if (response.data.success) {
        setMsg("Registrasi berhasil, silakan login.");
      } else {
        // Menangani error yang mungkin tidak dilempar oleh axios
        throw new Error(response.data.error || "Terjadi kesalahan yang tidak diketahui");
      }
    } catch (error) {
      // Menangkap error dari backend atau dari proses request itu sendiri
      setErr(error.response?.data?.error || error.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(135deg,#0f2027 0%,#2c5364 100%)" }}>
      <Card type="chard" style={{ maxWidth: 380 }}> {/* Menggunakan Card dengan tipe 'chard' */}
        <h3 className="mb-4 text-center">Daftar Akun Baru</h3>
        <form style={{ minWidth: 280 }} onSubmit={handleSubmit}>
          <div className="mb-3">
            <input 
              className="form-control" 
              placeholder="Username" 
              value={form.username} 
              onChange={e => setForm({ ...form, username: e.target.value })} 
              disabled={loading}
              required
            />
          </div>
          <div className="mb-3">
            <input 
              className="form-control" 
              placeholder="Email" 
              type="email" 
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })} 
              disabled={loading}
              required
            />
          </div>
          <div className="mb-3">
            <input 
              className="form-control" 
              placeholder="Password" 
              type="password" 
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })} 
              disabled={loading}
              required
            />
             <div className="form-text text-secondary small mt-1">
                Min 8 karakter, dengan huruf besar, kecil, dan angka.
            </div>
          </div>
          {msg && <div className="alert alert-success small p-2">{msg}</div>}
          {err && <div className="alert alert-danger small p-2">{err}</div>}
          <button className="btn btn-primary w-100 mb-2" type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>
        <div className="text-center mt-2">
          <Link to="/">Sudah punya akun? Masuk</Link>
        </div>
      </Card>
    </div>
  );
}