import {IsNotEmpty, IsString} from 'class-validator';
export class PacienteDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    genero: string;
}
