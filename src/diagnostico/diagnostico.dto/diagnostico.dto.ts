import {IsNotEmpty, IsString} from 'class-validator';
export class DiagnosticoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;
}
