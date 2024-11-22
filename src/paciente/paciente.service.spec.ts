import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { faker } from '@faker-js/faker';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();
 
    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    repository.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new paciente', async () => {
    const paciente: PacienteEntity = {
      id : "123",
      nombre: "Harold",
      genero: faker.person.gender(),
      medicos: [],
      diagnosticos: []
    }

    const newPaciente: PacienteEntity = await service.create(paciente);
    expect(newPaciente).not.toBeNull();

    const storedPaciente: PacienteEntity = await repository.findOne({where: {id: newPaciente.id}})
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(newPaciente.nombre)
    expect(storedPaciente.genero).toEqual(newPaciente.genero)
  });

  it('create should return exception', async () => {
    const paciente: PacienteEntity = {
      id : "124",
      nombre: "Ha",
      genero: faker.person.gender(),
      medicos: [],
      diagnosticos: []
    }
    await expect(() => service.create(paciente)).rejects.toHaveProperty("message", "Nombre menor de 3 caracteres")
  });
});
