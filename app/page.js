'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

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
  const [showPopup, setShowPopup] = useState(false); // popup
  const [popupName, setPopupName] = useState(''); // simpan nama buat popup

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

      setPopupName(name);
      setName('');
      setMessage('');
      await fetchMessages();

      // tampilkan popup
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Gagal mengirim ucapan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: #fff0f5;
          overflow-x: hidden;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Popup terima kasih */}
      {showPopup && (
        <div style={popupOverlayStyle}>
          <div style={popupBoxStyle}>
            <h3 style={{ marginBottom: '0.5rem' }}>💖 Terima kasih!</h3>
            <p>Atas wish dan doa terbaiknya <strong>{popupName}</strong> ✨</p>
          </div>
        </div>
      )}

      <main style={mainStyle}>
        <h1 style={titleStyle}>🎂 Happy Birthday, Jasmine! 🎉</h1>
        <p style={subtitleStyle}>Tulis wish dan doa terbaikmu untuk Jasmine di sini yaa</p>

        <form onSubmit={handleSubmit} style={formStyle}>
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
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Mengirim...' : 'Kirim Ucapan'}
          </button>
        </form>

        <div style={{ width: '100%', maxWidth: '1000px' }}>
          <h2 style={sectionTitleStyle}>Ucapan dari semua yang sayang Jasmine ❤️</h2>

          {messages.length === 0 && !loading && (
            <p style={{ textAlign: 'center', color: '#777' }}>
              Belum ada ucapan ih😢 Mau jadi yang pertama gak?
            </p>
          )}

          <ul style={messageGridStyle}>
            {messages.map((msg) => (
              <li key={msg.id} style={cardStyle}>
                <strong style={nameStyle}>💗 {msg.name}</strong>
                <p style={messageStyle}>{msg.message}</p>
                <small style={timestampStyle}>{formatDate(msg.timestamp)}</small>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer style={footerStyle}>
        <p>© 2025. Pacar Jasmine. All rights reserved</p>
      </footer>
    </>
  );
}

/* --- Style --- */

const mainStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem 1rem',
  minHeight: '100vh',
  width: '100%',
  boxSizing: 'border-box'
};

const titleStyle = {
  fontSize: 'clamp(2rem, 8vw, 3rem)',
  marginBottom: '0.5rem',
  color: '#d63384',
  fontWeight: '700',
  textAlign: 'center'
};

const subtitleStyle = {
  marginTop: 0,
  fontSize: '1.1rem',
  color: '#555',
  textAlign: 'center',
  maxWidth: '500px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  maxWidth: '480px',
  background: '#fff',
  padding: '2rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  margin: '1.5rem 0'
};

const inputStyle = {
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid #ddd',
  background: '#fafafa',
  fontSize: '1rem',
  fontFamily: "'Poppins', sans-serif"
};

const buttonStyle = {
  background: '#d63384',
  color: '#fff',
  border: 'none',
  padding: '1rem',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '1.05rem',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(214, 51, 132, 0.2)'
};

const sectionTitleStyle = {
  color: '#d63384',
  textAlign: 'center',
  fontWeight: '600',
  marginBottom: '1.5rem'
};

const messageGridStyle = {
  listStyle: 'none',
  padding: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '1rem'
};

const cardStyle = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const nameStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: '#d63384',
  fontSize: '1.1rem',
  marginBottom: '0.5rem'
};

const messageStyle = {
  color: '#333',
  lineHeight: '1.5',
  whiteSpace: 'pre-wrap'
};

const timestampStyle = {
  display: 'block',
  marginTop: '1rem',
  textAlign: 'right',
  color: '#999'
};

const popupOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  animation: 'fadeIn 0.3s ease'
};

const popupBoxStyle = {
  background: '#fff',
  padding: '1.5rem 2rem',
  borderRadius: '1rem',
  textAlign: 'center',
  color: '#d63384',
  fontWeight: '600',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  animation: 'scaleIn 0.3s ease'
};

const footerStyle = {
  textAlign: 'center',
  color: '#d63384',
  fontWeight: '500',
  fontSize: '0.95rem',
  borderTop: '1px solid #f3d6e0'
};
