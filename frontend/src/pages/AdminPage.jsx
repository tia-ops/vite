import React from "react";
import Chard from "../components/Chard";

export default function AdminPage() {
  return (
    <div className="d-flex flex-column align-items-center py-5" style={{ background: "linear-gradient(135deg,#0f2027 0%,#2c5364 100%)", minHeight: "100vh" }}>
      <Chard>
        <h3 className="mb-3 text-center">Halaman Admin</h3>
        <div className="mb-2">Selamat datang, Anda login sebagai <b>Admin</b>.</div>
        <div className="mb-2">Fitur admin bisa kamu kembangkan di sini (misal: manajemen user, monitoring aktivitas, panel data, dsb).</div>
      </Chard>
    </div>
  );
}
