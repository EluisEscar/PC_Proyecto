'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, auth, Worker } from '@/lib/api';

const EMPTY = {
  fullName: '',
  crossing: '',
  description: '',
  phone: '',
};

export default function AdminPage() {
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setWorkers(await api.listWorkers());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth.getToken()) {
      router.replace('/login');
      return;
    }
    load();
  }, [router, load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.createWorker(form);
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
    }
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar este trabajador?')) return;
    try {
      await api.deleteWorker(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }

  function logout() {
    auth.clear();
    router.push('/login');
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div className="spread">
        <h1 style={{ margin: 0 }}>Panel de gestión</h1>
        <button className="btn btn-ghost" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      {error && <div className="alert">{error}</div>}

      <form className="panel" onSubmit={create}>
        <h3 style={{ marginTop: 0 }}>Registrar trabajador</h3>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="field" style={{ flex: 1, minWidth: 200 }}>
            <label>Nombre completo *</label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 200 }}>
            <label>Cruce / esquina *</label>
            <input
              required
              value={form.crossing}
              onChange={(e) => setForm({ ...form, crossing: e.target.value })}
            />
          </div>
        </div>
        <div className="field">
          <label>Descripción</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Teléfono</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <button className="btn" type="submit">
          Registrar
        </button>
      </form>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Trabajadores registrados</h3>
        {loading ? (
          <p className="muted">Cargando…</p>
        ) : workers.length === 0 ? (
          <p className="muted">No hay trabajadores aún.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cruce</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id}>
                  <td>{w.fullName}</td>
                  <td className="muted">{w.crossing}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      href={`/w/${w.id}`}
                      className="btn btn-ghost"
                      style={{ padding: '6px 12px', marginRight: 8 }}
                    >
                      Ver / QR
                    </Link>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '6px 12px' }}
                      onClick={() => remove(w.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
