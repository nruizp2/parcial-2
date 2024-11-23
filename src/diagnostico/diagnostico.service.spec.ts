import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { faker } from '@faker-js/faker';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;
  let diagnosticosList: DiagnosticoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();
 
    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await  seedDatabase()
  });

  const seedDatabase = async () => {
    repository.clear();
    diagnosticosList = [];
    for(let i = 0; i < 5; i++){
        const diagnostico: DiagnosticoEntity = await repository.save( {
          nombre: faker.person.fullName(),
          descripcion: faker.lorem.paragraph(),
          pacientes: [],
        }
    )
    diagnosticosList.push(diagnostico);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new diagnostico', async () => {
    const diagnostico: DiagnosticoEntity = {
      id : "123",
      nombre: faker.person.fullName(),
      descripcion: "hola",
      pacientes: [],
    }

    const newDiagnostico: DiagnosticoEntity = await service.create(diagnostico);
    expect(newDiagnostico).not.toBeNull();

    const storedDiagnostico: DiagnosticoEntity = await repository.findOne({where: {id: newDiagnostico.id}})
    expect(storedDiagnostico).not.toBeNull();
    expect(storedDiagnostico.nombre).toEqual(newDiagnostico.nombre)
    expect(storedDiagnostico.descripcion).toEqual(newDiagnostico.descripcion)
  });

  it('create should return exception', async () => {
    const diagnostico: DiagnosticoEntity = {
      id : "124",
      nombre: faker.person.fullName(),
      descripcion: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      pacientes: [],
    }
    await expect(() => service.create(diagnostico)).rejects.toHaveProperty("message", "La descripción del diagnostico no debe tener mas de 200 caracteres")
  });

  it('find all works', async () => {
    let obtained: DiagnosticoEntity[] = await service.findAll()
    expect(obtained).not.toBeNull();
    expect(obtained).toHaveLength(diagnosticosList.length);
  });

  it('findOne should return a diagnostico by id', async () => {
    const storedDiagnostico: DiagnosticoEntity = diagnosticosList[0];
    const diagnostico: DiagnosticoEntity = await service.findOne(storedDiagnostico.id);
    expect(diagnostico).not.toBeNull();
    expect(diagnostico.nombre).toEqual(storedDiagnostico.nombre)
    expect(diagnostico.descripcion).toEqual(storedDiagnostico.descripcion)

  });

  it('findOne should throw an exception for an invalid diagnostico', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The diagnostico with the given id was not found")
  });

  it('delete should remove a diagnostico', async () => {
    const diagnostico: DiagnosticoEntity = diagnosticosList[0];
    await service.delete(diagnostico.id);
  
    const deletedDiagnostico: DiagnosticoEntity = await repository.findOne({ where: { id: diagnostico.id } })
    expect(deletedDiagnostico).toBeNull();
  });

  it('delete should throw an exception for an invalid diagnostico', async () => {
    const diagnostico: DiagnosticoEntity = diagnosticosList[0];
    await service.delete(diagnostico.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The diagnostico with the given id was not found")
  });

});
