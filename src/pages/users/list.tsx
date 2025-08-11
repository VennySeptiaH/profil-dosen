import { Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";

export const UserList = () => {
  const { dataGridProps } = useDataGrid({});

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
        minWidth: 50,
        display: "flex",
        align: "left",
        headerAlign: "left",
      },
      {
        field: "created_at",
        headerName: "Created at",
        minWidth: 120,
        display: "flex",
        renderCell: ({ value }) => <DateField value={value} />,
      },
      {
        field: "nama", //nama kolom pada database
        flex: 1, //panjang kolom
        headerName: "Name", //nama kolom pada halaman web
        minWidth: 200,
        display: "flex", //buat align center
      },
      {
        field: "email",
        headerName: "Email",
        minWidth: 250,
        flex: 1,
        display: "flex",
        renderCell: ({ value }) => (
          <Typography
            component="p"
            whiteSpace="pre"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {value || "-"}
          </Typography>
        ),
      },
      {
        field: "role",
        headerName: "Role",
        minWidth: 160,
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "right",
        headerAlign: "right",
        minWidth: 120,
        sortable: false,
        display: "flex",
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
};
