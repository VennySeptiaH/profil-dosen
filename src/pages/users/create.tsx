import { Box, MenuItem, Select, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { supabaseClient } from "../../utility"; // sesuaikan path
import authProvider from "../../authProvider"; // sesuaikan path

export const UserCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm({});

  const onSubmit = async (values: any) => {
    const { email, password, name, role } = values;
  
    try {
      // Pastikan authProvider ada sebelum dipanggil
      if (authProvider?.register) {
        const { success, error } = await authProvider.register({ email, password, name, role });
  
        if (success) {
          alert("User created successfully!");
        } else {
          console.error("Registration failed:", error?.message);
          alert(error?.message || "Registration failed");
        }
      } else {
        console.error("authProvider.register is undefined");
      }
    } catch (error: any) {
      console.error("Error during registration:", error.message);
      alert("An unexpected error occurred.");
    }
  };
  

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          {...register("name", { required: "This field is required" })}
          error={!!errors?.name}
          helperText={typeof errors?.name?.message === "string" ? errors.name.message : ""}
          margin="normal"
          fullWidth
          label="Name"
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
          label="Email"
          type="email"
        />
        <TextField
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={!!errors?.password}
          helperText={typeof errors?.password?.message === "string" ? errors.password.message : ""}
          margin="normal"
          fullWidth
          label="Password"
          type="password"
        />
        <Controller
          name="role"
          control={control}
          defaultValue="user"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Select {...field} fullWidth margin="none">
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="mahasiswa">Mahasiswa</MenuItem>
              <MenuItem value="dosen">Dosen</MenuItem>
            </Select>
          )}
        />
      </Box>
    </Create>
  );
};
