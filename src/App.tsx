import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import logo from "/src/LOGO STIS.png"; 
import PeopleIcon from "@mui/icons-material/People";
import { Navigate } from "react-router-dom";
// Tambahkan import ini di bagian atas App.tsx
import React, { useState, useEffect } from "react";
import { RoleProvider, useRole } from "./pages/RoleContext";
import SchoolIcon from '@mui/icons-material/School';
import { useLogin } from "@refinedev/core";
import { Button } from "@mui/material";
// Import SVG Icon
import UserEditIcon from "/src/user-edit.svg?url";
import { LandingPage } from "./pages/LandingPage"; 
import Detail from "./pages/detail";


import {
  AuthPage,
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import authProvider from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";


import {
  UserCreate,
  UserEdit,
  UserList,
  UserShow,
} from "./pages/users";
import {
  ProfilCreate,
  ProfilEdit,
  ProfilList,
  ProfilShow,
} from "./pages/edit_profil";
import {
  ExampleCreate,
  ExampleEdit,
  ExampleList,
  ExampleShow,
} from "./pages/example";
import {
  AccessCreate,
  AccessEdit,
  AccessList,
  AccessShow,
} from "./pages/pengguna";
import {
  BimbinganCreate,
  BimbinganEdit,
  BimbinganList,
  BimbinganShow,
} from "./pages/bimbingan";
import { supabaseClient } from "./utility";

// Komponen untuk menampilkan ikon SVG
const EditProfileIcon = () => (
  <svg  
    xmlns="http://www.w3.org/2000/svg"  
    width="24"  
    height="24"  
    viewBox="0 0 24 24"  
    fill="none"  
    stroke="currentColor"  
    strokeWidth="2"  
    strokeLinecap="round"  
    strokeLinejoin="round"  
    className="icon icon-tabler icons-tabler-outline icon-tabler-edit"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
    <path d="M16 5l3 3" />
  </svg>
);
const LoginWithGoogleButton = () => {
  const { mutate: login } = useLogin();

  const handleLoginGoogle = () => {
    login({ providerName: "google" });
  };

  return (
    <Button
      fullWidth
      variant="contained"
      sx={{
        mt: 2,
        backgroundColor: "#DB4437",
        color: "white",
        fontWeight: "bold",
        ":hover": {
          backgroundColor: "#c23329",
        },
      }}
      onClick={handleLoginGoogle}
    >
      Masuk dengan Google
    </Button>
  );
};
function App() {
  const [role, setRole] = useState<"admin" | "dosen" |  "mahasiswa" |null>(null); //  (role)
  const [loadingRole, setLoadingRole] = useState<boolean>(true);

  useEffect(() => {
    const fetchRole = async (): Promise<void> => {
      try {
        const { data, error } = await supabaseClient.auth.getUser();
        if (error) throw error;
  
        const email = data?.user?.email ?? "";
        const userId = data?.user?.id;
  
        if (!email || !userId) return setRole(null);
  
        // Ambil dari tabel pengguna dulu
        const { data: userData, error: userError } = await supabaseClient
          .from("pengguna")
          .select("role")
          .eq("id", userId)
          .single();
  
        const dbRole = userData?.role ?? null;
  
        if (dbRole === "admin") {
          setRole("admin");
        } else if (/^\d{9}@stis\.ac\.id$/.test(email)) {
          setRole("mahasiswa");
        } else if (/^[a-zA-Z0-9._%+-]+@stis\.ac\.id$/.test(email)) {
          setRole("dosen");
        } else {
          setRole(null); // tidak dikenali
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
    <RoleProvider>
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider> {/* Memberikan akses mode warna ke seluruh aplikasi */}
          <CssBaseline /> {/* Global CSS reset */}
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              
              <Refine
                dataProvider={dataProvider(supabaseClient)}
                liveProvider={liveProvider(supabaseClient)}
                authProvider={authProvider}
                routerProvider={routerBindings}
                notificationProvider={useNotificationProvider}
                resources={[
              
                  ...(role === "admin"
                  ? [
                      {
                        name: "users",
                        list: "/users",
                        create: "/users/create",
                        edit: "/users/edit/:id",
                        show: "/users/show/:id",
                        meta: {
                          canDelete: true,
                          icon: <PeopleIcon />,
                        },
                      },
                    ]
                  : []),

                  ...(role === "dosen" || role === "admin"
                  ? [
                      {
                        name: "edit_profil",
                        list: "/edit_profil",
                        create: "/edit_profil/create",
                        edit: "/edit_profil/edit/:id",
                        show: "/edit_profil/show/:id",
                        meta: {
                          canDelete: true,
                          icon: <EditProfileIcon />,
                        },
                      },
                    ]
                  : []),

                  ...(role === "admin"
                  ? [
                      {
                        name: "example",
                        list: "/example",
                        create: "/example/create",
                        edit: "/example/edit/:id",
                        show: "/example/show/:id",
                        meta: {
                          canDelete: true,
                          icon: <EditProfileIcon />,
                        },
                      },
                    ]
                  : []),

                  ...(role === "mahasiswa" || role === "dosen" || role === "admin"
                  ? [
                      {
                        name: "bimbingan",
                        list: "/bimbingan",
                        create: "/bimbingan/create",
                        edit: "/bimbingan/edit/:id",
                        show: "/bimbingan/show/:id",
                        meta: {
                          canDelete: true,
                          icon: <SchoolIcon />,
                        },
                      },
                    ]
                  : []),

                  ...(role === "admin"
                  ? [
                      {
                        name: "pengguna",
                        list: "/pengguna",
                        create: "/pengguna/create",
                        edit: "/pengguna/edit/:id",
                        show: "/pengguna/show/:id",
                        meta: {
                          canDelete: true,
                          icon: <PeopleIcon />,
                        },
                      },
                    ]
                  : []),
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "AK4XC6-NZrgS4-tFjVCg",
                }}
              >
                <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/landing" />}
                      >
                        <ThemedLayoutV2
                          Header={Header}
                          Title={({ collapsed }) => (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <img 
                                src="/src/LOGO STIS.png" // Sesuaikan path logo
                                alt="Logo" 
                                style={{ width: "40px", height: "40px" }} 
                              />
                              {!collapsed && (
                                <div style={{ lineHeight: "1.2" }}>
                                  <span style={{
                                    fontWeight: "bold", 
                                    fontSize: "14px", 
                                    color: "#0D47A1",
                                    display: "block"
                                  }}>
                                    PROFIL DOSEN
                                  </span>
                                  <span style={{
                                    fontSize: "10px", 
                                    color: "#1565C0",
                                    whiteSpace: "nowrap"
                                  }}>
                                    POLITEKNIK STATISTIKA STIS
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="users" />}
                    />

                      {/* Rute untuk Profil */}
                      <Route
                        path="/edit_profil"
                        element={
                          role === "admin" || role === "dosen" ? (
                            <ProfilList />
                          ) : (
                            <p>Anda tidak memiliki izin untuk melihat halaman ini.</p>
                          )
                        }
                      />
                      <Route
                        path="/edit_profil/create"
                        element={
                          role === "admin" || role === "dosen" ? (
                            <ProfilCreate />
                          ) : (
                            <p>Anda tidak memiliki izin untuk melihat halaman ini.</p>
                          )
                        }
                      />
                      <Route
                        path="/edit_profil/edit/:id"
                        element={
                          role === "admin" || role === "dosen" ? (
                            <ProfilEdit />
                          ) : (
                            <p>Anda tidak memiliki izin untuk melihat halaman ini.</p>
                          )
                        }
                      />
                      <Route
                        path="/edit_profil/show/:id"
                        element={
                          role === "admin" || role === "dosen" ? (
                            <ProfilShow />
                          ) : (
                            <p>Anda tidak memiliki izin untuk melihat halaman ini.</p>
                          )
                        }
                      />
                 

                      <Route
                        path="/users"
                        element={
                          role === "admin" ? (
                            <UserList />
                          ) : (
                            <p>Anda tidak memiliki izin untuk melihat halaman ini.</p>
                          )
                        }
                      >
                        {/* Nested Routes */}
                        <Route path="create" element={<UserCreate />} />
                        <Route path="edit/:id" element={<UserEdit />} />
                        <Route path="show/:id" element={<UserShow />} />
                      </Route>
                 
                      <Route
                        path="/example"
                        element={
                          role === "admin" ? (
                            <ExampleList />
                          ) : (
                            <p>Anda tidak memiliki izin untuk melihat halaman ini.</p>
                          )
                        }
                      >
                        {/* Nested Routes */}
                        <Route path="create" element={<ExampleCreate />} />
                        <Route path="edit/:id" element={<ExampleEdit />} />
                        <Route path="show/:id" element={<ExampleShow />} />
                      </Route>

                      <Route
                        path="/pengguna"
                        element={
                          role === "admin" ? (
                            <AccessList />
                          ) : (
                            <p>Anda tidak memiliki izin untuk melihat halaman ini.</p>
                          )
                        }
                      >
                        {/* Nested Routes */}
                        <Route path="create" element={<AccessCreate />} />
                        <Route path="edit/:id" element={<AccessEdit />} />
                        <Route path="show/:id" element={<AccessShow />} />
                      </Route>

                      {/* Rute untuk Bimbingan */}
                      <Route
                        path="/bimbingan"
                        element={
                          role === "mahasiswa" || role === "dosen" || role === "admin" ? (
                            <BimbinganList />
                          ) : (
                            <p>Anda tidak memiliki izin untuk melihat halaman ini.</p>
                          )
                        }
                      />
                      <Route
                        path="/bimbingan/create"
                        element={
                          role === "mahasiswa" || role === "dosen"|| role === "admin" ? (
                            <BimbinganCreate />
                          ) : (
                            <p>Anda tidak memiliki izin untuk melihat halaman ini.</p>
                          )
                        }
                      />
                      <Route
                        path="/bimbingan/edit/:id"
                        element={
                          role === "mahasiswa" || role === "dosen" || role === "admin" ? (
                            <BimbinganEdit />
                          ) : (
                            <p>Anda tidak memiliki izin untuk melihat halaman ini.</p>
                          )
                        }
                      />
                      <Route
                        path="/bimbingan/show/:id"
                        element={
                          role === "mahasiswa" || role === "dosen" || role === "admin" ? (
                            <BimbinganShow />
                          ) : (
                            <p>Anda tidak memiliki izin untuk melihat halaman ini.</p>
                          )
                        }
                      />

                        <Route path="*" element={<ErrorComponent />} />
                      </Route>
                      
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route
                      path="/login"
                      element={
                        <AuthPage
                          type="login"
                          title={false} // matikan title bawaan (luar box)
                          renderContent={(content) => {
                          if (!React.isValidElement(content)) return null;

                          return React.cloneElement(content as React.ReactElement, {
                            children: (
                              <>
                                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                                  <img
                                    src="/src/LOGO STIS.png"
                                    alt="Logo STIS"
                                    style={{ width: "100px", height: "auto" }}
                                  />
                                </div>
                  
                                {/* Form Login Default */}
                                {content.props.children}
                  
                                {/* Tombol Login Google */}
                                <LoginWithGoogleButton />
                              </>
                            ),
                          });
                        }}
                        formProps={{
                          defaultValues: {
                            email: "",
                            password: "",
                          },
                        }}
                      />
                    }
                  />

                    <Route
                      path="/register"
                      element={<AuthPage type="register" />}
                    />
                    <Route
                      path="/forgot-password"
                      element={<AuthPage type="forgotPassword" />}
                    />
                  </Route>
                  <Route path="*" element={<Navigate to="/landing" />} />
                  <Route path="/dosen/:username" element={<Detail />} />
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler handler={(title) => `Profil Dosen`} />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  </RoleProvider>
  );
}

export default App;
