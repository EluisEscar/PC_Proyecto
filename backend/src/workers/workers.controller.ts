import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WorkerStatus } from '@prisma/client';
import { WorkersService } from './workers.service';
import {
  CreateWorkerDto,
  RegisterWorkerDto,
  UpdateStatusDto,
  UpdateWorkerDto,
} from './dto/worker.dto';
import { CreateTipDto } from './dto/tip.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workers')
export class WorkersController {
  constructor(private workers: WorkersService) {}

  // ---- Endpoints públicos ----

  @Get()
  findAll() {
    return this.workers.findAll();
  }

  /// Auto-registro público del trabajador (queda en estado PENDING).
  @Post('register')
  register(@Body() dto: RegisterWorkerDto) {
    return this.workers.register(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workers.findOne(id);
  }

  /// Propina pública: cualquier conductor puede dejar una propina por QR.
  @Post(':id/tips')
  addTip(@Param('id') id: string, @Body() dto: CreateTipDto) {
    return this.workers.addTip(id, dto);
  }

  // ---- Endpoints protegidos (panel de gestión) ----

  /// Listado para el panel; ?status=PENDING para ver los que esperan aprobación.
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  findAllForAdmin(@Query('status') status?: WorkerStatus) {
    return this.workers.findAllForAdmin(status);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateWorkerDto, @Req() req: any) {
    return this.workers.create(dto, req.user.id);
  }

  /// Aprobar o rechazar un trabajador auto-registrado.
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.workers.setStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkerDto) {
    return this.workers.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workers.remove(id);
  }
}
