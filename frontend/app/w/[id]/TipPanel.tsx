'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const PRESET_AMOUNTS = [2, 5, 10, 20];

export function TipPanel({
  workerId,
  workerName,
}: {
  workerId: string;
  workerName: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(5);
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStatus('sending');
    try {
      await api.sendTip(workerId, {
        amount,
        donorName: donorName || undefined,
        message: message || undefined,
      });
      setStatus('done');
      router.refresh(); // actualiza el total mostrado en el perfil
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar');
      setStatus('idle');
    }
  }

  if (status === 'done') {
    return (
      <div className="panel">
        <div className="success">
          ¡Gracias! Tu propina de S/ {amount.toFixed(2)} para {workerName} fue
          registrada.
        </div>
        <button className="btn btn-ghost" onClick={() => setStatus('idle')}>
          Dejar otra propina
        </button>
      </div>
    );
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h3 style={{ marginTop: 0 }}>Dejar una propina digital</h3>
      {error && <div className="alert">{error}</div>}

      <div className="field">
        <label>Monto (S/)</label>
        <div className="tip-grid">
          {PRESET_AMOUNTS.map((a) => (
            <button
              type="button"
              key={a}
              className={`amount-btn ${amount === a ? 'active' : ''}`}
              onClick={() => setAmount(a)}
            >
              S/ {a}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={0.1}
          step={0.1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <div className="field">
        <label>Tu nombre (opcional)</label>
        <input
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          placeholder="Anónimo"
        />
      </div>

      <div className="field">
        <label>Mensaje (opcional)</label>
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="¡Buen trabajo!"
        />
      </div>

      <button className="btn" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : `Dar S/ ${amount.toFixed(2)}`}
      </button>
    </form>
  );
}
