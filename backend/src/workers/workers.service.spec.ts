import { NotFoundException } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WorkersService', () => {
  let service: WorkersService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      worker: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      tip: {
        create: jest.fn(),
      },
    };
    service = new WorkersService(prisma as PrismaService);
  });

  it('lanza NotFound al dejar propina a un trabajador inexistente', async () => {
    prisma.worker.findUnique.mockResolvedValue(null);
    await expect(
      service.addTip('no-existe', { amount: 5 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('registra la propina cuando el trabajador existe', async () => {
    prisma.worker.findUnique.mockResolvedValue({ id: 'w1' });
    prisma.tip.create.mockResolvedValue({ id: 't1', amount: 5, workerId: 'w1' });

    const tip = await service.addTip('w1', { amount: 5, donorName: 'Ana' });

    expect(prisma.tip.create).toHaveBeenCalledWith({
      data: { amount: 5, donorName: 'Ana', workerId: 'w1' },
    });
    expect(tip).toEqual({ id: 't1', amount: 5, workerId: 'w1' });
  });
});
