import { Test, TestingModule } from '@nestjs/testing';
import { PacienteMedicoService } from './paciente-medico.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import exp from 'constants';


describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let medicoList: MedicoEntity[];
  let pacienteList: PacienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    medicoRepository.clear();
    pacienteRepository.clear();

    medicoList = [];
    pacienteList = [];

    for (let i = 0; i < 10; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.sentence(),
        telefono: faker.phone.number(),
        pacientes: []
      });
      medicoList.push(medico);

      const paciente: PacienteEntity = await pacienteRepository.save({
        nombre: faker.person.fullName(),
          genero: faker.person.gender(),
          medicos: [],
          diagnosticos: []
      });
      pacienteList.push(paciente);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should work', async () => {
    let medico:MedicoEntity = medicoList[0];
    let paciente: PacienteEntity = pacienteList[0];

    await service.addMedicoToPaciente(paciente.id, medico.id);

    let obtainedMedico:MedicoEntity = await medicoRepository.findOne({where:{id : medico.id}, relations: ["pacientes"] });
    let obtainedPaciente: PacienteEntity = await pacienteRepository.findOne({where:{id : paciente.id}, relations: ["medicos"] });

    expect(obtainedMedico.pacientes).toHaveLength(1);
    expect(obtainedPaciente.medicos).toHaveLength(1);

    expect(obtainedMedico.pacientes[0].id).toBe(paciente.id);
    expect(obtainedPaciente.medicos[0].id).toBe(medico.id);

  });

  it('cant use medico that does not exist', async () => {
    let paciente: PacienteEntity = pacienteList[0];

    await expect(() => service.addMedicoToPaciente(paciente.id, "-1")).rejects.toHaveProperty("message", "The medico with the given id was not found")
  });

  it('cant use paciente that does not exist', async () => {
    let medico:MedicoEntity = medicoList[0];

    await expect(() => service.addMedicoToPaciente("-1", medico.id)).rejects.toHaveProperty("message", "The paciente with the given id was not found")
  });

  it('cannot asing more than 5 doctors', async () => {
    let paciente: PacienteEntity = pacienteList[0];

    for(let i = 0; i< 5; i++){
      await service.addMedicoToPaciente(paciente.id, medicoList[i].id)
    }

    await expect(() => service.addMedicoToPaciente(paciente.id, medicoList[5].id)).rejects.toHaveProperty("message", "El paciente ya tiene 5 medicos")
  });
});
