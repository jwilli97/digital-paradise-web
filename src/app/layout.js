import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Digital Paradise",
  description: "Created by Digital Paradise Media",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} bg-cover bg-center bg-fixed`}
        style={{
          backgroundImage: "url('/background2.jpeg')",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
