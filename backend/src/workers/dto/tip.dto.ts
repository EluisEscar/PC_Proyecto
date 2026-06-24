import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateTipDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.1)
  @Max(1000)
  amount: number;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  donorName?: string;
}
