import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ars = await prisma.currency.upsert({
    where: { code: 'ARS' },
    update: {},
    create: {
      code: 'ARS',
      name: 'Peso argentino',
      symbol: '$',
    },
  });
  const usd = await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      name: 'Dólar estadunidense',
      symbol: 'US$',
    },
  });
  const pen = await prisma.currency.upsert({
    where: { code: 'PEN' },
    update: {},
    create: {
      code: 'PEN',
      name: 'Sol peruano',
      symbol: 'S/',
    },
  });
  console.log({ ars, usd, pen });
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
