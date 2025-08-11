// src/pages/pengguna/list.tsx
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";

export const AccessList = () => {
  const { dataGridProps } = useDataGrid({
    resource: "pengguna",
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "name", headerName: "Nama", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "actions",
      headerName: "Aksi",
      width: 150,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <EditButton hideText recordItemId={row.id} />
          <ShowButton hideText recordItemId={row.id} />
          <DeleteButton hideText recordItemId={row.id} />
        </>
      ),
    },
  ];

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};
