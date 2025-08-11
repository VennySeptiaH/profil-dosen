import { Box, MenuItem, Select, TextField } from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";

export const AccessEdit = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    control,
    formState: { errors },
  } = useForm({});

  const categoryData = queryResult?.data?.data;
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("name", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.name}
          helperText={(errors as any)?.name?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type=""
          label={"Name"}
          name="name"
        />
        <TextField
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          error={!!errors?.email}
          helperText={typeof errors?.email?.message === "string" ? errors.email.message : ""}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="email"
          label="Email"
          name="email"
        />
        <Controller
          name="role"
          control={control}
          defaultValue={categoryData?.role || "mahasiswa"}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Select {...field} fullWidth margin="none" label="Role">
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="mahasiswa">Mahasiswa</MenuItem>
              <MenuItem value="dosen">Dosen</MenuItem>
            </Select>
          )}
        />
      </Box>
    </Edit>
  );
};
