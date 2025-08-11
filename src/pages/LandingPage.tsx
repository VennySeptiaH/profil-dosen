import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useList } from "@refinedev/core";
import { ColorModeContextProvider } from "../contexts/color-mode";
import { ColorModeContext } from "../contexts/color-mode";
import { useContext } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PopupCariDosenPembimbing from "./PopupCariDosenPembimbing";

const TABS = [
  "D-IV KOMPUTASI STATISTIK",
  "D-III STATISTIKA",
  "D-IV STATISTIKA",
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(1);
  const { setMode } = useContext(ColorModeContext);
  const [hover, setHover] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);


  // Fetch dosen dari tabel edit_profil
  const { data, isLoading } = useList({
    resource: "edit_profil",
    filters: [
      {
        field: "dosen_prodi",
        operator: "eq",
        value: TABS[selectedTab],
      },
    ],
    pagination: {
      pageSize: 8,
    },
  });

  const dosenList = data?.data || [];

  return (
    <>
      {/* Header */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          bgcolor: "background.paper",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <img
            src="/src/LOGO STIS.png"
            alt="Logo"
            style={{ width: "40px", height: "40px" }}
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#0D47A1" }}>
              PROFIL DOSEN
            </Typography>
            <Typography variant="caption" sx={{ color: "#1565C0", whiteSpace: "nowrap" }}>
              POLITEKNIK STATISTIKA STIS
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Button variant="outlined" onClick={() => setMode()}>
            .
          </Button>
          <Button variant="outlined" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "#002366",
          color: "white",
          px: { xs: 4, md: 12 },
          pt: { xs: 6, md: 5 },
          pb: { xs: 4, md: 1 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ maxWidth: { xs: "100%", md: "45%" }, zIndex: 2 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom mt={7}>
              SELAMAT DATANG
            </Typography>
            <Typography variant="h6" gutterBottom mt={2}>
              Website Profil Dosen Politeknik Statistika STIS
            </Typography>
            <Box mt={4}>
              <Button variant="contained" sx={{ mr: 2 }}>
                LOGIN
              </Button>
              
              <Button variant="outlined" color="inherit">
              <PopupCariDosenPembimbing />
              </Button>
            </Box>
          </Box>

          <Box
            component="img"
            src="/src/direktur.png"
            alt="Direktur"
            sx={{
              width: { xs: "200%", md: "50%" },
              maxWidth: 700,
              position: "relative",
              right: { xs: 0, md: -20 },
              mt: { xs: 4, md: 0 },
              zIndex: 1,
            }}
          />
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            left: "50%",
            bottom: 0,
            transform: "translateX(-50%) translateY(50%)",
            zIndex: 2,
            backgroundColor: "#fff",
            boxShadow: 3,
          }}
        >
          {TABS.map((label, index) => {
            const isActive = selectedTab === index;
            return (
              <Box
                key={label}
                onClick={() => setSelectedTab(index)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  px: 3,
                  py: 4,
                  pb: 3,
                  minWidth: 180,
                  backgroundColor: isActive ? "#2196F3" : "#fff",
                  color: isActive ? "#fff" : "#333",
                  boxShadow: isActive ? 3 : "none",
                  transform: isActive ? "translateY(-12px)" : "none",
                  borderRadius:
                    index === 0
                      ? "8px 0 0 8px"
                      : index === 2
                      ? "0 8px 8px 0"
                      : "0",
                  zIndex: isActive ? 2 : 1,
                }}
              >
                <Box
                  component="img"
                  src="/src/icon-monitor.png"
                  alt="icon"
                  sx={{
                    width: 28,
                    height: 28,
                    mb: 1,
                    filter: isActive ? "invert(1)" : "none",
                  }}
                />
                <Typography variant="body2" fontWeight="bold" textAlign="center">
                  DOSEN
                </Typography>
                <Typography variant="caption" textAlign="center">
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Daftar Dosen */}
      <Container sx={{ mt: 10 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
          DAFTAR DOSEN {TABS[selectedTab]}
        </Typography>
        <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
          POLITEKNIK STATISTIKA STIS
        </Typography>

        <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            dosenList.map((dosen, index) => (
              <Grid item xs={6} sm={3} key={index}>
                  <Card 
                    sx={{ 
                          borderRadius: 2, 
                          boxShadow: 2, 
                          position: "relative", 
                          overflow: "hidden", 
                          cursor: "pointer", 
                        }}
                          onMouseEnter={() => setHoveredCard(index)}
                          onMouseLeave={() => setHoveredCard(null)}
                  >
                  <CardMedia
                    component="img"
                    height="200"
                    image={dosen.avatars || ""}
                    alt={dosen.nama_dosen}
                    sx={{
                      objectFit: "cover",
                      backgroundColor: "#002366",
                      mb: -0.5,
                    }}
                  />
                  <CardContent
                    sx={{
                      textAlign: "center",
                      backgroundColor:
                        theme.palette.mode === "light" ? "#001E60" : "#1565C0",
                      color: "#fff",
                      py: 1,
                    }}
                  >
                    <Typography variant="body2">{dosen.nama_dosen}</Typography>
                  </CardContent>
                  

          {/* Overlay on hover */}
          {hoveredCard === index && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "0.3s ease-in-out",
              }}
            >
              <Typography variant="body2" fontWeight="bold" mb={1}>
                {dosen.nama_dosen}
              </Typography>
              <IconButton
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  ":hover": {
                    backgroundColor: "rgba(255,255,255,0.4)",
                  },
                }}
                onClick={() => navigate(`/dosen/${dosen.id}`)}
              >
                <Visibility />
              </IconButton>
            </Box>
          )}
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </>
  );
};

export default LandingPage;
