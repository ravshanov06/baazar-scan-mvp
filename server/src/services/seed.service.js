const prisma = require('../config/prisma');

const seedDatabase = async () => {
    // Clean existing data
    await prisma.product.deleteMany({});
    await prisma.shop.deleteMany({});
    await prisma.section.deleteMany({});
    await prisma.market.deleteMany({});

    // Create market
    const market = await prisma.market.create({
        data: {
            name: 'Chorsu Bazaar',
            location: 'Tashkent',
            floorPlan: '/images/chorsu-map.svg',
            sections: {
                create: [
                    { name: 'Section A - Vegetables' },
                    { name: 'Section B - Fruits' },
                    { name: 'Section C - Meat' }
                ]
            }
        }
    });

    const sections = await prisma.section.findMany({
        where: { marketId: market.id }
    });

    // Create test shops WITH location data
    const testShops = [
        {
            name: 'Akmal Sabzavotlari',
            phone: '+998901234567',
            address: 'E-Block, 12-Shop',
            lat: 41.3,
            lon: 69.3,
            categories: ['vegetables'],
            marketId: market.id,
            sectionId: sections[0].id
        },
        {
            name: 'Meva Markazi',
            phone: '+998907654321',
            address: 'F-Block, 5-Shop',
            lat: 41.31,
            lon: 69.29,
            categories: ['fruits'],
            marketId: market.id,
            sectionId: sections[1].id
        },
        {
            name: 'Halol Go\'sht',
            phone: '+998990001122',
            address: 'A-Block, 1-Shop',
            lat: 41.29,
            lon: 69.31,
            categories: ['meat'],
            marketId: market.id,
            sectionId: sections[2].id
        }
    ];

    for (const shopData of testShops) {
        await prisma.shop.create({ data: shopData });
    }

    return {
        success: true,
        message: 'Test data seeded!',
        marketId: market.id,
        testShops: testShops.length
    };
};

module.exports = {
    seedDatabase
};
