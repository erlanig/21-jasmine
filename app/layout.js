export const metadata = {
  title: "Ucapan Ultah Jasmine 🎂",
  description: "Kirim ucapan ulang tahun untuk Jasmine",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#fffafc" }}>
        {children}
      </body>
    </html>
  );
}

