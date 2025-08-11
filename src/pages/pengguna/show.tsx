import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import {  DateField, Show, TextFieldComponent as TextField } from "@refinedev/mui";

export const AccessShow = () => {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          {"ID"}
        </Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">
          {"Created At"}
        </Typography>
        <DateField value={record?.created_at} />

        <Typography variant="body1" fontWeight="bold">
          {"Name"}
        </Typography>
        <TextField value={record?.name} />

        <Typography variant="body1" fontWeight="bold">
          {"Email"}
        </Typography>
        <TextField value={record?.email} />

        <Typography variant="body1" fontWeight="bold">
          {"Role"}
        </Typography>
        <TextField value={record?.role} />

      </Stack>
    </Show>
  );
};
