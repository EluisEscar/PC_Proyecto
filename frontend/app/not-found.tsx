import Link from 'next/link';

// Página 404: se muestra cuando un perfil de trabajador no existe
// (p. ej. un QR de un trabajador eliminado) o una ruta inválida.
export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '64px 0', maxWidth: 460, margin: '0 auto' }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
      <h1>Página no encontrada</h1>
      <p className="lead" style={{ margin: '0 auto 24px' }}>
        El trabajador o la página que buscas no existe o fue retirada del
        padrón.
      </p>
      <Link href="/" className="btn">
        Volver al inicio
      </Link>
    </div>
  );
}
