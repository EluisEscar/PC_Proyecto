import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerDto, UpdateWorkerDto } from './dto/worker.dto';
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

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateWorkerDto, @Req() req: any) {
    return this.workers.create(dto, req.user.id);
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
