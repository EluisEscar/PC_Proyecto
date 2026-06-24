'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// Genera el QR del perfil público del trabajador (en el cliente).
// El QR apunta a esta misma página, de modo que el conductor que lo escanea
// llega directo al perfil y puede dejar la propina.
export function QrCode({ workerId }: { workerId: string }) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    const url = `${window.location.origin}/w/${workerId}`;
    QRCode.toDataURL(url, { width: 200, margin: 1 })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [workerId]);

  if (!dataUrl) return <div className="muted">Generando QR…</div>;

  return (
    <div className="qr-box">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="Código QR del perfil" width={200} height={200} />
    </div>
  );
}
