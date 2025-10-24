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
  const [loading, setLoading] = useState(false);

  // Fungsi untuk mengambil data
  const fetchMessages = async () => {
    const q = query(collection(db, 'ucapan'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Simpan data ke Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return alert("Nama dan ucapan harus diisi!");

    setLoading(true);
    try {
      await addDoc(collection(db, 'ucapan'), {
        name,
        message,
        timestamp: new Date()
      });

      setName('');
      setMessage('');
      await fetchMessages(); 
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Gagal mengirim ucapan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mengganti font menjadi Poppins */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        
        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: #fff0f5; /* Warna pink yang sangat muda */
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
          fontFamily: "'Poppins', sans-serif", // Font diubah ke Poppins
          fontSize: 'clamp(2rem, 8vw, 3rem)',
          marginBottom: '0.5rem',
          color: '#d63384', // Warna pink utama
          fontWeight: '700',
          textAlign: 'center'
        }}>
          🎂 Happy Birthday, Jasmine! 🎉
        </h1>
        <p style={{
          marginTop: 0,
          fontSize: '1.1rem',
          color: '#555',
          textAlign: 'center'
        }}>
          Tinggalkan ucapan manismu di sini~
        </p>

        {/* Form dibuat lebih simpel */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '500px',
          background: '#ffffff', // Latar belakang putih solid
          padding: '2rem',
          borderRadius: '1rem', // Border radius lebih simpel
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // Bayangan lebih lembut
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
          >
            {loading ? 'Mengirim...' : 'Kirim Ucapan 💌'}
          </button>
        </form>

        <div style={{
          width: '100%',
          maxWidth: '1200px'
        }}>
          <h2 style={{
            color: '#d63384',
            textAlign: 'center',
            fontWeight: '600',
            marginBottom: '1.5rem'
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
              <li key={msg.id} style={cardStyle}>
                <strong style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#d63384',
                  fontSize: '1.1rem',
                  paddingBottom: '0.5rem',
                  marginBottom: '1rem',
                  fontWeight: '600'
                }}>
                  💖 {msg.name}
                </strong>
                <p style={{
                  margin: '0.5rem 0',
                  color: '#333',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
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

// Definisikan style di luar return
const inputStyle = {
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid #ddd', // Border lebih simpel
  background: '#fafafa',
  fontSize: '1rem',
  fontFamily: "'Poppins', sans-serif", // Font Poppins
};

const buttonStyle = {
  background: '#d63384',
  color: '#fff',
  border: 'none',
  padding: '1rem',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: '600', // Poppins terlihat bagus dengan 600
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(214, 51, 132, 0.2)' // Bayangan lebih lembut
};

const cardStyle = {
  background: '#ffffff',
  padding: '1.5rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // Bayangan simpel
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%', 
  boxSizing: 'border-box'
};