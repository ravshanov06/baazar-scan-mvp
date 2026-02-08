import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import api from '../api/axios';

const Products = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/shops/nearby?lat=41.2995&lon=69.2401&radius=10');
            const shops = res.data;

            const allProducts = [];
            shops.forEach(shop => {
                if (shop.products && Array.isArray(shop.products)) {
                    shop.products.forEach(product => {
                        allProducts.push({
                            ...product,
                            shopName: shop.name,
                            distance: shop.distance ? shop.distance.toFixed(1) : '?'
                        });
                    });
                }
            });

            setProducts(allProducts);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
        setLoading(false);
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase());
        // Case-insensitive category matching to handle 'other' vs 'Other'
        const matchesCategory = activeCategory === 'All' ||
            (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-gray-50 min-h-full pb-20">
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
                <h1 className="text-2xl font-bold mb-4">Mahsulotlar</h1>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['All', 'Vegetables', 'Fruits', 'Meat', 'Dairy', 'Bakery', 'Spices', 'Other'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${activeCategory === cat
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 space-y-3">
                {loading ? (
                    <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">Mahsulotlar topilmadi</div>
                ) : (
                    filteredProducts.map((product, index) => (
                        <div key={`${product.shopId}-${product.id}-${index}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-800">{product.name}</h3>
                                <p className="text-xs text-gray-500">{product.shopName} • {product.distance} km</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600 text-lg">{product.price.toLocaleString()} sum</p>
                                <p className="text-xs text-gray-400">per {product.unit}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Products;
