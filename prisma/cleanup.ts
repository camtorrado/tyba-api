import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // List of models to delete records from
  const models = [
    'User',
    'Transaction'
  ];

  // Delete all records from each model
  for (const model of models) {
    await prisma[model.toLowerCase()].deleteMany({});
    console.log(`Deleted all records from ${model}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
