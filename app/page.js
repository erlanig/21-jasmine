'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

// Komponen untuk memformat tanggal (agar lebih rapi)
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // State untuk loading

  // Fungsi untuk mengambil data
  const fetchMessages = async () => {
    // Mengurutkan berdasarkan timestamp, yang terbaru di atas
    const q = query(collection(db, 'ucapan'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMessages(data);
  };

  // Ambil data dari Firestore saat komponen dimuat
  useEffect(() => {
    fetchMessages();
  }, []);

  // Simpan data ke Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return alert("Nama dan ucapan harus diisi!");

    setLoading(true); // Mulai loading
    try {
      await addDoc(collection(db, 'ucapan'), {
        name,
        message,
        timestamp: new Date()
      });

      setName('');
      setMessage('');
      await fetchMessages(); // Ambil ulang data untuk refresh
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Gagal mengirim ucapan!");
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  return (
    <>
      {/* Ini adalah style global untuk background dan font */}
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Lato', sans-serif;
          background: linear-gradient(135deg, #fff0f5 0%, #ffe6e9 100%);
        }
      `}</style>

      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        <h1 style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: 'clamp(2.5rem, 10vw, 4rem)', // Font responsif
          marginBottom: '1rem',
          color: '#c2185b', // Pink yang lebih dalam
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          🎂 Happy Birthday, Jasmine! 🎉
        </h1>
        <p style={{marginTop: 0, fontSize: '1.1rem', color: '#555', textAlign: 'center'}}>
          Tinggalkan ucapan manismu di sini~
        </p>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '500px',
          background: 'rgba(255, 255, 255, 0.9)', // Efek kaca
          backdropFilter: 'blur(10px)',
          padding: '2rem',
          borderRadius: '1.5rem',
          boxShadow: '0 8px 32px 0 rgba(194, 24, 91, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          margin: '1rem auto 2rem auto'
        }}>
          <input
            type="text"
            placeholder="Nama kamu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <textarea
            placeholder="Tulis ucapan kamu di sini..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
            // Tambahkan efek hover langsung di sini untuk kemudahan
            onMouseOver={(e) => e.currentTarget.style.background = '#ad1457'}
            onMouseOut={(e) => e.currentTarget.style.background = '#d63384'}
          >
            {loading ? 'Mengirim...' : 'Kirim Ucapan 💌'}
          </button>
        </form>

        <div style={{
          width: '100%',
          maxWidth: '1200px'
        }}>
          <h2 style={{
            color: '#c2185b',
            borderBottom: '2px solid #fce4ec',
            paddingBottom: '0.5rem'
          }}>
            Ucapan dari Teman-Teman ✨
          </h2>
          {messages.length === 0 && !loading && (
            <p style={{ textAlign: 'center', color: '#777' }}>
              Belum ada ucapan 😢 Jadilah yang pertama!
            </p>
          )}
          <ul style={{
            listStyle: 'none',
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {messages.map((msg) => (
              <li key={msg.id} style={cardStyle}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <strong style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#c2185b',
                  fontSize: '1.1rem',
                  borderBottom: '1px dashed #eee',
                  paddingBottom: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  💖 {msg.name}
                </strong>
                <p style={{
                  margin: '0.5rem 0',
                  color: '#333',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap' // Menghargai baris baru dari textarea
                }}>
                  {msg.message}
                </p>
                <small style={{
                  display: 'block',
                  marginTop: '1rem',
                  textAlign: 'right',
                  color: '#999',
                  fontStyle: 'italic'
                }}>
                  {formatDate(msg.timestamp)}
                </small>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}

// Definisikan style di luar return agar lebih bersih
const inputStyle = {
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid #eee',
  background: '#fcfcfc',
  fontSize: '1rem',
  fontFamily: "'Lato', sans-serif",
  transition: 'all 0.3s ease'
  // Anda bisa menambahkan :focus state menggunakan CSS biasa
};

const buttonStyle = {
  background: '#d63384',
  color: '#fff',
  border: 'none',
  padding: '1rem',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(214, 51, 132, 0.3)'
};

const cardStyle = {
  background: '#ffffff',
  padding: '1.5rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%', // Membuat kartu sama tinggi di dalam grid
  boxSizing: 'border-box' // Penting untuk padding
};