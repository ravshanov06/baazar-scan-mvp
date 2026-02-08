const prisma = require('../config/prisma');

/**
 * Submit or update product prices for a specific shop.
 * Logic handles both updating existing products and creating new ones.
 */
const submitPrices = async (req, res) => {
    try {
        const { phone, shopId, products } = req.body;

        if (!phone || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                error: 'Phone and products array are required'
            });
        }

        // Find shop by ID first, fallback to phone (for legacy support)
        let shop;
        if (shopId) {
            shop = await prisma.shop.findUnique({ where: { id: shopId } });
        } else {
            shop = await prisma.shop.findFirst({ where: { phone } });
        }

        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        const updatedProducts = [];
        for (const product of products) {
            if (!product.name || product.price === undefined) {
                continue;
            }

            // Products are case-insensitive by name within a shop
            const existing = await prisma.product.findFirst({
                where: {
                    shopId: shop.id,
                    name: product.name.toLowerCase()
                }
            });

            if (existing) {
                const updated = await prisma.product.update({
                    where: { id: existing.id },
                    data: {
                        price: parseFloat(product.price),
                        category: product.category || existing.category,
                        lastUpdated: new Date()
                    }
                });
                updatedProducts.push(updated);
            } else {
                const created = await prisma.product.create({
                    data: {
                        name: product.name.toLowerCase(),
                        price: parseFloat(product.price),
                        category: product.category || 'other',
                        unit: product.unit || 'kg',
                        shopId: shop.id
                    }
                });
                updatedProducts.push(created);
            }
        }

        res.json({
            success: true,
            message: 'Prices updated!',
            shop: shop.name,
            count: updatedProducts.length
        });
    } catch (error) {
        console.error('Submit prices error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Login vendor by phone number. 
 * Returns all shops associated with that phone.
 */
const login = async (req, res) => {
    try {
        const { phone } = req.body;

        const shops = await prisma.shop.findMany({
            where: { phone },
            include: { products: true }
        });

        if (shops.length === 0) {
            return res.status(401).json({ error: 'Shop not found. Please register first.' });
        }

        res.json(shops);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

/**
 * Register a new shop or update an existing one.
 * Ensures the vendor session stays in sync by returning all shops for the phone.
 */
const register = async (req, res) => {
    try {
        const { id, name, phone, address, lat, lon, categories, category } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Normalize categories to an array
        let categoriesList = [];
        if (categories) {
            categoriesList = Array.isArray(categories) ? categories : categories.split(',').map(c => c.trim());
        } else if (category) {
            categoriesList = [category];
        } else {
            categoriesList = ['other'];
        }

        let shop;
        if (id) {
            // Update
            shop = await prisma.shop.update({
                where: { id },
                data: {
                    name,
                    address: address || undefined,
                    lat: lat ? parseFloat(lat) : undefined,
                    lon: lon ? parseFloat(lon) : undefined,
                    categories: categoriesList
                }
            });
        } else {
            // Create
            shop = await prisma.shop.create({
                data: {
                    name: name || 'Unnamed Store',
                    phone,
                    address: address || 'Location not set',
                    lat: lat ? parseFloat(lat) : 41.2995,
                    lon: lon ? parseFloat(lon) : 69.2401,
                    categories: categoriesList
                }
            });
        }

        // Always return full shop list to update client-side session context
        const allShops = await prisma.shop.findMany({ where: { phone } });

        res.json({
            success: true,
            message: id ? 'Store updated!' : 'Store registered!',
            shops: allShops,
            activeShop: shop
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register store' });
    }
};

/**
 * Search for nearby shops with price comparison.
 * Filters by product or category and calculates marker colors:
 * - Green: Cheapest
 * - Red: Most Expensive
 * - Yellow: Intermediate
 * - Blue: No match / Default
 */
const getNearbyShops = async (req, res) => {
    try {
        const { lat, lon, radius = 5, product, category } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude required' });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        const radiusKm = parseFloat(radius);
        const productSearch = product?.toLowerCase();
        const categorySearch = category;

        // 1. Haversine distance query for nearby shops
        const nearbyShopsRaw = await prisma.$queryRaw`
      SELECT id, (6371 * acos(
        cos(radians(${latitude})) * cos(radians(lat)) * cos(radians(lon) - radians(${longitude})) + 
        sin(radians(${latitude})) * sin(radians(lat))
      )) AS distance
      FROM "Shop"
      WHERE (6371 * acos(
        cos(radians(${latitude})) * cos(radians(lat)) * cos(radians(lon) - radians(${longitude})) + 
        sin(radians(${latitude})) * sin(radians(lat))
      )) <= ${radiusKm}
      ORDER BY distance
    `;

        if (nearbyShopsRaw.length === 0) return res.json([]);

        const shopIds = nearbyShopsRaw.map(s => s.id);
        const shops = await prisma.shop.findMany({
            where: { id: { in: shopIds } },
            include: { products: true }
        });

        // 2. Determine price range for comparison
        let minP = Infinity, maxP = -Infinity;
        if (productSearch || categorySearch) {
            shops.forEach(s => {
                const matches = s.products.filter(p =>
                    productSearch ? p.name.toLowerCase().includes(productSearch) : p.category === categorySearch
                );
                if (matches.length > 0) {
                    const shopMin = Math.min(...matches.map(m => m.price));
                    if (shopMin < minP) minP = shopMin;
                    if (shopMin > maxP) maxP = shopMin;
                }
            });
        }

        // 3. Format result with specific product filtering and coloring
        const result = nearbyShopsRaw.map(raw => {
            const shop = shops.find(s => s.id === raw.id);
            let color = 'blue';
            let matches = [];

            if (productSearch) {
                matches = shop.products.filter(p => p.name.toLowerCase().includes(productSearch));
            } else if (categorySearch) {
                matches = shop.products.filter(p => p.category === categorySearch);
            }

            let displayProducts = matches.length > 0 ? matches : shop.products;

            if (matches.length > 0 && minP !== Infinity) {
                const shopBest = Math.min(...matches.map(m => m.price));
                if (maxP > minP) {
                    if (shopBest === minP) color = 'green';
                    else if (shopBest === maxP) color = 'red';
                    else color = 'yellow';
                } else {
                    color = 'green'; // All prices are the same
                }
            }

            return {
                ...shop,
                products: displayProducts,
                distance: raw.distance,
                color
            };
        });

        res.json(result);
    } catch (error) {
        console.error('Nearby search error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    submitPrices,
    login,
    register,
    getNearbyShops
};
