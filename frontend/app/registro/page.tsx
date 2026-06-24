'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

const EMPTY = { fullName: '', crossing: '', description: '', phone: '' };

export default function RegistroPage() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStatus('sending');
    try {
      await api.registerWorker(form);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
      setStatus('idle');
    }
  }

  if (status === 'done') {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div className="success">
          ¡Registro enviado! Tu perfil quedó <strong>pendiente de
          verificación</strong>. Un administrador lo revisará y lo activará
          pronto.
        </div>
        <Link href="/" className="btn btn-ghost">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1>Regístrate como trabajador</h1>
      <p className="lead">
        Crea tu perfil para recibir propinas digitales. Un administrador lo
        verificará antes de publicarlo.
      </p>
      <form className="panel" onSubmit={submit}>
        {error && <div className="alert">{error}</div>}
        <div className="field">
          <label>Nombre completo *</label>
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Cruce / esquina donde trabajas *</label>
          <input
            required
            value={form.crossing}
            onChange={(e) => setForm({ ...form, crossing: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Teléfono (opcional)</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Cuéntanos sobre ti (opcional)</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Registrarme'}
        </button>
      </form>
    </div>
  );
}
