import { Typography, Chip, Stack, Box, Avatar, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  useDataGrid,
} from "@refinedev/mui";
import { useGetIdentity, useNavigation } from "@refinedev/core";
import React, { useEffect, useState } from "react";

// Tipe user login
type IdentityUser = {
  email: string;
  role: "admin" | "dosen" | "mahasiswa";
};

export const ProfilList: React.FC = () => {
  const { data: identity } = useGetIdentity<IdentityUser>();
  const isAdmin = identity?.role === "admin";
  const isDosen = identity?.role === "dosen";
  const [hasProfil, setHasProfil] = useState(false);

  const { showUrl, editUrl, createUrl } = useNavigation();

  const { dataGridProps } = useDataGrid({
    filters: {
      permanent:
        !isAdmin
          ? [{ field: "email", operator: "eq", value: identity?.email }]
          : [],
    },
    pagination: {
      pageSize: 10,
    },
  });

  // Cek apakah user sudah punya profil
  useEffect(() => {
    if (dataGridProps?.rows?.length > 0) {
      setHasProfil(true);
    }
  }, [dataGridProps?.rows]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    {
      field: "avatars",
      headerName: "Foto",
      renderCell: ({ row }) => (
        <Avatar
          src={row.avatars || "/default-avatar.png"}
          alt={row.nama_dosen}
          sx={{ width: 50, height: 50 }}
          variant="circular"
        />
      ),
      width: 80,
    },
    {
      field: "nama_dosen",
      headerName: "Nama Dosen",
      minWidth: 200,
      flex: 1,
      renderCell: ({ value }) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography noWrap>{value ?? "-"}</Typography>
        </Box>
      ),
    },
    {
      field: "jabatan",
      headerName: "Jabatan",
      minWidth: 200,
      flex: 1,
      renderCell: ({ value }) => {
        let jabatanList: string[] = [];

        if (Array.isArray(value)) {
          jabatanList = value;
        } else if (typeof value === "string") {
          try {
            const parsed = JSON.parse(value);
            jabatanList = Array.isArray(parsed) ? parsed : [value];
          } catch {
            jabatanList = [value];
          }
        }

        return (
          <Box display="flex" alignItems="center" height="100%">
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1 }}>
              {jabatanList.map((item, index) => (
                <Chip key={index} label={item} size="small" color="primary" />
              ))}
            </Stack>
          </Box>
        );
      },
    },
    {
      field: "update_at",
      headerName: "Terakhir Diedit",
      minWidth: 180,
      flex: 1,
      renderCell: ({ value }) => {
        const tanggal = value
          ? new Date(value).toLocaleString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-";
        return (
          <Box display="flex" alignItems="center" height="100%">
            <Typography noWrap>{tanggal}</Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      align: "center",
      headerAlign: "center",
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <EditButton hideText size="small" recordItemId={row.id} />
          <ShowButton hideText size="small" recordItemId={row.id} />
          {isAdmin && <DeleteButton hideText size="small" recordItemId={row.id} />}
        </Stack>
      ),
    },
  ];

  return (
    <List
      createButtonProps={
        !isAdmin && hasProfil
          ? { style: { display: "none" } }
          : undefined
      }
    >
      <DataGrid
        {...dataGridProps}
        columns={columns}
        checkboxSelection
        autoHeight
      />
    </List>
  );
};
