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
  let pacientesList: PacienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();
 
    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    await  seedDatabase()
  });

  const seedDatabase = async () => {
    repository.clear();
    pacientesList = [];
    for(let i = 0; i < 5; i++){
        const paciente: PacienteEntity = await repository.save( {
          nombre: faker.person.fullName(),
          genero: faker.person.gender(),
          medicos: [],
          diagnosticos: []
        }
    )
    pacientesList.push(paciente);
    }
  }

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

  it('find all works', async () => {
    let obtained: PacienteEntity[] = await service.findAll()
    expect(obtained).not.toBeNull();
    expect(obtained).toHaveLength(pacientesList.length);
  });

  it('findOne should return a paciente by id', async () => {
    const storedPaciente: PacienteEntity = pacientesList[0];
    const paciente: PacienteEntity = await service.findOne(storedPaciente.id);
    expect(paciente).not.toBeNull();
    expect(paciente.nombre).toEqual(storedPaciente.nombre)
    expect(paciente.genero).toEqual(storedPaciente.genero)

  });

  it('findOne should throw an exception for an invalid paciente', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The paciente with the given id was not found")
  });

  it('delete should remove a paciente', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    await service.delete(paciente.id);
  
    const deletedPaciente: PacienteEntity = await repository.findOne({ where: { id: paciente.id } })
    expect(deletedPaciente).toBeNull();
  });

  it('delete should throw an exception for an invalid paciente', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    await service.delete(paciente.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The paciente with the given id was not found")
  });

});
