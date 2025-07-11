import React, { useEffect, useState } from "react";
import Chard from "../components/Chard";
import axios from "axios";

export default function ProfilePage({ role }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("https://sinyalrmb.net/backend/profile.php", { withCredentials: true })
      .then(r => setUser(r.data));
  }, []);

  return (
    <div className="d-flex flex-column align-items-center py-4" style={{ background: "linear-gradient(135deg,#0f2027 0%,#2c5364 100%)", minHeight: "100vh" }}>
      <Chard>
        <h3 className="mb-3 text-center">Profil</h3>
        {!user ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="mb-2">Username: <b>{user.username}</b></div>
            <div className="mb-2">Email: <b>{user.email}</b></div>
            <div className="mb-2">Role: <b>{role}</b></div>
            <div className="mb-2">Bergabung: <b>{user.created_at}</b></div>
          </>
        )}
      </Chard>
    </div>
  );
}
