import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Map from '../components/ui/Map';
import { Save, Plus, Trash2, MapPin, Loader2, Store, ChevronRight } from 'lucide-react';
import api from '../api/axios';

const Vendor = () => {
    const { user, logout, register } = useAuth(); // 'user' is now an array of shops
    const [shops, setShops] = useState(user || []);
    const [activeShopIndex, setActiveShopIndex] = useState(0);
    const [shop, setShop] = useState(shops[0] || {});
    const [products, setProducts] = useState(shops[0]?.products || []);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState([shops[0]?.lat || 41.2995, shops[0]?.lon || 69.2401]);
    const [activeTab, setActiveTab] = useState('details'); // details | prices
    const [showStoreList, setShowStoreList] = useState(true);

    useEffect(() => {
        if (user && user.length > 0) {
            setShops(user);
            // Default select first shop if none selected
            if (!shop.id && user[0]) {
                selectShop(0);
            }
        }
    }, [user]);

    const selectShop = (index) => {
        const selected = user[index];
        setActiveShopIndex(index);
        setShop(selected);
        setProducts(selected.products || []);
        setLocation([selected.lat || 41.2995, selected.lon || 69.2401]);
        setShowStoreList(false);
    };

    const handleAddNewStore = () => {
        setShop({ name: '', categories: [], phone: user[0]?.phone });
        setProducts([]);
        setLocation([41.2995, 69.2401]);
        setActiveShopIndex(-1); // New store marker
        setShowStoreList(false);
        setActiveTab('details');
    };

    const handleSaveDetails = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Updated register endpoint handles create/update by ID
            const res = await register({
                ...shop,
                lat: location[0],
                lon: location[1],
                phone: user[0]?.phone // Keep sync with current account
            });
            if (res.success) {
                alert('Shop details saved!');
                // shops are updated in AuthContext/user state
                setShowStoreList(true);
            }
        } catch (error) {
            console.error("Save failed", error);
            alert('Failed to save details');
        }
        setLoading(false);
    };

    const handleAddProduct = () => {
        setProducts([...products, { name: '', price: '', unit: 'kg' }]);
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...products];
        newProducts[index][field] = value;
        setProducts(newProducts);
    };

    const handleRemoveProduct = (index) => {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
    };

    const handleSavePrices = async () => {
        if (!shop.id) {
            alert('Please save store details first');
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/api/shops/submit-prices', {
                phone: user[0]?.phone,
                products: products,
                shopId: shop.id // Pass specific shop ID
            });
            if (res.data.success) {
                alert('Prices updated!');
            }
        } catch (error) {
            console.error("Price update failed", error);
            alert('Failed to update prices');
        }
        setLoading(false);
    };

    if (showStoreList) {
        return (
            <div className="pb-20 bg-gray-50 min-h-screen">
                <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
                    <h1 className="text-xl font-bold font-heading">Mening Do'konlarim</h1>
                    <button onClick={logout} className="text-red-500 text-sm font-medium">Chiqish</button>
                </div>

                <div className="p-4 space-y-4">
                    {shops.map((s, idx) => (
                        <div
                            key={s.id}
                            onClick={() => selectShop(idx)}
                            className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100 active:scale-98 transition-transform cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Store size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{s.name}</h3>
                                    <p className="text-xs text-gray-500 tracking-tight">{(s.categories || []).join(', ')}</p>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-400" size={20} />
                        </div>
                    ))}

                    <button
                        onClick={handleAddNewStore}
                        className="w-full py-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:border-primary hover:text-primary transition-all flex flex-col items-center gap-2 bg-white"
                    >
                        <Plus size={32} />
                        <span>Yangi do'kon qo'shish</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20 bg-gray-50 min-h-screen">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
                <button
                    onClick={() => setShowStoreList(true)}
                    className="p-1 -ml-1 text-gray-500"
                >
                    <ChevronRight className="rotate-180" size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold leading-none">{shop.id ? shop.name : "Yangi Do'kon"}</h1>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Tahrirlash</p>
                </div>
                <button onClick={logout} className="text-red-500 text-sm font-medium">Chiqish</button>
            </div>

            <div className="p-4">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4 border border-gray-100">
                    <div className="flex bg-gray-50/50">
                        <button
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'details' ? 'text-primary bg-white shadow-sm' : 'text-gray-400'}`}
                            onClick={() => setActiveTab('details')}
                        >
                            Ma'lumotlar
                        </button>
                        <button
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'prices' ? 'text-primary bg-white shadow-sm' : 'text-gray-400'}`}
                            onClick={() => setActiveTab('prices')}
                        >
                            Narxlar
                        </button>
                    </div>

                    <div className="p-5">
                        {activeTab === 'details' ? (
                            <form onSubmit={handleSaveDetails} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Do'kon Nomi</label>
                                    <input
                                        type="text"
                                        placeholder="Masalan: Bek Sabzavotlari"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                                        value={shop.name || ''}
                                        onChange={(e) => setShop({ ...shop, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kategoriyalar</label>
                                    <div className="grid grid-cols-2 gap-2 bg-gray-50/50 p-4 rounded-xl border border-gray-200">
                                        {['Vegetables', 'Fruits', 'Meat', 'Dairy', 'Bakery', 'Spices', 'Other'].map(cat => (
                                            <label key={cat} className="flex items-center space-x-3 text-sm font-medium text-gray-700 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={Array.isArray(shop.categories) && shop.categories.includes(cat)}
                                                    onChange={() => {
                                                        const currentCats = Array.isArray(shop.categories) ? shop.categories : [];
                                                        let newCats;
                                                        if (currentCats.includes(cat)) {
                                                            newCats = currentCats.filter(c => c !== cat);
                                                        } else {
                                                            newCats = [...currentCats, cat];
                                                        }
                                                        setShop({ ...shop, categories: newCats });
                                                    }}
                                                    className="rounded-lg text-primary focus:ring-primary h-5 w-5 border-gray-300"
                                                />
                                                <span>{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Joylashuv (Karta orqali belgilang)</label>
                                    <div className="h-56 bg-gray-100 rounded-2xl overflow-hidden relative shadow-inner border border-gray-200">
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                            <div className="relative">
                                                <MapPin className="text-primary -mt-8 drop-shadow-lg" size={40} fill="currentColor" />
                                                <div className="w-1 h-1 bg-black/20 rounded-full blur-[1px] absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                            </div>
                                        </div>
                                        <Map center={location} zoom={15} onCenterChange={setLocation} />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase text-center">Xaritani siljitib markazga tushiring</p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 flex justify-center items-center gap-3 active:scale-95 transition-transform disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                                        {shop.id ? "Yangilash" : "Qo'shish"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mahsulotlar Ro'yxati</p>
                                    <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-full">{products.length} TURLI</span>
                                </div>

                                {products.map((product, idx) => (
                                    <div key={idx} className="flex gap-3 items-start bg-gray-50/50 p-4 rounded-xl border border-gray-200 group transition-all">
                                        <div className="flex-1 space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Mahsulot nomi"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold bg-white focus:ring-4 focus:ring-primary/10 outline-none"
                                                value={product.name}
                                                onChange={(e) => handleProductChange(idx, 'name', e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <div className="flex-1 relative">
                                                    <input
                                                        type="number"
                                                        placeholder="0.00"
                                                        className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 text-sm font-black bg-white focus:ring-4 focus:ring-primary/10 outline-none"
                                                        value={product.price}
                                                        onChange={(e) => handleProductChange(idx, 'price', e.target.value)}
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">SO'M</span>
                                                </div>
                                                <select
                                                    className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold bg-white focus:ring-4 focus:ring-primary/10 outline-none appearance-none"
                                                    value={product.unit}
                                                    onChange={(e) => handleProductChange(idx, 'unit', e.target.value)}
                                                >
                                                    <option value="kg">kilogram</option>
                                                    <option value="dona">dona</option>
                                                    <option value="litr">litr</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Turi (Kategoriya)</label>
                                                <select
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold bg-white focus:ring-4 focus:ring-primary/10 outline-none"
                                                    value={product.category || 'other'}
                                                    onChange={(e) => handleProductChange(idx, 'category', e.target.value)}
                                                >
                                                    <option value="Vegetables">Sabzavotlar (Vegetables)</option>
                                                    <option value="Fruits">Mevalar (Fruits)</option>
                                                    <option value="Meat">Go'shtlar (Meat)</option>
                                                    <option value="Dairy">Sut mahsulotlari (Dairy)</option>
                                                    <option value="Bakery">Non mahsulotlari (Bakery)</option>
                                                    <option value="Spices">Ziravorlar (Spices)</option>
                                                    <option value="Other">Boshqa (Other)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveProduct(idx)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors rounded-lg mt-1"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={handleAddProduct}
                                    className="w-full py-5 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-bold hover:border-primary hover:text-primary hover:bg-white transition-all flex justify-center items-center gap-2 bg-gray-50/30"
                                >
                                    <Plus size={24} />
                                    <span>Yangi mahsulot</span>
                                </button>

                                <button
                                    onClick={handleSavePrices}
                                    disabled={loading}
                                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-600/30 flex justify-center items-center gap-3 active:scale-95 transition-transform disabled:opacity-70 mt-6"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                                    Yangilash
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vendor;
