import { notFound } from 'next/navigation';
import { API_URL, WorkerDetail } from '@/lib/api';
import { TipPanel } from './TipPanel';
import { QrCode } from './QrCode';

async function getWorker(id: string): Promise<WorkerDetail | null> {
  try {
    const res = await fetch(`${API_URL}/workers/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function WorkerProfile({
  params,
}: {
  params: { id: string };
}) {
  const worker = await getWorker(params.id);
  if (!worker) notFound();

  const total = Number(worker.totalTips ?? 0);

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div className="panel">
        <div className="spread">
          <div className="row">
            <div className="avatar" style={{ width: 64, height: 64 }}>
              👤
            </div>
            <div>
              <h1 style={{ marginBottom: 2 }}>{worker.fullName}</h1>
              <div className="crossing" style={{ color: 'var(--accent-2)' }}>
                📍 {worker.crossing}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="muted" style={{ fontSize: '0.8rem' }}>
              Propinas recibidas
            </div>
            <div className="stat">S/ {total.toFixed(2)}</div>
            <div className="muted" style={{ fontSize: '0.8rem' }}>
              {worker._count.tips} aporte(s)
            </div>
          </div>
        </div>
        {worker.description && (
          <p className="muted" style={{ marginTop: 16 }}>
            {worker.description}
          </p>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: 24,
          alignItems: 'start',
        }}
        className="profile-cols"
      >
        <TipPanel workerId={worker.id} workerName={worker.fullName} />

        <div className="panel" style={{ textAlign: 'center' }}>
          <h3 style={{ marginTop: 0 }}>Código QR</h3>
          <p className="muted" style={{ fontSize: '0.85rem' }}>
            Imprímelo o muéstralo en el cruce. El conductor lo escanea y deja su
            propina.
          </p>
          <QrCode workerId={worker.id} />
        </div>
      </div>
    </div>
  );
}
