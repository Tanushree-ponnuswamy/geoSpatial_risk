import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nilgiris Geo-Risk Approval",
  description: "Advanced Geo-Spatial Risk-Based Building Approval System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="navbar">
          <div className="nav-container">
            <Link href="/" className="nav-logo">
              🌿 Nilgiris<span className="logo-light">Approval</span>
            </Link>
            <div className="nav-links">

              <Link href="/login" className="btn btn-primary btn-sm">Sign In</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
