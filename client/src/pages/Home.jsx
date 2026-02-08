import React, { useState, useEffect } from 'react';
import Map from '../components/ui/Map';
import { Search, Filter, Loader2 } from 'lucide-react';
import api from '../api/axios';

/**
 * Home page: The main map view where users can search for products and categories.
 * Coordinates user location and fetches nearby shop data with price comparison.
 */
const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(false);
    const [shops, setShops] = useState([]);
    const [userLocation, setUserLocation] = useState([41.2995, 69.2401]); // Default to Tashkent center

    useEffect(() => {
        // Initial load: Get user location and fetch nearby shops
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(coords);
                    fetchNearbyShops(coords[0], coords[1]);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    // Fallback to default location
                    fetchNearbyShops(userLocation[0], userLocation[1]);
                }
            );
        } else {
            fetchNearbyShops(userLocation[0], userLocation[1]);
        }
    }, []);

    /**
     * Fetch shops from the backend based on location and search criteria.
     */
    const fetchNearbyShops = async (lat, lon, product = '', category = '') => {
        try {
            // Radius is set to 20km for MVP
            let url = `/api/shops/nearby?lat=${lat}&lon=${lon}&radius=20`;
            if (product) url += `&product=${encodeURIComponent(product)}`;
            if (category) url += `&category=${encodeURIComponent(category)}`;

            const res = await api.get(url);
            setShops(res.data);
        } catch (error) {
            console.error("API Error (nearby shops):", error);
        }
    };

    /**
     * Explicit search by text
     */
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setActiveCategory('All'); // Reset category when searching by text
        await fetchNearbyShops(userLocation[0], userLocation[1], searchTerm, '');
        setLoading(false);
    };

    /**
     * Search by category chip selection
     */
    const handleCategoryClick = (cat) => {
        setActiveCategory(cat);
        if (cat === 'All') {
            setSearchTerm('');
            fetchNearbyShops(userLocation[0], userLocation[1], '', '');
        } else {
            setSearchTerm(''); // Clear search input when filtering by category
            fetchNearbyShops(userLocation[0], userLocation[1], '', cat);
        }
    };


    return (
        <div className="h-full relative overflow-hidden">
            {/* Map Canvas - z-0 to stay behind UI elements */}
            <div className="absolute inset-0 z-0">
                <Map center={userLocation} zoom={14} markers={shops} />
            </div>

            {/* Overlay UI: Search & Categories */}
            <div className="absolute top-4 left-4 right-4 z-10 space-y-4">
                <form
                    onSubmit={handleSearch}
                    className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-2 pl-4 flex gap-2 items-center border border-white/20"
                >
                    <Search size={20} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Mahsulot qidirish (masalan: pomidor)"
                        className="flex-1 outline-none text-sm font-bold text-gray-700 placeholder-gray-400 py-3 bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {loading ? (
                        <div className="p-2">
                            <Loader2 size={24} className="animate-spin text-primary" />
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="bg-primary text-white p-3 rounded-xl shadow-lg active:scale-95 transition-transform"
                        >
                            <Search size={20} />
                        </button>
                    )}
                </form>

                {/* Horizontal Category Scroll */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {['All', 'Vegetables', 'Fruits', 'Meat', 'Dairy', 'Bakery', 'Spices'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className={`px-6 py-3 rounded-full shadow-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                                ${activeCategory === cat
                                    ? 'bg-primary text-white scale-110 shadow-primary/30'
                                    : 'bg-white/90 backdrop-blur text-gray-500 hover:text-primary'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
