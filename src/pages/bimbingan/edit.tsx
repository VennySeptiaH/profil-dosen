import { Box, MenuItem, Select, TextField, Button } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useGetIdentity } from "@refinedev/core";
import jsPDF from "jspdf"; 

interface IUserIdentity {
  email: string;
  name: string;
  role: string;
}

export const BimbinganEdit = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult },
    register,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const { data: identity } = useGetIdentity<IUserIdentity>();
  const role = identity?.role?.toLowerCase() ?? "";
  const data = queryResult?.data?.data || {};

  const status = watch("status_bimbingan");

  const generatePersetujuanPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SURAT PERSETUJUAN PROPOSAL SKRIPSI", 105, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    let y = 40;
    doc.text(`Nama Mahasiswa : ${data.nama_mahasiswa || "-"}`, 20, y);

    y += 10;
    const wrappedJudul = doc.splitTextToSize(`Judul : ${data.judul || "-"}`, 170);
    doc.text(wrappedJudul, 20, y);
    y += wrappedJudul.length * 7;

    doc.text(`Dosen Pembimbing 1 : ${data.dosen_pembimbing1 || "-"}`, 20, y);
    y += 10;
    doc.text(`Dosen Pembimbing 2 : ${data.dosen_pembimbing2 || "-"}`, 20, y);
    y += 10;

    doc.text(
      `Tanggal Persetujuan : ${new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      20,
      y
    );

    y += 20;
    doc.text("Mengetahui,", 150, y);
    y += 10;
    doc.text("Dosen Pembimbing", 150, y);

    doc.save("Surat_Persetujuan.pdf");
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box component="form" sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          {...register("nama_mahasiswa", { required: "Nama mahasiswa wajib diisi" })}
          defaultValue={data.nama_mahasiswa}
          margin="normal"
          label="Nama Mahasiswa"
          error={!!errors?.nama_mahasiswa}
          helperText={errors?.nama_mahasiswa?.message as string}
        />
        <TextField
          {...register("judul", { required: "Judul wajib diisi" })}
          defaultValue={data.judul}
          margin="normal"
          label="Judul"
          error={!!errors?.judul}
          helperText={errors?.judul?.message as string}
        />
        <TextField
          {...register("dosen_pembimbing1")}
          defaultValue={data.dosen_pembimbing1}
          margin="normal"
          label="Dosen Pembimbing 1"
        />
        <TextField
          {...register("dosen_pembimbing2")}
          defaultValue={data.dosen_pembimbing2}
          margin="normal"
          label="Dosen Pembimbing 2"
        />

        {role === "dosen" && (
          <Controller
            name="status_bimbingan"
            control={control}
            defaultValue={data.status_bimbingan || ""}
            render={({ field }) => (
              <Select {...field} fullWidth sx={{ mt: 2 }}>
                <MenuItem value="Disetujui">Disetujui</MenuItem>
                <MenuItem value="Revisi">Revisi</MenuItem>
                <MenuItem value="Ditolak">Ditolak</MenuItem>
              </Select>
            )}
          />
        )}

        {status === "Disetujui" && (
          <Button
            type="button" // ⬅ ini penting biar form tidak submit
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={generatePersetujuanPDF}
          >
            Unduh Surat Persetujuan
          </Button>
        )}
      </Box>
    </Edit>
  );
};
