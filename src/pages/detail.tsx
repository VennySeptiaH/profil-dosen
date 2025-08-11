import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  List,
  ListItem,
  Stack,
  ListItemText,
  CircularProgress,
  LinearProgress,
  Tooltip,
  Chip,
  Grid,
} from "@mui/material";
import { useShow } from "@refinedev/core";
import { useParams } from "react-router-dom";
import InterestsIcon from "@mui/icons-material/Interests";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BuildIcon from "@mui/icons-material/Build";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";


const parseArray = (field: any): any[] => {
  try {
    let temp = field;
    while (typeof temp === "string") {
      temp = JSON.parse(temp);
    }
    return Array.isArray(temp) ? temp : [];
  } catch {
    return [];
  }
};


const Detail = () => {
  const { username } = useParams();
  const { query } = useShow({ resource: "edit_profil", id: username });
  const { data, isLoading, isError, error } = query;
  const record = data?.data;
  const researchInterests = record?.minat_penelitian || [];
  const publications = record?.publikasi_ilmiah || [];
  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Typography color="error">Terjadi kesalahan: {error?.message || "Gagal memuat data."}</Typography>
      </Box>
    );
  }

  if (isLoading || !record) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const minatPenelitian = parseArray(record.minat_penelitian);
  const publikasiPenelitian = parseArray(record.publikasi_penelitian);
  const publikasiInternal = parseArray(record.publikasi_internal);
  const projekBerjalan = parseArray(record.projek_berjalan);
  const riwayatPendidikan = parseArray(record.riwayat_pendidikan);
  const riwayatPekerjaan = parseArray(record.riwayat_pekerjaan);
  const matkul = parseArray(record.matkul);
  const sertifikat = parseArray(record.sertifikat);
  const organisasi = parseArray(record.organisasi);
  const penghargaan = parseArray(record.penghargaan);

  return (
    <Box>
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
          padding: "12px 24px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          bgcolor: "background.paper",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <img src="/src/LOGO STIS.png" alt="Logo" style={{ width: 36, height: 36 }} />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "18px", color: "#003366" }}>
              PROFIL DOSEN
            </Typography>
            <Typography variant="caption" sx={{ color: "#666" }}>
              POLITEKNIK STATISTIKA STIS
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Button variant="outlined" size="small">.</Button>
          <Button variant="outlined" size="small">Login</Button>
        </Box>
      </Box>

{/* Profile Section */}
<Box sx={{ px: { xs: 2, sm: 12 }, pt: 6, pb: 4 }}>
 
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      borderRadius: 4,
      overflow: "hidden",
      boxShadow: 3,
      minHeight: 220,
      position: "relative",
      backgroundColor: "#fff",
    }}
  >
    {/* Lingkaran penghubung di bawah card */}
<Box
  sx={{
    position: "absolute",
    bottom: -20,
    left: "50%",
    transform: "translateX(-50%)",
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#fff",
    border: "5px solid #cfd8dc", // warna abu-abu terang
    zIndex: 1,
  }}
