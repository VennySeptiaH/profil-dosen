export const canAccess = async ({ resource, action }: { resource: string; action: string }) => {
    const role = localStorage.getItem("role");
  
    if (role === "admin") return true;
  
    if (["dosen", "mahasiswa"].includes(role || "") && resource === "edit_profil") {
      return true;
    }
  
    return false;
  };
  