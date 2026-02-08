const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearDatabase() {
    try {
        console.log('Clearing database...');

        // Delete in order of dependencies
        await prisma.priceSnapshot.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.shop.deleteMany({});
        await prisma.section.deleteMany({});
        await prisma.market.deleteMany({});

        console.log('Database cleared successfully!');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase();
