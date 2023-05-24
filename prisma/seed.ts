import { PrismaClient } from '@prisma/client';
import { UserHKRole } from 'src/users/dto/UserEntity.dto';

const prisma = new PrismaClient();

async function makeMyUser() {
  const create: Date = new Date('2023-01-01T10:30:00.000Z');
  const update: Date = new Date();
  update.setDate(create.getDate() - 5);
  await prisma.user.create({
    data: {
      id: 1,
      name: 'Alex Csiszár',
      email: 'csiszaralex@gmail.com',
      firstName: 'Alex',
      createdAt: create,
      updatedAt: update,
      isAdmin: true,
      authSchId: '76d4dde2-5b4d-04ff-eeb7-5ce9a9133c8e',
      role: UserHKRole.KORVEZETO,
      salt: 'salt',
    },
  });
}

async function main() {
  await makeMyUser();
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
