import {
  Avatar, Box, Button, Grid, MenuItem, Select, TextField,
  Typography, InputLabel, Paper, IconButton, Autocomplete, Chip,
  FormControlLabel,
  Switch
} from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useFieldArray, Controller, useWatch, useFormContext } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { Button as MantineButton } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from '@mui/icons-material/Person';
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from '@mui/material/Stack';
import { Slider } from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import { supabaseClient } from "../../utility";
import { useGetIdentity, useNavigation, useOne } from "@refinedev/core";


export const ProfilCreate = () => {
  type IdentityUser = {
    email: string;
    role: string;
  };
  
  const { data: identity } = useGetIdentity<IdentityUser>();
  const { list, edit } = useNavigation();

  // Cek apakah user sudah punya profil
const { data: existingProfile, isLoading } = useOne({
  resource: "edit_profil",
  meta: {
    // Supabase mungkin perlu `filter` dalam bentuk query param
    filters: [{ field: "email", operator: "eq", value: identity?.email }],
  },
  queryOptions: {
    enabled: !!identity?.email,
  },
});

useEffect(() => {
  if (existingProfile?.data?.id) {
    edit("edit_profil", existingProfile.data.id);
  }
}, [existingProfile]);


  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({});

  const handleUploadAvatar = async () => {
    if (!selectedImage) return;
  
    const fileExt = selectedImage.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
  
    const { data, error } = await supabaseClient.storage
    .from("avatars")
    .upload(filePath, selectedImage, {
      upsert: true, // agar tidak gagal jika nama file sama
    });
  
    if (error) {
      console.error("Upload error:", error.message);
      return;
    }
  
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from("avatars")
      .getPublicUrl(filePath);
  
    // Set ke kolom "avatar"
    setValue("avatars", publicUrl);
  };
  
  //field array
  const {
    fields: fieldsMinatPenelitian,
    append: appendMinatPenelitian,
    remove: removeMinatPenelitian,
  } = useFieldArray({ control, name: "minat_penelitian" });

  const {
    fields: fieldsPenelitian,
    append: appendPenelitian,
    remove: removePenelitian,
  } = useFieldArray({ control, name: "publikasi_penelitian" });

  const {
    fields: fieldsInternal,
    append: appendInternal,
    remove: removeInternal,
  } = useFieldArray({ control, name: "publikasi_internal" });

  const {
    fields: fieldsProjek,
    append: appendProjek,
    remove: removeProjek ,
  } = useFieldArray({ control, name: "projek_berjalan" });

  const {
    fields: fieldsRiwayatPendidikan,
    append: appendRiwayatPendidikan,
    remove: removeRiwayatPendidikan,
  } = useFieldArray({ control, name: "riwayat_pendidikan" });

  const {
    fields: fieldsRiwayatPekerjaan,
    append: appendRiwayatPekerjaan,
    remove: removeRiwayatPekerjaan,
  } = useFieldArray({ control, name: "riwayat_pekerjaan" });

  const {
    fields: fieldsMatkul,
    append: appendMatkul,
    remove: removeMatkul,
  } = useFieldArray({ control, name: "matkul" });

  const {
    fields: fieldsSertifikat,
    append: appendSertifikat,
    remove: removeSertifikat,
  } = useFieldArray({ control, name: "sertifikat" });

  const {
    fields: fieldsOrganisasi,
    append: appendOrganisasi,
    remove: removeOrganisasi,
  } = useFieldArray({ control, name: "organisasi" });

  const {
    fields: fieldsPenghargaan,
    append: appendPenghargaan,
    remove: removePenghargaan,
  } = useFieldArray({ control, name: "penghargaan" });

  useEffect(() => {
    if (fieldsMinatPenelitian.length === 0) {
      appendMinatPenelitian({ value: "" });
    }
    if (fieldsPenelitian.length === 0) {
      appendPenelitian({ nama_jurnal1: "", url1: "", doi1: ""  });
    }
    if (fieldsInternal.length === 0) {
      appendInternal({ nama_jurnal: "", url: "", doi: "" });
    }
    if (fieldsProjek.length === 0) {
      appendProjek({ nama_projek: "", penyelesaian: ""});
    }
    if (fieldsRiwayatPendidikan.length === 0) {
      appendRiwayatPendidikan({ riwayat_pendidikan: "" });
    }
    if (fieldsRiwayatPekerjaan.length === 0) {
      appendRiwayatPekerjaan({ riwayat_pekerjaan: "" });
    }
    if (fieldsMatkul.length === 0) {
      appendMatkul({ matkul: "" });
    }
    if (fieldsSertifikat.length === 0) {
      appendSertifikat({ sertifikat: "" });
    }
    if (fieldsOrganisasi.length === 0) {
      appendOrganisasi({ organisasi: "" });
    }
    if (fieldsPenghargaan.length === 0) {
      appendPenghargaan({ penghargaan: "" });
    }


  }, [appendMinatPenelitian, appendPenelitian, appendInternal, appendProjek, appendRiwayatPendidikan, appendRiwayatPekerjaan, appendMatkul, appendSertifikat, appendOrganisasi, appendPenghargaan, fieldsMinatPenelitian.length, fieldsPenelitian.length, fieldsInternal.length,  fieldsProjek.length, fieldsRiwayatPendidikan.length, fieldsRiwayatPekerjaan, fieldsMatkul, fieldsSertifikat.length, fieldsOrganisasi.length, fieldsPenghargaan.length]);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPublikasiInternal, setShowPublikasiInternal] = useState(true);
  const handleSliderChange = (index: any, value: any) => {
    // Update the value of penyelesaian in the form state for the specific project
    setValue(`projek_berjalan.${index}.penyelesaian`, value);
  };
  
  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {/* Avatar Upload */}
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{
              border: '1px solid #ddd',
              borderRadius: 2,
              padding: 2,
              width: '100%',
              backgroundColor: '#0000',
            }}>
              <Avatar
                variant="square"
                src={selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : watch("avatars")} // dari DB jika belum pilih baru
                
                sx={{ width: 90, height: 120, mb: 2, borderRadius: 2 }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedImage(file);
                  }
                }}
              />
              <Box display="flex" width="100%" gap={1} mb={1}>
                <Box sx={{
                  flexGrow: 1, height: 40, border: '1px solid #ccc',
                  borderRadius: 1, display: 'flex', alignItems: 'center',
                  paddingLeft: 2, backgroundColor: '#fff', fontSize: '14px', color: '#888',
                }}>
                  {selectedImage?.name ?? 'Choose image'}
                </Box>
                <Button variant="outlined" onClick={() => fileInputRef.current?.click()}
                  sx={{ height: 40, minWidth: 90, textTransform: 'none', fontWeight: 500 }}>
                  Browse
                </Button>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleUploadAvatar}
                sx={{
                  height: 40,
                  textTransform: 'none',
                  fontWeight: 500,
                  backgroundColor: '#1976d2',
                  ':hover': { backgroundColor: '#1565c0' },
                }}
              >
                Upload
              </Button>
            </Box>
          </Grid>

          {/* Form Section */}
          <Grid item xs={12} md={8}>
            <Box component="form" autoComplete="off">
              {/* Identitas */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", borderBottom: "1px solid #ccc", mb: 3, pb: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Identitas</Typography>
                </Box>

                {/* Nama */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, height: 40 }}>
                  <Typography sx={{ width: "150px" }}>Nama</Typography>
                  <TextField
                    {...register("nama_dosen", { required: "This field is required" })}
                    error={!!errors?.nama_dosen}
                    helperText={(errors as any)?.nama_dosen?.message}
                    sx={{ border: '1px solid #ddd', borderRadius: 2, width: "600px" }}
                    InputProps={{ sx: { height: 40 } }}
                  />
                </Box>

                {/* Email */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, height: 40 }}>
                  <Typography sx={{ width: "150px" }}>Email</Typography>
                  <TextField
                    {...register("email")}
                    value={identity?.email || ""}
                    InputProps={{
                      sx: { height: 40 },
                      readOnly: true, // Bikin read-only
                    }}
                    sx={{ border: '1px solid #ddd', borderRadius: 2, width: "600px" }}
                  />
                </Box>

                {/* Username */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, height: 40 }}>
                  <Typography sx={{ width: "150px" }}>Username</Typography>
                  <TextField
                    {...register("username", { required: "This field is required" })}
                    error={!!errors?.username}
                    helperText={(errors as any)?.username?.message}
                    sx={{ border: '1px solid #ddd', borderRadius: 2, width: "600px" }}
                    InputProps={{ sx: { height: 40 } }}
                    placeholder="masukkan tanpa '@'"
                  />
                </Box>

                {/* Jabatan */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography sx={{ width: "150px", lineHeight: "40px" }}>Jabatan</Typography>
                  <Controller
                    name="jabatan"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        options={[
                          "Lektor", "Direktur Politeknik Statistika STIS", "Wakil Direktur I",
                          "Wakil Direktur II", "Wakil Direktur III", "Ketua Prodi DIV Komputasi Statistik",
                          "Sekretaris Prodi DIV Komputasi Statistik","Lektor Kepala"
                        ]}
                        onChange={(_, value) => field.onChange(value)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip variant="outlined" color="primary" label={option}
                              {...getTagProps({ index })} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            placeholder="Pilih jabatan"
                            multiline
                            minRows={1}
                            InputProps={{
                              ...params.InputProps,
                              sx: {
                                border: '1px solid #ddd',
                                borderRadius: 2,
                                px: 1,
                                alignItems: 'flex-start',
                              },
                            }}
                          />
                        )}
                        sx={{
                          width: 600,
                          '& .MuiInputBase-root': {
                            paddingTop: '4px',
                            paddingBottom: '4px',
                            minHeight: '40px',
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              </Paper>

              {/* === Minat Penelitian === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Minat Penelitian / Research Interest
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsMinatPenelitian.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{
                          width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          backgroundColor: "#0000", fontWeight: 500, mt: 1
                        }}>
                          {index + 1}
                        </Box>
                        <TextField
                          {...register(`minat_penelitian.${index}.minat_penelitian`, {
                            required: "This field is required"
                          })}
                          error={!!(errors as any)?.minat_penelitian?.[index]?.value}
                          helperText={(errors as any)?.minat_penelitian?.[index]?.value?.message}
                          placeholder={`Minat Penelitian ${index + 1}`}
                          fullWidth
                          multiline
                          maxRows={4}
                        />
                        {fieldsMinatPenelitian.length > 1 && (
                          <IconButton onClick={() => removeMinatPenelitian(index)} color="error" sx={{
                            width: 40, height: 40, mt: 1, border: "1px solid #f44336", borderRadius: 1
                          }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendMinatPenelitian({ value: "" })}
                    sx={{ textTransform: "none", fontWeight: 500 }}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* === Publikasi Ilmiah === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Publikasi Ilmiah
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsPenelitian.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{
                          width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          backgroundColor: "#0000", fontWeight: 500, mt: 1
                        }}>
                          {index + 1}
                        </Box>

                        {/* Input berjajar ke bawah */}
                        <Stack spacing={2} sx={{ flexGrow: 1 }}>
                          <TextField
                            {...register(`publikasi_penelitian.${index}.nama_jurnal1`, {
                              required: "Nama jurnal diperlukan"
                            })}
                            placeholder="Nama Jurnal"
                            fullWidth
                            multiline
                            maxRows={4}
                            variant="outlined"
                          />
                          <TextField
                            {...register(`publikasi_penelitian.${index}.url1`, {
                              required: "URL diperlukan",
                              pattern: {
                                value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/,
                                message: "Format URL tidak valid"
                              }
                            })}
                            placeholder="URL"
                            fullWidth
                            multiline
                            maxRows={4}
                            variant="outlined"
                          />
                          <TextField
                            {...register(`publikasi_penelitian.${index}.doi1`, {
                              required: "DOI diperlukan"
                            })}
                            placeholder="DOI"
                            fullWidth
                            multiline
                            maxRows={4}
                            variant="outlined"
                          />
                        </Stack>

                        {/* Tombol hapus */}
                        {fieldsPenelitian.length > 1 && (
                          <IconButton onClick={() => removePenelitian(index)} color="error" sx={{
                            width: 40, height: 40, mt: 1, border: "1px solid #f44336", borderRadius: 1
                          }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendPenelitian({ value: "" })}
                    sx={{ textTransform: "none", fontWeight: 500 }}>
                    Tambah Publikasi
                  </Button>
                </Box>
              </Paper>

              {/* === Publikasi Internal === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center">
                    <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Publikasi atau Hasil Pekerjaan Internal
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showPublikasiInternal}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowPublikasiInternal(e.target.checked)}
                        color="primary"
                      />
                    }
                    label=""
                  />
                </Box>

                {showPublikasiInternal && (
                  <>
                    <Grid container spacing={2}>
                      {fieldsInternal.map((field, index) => (
                        <Grid item xs={12} key={field.id}>
                          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                            <Box sx={{
                              width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              backgroundColor: "#0000", fontWeight: 500, mt: 1
                            }}>
                              {index + 1}
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 1 }}>
                              <TextField
                                {...register(`publikasi_internal.${index}.nama_jurnal`, {
                                  required: "Nama jurnal diperlukan"
                                })}
                                placeholder="Nama Jurnal"
                                fullWidth
                              />
                              <TextField
                                {...register(`publikasi_internal.${index}.url`, {
                                  required: "URL diperlukan",
                                  pattern: {
                                    value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/,
                                    message: "Format URL tidak valid"
                                  }
                                })}
                                placeholder="URL"
                                fullWidth
                              />
                              <TextField
                                {...register(`publikasi_internal.${index}.doi`, {
                                  required: "DOI diperlukan"
                                })}
                                placeholder="DOI"
                                fullWidth
                              />
                            </Box>
                            {fieldsInternal.length > 1 && (
                              <IconButton onClick={() => removeInternal(index)} color="error" sx={{
                                width: 40, height: 40, mt: 1, border: "1px solid #f44336", borderRadius: 1
                              }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                      <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendInternal({
                        nama_jurnal: "", url: "", doi: ""
                      })} sx={{ textTransform: "none", fontWeight: 500 }}>
                        Tambah Publikasi
                      </Button>
                    </Box>
                  </>
                )}
              </Paper>

               {/* === Projek Penelitian Berjalan === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Projek Penelitian Berjalan / Ongoing Research Project
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsProjek.map((field, index) => {
                    // Menggunakan watch untuk mengambil nilai penyelesaian saat ini
                    const penyelesaian = watch(`projek_berjalan.${index}.penyelesaian`, 0);

                    return (
                      <Grid item xs={12} key={field.id}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              border: "1px solid #ccc",
                              borderRadius: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#0000",
                              fontWeight: 500,
                              mt: 1,
                            }}
                          >
                            {index + 1}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              {...register(`projek_berjalan.${index}.nama_projek`, {
                                required: "Nama projek diperlukan",
                              })}
                              placeholder={`Nama Penelitian ${index + 1}`}
                              fullWidth
                              sx={{ mb: 2 }}
                            />
                            <Box display="flex" alignItems="center" gap={2}>
                              <Typography sx={{ minWidth: 110 }}>Penyelesaian :</Typography>
                              <Controller
                                name={`projek_berjalan.${index}.penyelesaian`}
                                control={control}
                                defaultValue={0}
                                render={({ field }) => (
                                  <Slider
                                    {...field}
                                    value={field.value}
                                    onChange={(_, value) => field.onChange(value)}
                                    step={1}
                                    min={0}
                                    max={100}
                                    valueLabelDisplay="auto"
                                    sx={{ flex: 1 }}
                                  />
                                )}
                              />
                              <Typography sx={{ minWidth: 40 }}>
                                {penyelesaian}% {/* Menampilkan nilai penyelesaian yang diambil langsung dari watch */}
                              </Typography>
                            </Box>
                          </Box>
                          {fieldsProjek.length > 1 && (
                            <IconButton
                              onClick={() => removeProjek(index)}
                              color="error"
                              sx={{
                                width: 40,
                                height: 40,
                                mt: 1,
                                border: "1px solid #f44336",
                                borderRadius: 1,
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      appendProjek({ nama_projek: "", penyelesaian: 0 })
                    }
                    sx={{ textTransform: "none", fontWeight: 500 }}
                  >
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* === Riwayat Pendidikan / Educational History === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                   Riwayat Pendidikan / Educational History
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsRiwayatPendidikan.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{
                          width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          backgroundColor: "#0000", fontWeight: 500, mt: 1
                        }}>
                          {index + 1}
                        </Box>
                        <TextField
                          {...register(`riwayat_pendidikan.${index}.riwayat_pendidikan`, {
                            required: "This field is required"
                          })}
                          error={!!(errors as any)?.riwayat_pendidikan?.[index]?.value}
                          helperText={(errors as any)?.riwayat_pendidikan?.[index]?.value?.message}
                          placeholder="Contoh : 2002-2006 DIV Statistika, Sekolah Tinggi Ilmu Statistik"
                          fullWidth
                          multiline
                          maxRows={4}
                        />
                        {fieldsRiwayatPendidikan.length > 1 && (
                          <IconButton onClick={() => removeRiwayatPendidikan(index)} color="error" sx={{
                            width: 40, height: 40, mt: 1, border: "1px solid #f44336", borderRadius: 1
                          }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendRiwayatPendidikan({ value: "" })}
                    sx={{ textTransform: "none", fontWeight: 500 }}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>           

              {/* === Mata Kuliah yang Diampu atau Pernah Diampu === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                   Mata Kuliah yang Diampu atau Pernah Diampu
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsMatkul.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{
                          width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          backgroundColor: "#0000", fontWeight: 500, mt: 1
                        }}>
                          {index + 1}
                        </Box>
                        <TextField
                          {...register(`matkul.${index}.matkul`, {
                            required: "This field is required"
                          })}
                          error={!!(errors as any)?.matkul?.[index]?.value}
                          helperText={(errors as any)?.matkul?.[index]?.value?.message}
                          placeholder="Contoh : Official Statistic"
                          fullWidth
                          multiline
                          maxRows={4}
                        />
                        {fieldsMatkul.length > 1 && (
                          <IconButton onClick={() => removeMatkul(index)} color="error" sx={{
                            width: 40, height: 40, mt: 1, border: "1px solid #f44336", borderRadius: 1
                          }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendMatkul({ value: "" })}
                    sx={{ textTransform: "none", fontWeight: 500 }}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* === Riwayat Pekerjaan / Employment History === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                   Riwayat Pekerjaan / Employment History
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsRiwayatPekerjaan.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{
                          width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          backgroundColor: "#0000", fontWeight: 500, mt: 1
                        }}>
                          {index + 1}
                        </Box>
                        <TextField
                          {...register(`riwayat_pekerjaan.${index}.riwayat_pekerjaan`, {
                            required: "This field is required"
                          })}
                          error={!!(errors as any)?.riwayat_pekerjaan?.[index]?.value}
                          helperText={(errors as any)?.riwayat_pekerjaan?.[index]?.value?.message}
                          placeholder="Contoh : 2010-2012 Kepala Seksi Neraca wilayah dan Analisis BPS"
                          fullWidth
                          multiline
                          maxRows={4}
                        />
                        {fieldsRiwayatPekerjaan.length > 1 && (
                          <IconButton onClick={() => removeRiwayatPekerjaan(index)} color="error" sx={{
                            width: 40, height: 40, mt: 1, border: "1px solid #f44336", borderRadius: 1
                          }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendRiwayatPekerjaan({ value: "" })}
                    sx={{ textTransform: "none", fontWeight: 500 }}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* === Sertifikat Profesi / Kompetensi === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                   Sertifikat Profesi / Kompetensi
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsSertifikat.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{
                          width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          backgroundColor: "#0000", fontWeight: 500, mt: 1
                        }}>
                          {index + 1}
                        </Box>
                        <TextField
                          {...register(`sertifikat.${index}.sertifikat`, {
                            required: "This field is required"
                          })}
                          error={!!(errors as any)?.sertifikat?.[index]?.value}
                          helperText={(errors as any)?.sertifikat?.[index]?.value?.message}
                          placeholder="Contoh : Big Data Analytics"
                          fullWidth
                          multiline
                          maxRows={4}
                        />
                        {fieldsSertifikat.length > 1 && (
                          <IconButton onClick={() => removeSertifikat(index)} color="error" sx={{
                            width: 40, height: 40, mt: 1, border: "1px solid #f44336", borderRadius: 1
                          }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendSertifikat({ value: "" })}
                    sx={{ textTransform: "none", fontWeight: 500 }}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* === Keanggotaan Organisasi Profesi === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                   Keanggotaan Organisasi Profesi
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsOrganisasi.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{
                          width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          backgroundColor: "#0000", fontWeight: 500, mt: 1
                        }}>
                          {index + 1}
                        </Box>
                        <TextField
                          {...register(`organisasi.${index}.organisasi`, {
                            required: "This field is required"
                          })}
                          error={!!(errors as any)?.organisasi?.[index]?.value}
                          helperText={(errors as any)?.organisasi?.[index]?.value?.message}
                          placeholder="Contoh : Ikatan Statistisi Indonesia (ISI)"
                          fullWidth
                          multiline
                          maxRows={4}
                        />
                        {fieldsOrganisasi.length > 1 && (
                          <IconButton onClick={() => removeOrganisasi(index)} color="error" sx={{
                            width: 40, height: 40, mt: 1, border: "1px solid #f44336", borderRadius: 1
                          }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendOrganisasi({ value: "" })}
                    sx={{ textTransform: "none", fontWeight: 500 }}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* === Penghargaan, Beasiswa, Hibah Pribadi === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                   Penghargaan, Beasiswa, Hibah Pribadi
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsPenghargaan.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{
                          width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          backgroundColor: "#0000", fontWeight: 500, mt: 1
                        }}>
                          {index + 1}
                        </Box>
                        <TextField
                          {...register(`penghargaan.${index}.penghargaan`, {
                            required: "This field is required"
                          })}
                          error={!!(errors as any)?.penghargaan?.[index]?.value}
                          helperText={(errors as any)?.penghargaan?.[index]?.value?.message}
                          placeholder="Contoh : Ikatan Statistisi Indonesia (ISI)"
                          fullWidth
                          multiline
                          maxRows={4}
                        />
                        {fieldsPenghargaan.length > 1 && (
                          <IconButton onClick={() => removePenghargaan(index)} color="error" sx={{
                            width: 40, height: 40, mt: 1, border: "1px solid #f44336", borderRadius: 1
                          }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendPenghargaan({ value: "" })}
                    sx={{ textTransform: "none", fontWeight: 500 }}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

            </Box>
          </Grid>
        </Grid>
      </Box>
    </Create>
  );
};


