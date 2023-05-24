import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let fakePrismaService: Partial<PrismaService>;

  beforeEach(async () => {
    fakePrismaService = {
      user: {
        findUnique: jest.fn(),
        ...PrismaService.prototype.user,
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UsersService, { provide: PrismaService, useValue: fakePrismaService }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should find a user by email', async () => {
  //   const email = 'test@test.hu';
  //   const user = { id: 1, email, name: 'Test User' };
  // });
});
