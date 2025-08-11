// ./pages/RoleContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabaseClient } from "../utility"; // Pastikan path ini sesuai dengan lokasi utility Anda

type RoleContextType = {
  role: "admin" | "dosen" | "mahasiswa" | null;
  loadingRole: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<"admin" | "dosen" | "mahasiswa" | null>(null);
  const [loadingRole, setLoadingRole] = useState<boolean>(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoadingRole(true);
        const { data, error } = await supabaseClient.auth.getUser();
        if (error) throw error;
        if (data?.user) {
          const userId = data.user.id;
          const { data: userData, error: userError } = await supabaseClient
            .from("pengguna")
            .select("role")
            .eq("id", userId)
            .single();
          
          if (userError) throw userError;
          
          console.log("Role fetched:", userData?.role || "Role tidak ditemukan");
          setRole(userData?.role as "admin" | "dosen" | "mahasiswa" | null);
        } else {
          console.warn("User not logged in");
          setRole(null);
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setRole(null);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, []);

  return (
    <RoleContext.Provider value={{ role, loadingRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
