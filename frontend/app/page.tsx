import Link from 'next/link';
import { API_URL, Worker } from '@/lib/api';

// Página de inicio: listado público de trabajadores. Server Component que
// consume la API directamente (sin exponer datos sensibles).
async function getWorkers(): Promise<Worker[]> {
  try {
    const res = await fetch(`${API_URL}/workers`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const workers = await getWorkers();

  return (
    <>
      <div className="spread">
        <h1>Personas que limpian parabrisas</h1>
        <Link href="/registro" className="btn">
          Soy trabajador · Registrarme
        </Link>
      </div>
      <p className="lead">
        Cada persona en esta lista trabaja en un cruce de la ciudad. Conoce su
        historia y déjale una propina digital escaneando su código QR.
      </p>

      {workers.length === 0 ? (
        <div className="panel">
          <p className="muted">
            Aún no hay trabajadores registrados (o la API no está disponible).
          </p>
        </div>
      ) : (
        <div className="grid">
          {workers.map((w) => (
            <Link key={w.id} href={`/w/${w.id}`} className="card">
              <div className="avatar">👤</div>
              <h3>{w.fullName}</h3>
              <div className="crossing">📍 {w.crossing}</div>
              {w.description && <div className="desc">{w.description}</div>}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
