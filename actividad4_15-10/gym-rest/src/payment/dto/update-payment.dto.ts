import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDate } from 'class-validator';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
    @ApiProperty({
        description: 'Fecha y hora del pago',
        example: '2023-10-21T17:30:00.000Z',
        required: false
    })
    @IsDate({ message: 'La fecha de pago debe ser una fecha válida' })
    @IsOptional()
    paidAt?: Date;
}
