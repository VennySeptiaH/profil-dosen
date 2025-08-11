
import {
  Avatar, Box, Button, Grid, MenuItem, Select, TextField,
  Typography, InputLabel, Paper, IconButton, Autocomplete, Chip,
  FormControlLabel, Switch
} from "@mui/material";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useFieldArray, Controller } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from '@mui/icons-material/Person';
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import Stack from '@mui/material/Stack';
import { Slider } from "@mui/material";
import { supabaseClient } from "../../utility";
import { Navigate } from "react-router-dom";
export const ProfilEdit = () => {
  const {
    refineCore: { formLoading, queryResult },
    saveButtonProps,
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({});

  const record = queryResult?.data?.data;

  const { fields: fieldsMinatPenelitian, append: appendMinatPenelitian, remove: removeMinatPenelitian } = useFieldArray({ control, name: "minat_penelitian" });
  const { fields: fieldsPenelitian, append: appendPenelitian, remove: removePenelitian } = useFieldArray({ control, name: "publikasi_penelitian" });
  const { fields: fieldsInternal, append: appendInternal, remove: removeInternal } = useFieldArray({ control, name: "publikasi_internal" });
  const { fields: fieldsProjek, append: appendProjek, remove: removeProjek } = useFieldArray({ control, name: "projek_berjalan" });
  const { fields: fieldsRiwayatPendidikan, append: appendRiwayatPendidikan, remove: removeRiwayatPendidikan } = useFieldArray({ control, name: "riwayat_pendidikan" });
  const { fields: fieldsRiwayatPekerjaan, append: appendRiwayatPekerjaan, remove: removeRiwayatPekerjaan } = useFieldArray({ control, name: "riwayat_pekerjaan" });
  const { fields: fieldsMatkul, append: appendMatkul, remove: removeMatkul } = useFieldArray({ control, name: "matkul" });
  const { fields: fieldsSertifikat, append: appendSertifikat, remove: removeSertifikat } = useFieldArray({ control, name: "sertifikat" });
  const { fields: fieldsOrganisasi, append: appendOrganisasi, remove: removeOrganisasi } = useFieldArray({ control, name: "organisasi" });
  const { fields: fieldsPenghargaan, append: appendPenghargaan, remove: removePenghargaan } = useFieldArray({ control, name: "penghargaan" });

  const watchedAvatar = watch("avatars");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (watchedAvatar && typeof watchedAvatar === "string") {
      setAvatarUrl(watchedAvatar);
    }
  }, [watchedAvatar]);
  
  
  useEffect(() => {
    if (record) {

      // Parsing jabatan (khusus karena bisa string/array)
      if (record.jabatan) {
        let parsedJabatan = [];
        try {
          parsedJabatan = JSON.parse(record.jabatan);
          if (!Array.isArray(parsedJabatan)) {
            parsedJabatan = record.jabatan.split(",").map((j: string) => j.trim());
          }
        } catch (e) {
          parsedJabatan = record.jabatan.split(",").map((j: string) => j.trim());
        }
        setValue("jabatan", parsedJabatan);
      }
  
      // Helper untuk JSON parsing berlapis
      const parseArrayField = (raw: any, label: string) => {
        try {
          let temp = raw;
          while (typeof temp === "string") {
            temp = JSON.parse(temp);
          }
          if (Array.isArray(temp)) return temp;
        } catch (e) {
          console.error(`Gagal parse ${label}:`, e);
        }
        return [];
      };
  
      // Daftar field yang butuh parsing JSON array
      const jsonArrayFields = [
        "minat_penelitian",
        "publikasi_penelitian",
        "publikasi_internal",
        "projek_berjalan",
        "riwayat_pendidikan",
        "riwayat_pekerjaan",
        "matkul",
        "sertifikat",
        "organisasi",
        "penghargaan",
      ];
  
      jsonArrayFields.forEach((field) => {
        if (record[field]) {
          const parsed = parseArrayField(record[field], field);
          setValue(field, parsed);
        }
      });
    }
  }, [record, setValue]);
  
  

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPublikasiInternal, setShowPublikasiInternal] = useState(true);
  const handleUploadAvatar = async () => {
    if (!selectedImage) return;
    const fileExt = selectedImage.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
  
    const { data, error } = await supabaseClient.storage
      .from("avatars")
      .upload(filePath, selectedImage, { upsert: true });
  
    if (error) {
      console.error("Upload error:", error.message);
      return;
    }
  
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from("avatars")
      .getPublicUrl(filePath);
  
    setValue("avatars", publicUrl);
  };
  
  const handleSliderChange = (index: number, value: number) => {
    setValue(`projek_berjalan.${index}.penyelesaian`, value);
  };

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ border: '1px solid #ddd', borderRadius: 2, padding: 2 }}>
              <Avatar
                  variant="square"
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : watch("avatars") || record?.avatars || ""
                  }
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
                <Box sx={{ flexGrow: 1, height: 40, border: '1px solid #ccc', borderRadius: 1, display: 'flex', alignItems: 'center', paddingLeft: 2, backgroundColor: '#fff', fontSize: '14px', color: '#888' }}>
                  {selectedImage?.name ?? 'Choose image'}
                </Box>
                <Button variant="outlined" onClick={() => fileInputRef.current?.click()} sx={{ height: 40, minWidth: 90 }}>Browse</Button>
              </Box>
                <Button variant="contained" fullWidth onClick={handleUploadAvatar} 
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
          <Grid item xs={12} md={8}>
            <Box component="form" autoComplete="off">
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", borderBottom: "1px solid #ccc", mb: 3, pb: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Identitas</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, height: 40 }}>
                  <Typography sx={{ width: "150px" }}>Nama</Typography>
                  <TextField {...register("nama_dosen", { required: true })} sx={{ width: "600px" }} InputProps={{ sx: { height: 40 } }} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, height: 40 }}>
                  <Typography sx={{ width: "150px" }}>Email</Typography>
                  <TextField {...register("email", { required: true })} sx={{ width: "600px" }} InputProps={{ sx: { height: 40 } }} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, height: 40 }}>
                  <Typography sx={{ width: "150px" }}>Username</Typography>
                  <TextField {...register("username", { required: true })} sx={{ width: "600px" }} InputProps={{ sx: { height: 40 } }} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography sx={{ width: "150px" }}>Jabatan</Typography>
                  <Controller
                    name="jabatan"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        options={["Guru Besar", "Direktur", "Wakil Direktur", "Ketua Prodi"]}
                        onChange={(_, value) => field.onChange(value)}
                        renderInput={(params) => <TextField {...params} variant="standard" placeholder="Pilih jabatan" />}
                        sx={{ width: 600 }}
                      />
                    )}
                  />
                </Box>
              </Paper>

              {/* === Minat Penelitian === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Minat Penelitian</Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsMinatPenelitian.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, mt: 1 }}>{index + 1}</Box>
                        <TextField {...register(`minat_penelitian.${index}.minat_penelitian`, { required: true })} fullWidth multiline maxRows={4} />
                        {fieldsMinatPenelitian.length > 1 && (
                          <IconButton onClick={() => removeMinatPenelitian(index)} color="error" sx={{ mt: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendMinatPenelitian({ minat_penelitian: "" })}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* === Publikasi Ilmiah === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Publikasi Ilmiah</Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsPenelitian.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}>{index + 1}</Box>
                        <Box sx={{ flex: 1 }}>
                          <Stack spacing={2}>
                            <TextField
                              {...register(`publikasi_penelitian.${index}.nama_jurnal1`, { required: true })}
                              placeholder="Nama Jurnal"
                              fullWidth
                            />
                            <TextField
                              {...register(`publikasi_penelitian.${index}.url1`, { required: true })}
                              placeholder="URL"
                              fullWidth
                            />
                            <TextField
                              {...register(`publikasi_penelitian.${index}.doi1`, { required: true })}
                              placeholder="DOI"
                              fullWidth
                            />
                          </Stack>
                        </Box>
                        {fieldsPenelitian.length > 1 && (
                          <IconButton onClick={() => removePenelitian(index)} color="error" sx={{ mt: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendPenelitian({ nama_jurnal1: "", url1: "", doi1: "" })}>
                    Tambah Publikasi
                  </Button>
                </Box>
              </Paper>

              {/* === Publikasi Internal === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Publikasi Internal</Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsInternal.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}>{index + 1}</Box>
                        <Box sx={{ flex: 1 }}>
                          <Stack spacing={2}>
                            <TextField
                              {...register(`publikasi_internal.${index}.nama_jurnal`, { required: true })}
                              placeholder="Nama Jurnal"
                              fullWidth
                            />
                            <TextField
                              {...register(`publikasi_internal.${index}.url`, { required: true })}
                              placeholder="URL"
                              fullWidth
                            />
                            <TextField
                              {...register(`publikasi_internal.${index}.doi`, { required: true })}
                              placeholder="DOI"
                              fullWidth
                            />
                          </Stack>
                        </Box>
                        {fieldsInternal.length > 1 && (
                          <IconButton onClick={() => removeInternal(index)} color="error" sx={{ mt: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendInternal({ nama_jurnal: "", url: "", doi: "" })}>
                    Tambah Publikasi
                  </Button>
                </Box>
              </Paper>


              {/* === Projek Penelitian Berjalan === */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Projek Penelitian Berjalan</Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsProjek.map((field, index) => {
                    const penyelesaian = watch(`projek_berjalan.${index}.penyelesaian`, 0);
                    return (
                      <Grid item xs={12} key={field.id}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                          <Box sx={{ width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, mt: 1 }}>{index + 1}</Box>
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              {...register(`projek_berjalan.${index}.nama_projek`, { required: true })}
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
                                    value={field.value || 0}
                                    onChange={(_, value) => field.onChange(value)}
                                    step={1}
                                    min={0}
                                    max={100}
                                    valueLabelDisplay="auto"
                                    sx={{ flex: 1 }}
                                  />
                                )}
                              />
                              <Typography sx={{ minWidth: 40 }}>{penyelesaian}%</Typography>
                            </Box>
                          </Box>
                          {fieldsProjek.length > 1 && (
                            <IconButton onClick={() => removeProjek(index)} color="error" sx={{ mt: 1 }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendProjek({ nama_projek: "", penyelesaian: 0 })}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* Riwayat Pendidikan */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Riwayat Pendidikan</Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsRiwayatPendidikan.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, mt: 1 }}>{index + 1}</Box>
                        <TextField
                          {...register(`riwayat_pendidikan.${index}.riwayat_pendidikan`, { required: true })}
                          fullWidth
                          multiline
                          maxRows={4}
                          placeholder="Contoh: 2006-2010 S1 Statistika"
                        />
                        {fieldsRiwayatPendidikan.length > 1 && (
                          <IconButton onClick={() => removeRiwayatPendidikan(index)} color="error" sx={{ mt: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendRiwayatPendidikan({ riwayat_pendidikan: "" })}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* Mata Kuliah yang Diampu */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Mata Kuliah yang Diampu</Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsMatkul.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, mt: 1 }}>{index + 1}</Box>
                        <TextField
                          {...register(`matkul.${index}.matkul`, { required: true })}
                          fullWidth
                          multiline
                          maxRows={4}
                          placeholder="Contoh: Statistika Dasar"
                        />
                        {fieldsMatkul.length > 1 && (
                          <IconButton onClick={() => removeMatkul(index)} color="error" sx={{ mt: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendMatkul({ matkul: "" })}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* Riwayat Pekerjaan */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Riwayat Pekerjaan</Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsRiwayatPekerjaan.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, mt: 1 }}>{index + 1}</Box>
                        <TextField
                          {...register(`riwayat_pekerjaan.${index}.riwayat_pekerjaan`, { required: true })}
                          fullWidth
                          multiline
                          maxRows={4}
                          placeholder="Contoh: 2010-2015 BPS Pusat"
                        />
                        {fieldsRiwayatPekerjaan.length > 1 && (
                          <IconButton onClick={() => removeRiwayatPekerjaan(index)} color="error" sx={{ mt: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendRiwayatPekerjaan({ riwayat_pekerjaan: "" })}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* Sertifikasi Profesi */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Sertifikasi Profesi</Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsSertifikat.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, mt: 1 }}>{index + 1}</Box>
                        <TextField
                          {...register(`sertifikat.${index}.sertifikat`, { required: true })}
                          fullWidth
                          multiline
                          maxRows={4}
                          placeholder="Contoh: Big Data Analytics"
                        />
                        {fieldsSertifikat.length > 1 && (
                          <IconButton onClick={() => removeSertifikat(index)} color="error" sx={{ mt: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendSertifikat({ sertifikat: "" })}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* Keanggotaan Organisasi */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Keanggotaan Organisasi</Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsOrganisasi.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, mt: 1 }}>{index + 1}</Box>
                        <TextField
                          {...register(`organisasi.${index}.organisasi`, { required: true })}
                          fullWidth
                          multiline
                          maxRows={4}
                          placeholder="Contoh: ISI"
                        />
                        {fieldsOrganisasi.length > 1 && (
                          <IconButton onClick={() => removeOrganisasi(index)} color="error" sx={{ mt: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendOrganisasi({ organisasi: "" })}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>

              {/* Penghargaan */}
              <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LibraryBooksIcon sx={{ mr: 1, color: "#555" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Penghargaan</Typography>
                </Box>
                <Grid container spacing={2}>
                  {fieldsPenghargaan.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, border: "1px solid #ccc", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, mt: 1 }}>{index + 1}</Box>
                        <TextField
                          {...register(`penghargaan.${index}.penghargaan`, { required: true })}
                          fullWidth
                          multiline
                          maxRows={4}
                          placeholder="Contoh: Satyalancana Karya Satya"
                        />
                        {fieldsPenghargaan.length > 1 && (
                          <IconButton onClick={() => removePenghargaan(index)} color="error" sx={{ mt: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={() => appendPenghargaan({ penghargaan: "" })}>
                    Tambah Data
                  </Button>
                </Box>
              </Paper>
            
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Edit>
  );
};
