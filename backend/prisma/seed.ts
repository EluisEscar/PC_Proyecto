import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Usuario administrador de prueba.
  const password = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@manosvisibles.pe' },
    update: {},
    create: {
      email: 'admin@manosvisibles.pe',
      password,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  // Trabajadores de prueba en cruces reales de Lima.
  const workers = [
    {
      fullName: 'Carlos Mendoza',
      crossing: 'Av. Javier Prado con Av. Aviación',
      description:
        'Trabaja desde hace 3 años en este cruce. Apoya a su familia de 4.',
      latitude: -12.0892,
      longitude: -77.0036,
      phone: '+51 999 111 222',
    },
    {
      fullName: 'José Rodríguez',
      crossing: 'Av. La Marina con Av. Universitaria',
      description: 'Migrante venezolano, estudia de noche.',
      latitude: -12.0739,
      longitude: -77.0808,
      phone: '+51 999 333 444',
    },
    {
      fullName: 'Miguel Quispe',
      crossing: 'Vía Expresa con Av. Canadá',
      description: 'Joven que ahorra para terminar el colegio.',
      latitude: -12.0795,
      longitude: -77.0282,
    },
  ];

  for (const w of workers) {
    const created = await prisma.worker.create({
      data: { ...w, registeredById: admin.id },
    });
    // Algunas propinas de ejemplo.
    await prisma.tip.createMany({
      data: [
        { workerId: created.id, amount: 5.0, donorName: 'Anónimo' },
        { workerId: created.id, amount: 2.5, message: '¡Gracias!' },
      ],
    });
  }

  // eslint-disable-next-line no-console
  console.log('Seed completado. Admin: admin@manosvisibles.pe / admin123');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
