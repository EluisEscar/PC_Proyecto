import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Manos Visibles — Apoya a quienes limpian parabrisas',
  description:
    'Plataforma para registrar y apoyar con propinas digitales a las personas que limpian parabrisas en cruces de alto tráfico.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header className="header">
          <div className="container header-inner">
            <Link href="/" className="brand">
              👐 Manos Visibles
            </Link>
            <nav className="nav">
              <Link href="/">Trabajadores</Link>
              <Link href="/admin">Panel</Link>
            </nav>
          </div>
        </header>
        <main className="container main">{children}</main>
        <footer className="footer">
          <div className="container">
            Proyecto Final de Carrera III — Caso 3 · Economía de subsistencia
          </div>
        </footer>
      </body>
    </html>
  );
}
