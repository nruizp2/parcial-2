import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity/medico.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { faker } from '@faker-js/faker';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();
 
    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await  seedDatabase()
  });

  const seedDatabase = async () => {
    repository.clear();
    medicosList = [];
    for(let i = 0; i < 5; i++){
        const medico: MedicoEntity = await repository.save( {
          nombre: faker.person.fullName(),
          especialidad: faker.lorem.sentence(),
          telefono: faker.phone.number(),
          pacientes: []
        }
    )
    medicosList.push(medico);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new medico', async () => {
    const medico: MedicoEntity = {
      id : "123",
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.sentence(),
      telefono: faker.phone.number(),
      pacientes: []
    }

    const newMedico: MedicoEntity = await service.create(medico);
    expect(newMedico).not.toBeNull();

    const storedMedico: MedicoEntity = await repository.findOne({where: {id: newMedico.id}})
    expect(storedMedico).not.toBeNull();
    expect(storedMedico.nombre).toEqual(newMedico.nombre)
    expect(storedMedico.especialidad).toEqual(newMedico.especialidad)
  });

  it('create should return exception', async () => {
    const medico: MedicoEntity = {
      id : "124",
      nombre: "",
      especialidad: faker.lorem.sentence(),
      telefono: faker.phone.number(),
      pacientes: []
    }
    await expect(() => service.create(medico)).rejects.toHaveProperty("message", "Nombre o especialidad vacíos")
  });

  it('create should return exception 2', async () => {
    const medico: MedicoEntity = {
      id : "124",
      nombre: faker.person.fullName(),
      especialidad: "",
      telefono: faker.phone.number(),
      pacientes: []
    }
    await expect(() => service.create(medico)).rejects.toHaveProperty("message", "Nombre o especialidad vacíos")
  });

  it('find all works', async () => {
    let obtained: MedicoEntity[] = await service.findAll()
    expect(obtained).not.toBeNull();
    expect(obtained).toHaveLength(medicosList.length);
  });

  it('findOne should return a medico by id', async () => {
    const storedMedico: MedicoEntity = medicosList[0];
    const medico: MedicoEntity = await service.findOne(storedMedico.id);
    expect(medico).not.toBeNull();
    expect(medico.nombre).toEqual(storedMedico.nombre)
    expect(medico.especialidad).toEqual(storedMedico.especialidad)

  });

  it('findOne should throw an exception for an invalid medico', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The medico with the given id was not found")
  });

  it('delete should remove a medico', async () => {
    const medico: MedicoEntity = medicosList[0];
    await service.delete(medico.id);
  
    const deletedMedico: MedicoEntity = await repository.findOne({ where: { id: medico.id } })
    expect(deletedMedico).toBeNull();
  });

  it('delete should throw an exception for an invalid medico', async () => {
    const medico: MedicoEntity = medicosList[0];
    await service.delete(medico.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The medico with the given id was not found")
  });

});
