import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Portal | Geo-Risk System",
  description: "Authority Dashboard for Building Approvals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="admin-header">
          <div className="logo">🏛️ Nilgiris Authority Portal</div>
          <div className="user-profile">Officer ID: ADM-08</div>
        </header>
        {children}
      </body>
    </html>
  );
}
