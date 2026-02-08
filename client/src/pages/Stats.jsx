import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const Stats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/api/shops/nearby?lat=41.2995&lon=69.2401&radius=50');
            const shops = res.data;

            let totalProducts = 0;
            let totalShops = shops.length;
            let productPrices = {};

            shops.forEach(shop => {
                if (shop.products) {
                    totalProducts += shop.products.length;
                    shop.products.forEach(p => {
                        const name = p.name.toLowerCase();
                        if (!productPrices[name]) productPrices[name] = [];
                        productPrices[name].push(p.price);
                    });
                }
            });

            const marketOverview = Object.keys(productPrices).map(name => {
                const prices = productPrices[name];
                const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                return { name, avg, min, max, count: prices.length };
            }).sort((a, b) => b.count - a.count).slice(0, 5);

            setStats({
                totalShops,
                totalProducts,
                marketOverview
            });
            setLoading(false);
        } catch (e) {
            console.error("Stats error", e);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading stats...</div>;

    return (
        <div className="p-4 pb-20 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Bozor Statistikasi</h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                            <BarChart2 size={20} />
                        </div>
                        <span className="text-gray-500 text-sm">Do'konlar</span>
                    </div>
                    <p className="text-2xl font-bold">{stats?.totalShops || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-green-50 text-green-500 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-gray-500 text-sm">Mahsulotlar</span>
                    </div>
                    <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
                </div>
            </div>

            <h2 className="text-lg font-bold mb-3">Top Mahsulotlar Narxlari (o'rtacha)</h2>
            <div className="space-y-3">
                {stats?.marketOverview?.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold capitalize">{item.name}</h3>
                            <span className="text-xs text-gray-400">{item.count} ta do'konda</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-gray-500">O'rtacha</p>
                                <p className="text-lg font-bold text-gray-800">{Math.round(item.avg).toLocaleString()} so'm</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-green-500">Min: {item.min.toLocaleString()}</p>
                                <p className="text-xs text-red-500">Max: {item.max.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${(item.min / item.max) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
                {stats?.marketOverview?.length === 0 && (
                    <div className="text-center text-gray-400 py-10">Ma'lumotlar yetarli emas</div>
                )}
            </div>
        </div>
    );
};

export default Stats;
