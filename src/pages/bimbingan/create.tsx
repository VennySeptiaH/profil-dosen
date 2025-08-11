import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Chip, Autocomplete,
} from '@mui/material';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { Create } from '@refinedev/mui';
import { useGetIdentity } from '@refinedev/core';
import { supabaseClient } from '../../utility';


interface IUserIdentity {
  email: string;
  name?: string;
}

interface Dosen {
  nama: string;
  minat_penelitian: string[];
  matkul: string[];
  publikasi_penelitian?: any[];
  publikasi_internal?: any[];
  avatar?: string;
}
interface MahasiswaProfil {
  minatPenelitian: string[];
  mataKuliah: string[];
}

interface RankedDosen {
  nama: string;
  nilaiNCF: number;
  nilaiNSF: number;
  total: number;
  avatar?: string;
  detail: {
    gapMinat: number;
    gapMatkul: number;
    bobotMinat: number;
    bobotMatkul: number;
    totalPublikasi: number;
    rumus: string;
  };
}
function calculateRanking(mahasiswa: MahasiswaProfil, dosenList: Dosen[]): RankedDosen[] {
  return dosenList.map((dosen) => {
    const matchMinat = (mahasiswa.minatPenelitian || []).filter((m) =>
      (dosen.minat_penelitian || []).includes(m)
    ).length;

    const matchMatkul = (mahasiswa.mataKuliah || []).filter((m) =>
      (dosen.matkul || []).includes(m)
    ).length;

    const totalMinat = mahasiswa.minatPenelitian?.length || 0;
    const totalMatkul = mahasiswa.mataKuliah?.length || 0;

    const gapMinat = Number(matchMinat - totalMinat);
    const gapMatkul = Number(matchMatkul - totalMatkul);

    const bobotGap: Record<string, number> = {
      "0": 5, "1": 4.5, "-1": 4,
      "2": 3.5, "-2": 3,
      "3": 2.5, "-3": 2,
      "4": 1.5, "-4": 1,
    };

    const bobotMinat = Number(bobotGap[gapMinat.toString()] ?? 1);
    const bobotMatkul = Number(bobotGap[gapMatkul.toString()] ?? 1);

    const nilaiNCF = Number(((bobotMinat + bobotMatkul) / 2).toFixed(2));

    const totalPublikasi =
      ((Array.isArray(dosen.publikasi_penelitian) ? dosen.publikasi_penelitian.length : 0) +
      (Array.isArray(dosen.publikasi_internal) ? dosen.publikasi_internal.length : 0));

    const nilaiNSF = Number(
      totalPublikasi >= 10 ? 5 :
      totalPublikasi >= 6 ? 4 :
      totalPublikasi >= 3 ? 3 :
      totalPublikasi >= 1 ? 2 : 1
    );

    const total = Number(((nilaiNCF * 0.7) + (nilaiNSF * 0.3)).toFixed(4));
    const rumus = `(${nilaiNCF} * 0.7) + (${nilaiNSF} * 0.3) = ${total}`;

    return {
      nama: dosen.nama || '',
      avatar: dosen.avatar || '',
      nilaiNCF,
      nilaiNSF,
      total,
      detail: {
        gapMinat,
        gapMatkul,
        bobotMinat,
        bobotMatkul,
        totalPublikasi: Number(totalPublikasi),
        rumus,
      },
    };
  }).sort((a, b) => b.total - a.total);
}




