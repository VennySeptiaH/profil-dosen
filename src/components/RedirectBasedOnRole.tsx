// src/RedirectBasedOnRole.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabaseClient } from "../utility";

export const RedirectBasedOnRole = () => {
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      const { data, error } = await supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single();

      if (error || !data) {
        setRedirectPath("/edit_profil"); // default
      } else if (data.role === "admin") {
        setRedirectPath("/users");
      } else {
        setRedirectPath("/edit_profil");
      }

      setLoading(false);
    };

    fetchRole();
  }, []);

  if (loading) return null;

  return <Navigate to={redirectPath!} replace />;
};
