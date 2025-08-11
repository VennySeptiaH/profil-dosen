// ContohPenggunaan.tsx
import React from "react";
import { useRole } from "../pages/RoleContext";

const ContohPenggunaan: React.FC = () => {
  const { role, loadingRole } = useRole();

  if (loadingRole) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Role Anda: {role ? role : "Belum teridentifikasi"}</h2>
      {role === "admin" && <p>Anda memiliki akses admin.</p>}
      {role === "dosen" && <p>Anda adalah dosen.</p>}
      {role === "mahasiswa" && <p>Anda adalah mahasiswa.</p>}
    </div>
  );
};

export default ContohPenggunaan;
