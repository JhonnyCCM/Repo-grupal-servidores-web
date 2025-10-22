import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsNotEmpty, IsOptional, IsUUID, IsPositive, IsString } from 'class-validator';
import { PaymentMethod, PaymentStatus } from 'src/common/enums';

export class CreatePaymentDto {
    @ApiProperty({
        description: 'Método de pago',
        enum: PaymentMethod,
        example: PaymentMethod.CREDIT_CARD
    })
    @IsEnum(PaymentMethod, { message: 'El método de pago debe ser válido' })
    @IsNotEmpty({ message: 'El método de pago es obligatorio' })
    method: PaymentMethod;

    @ApiProperty({
        description: 'Monto del pago',
        example: 99.99,
        minimum: 0.01
    })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El monto debe ser un número válido con máximo 2 decimales' })
    @IsPositive({ message: 'El monto debe ser mayor a 0' })
    amount: number;

    @ApiProperty({
        description: 'ID de transacción externa',
        example: 'TXN_123456789',
        required: false
    })
    @IsString({ message: 'El ID de transacción debe ser un texto' })
    @IsOptional()
    transactionId?: string;

    @ApiProperty({
        description: 'Estado del pago',
        enum: PaymentStatus,
        example: PaymentStatus.PENDING,
        required: false,
        default: PaymentStatus.PENDING
    })
    @IsEnum(PaymentStatus, { message: 'El estado del pago debe ser válido' })
    @IsOptional()
    status?: PaymentStatus;

    @ApiProperty({
        description: 'ID de la membresía asociada',
        example: 'uuid-membership-id'
    })
    @IsUUID('4', { message: 'El ID de la membresía debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID de la membresía es obligatorio' })
    membershipId: string;

    @ApiProperty({
        description: 'ID del usuario que realiza el pago',
        example: 'uuid-user-id'
    })
    @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    userId: string;
}
