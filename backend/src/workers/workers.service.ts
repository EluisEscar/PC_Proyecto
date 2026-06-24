import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkerStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateWorkerDto,
  RegisterWorkerDto,
  UpdateWorkerDto,
} from './dto/worker.dto';
import { CreateTipDto } from './dto/tip.dto';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  /// Listado público: solo trabajadores aprobados y activos.
  findAll() {
    return this.prisma.worker.findMany({
      where: { active: true, status: WorkerStatus.APPROVED },
      orderBy: { createdAt: 'desc' },
    });
  }

  /// Listado para el panel admin; permite filtrar por estado (p. ej. PENDING).
  findAllForAdmin(status?: WorkerStatus) {
    return this.prisma.worker.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  /// Auto-registro público: el trabajador crea su perfil en estado PENDING.
  register(dto: RegisterWorkerDto) {
    return this.prisma.worker.create({
      data: { ...dto, status: WorkerStatus.PENDING },
    });
  }

  /// El admin aprueba o rechaza un trabajador pendiente.
  async setStatus(id: string, status: WorkerStatus) {
    await this.ensureExists(id);
    return this.prisma.worker.update({ where: { id }, data: { status } });
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

  /// Alta directa por el admin: queda aprobada de inmediato.
  create(dto: CreateWorkerDto, userId: string) {
    return this.prisma.worker.create({
      data: { ...dto, registeredById: userId, status: WorkerStatus.APPROVED },
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
