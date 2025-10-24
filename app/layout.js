export const metadata = {
  title: "Cie yang ultah",
  description: "Kirim ucapan ulang tahun untuk Jasmine",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
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

