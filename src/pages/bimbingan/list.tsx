import React from "react";
import { Button, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import { useGetIdentity } from "@refinedev/core";

interface IUserIdentity {
  email: string;
  name: string;
  role: string;
}

export const BimbinganList = () => {
  const { data: identity } = useGetIdentity<IUserIdentity>();
  const { dataGridProps } = useDataGrid();

  const filteredRows = React.useMemo(() => {
    if (!dataGridProps.rows || !identity) return [];

    const role = identity.role?.toLowerCase();
    const emailLogin = identity.email;
    const namaLogin = identity.name;

    return dataGridProps.rows.filter((row: any) => {
      if (role === "mahasiswa") {
        return row.email === emailLogin;
      }
      if (role === "dosen") {
        return (
          row.dosen_pembimbing1 === namaLogin ||
          row.dosen_pembimbing2 === namaLogin
        );
      }
      return false;
    });
  }, [dataGridProps.rows, identity]);

  const filePersetujuanUrl = (id: number) =>
    `/files/persetujuan-${id}.pdf`; // nanti diganti link Storage

  const columns = React.useMemo<GridColDef[]>(() => [
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "nama_mahasiswa", headerName: "Nama Mahasiswa", flex: 1, minWidth: 200 },
    { field: "judul", headerName: "Judul", flex: 1, minWidth: 250 },
    { field: "dosen_pembimbing1", headerName: "Dosen Pembimbing 1", flex: 1, minWidth: 200 },
    { field: "dosen_pembimbing2", headerName: "Dosen Pembimbing 2", flex: 1, minWidth: 200 },
    {
      field: "status_bimbingan",
      headerName: "Status Bimbingan",
      flex: 1,
      minWidth: 160,
      renderCell: ({ value }) => {
        let color = "#6b7280", bg = "#f3f4f6", border = "#d1d5db";
        let text = value?.toUpperCase() || "BELUM DISETUJUI";

        if (value?.toLowerCase() === "disetujui") {
          color = "#059669"; bg = "#ecfdf5"; border = "#34d399"; text = "DISETUJUI";
        } else if (value?.toLowerCase() === "ditolak") {
          color = "#dc2626"; bg = "#fef2f2"; border = "#f87171"; text = "DITOLAK";
        } else if (value?.toLowerCase() === "revisi") {
          color = "#f59e0b"; bg = "#fff7ed"; border = "#fbbf24"; text = "REVISI";
        }

        return (
          <Typography
            variant="caption"
            sx={{
              color,
              border: `1px solid ${border}`,
              borderRadius: "16px",
              padding: "4px 12px",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {text}
          </Typography>
        );
      },
    },
  
    {
      field: "download_pdf",
      headerName: "File Persetujuan",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => {
        if (row.status_bimbingan?.toLowerCase() !== "disetujui") {
          return "-";
        }
        const handleGeneratePDF = () => {
          import("jspdf").then(({ default: jsPDF }) => {
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text("Surat Persetujuan Proposal Skripsi", 105, 20, { align: "center" });
            doc.setFontSize(12);

            let y = 40;
            doc.text(`Nama Mahasiswa : ${row.nama_mahasiswa || "-"}`, 20, y);

            y += 10;
            const wrappedJudul = doc.splitTextToSize(`Judul : ${row.judul || "-"}`, 170);
            doc.text(wrappedJudul, 20, y);
            y += wrappedJudul.length * 7;

            doc.text(`Dosen Pembimbing 1 : ${row.dosen_pembimbing1 || "-"}`, 20, y);
            y += 10;
            doc.text(`Dosen Pembimbing 2 : ${row.dosen_pembimbing2 || "-"}`, 20, y);
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

            doc.save(`Surat_Persetujuan_${row.id}.pdf`);
          });
        };

        return (
          <Button
          variant="outlined"
          size="small"
          onClick={handleGeneratePDF}
          sx={{
            color: '#1976d2',
            borderColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#e3f2fd',
              borderColor: '#1976d2',
            },
          }}
        >
          UNDUH FILE
        </Button>
        

        );
      },
    },
    
    {
      field: "actions",
      headerName: "Actions",
      align: "right",
      headerAlign: "right",
      minWidth: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <EditButton hideText recordItemId={row.id} />
          <ShowButton hideText recordItemId={row.id} />
          <DeleteButton hideText recordItemId={row.id} />
        </>
      ),
    },
  ], []);

  return (
    <List>
      <DataGrid {...dataGridProps} rows={filteredRows} columns={columns} />
    </List>
  );
};
