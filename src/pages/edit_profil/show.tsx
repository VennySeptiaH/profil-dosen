import {
  Box,
  Typography,
  Stack,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import { LinearProgress } from "@mui/material";
import { CircularProgress } from "@mui/material";


// Import icons
import InterestsIcon from "@mui/icons-material/Interests";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export const ProfilShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;
  const record = data?.data;

  if (isLoading || !record) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }
  

  // Utility function: parse if stringified JSON
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
    <Show isLoading={isLoading}>
      <Stack spacing={3}>
        {/* Header */}
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems="center" gap={3}>
          <Avatar
            src={record?.avatars || "/default-avatar.png"}
            alt={record?.nama_dosen}
            sx={{ width: 180, height: 220 }}
            variant="rounded"
          />
          <Box textAlign={{ xs: "center", sm: "left" }}>
            <Typography variant="h5" fontWeight="bold">
              {record?.nama_dosen ?? "-"}
            </Typography>
            <Typography color="text.secondary">{record?.email ?? "-"}</Typography>
            <Typography color="text.secondary">{record?.username ?? "-"}</Typography>
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
          </Box>
        </Box>

        {/* Sections */}
        {minatPenelitian.length > 0 && (
          <Section
            icon={<InterestsIcon sx={{ mr: 1 }} />}
            title="Minat Penelitian / Research Interest"
            items={minatPenelitian}
            field="minat_penelitian"
          />
        )}

        {publikasiPenelitian.length > 0 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>📚 Publikasi Ilmiah</Typography>
            <List dense>
              {publikasiPenelitian.map((item, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={`• ${item.nama_jurnal1}`}
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
        )}

        {publikasiInternal.length > 0 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>🗂️ Publikasi Internal</Typography>
            <List dense>
              {publikasiInternal.map((item, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={`• ${item.nama_jurnal}`}
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
        )}

{projekBerjalan.length > 0 && (
  <Paper variant="outlined" sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom display="flex" alignItems="center">
      <Box mr={1}>
        <i className="ri-tools-line" />
      </Box>
      Projek Penelitian Berjalan
    </Typography>
    <List dense>
      {projekBerjalan.map((item, i) => (
        <ListItem key={i} sx={{ px: 0 }}>
          <Box display="flex" alignItems="center" width="100%" gap={2}>
            {/* Nama projek */}
            <Box sx={{ width: { xs: "100%", sm: "35%" } }}>
              <Typography variant="subtitle1" noWrap>
                • {item.nama_projek}
              </Typography>
            </Box>

            {/* Progress bar */}
            <Box sx={{ width: { xs: "100%", sm: "55%" } }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(item.penyelesaian) || 0}
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>

            {/* Persentase */}
            <Box sx={{ width: { xs: "100%", sm: "10%" }, textAlign: "right" }}>
              <Typography variant="body2">
                {item.penyelesaian ?? 0}%
              </Typography>
            </Box>
          </Box>
        </ListItem>
      ))}
    </List>
  </Paper>
)}





        <Section
          icon={<SchoolIcon sx={{ mr: 1 }} />}
          title="Riwayat Pendidikan"
          items={riwayatPendidikan}
          field="riwayat_pendidikan"
        />
        <Section
          icon={<WorkIcon sx={{ mr: 1 }} />}
          title="Riwayat Pekerjaan"
          items={riwayatPekerjaan}
          field="riwayat_pekerjaan"
        />
        <Section
          icon={<LibraryBooksIcon sx={{ mr: 1 }} />}
          title="Mata Kuliah"
          items={matkul}
          field="matkul"
        />
        <Section
          icon={<WorkspacePremiumIcon sx={{ mr: 1 }} />}
          title="Sertifikat Profesi / Kompetensi"
          items={sertifikat}
          field="sertifikat"
        />
        <Section
          icon={<GroupsIcon sx={{ mr: 1 }} />}
          title="Keanggotaan Organisasi Profesi"
          items={organisasi}
          field="organisasi"
        />
        <Section
          icon={<EmojiEventsIcon sx={{ mr: 1 }} />}
          title="Penghargaan / Beasiswa / Hibah Pribadi"
          items={penghargaan}
          field="penghargaan"
        />
      </Stack>
    </Show>
  );
};

// Komponen Section reusable
const Section = ({
  title,
  items,
  field,
  icon,
}: {
  title: string;
  items: any[];
  field: string;
  icon: React.ReactNode;
}) => (
  <Paper variant="outlined" sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom display="flex" alignItems="center">
      {icon} {title}
    </Typography>
    <List dense>
      {items.map((item, i) => (
        <ListItem key={i}>
          <ListItemText
            primary={`• ${
              typeof item === "string"
                ? item
                : item?.[field] ?? JSON.stringify(item)
            }`}
          />
        </ListItem>
      ))}
    </List>
  </Paper>
);