/>

    {/* Left - Blue Background & Photo */}
    <Box
      sx={{
        width: { xs: "100%", sm: 300 },
        backgroundColor: "#0b2c64",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      <Avatar
        src={record?.avatars || "/default-avatar.png"}
        alt={record?.nama_dosen}
        sx={{ width: 180, height: 220 }}
      />
    </Box>

    {/* Right - White Card with Identity */}
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        position: "relative",
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        {record?.nama_dosen ?? "-"}
      </Typography>
      <Stack direction="row" flexWrap="wrap" spacing={1} mt={1}>
              {(() => {
                let jabatanList: string[] = [];

                if (Array.isArray(record?.jabatan)) {
                  jabatanList = record.jabatan;
                } else if (typeof record?.jabatan === "string") {
                  try {
                    const parsed = JSON.parse(record.jabatan);
                    jabatanList = Array.isArray(parsed) ? parsed : [record.jabatan];
                  } catch (error) {
                    jabatanList = [record.jabatan];
                  }
                }

                return jabatanList.map((item, i) => (
                  <Chip key={i} label={item} color="primary" />
                ));
              })()}
      </Stack>
      <Typography color="text.secondary">{record?.username ?? "-"}</Typography>
      <Typography color="text.secondary">{record?.email ?? "-"}</Typography>


    </Box>
  </Box>
</Box>


{/* Sections */}
<Box sx={{ px: { xs: 4, sm: 12 } }}>
  <Grid container spacing={2}>
    {minatPenelitian.length > 0 && (
      <Grid item xs={12}>
        <Section
          icon={<InterestsIcon />}
          title="Minat Penelitian"
          items={minatPenelitian}
          field="minat_penelitian"
        />
      </Grid>
    )}

    {publikasiPenelitian.length > 0 && (
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center">
            <LibraryBooksIcon sx={{ mr: 1 }} /> Publikasi Ilmiah
          </Typography>
          <List dense>
            {publikasiPenelitian.map((item, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={`• ${item.nama_jurnal1 ?? "-"}`}
                  secondary={
                    <>
                      {item.url1 && <div>URL: {item.url1}</div>}
                      {item.doi1 && <div>DOI: {item.doi1}</div>}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    )}

    {publikasiInternal.length > 0 && (
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center">
            <LibraryBooksIcon sx={{ mr: 1 }} /> Publikasi Internal
          </Typography>
          <List dense>
            {publikasiInternal.map((item, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={`• ${item.nama_jurnal ?? "-"}`}
                  secondary={
                    <>
                      {item.url && <div>URL: {item.url}</div>}
                      {item.doi && <div>DOI: {item.doi}</div>}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    )}


          {projekBerjalan.length > 0 && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                  <BuildIcon sx={{ mr: 1 }} /> Projek Penelitian Berjalan
                </Typography>
                <List dense>
                  {projekBerjalan.map((item, i) => (
                    <ListItem key={i} sx={{ px: 0 }}>
                      <Box display="flex" alignItems="center" width="100%" gap={2}>
                        <Box sx={{ width: { xs: "100%", sm: "35%" } }}>
                          <Typography variant="subtitle2" noWrap>
                            • {item.nama_projek}
                          </Typography>
                        </Box>
                        <Box sx={{ width: { xs: "100%", sm: "55%" } }}>
                          <Tooltip title={`${item.penyelesaian}%`} placement="top">
                            <LinearProgress variant="determinate" value={parseFloat(item.penyelesaian) || 0} sx={{ height: 8, borderRadius: 5 }} />
                          </Tooltip>
                        </Box>
                        <Box sx={{ width: { xs: "100%", sm: "10%" }, textAlign: "right" }}>
                          <Typography variant="body2">{item.penyelesaian ?? 0}%</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          <Grid item xs={12} sm={6}><Section icon={<SchoolIcon />} title="Riwayat Pendidikan" items={riwayatPendidikan} field="riwayat_pendidikan" /></Grid>
          <Grid item xs={12} sm={6}><Section icon={<WorkIcon />} title="Riwayat Pekerjaan" items={riwayatPekerjaan} field="riwayat_pekerjaan" /></Grid>
          <Grid item xs={12} sm={6}><Section icon={<LibraryBooksIcon />} title="Mata Kuliah" items={matkul} field="matkul" /></Grid>
          <Grid item xs={12} sm={6}><Section icon={<WorkspacePremiumIcon />} title="Sertifikat Profesi / Kompetensi" items={sertifikat} field="sertifikat" /></Grid>
          <Grid item xs={12} sm={6}><Section icon={<GroupsIcon />} title="Keanggotaan Organisasi Profesi" items={organisasi} field="organisasi" /></Grid>
          <Grid item xs={12} sm={6}><Section icon={<EmojiEventsIcon />} title="Penghargaan / Beasiswa / Hibah Pribadi" items={penghargaan} field="penghargaan" /></Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const Section = ({ title, items, field, icon }: { title: string; items: any[]; field: string; icon: React.ReactNode }) => (
  <Paper variant="outlined" sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: 3 }}>
    <Typography variant="h6" gutterBottom display="flex" alignItems="center">
      <Box mr={1}>{icon}</Box> <Box component="span" fontWeight={600}>{title}</Box>
    </Typography>
    <List dense>
      {items.map((item, i) => (
        <ListItem key={i}>
          <ListItemText primary={`• ${typeof item === "string" ? item : item?.[field] ?? JSON.stringify(item)}`} />
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default Detail;
