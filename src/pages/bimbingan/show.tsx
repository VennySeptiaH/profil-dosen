import { Box, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/mui";

interface BimbinganRecord {
  nama_mahasiswa: string;
  judul: string;
  minat_penelitian: string;
  matkul_terkait: string;
  dosen_pembimbing1: string;
  persenDosen1: number;
  dosen_pembimbing2: string;
  persenDosen2: number;
}

export const BimbinganShow = () => {
  const { query } = useShow<BimbinganRecord>();
  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Informasi Bimbingan
        </Typography>

        <Typography>Nama Mahasiswa: {record?.nama_mahasiswa}</Typography>
        <Typography>Judul Skripsi: {record?.judul}</Typography>
        <Typography>Minat Penelitian: {record?.minat_penelitian}</Typography>
        <Typography>Mata Kuliah Terkait: {record?.matkul_terkait}</Typography>

        <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap" }}>
          {/* Dosen Pembimbing 1 */}
          <Box
            sx={{
              flex: "1 1 300px",
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              backgroundColor: "#0000",
              minWidth: 280,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Dosen Pembimbing 1
            </Typography>
            <Typography>{record?.dosen_pembimbing1}</Typography>
            <Typography variant="body2" color="text.secondary">
              Persentase Kecocokan: {record?.persenDosen1}%
            </Typography>
          </Box>

          {/* Dosen Pembimbing 2 */}
          <Box
            sx={{
              flex: "1 1 300px",
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              backgroundColor: "#0000",
              minWidth: 280,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Dosen Pembimbing 2
            </Typography>
            <Typography>{record?.dosen_pembimbing2}</Typography>
            <Typography variant="body2" color="text.secondary">
              Persentase Kecocokan: {record?.persenDosen2}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </Show>
  );
};
