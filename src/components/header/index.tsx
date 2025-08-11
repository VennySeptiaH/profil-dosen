import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useGetIdentity } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import React, { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";
import { useRole } from "../../pages/RoleContext"; // Pastikan untuk import useRole jika diperlukan

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode } = useContext(ColorModeContext);

  const { data: user } = useGetIdentity<IUser>();
  const { role } = useRole(); // Mengambil role pengguna

  return (
    <AppBar position={sticky ? "sticky" : "relative"}>
      <Toolbar>
        {/* <img src="/src/LOGO STIS.png" alt="Logo" style={{ height: 40, marginRight: 16 }} /> */}
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
        >
          <HamburgerMenu />
          <Stack
            direction="row"
            width="100%"
            gap="16px"
            justifyContent="flex-end"
            alignItems="center"
          >
            <IconButton
              color="inherit"
              onClick={() => {
                setMode();
              }}
            >
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>

            {(user?.avatar || user?.name) && (
              <Stack
                direction="row"
                gap="16px"
                alignItems="center"
                justifyContent="center"
              >
                  <Avatar src={user?.avatar} alt={user?.name} />
                {user?.name && (
                  <Stack direction="column" alignItems="justify" justifyContent="center">
                    <Typography
                      sx={{
                        display: {
                          xs: "none",
                          sm: "inline-block",
                        },
                        fontWeight: "bold",
                      }}
                      variant="subtitle2"
                    >
                      {user?.name}
                    </Typography>

                    {/* Menambahkan role di bawah nama pengguna */}
                    {role && (
                      <Typography
                        sx={{
                          display: {
                            xs: "none",
                            sm: "inline-block",
                          },
                          fontSize: "0.875rem",
                        }}
                        variant="caption"
                        color="#fffff"
                      >
                        {role} {/* Menampilkan role pengguna */}
                      </Typography>
                    )}
                  </Stack>
                )}
                
              </Stack>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

