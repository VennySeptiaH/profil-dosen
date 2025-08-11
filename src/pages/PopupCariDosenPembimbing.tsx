import React, { useState } from 'react';
import { Autocomplete, TextField, Button, Chip, Box, Typography, Dialog, DialogTitle, DialogContent, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Menggunakan useNavigate dari React Router v6

interface DosenMatching {
    nama: string;
    score: number;
}

const PopupCariDosenPembimbing: React.FC = () => {
    const [judul, setJudul] = useState<string>('');
    const [minatPenelitian, setMinatPenelitian] = useState<string[]>([]); // Menyimpan minat penelitian yang dipilih
    const [mataKuliah, setMataKuliah] = useState<string[]>([]); // Menyimpan mata kuliah yang dipilih
    const [hasilMatching, setHasilMatching] = useState<DosenMatching[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Status login
    const navigate = useNavigate(); // Menggunakan useNavigate dari React Router v6

    const bidangPenelitianOptions = ["Data Mining", "Official Statistics", "Artificial Intelligence"];
    const mataKuliahOptions = ["PBW", "PBO", "Matematika Diskrit"];

    const generateDosen = () => {
        if (judul.trim() === '') {
            alert("Judul skripsi tidak boleh kosong");
            return;
        }

        const hasil: DosenMatching[] = [
            { nama: 'Dr. John Doe', score: parseFloat((Math.random() * 100).toFixed(2)) },
            { nama: 'Prof. Jane Smith', score: parseFloat((Math.random() * 100).toFixed(2)) }
        ];
        setHasilMatching(hasil);
    };

    // Fungsi untuk login (menyesuaikan dengan sistem login Anda)
    const login = () => {
        // Simulasi login, Anda bisa mengganti logika ini dengan autentikasi asli
        setIsLoggedIn(true);
        toggleDialog();
    };

    const toggleDialog = () => setOpen(!open);

    // Fungsi Ajukan Bimbingan
    const handleAjukanBimbingan = () => {
        if (!isLoggedIn) {
            // Jika belum login, arahkan ke halaman login
            navigate('/login'); // Menggunakan navigate untuk redirect ke halaman login
        } else {
            // Jika sudah login, ajukan bimbingan
            alert("Ajukan bimbingan berhasil!");
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={toggleDialog}>Cari Dosen Pembimbing</Button>
            <Dialog open={open} onClose={toggleDialog} fullWidth maxWidth="sm">
                <DialogTitle>Cari Dosen Pembimbing</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Judul Skripsi</Typography>
                    <Input
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        fullWidth
                        placeholder="Masukkan judul skripsi"
                        sx={{ mb: 3 }}
                    />

                    {/* Bidang Penelitian */}
                    <Typography variant="h6" sx={{ mb: 1 }}>Bidang Penelitian</Typography>
                    <Autocomplete
                        multiple
                        options={bidangPenelitianOptions}
                        value={minatPenelitian}
                        onChange={(_, newValue) => setMinatPenelitian(newValue)}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" color="primary" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                placeholder="Pilih bidang penelitian"
                                sx={{ mb: 3 }}
                            />
                        )}
                    />

                    {/* Mata Kuliah yang Terkait */}
                    <Typography variant="h6" sx={{ mb: 1 }}>Mata Kuliah yang Terkait</Typography>
                    <Autocomplete
                        multiple
                        options={mataKuliahOptions}
                        value={mataKuliah}
                        onChange={(_, newValue) => setMataKuliah(newValue)}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" color="primary" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                placeholder="Pilih mata kuliah"
                                sx={{ mb: 3 }}
                            />
                        )}
                    />

                    {/* Tombol Generate */}
                    <Button variant="contained" onClick={generateDosen} sx={{ mr: 2 }}>
                        Generate Dosen Pembimbing
                    </Button>


                    {/* Hasil Matching */}
                    {hasilMatching.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">Hasil Profil Matching</Typography>
                            {hasilMatching.map((dosen, index) => (
                                <Typography key={index}>{dosen.nama}: {dosen.score}%</Typography>
                            ))}
                        </Box>
                    )}

                    {/* Tombol Ajukan Bimbingan */}
                    <Button variant="contained" onClick={handleAjukanBimbingan}>
    Ajukan Bimbingan
</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PopupCariDosenPembimbing;
