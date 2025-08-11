import { AuthBindings, CheckResponse } from "@refinedev/core";
import { supabaseClient } from "./utility";

const authProvider: AuthBindings = {
  login: async ({ email, password, providerName }) => {
    try {
      // Login via Google OAuth
      if (providerName) {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider: providerName,
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        });

        if (error) {
          return { success: false, error };
        }

        return {
          success: true,
          redirectTo: data?.url,
        };
      }

      // Login manual via email/password
      if (!email) {
        return { success: false, error: { message: "Email wajib diisi" } };
      }
      if (!password) {
        return { success: false, error: { message: "Password wajib diisi" } };
      }

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error };
      }

      if (data?.user) {
        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Login failed",
        name: "Invalid email or password",
      },
    };
  },

  register: async ({ email, password }) => {
    try {
      if (!email) {
        return { success: false, error: { message: "Email wajib diisi" } };
      }
      if (!password) {
        return { success: false, error: { message: "Password wajib diisi" } };
      }

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, redirectTo: "/" };
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      if (!email) {
        return { success: false, error: { message: "Email wajib diisi" } };
      }
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

      if (error) {
        return { success: false, error };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error };
    }
  },

  updatePassword: async ({ password }) => {
    try {
      if (!password) {
        return { success: false, error: { message: "Password wajib diisi" } };
      }
      const { data, error } = await supabaseClient.auth.updateUser({
        password,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, redirectTo: "/" };
    } catch (error: any) {
      return { success: false, error };
    }
  },

  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return { success: false, error };
    }

    return { success: true, redirectTo: "/landing" };
  },

  onError: async (error) => {
    console.error(error);
    return { error };
  },

  check: async (): Promise<CheckResponse> => {
    try {
      const { data } = await supabaseClient.auth.getSession();
      const { session } = data;

      if (!session) {
        return {
          authenticated: false,
          error: {
            message: "Session not found",
            name: "Session not found",
          },
          logout: true,
          redirectTo: "/landing",
        };
      }

      const user = session.user;
      const email = user.email;
      if (!email) {
        return {
          authenticated: false,
          error: {
            message: "Email tidak ditemukan di session",
            name: "Email kosong",
          },
          logout: true,
          redirectTo: "/landing",
        };
      }

      // Ambil role dari metadata
      let role = user.user_metadata?.role;

      if (!role) {
        if (/^\d{9}@stis\.ac\.id$/.test(email)) {
          role = "mahasiswa";
        } else if (/^[a-zA-Z0-9._%+-]+@stis\.ac\.id$/.test(email)) {
          role = "dosen";
        } else {
          role = "admin";
        }

        const { error: updateError } = await supabaseClient.auth.updateUser({
          data: { role },
        });

        if (updateError) {
          console.error("Gagal update role:", updateError.message);
        }
      }

      if (!email.endsWith("@stis.ac.id") && role !== "admin") {
        await supabaseClient.auth.signOut();
        return {
          authenticated: false,
          error: {
            message: "Hanya email @stis.ac.id atau role admin yang diperbolehkan",
            name: "Email tidak valid",
          },
          logout: true,
          redirectTo: "/landing",
        };
      }

      // SIMPAN PROFIL USER JIKA BELUM ADA
      const { data: existingUser } = await supabaseClient
        .from("pengguna")
        .select("id")
        .eq("email", email)
        .single();

      if (!existingUser) {
        const username = email.split("@")[0];
        const nama = user.user_metadata?.full_name || username;
        const avatar = user.user_metadata?.avatar_url || null;

        const { error: insertError } = await supabaseClient
          .from("pengguna")
          .insert([
            {
              email,
              username,
              nama,
              avatars: avatar,
              role,
            },
          ]);

        if (insertError) {
          console.error("Gagal menyimpan pengguna:", insertError.message);
        } else {
          console.log("Pengguna baru disimpan:", { email, username, nama, role });
        }
      }

      return { authenticated: true };
    } catch (error: any) {
      return {
        authenticated: false,
        error: error || {
          message: "Check failed",
          name: "Not authenticated",
        },
        logout: true,
        redirectTo: "/landing",
      };
    }
  },

  getPermissions: async () => {
    const { data, error } = await supabaseClient.auth.getUser();

    if (data?.user) {
      return data.user.user_metadata?.role || null;
    }

    return null;
  },

  getIdentity: async () => {
    const { data: userResult, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !userResult?.user) return null;

    const email = userResult.user.email;
    if (!email) return null;

    const { data: profil } = await supabaseClient
      .from("edit_profil")
      .select("nama_dosen")
      .eq("email", email)
      .single();

    return {
      email,
      name: profil?.nama_dosen || email,
      role: userResult.user.user_metadata?.role || "user",
    };
  },
};

export default authProvider;
