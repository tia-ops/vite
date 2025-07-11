import React, { useEffect, useState } from "react";
import Card from "../components/Card"; // Ganti
import axios from "axios";
import API_BASE_URL from "../apiConfig";

export default function ProfilePage({ role }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/profile.php`, { withCredentials: true })
      .then(r => setUser(r.data))
      .catch(console.error);
  }, []);

  return (
    <div className="d-flex flex-column align-items-center py-4" style={{ background: "linear-gradient(135deg,#0f2027 0%,#2c5364 100%)", minHeight: "100vh" }}>
      <Card type="chard"> {/* Menggunakan Card */}
        <h3 className="mb-3 text-center">Profil</h3>
        {!user ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="mb-2">Username: <b>{user.username}</b></div>
            <div className="mb-2">Email: <b>{user.email}</b></div>
            <div className="mb-2">Role: <b>{user.role}</b></div>
          </>
        )}
      </Card>
    </div>
  );
}