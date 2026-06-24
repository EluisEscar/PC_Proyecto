import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkerDto, UpdateWorkerDto } from './dto/worker.dto';
import { CreateTipDto } from './dto/tip.dto';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  /// Listado público de trabajadores activos.
  findAll() {
    return this.prisma.worker.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /// Perfil público de un trabajador (con total de propinas recibidas).
  async findOne(id: string) {
    const worker = await this.prisma.worker.findUnique({
      where: { id },
      include: {
        tips: { orderBy: { createdAt: 'desc' }, take: 10 },
        _count: { select: { tips: true } },
      },
    });
    if (!worker) throw new NotFoundException('Trabajador no encontrado');

    const agg = await this.prisma.tip.aggregate({
      where: { workerId: id },
      _sum: { amount: true },
    });

    return { ...worker, totalTips: agg._sum.amount ?? 0 };
  }

  create(dto: CreateWorkerDto, userId: string) {
    return this.prisma.worker.create({
      data: { ...dto, registeredById: userId },
    });
  }

  async update(id: string, dto: UpdateWorkerDto) {
    await this.ensureExists(id);
    return this.prisma.worker.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.worker.delete({ where: { id } });
  }

  /// Registra una propina digital (simulada en el MVP).
  async addTip(workerId: string, dto: CreateTipDto) {
    await this.ensureExists(workerId);
    return this.prisma.tip.create({
      data: { ...dto, workerId },
    });
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.worker.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Trabajador no encontrado');
  }
}
