import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ars = await prisma.currency.upsert({
    where: { code: 'ARS' },
    update: {},
    create: {
      code: 'ARS',
      name: 'Pesos argentinos',
      symbol: '$.',
    },
  });
  console.log({ ars });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
