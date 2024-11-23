import {IsNotEmpty, IsString} from 'class-validator';
export class MedicoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    especialidad: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;
}