export const BimbinganCreate: React.FC = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const { data: identity } = useGetIdentity<IUserIdentity>();

  const [formData, setFormData] = useState({
    email: '',
    nama_mahasiswa: '',
    judul: '',
    minatPenelitian: [] as string[],
    mataKuliah: [] as string[],
    dosen_pembimbing1: '',
    dosen_pembimbing2: '',
    persenDosen1: 0,
    persenDosen2: 0,
    
  // tambahan untuk simpan di state
  rankingresult: [] as RankedDosen[],
  
  gap_minat_dosen1: 0,
  bobot_minat_dosen1: 0,
  gap_matkul_dosen1: 0,
  bobot_matkul_dosen1: 0,
  total_publikasi_dosen1: 0,
  rumus_dosen1: '',
  nilai_rumus_dosen1: 0,

  gap_minat_dosen2: 0,
  bobot_minat_dosen2: 0,
  gap_matkul_dosen2: 0,
  bobot_matkul_dosen2: 0,
  total_publikasi_dosen2: 0,
  rumus_dosen2: '',
  nilai_rumus_dosen2: 0,
  });

  const [allMinat, setAllMinat] = useState<string[]>([]);
  const [allMatkul, setAllMatkul] = useState<string[]>([]);
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [rankingResult, setRankingResult] = useState<RankedDosen[]>([]);

  useEffect(() => {
    if (identity?.email) {
      setFormData((prev) => ({ ...prev, email: identity.email }));
      setValue('email', identity.email);
    }
  }, [identity]);

  const parseJSONField = (field: any): any[] => {
    try {
      const parsed = typeof field === "string" ? JSON.parse(field) : field;
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (typeof parsed === "object" && parsed !== null) {
        return [parsed]; // bungkus objek tunggal ke dalam array
      }
      return [];
    } catch {
      return [];
    }
  };
  

  useEffect(() => {
    const fetchOptions = async () => {
      const { data, error } = await supabaseClient
        .from("edit_profil")
        .select("nama_dosen, minat_penelitian, matkul, publikasi_penelitian, publikasi_internal, avatars");

      if (error) {
        console.error("Gagal mengambil data:", error.message);
        return;
      }

      const minatSet = new Set<string>();
      const matkulSet = new Set<string>();
      const dosenArray: Dosen[] = [];

      
      data?.forEach((d) => {
        let minat: string[] = [];
        let matkul: string[] = [];
      
        try {
          const parsedMinat = JSON.parse(d.minat_penelitian);
          minat = Array.isArray(parsedMinat)
            ? parsedMinat.map((m) => typeof m === 'string' ? m : m?.minat_penelitian || '')
            : [];
        } catch {
          minat = d.minat_penelitian?.split(',').map((s: string) => s.trim()) || [];
        }
      
        try {
          const parsedMatkul = JSON.parse(d.matkul);
          matkul = Array.isArray(parsedMatkul)
            ? parsedMatkul.map((m) => typeof m === 'string' ? m : m?.matkul || '')
            : [];
        } catch {
          matkul = d.matkul?.split(',').map((s: string) => s.trim()) || [];
        }
      
        minat.forEach((m) => minatSet.add(m));
        matkul.forEach((m) => matkulSet.add(m));
      
        if (d.nama_dosen) {

          dosenArray.push({
            nama: d.nama_dosen,
            minat_penelitian: minat,
            matkul: matkul,
            publikasi_penelitian: parseJSONField(d.publikasi_penelitian),
            publikasi_internal: parseJSONField(d.publikasi_internal),
            avatar: d.avatars || '', 
          });
        }
      });
      

      setAllMinat(Array.from(minatSet));
      setAllMatkul(Array.from(matkulSet));
      setDosenList(dosenArray);
    };

    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValue(name, value);
  };

  const handleAutocompleteChange = (name: string, value: (string | null)[]) => {
    const cleanedValues = value.filter((v): v is string => typeof v === 'string');
    if (name === 'minatPenelitian') {
      setFormData((prev) => ({ ...prev, minatPenelitian: cleanedValues }));
      setValue('minat_penelitian', cleanedValues);
    } else if (name === 'mataKuliah') {
      setFormData((prev) => ({ ...prev, mataKuliah: cleanedValues }));
      setValue('matkul_terkait', cleanedValues);
    }
  };

  const generateDosenPembimbing = () => {
    const mahasiswa = {
      minatPenelitian: formData.minatPenelitian,
      mataKuliah: formData.mataKuliah,
    };
  
    const hasilRanking = calculateRanking(mahasiswa, dosenList);
  
    const pembimbing1 = hasilRanking[0];
    const pembimbing2 = hasilRanking[1];
  
    setRankingResult(hasilRanking); 

    setFormData((prev) => ({
      ...prev,
      dosen_pembimbing1: pembimbing1?.nama || '',
      dosen_pembimbing2: pembimbing2?.nama || '',
      persenDosen1: pembimbing1?.total || 0,
      persenDosen2: pembimbing2?.total || 0,
    }));
  
    setValue('dosen_pembimbing1', pembimbing1?.nama || '');
    setValue('dosen_pembimbing2', pembimbing2?.nama || '');
    setValue('persenDosen1', pembimbing1?.total || 0);
    setValue('persenDosen2', pembimbing2?.total || 0);
    setValue('status_bimbingan', 'sedang diajukan');
  };

  const generateRankingNow = () => {
    const mahasiswa = {
      minatPenelitian: formData.minatPenelitian,
      mataKuliah: formData.mataKuliah,
    };
    return calculateRanking(mahasiswa, dosenList);
  };
  
  const onSubmit = async () => {
    const pembimbing1 = rankingResult[0];
    const pembimbing2 = rankingResult[1];
  
    const cleanedData = {
      ...formData,
      minat_penelitian: JSON.stringify(formData.minatPenelitian),
      matkul_terkait: JSON.stringify(formData.mataKuliah),
  
      dosen_pembimbing1: pembimbing1?.nama || "",
      dosen_pembimbing2: pembimbing2?.nama || "",
      persenDosen1: pembimbing1?.total || 0, // ganti dari persentase → total
      persenDosen2: pembimbing2?.total || 0, // ganti dari persentase → total
  
      gap_minat_dosen1: pembimbing1?.detail?.gapMinat || 0,
      bobot_minat_dosen1: pembimbing1?.detail?.bobotMinat || 0,
      gap_matkul_dosen1: pembimbing1?.detail?.gapMatkul || 0,
      bobot_matkul_dosen1: pembimbing1?.detail?.bobotMatkul || 0,
      total_publikasi_dosen1: pembimbing1?.detail?.totalPublikasi || 0,
      rumus_dosen1: pembimbing1?.detail?.rumus || "",
      nilai_rumus_dosen1: pembimbing1?.total || 0, // ganti dari nilaiRumus → total
  
      gap_minat_dosen2: pembimbing2?.detail?.gapMinat || 0,
      bobot_minat_dosen2: pembimbing2?.detail?.bobotMinat || 0,
      gap_matkul_dosen2: pembimbing2?.detail?.gapMatkul || 0,
      bobot_matkul_dosen2: pembimbing2?.detail?.bobotMatkul || 0,
      total_publikasi_dosen2: pembimbing2?.detail?.totalPublikasi || 0,
      rumus_dosen2: pembimbing2?.detail?.rumus || "",
      nilai_rumus_dosen2: pembimbing2?.total || 0, // ganti dari nilaiRumus → total
  
      rankingresult: rankingResult, // simpan semua hasil ranking dalam JSON
      status_bimbingan: "sedang diajukan",
    };
  
    const { error } = await supabaseClient
      .from("bimbingan")
      .insert([cleanedData]);
  
    if (error) {
      console.error(error);
      alert("Gagal menyimpan data");
    } else {
      alert("Data berhasil disimpan");
    }
  };
  
  
  
  
  
  
  

  const isFormComplete =
  formData.nama_mahasiswa.trim() !== '' &&
  formData.judul.trim() !== '' &&
  formData.minatPenelitian.length > 0 &&
  formData.mataKuliah.length > 0;


  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          value={formData.email}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
        />

        <TextField
          {...register('nama_mahasiswa', { required: 'Nama Mahasiswa wajib diisi' })}
          value={formData.nama_mahasiswa}
          onChange={handleChange}
          name="nama_mahasiswa"
          label="Nama Mahasiswa"
          fullWidth
          margin="normal"
          error={!!errors?.nama_mahasiswa}
          helperText={errors?.nama_mahasiswa?.message as string}
        />

        <TextField
          {...register('judul', { required: 'Judul wajib diisi' })}
          value={formData.judul}
          onChange={handleChange}
          name="judul"
          label="Judul Skripsi"
          fullWidth
          margin="normal"
          error={!!errors?.judul}
          helperText={errors?.judul?.message as string}
        />

        <Controller
          name="minat_penelitian"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Autocomplete
              multiple
              freeSolo
              options={allMinat}
              value={field.value || []}
              onChange={(_, value) => {
                const values = value.map((v) => (typeof v === 'string' ? v : ''));
                field.onChange(values);
                handleAutocompleteChange('minatPenelitian', values);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" color="primary" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} variant="standard" placeholder="Pilih Minat Penelitian" fullWidth />
              )}
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="matkul_terkait"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Autocomplete
              multiple
              freeSolo
              options={allMatkul}
              value={field.value || []}
              onChange={(_, value) => {
                const values = value.map((v) => (typeof v === 'string' ? v : ''));
                field.onChange(values);
                handleAutocompleteChange('mataKuliah', values);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" color="primary" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} variant="standard" placeholder="Pilih Mata Kuliah" fullWidth />
              )}
              sx={{ mb: 2 }}
            />
          )}
        />

      <Button
        variant="contained"
        onClick={generateDosenPembimbing}
        disabled={!isFormComplete}
        sx={{ mt: 3 }}
      >
        Generate Dosen Pembimbing
      </Button>
      
      <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
        {[rankingResult[0], rankingResult[1]].map((dosen, idx) => (
          <Box
            key={idx}
            sx={{
              flex: '1 1 300px',
              p: 2,
              border: '1px solid #ccc',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0000',
              minWidth: 280,
            }}
          >
            <img
              src={dosen?.avatar || '/default-avatar.png'}
              alt="Foto Dosen"
              style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 4, marginRight: 16 }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {idx === 0 ? 'Dosen Pembimbing 1' : 'Dosen Pembimbing 2'}
              </Typography>
              <Typography>{dosen?.nama}</Typography>
              <Typography variant="body2" color="text.secondary">
                Persentase Kecocokan: {dosen?.total}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>



        {rankingResult.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Tabel Perhitungan Detail GAP & Rumus
          </Typography>
          <Box sx={{ mt: 1, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#0000' }}>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>No</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nama Dosen</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>GAP Minat</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Bobot Minat</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>GAP Matkul</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Bobot Matkul</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Total Publikasi</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Rumus</th>
                </tr>
              </thead>
              <tbody>
                {rankingResult.slice(0, 3).map((d, i) => (
                  <tr key={i}>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{i + 1}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{d.nama}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{d.detail.gapMinat}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{d.detail.bobotMinat}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{d.detail.gapMatkul}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{d.detail.bobotMatkul}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{d.detail.totalPublikasi}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{d.detail.rumus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </>
      )}


      {rankingResult.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Kesimpulan</Typography>
          <Typography>
            Mahasiswa <b> {formData.nama_mahasiswa} </b> dengan judul "{formData.judul}" disarankan untuk dibimbing oleh
            <b> {rankingResult[0].nama}</b> berdasarkan perhitungan tertinggi sebesar <b>{rankingResult[0].total}</b>.
          </Typography>
        </Box>
      )}

      </Box>
    </Create>
  );
};
