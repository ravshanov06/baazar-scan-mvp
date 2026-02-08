import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Map from '../../components/ui/Map';
import { MapPin, ArrowRight, Loader2, Store, CheckCircle2 } from 'lucide-react';

/**
 * Register page: Create a new vendor account and their first shop.
 */
const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        categories: [],
        phone: '',
        password: ''
    });
    const [location, setLocation] = useState([41.2995, 69.2401]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const toggleCategory = (cat) => {
        const current = formData.categories;
        if (current.includes(cat)) {
            setFormData({ ...formData, categories: current.filter(c => c !== cat) });
        } else {
            setFormData({ ...formData, categories: [...current, cat] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.phone || formData.categories.length === 0) {
            return setError('Barcha maydonlarni to\'ldiring va kamida bitta kategoriya tanlang');
        }

        setLoading(true);
        setError('');

        const res = await register({
            ...formData,
            lat: location[0],
            lon: location[1]
        });

        if (res.success) {
            navigate('/vendor');
        } else {
            setError(res.error || 'Ro\'yxatdan o\'tishda xatolik');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-md mx-auto">
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Do'koningizni qo'shing</h1>
                <p className="text-gray-500 font-medium">BazaarScan tarmog'iga qo'shiling va mijozlarni jalb qiling</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shop Name */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Do'kon Nomi</label>
                    <input
                        type="text"
                        placeholder="Masalan: Bek Mir Bozori #12"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all font-bold"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* Categories */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Kategoriyalar</label>
                    <div className="flex flex-wrap gap-2">
                        {['Vegetables', 'Fruits', 'Meat', 'Dairy', 'Bakery', 'Spices'].map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => toggleCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border
                                    ${formData.categories.includes(cat)
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Map Location */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Do'kon Joylashuvi</label>
                    <div className="h-48 rounded-2xl overflow-hidden border border-gray-100 relative shadow-inner shadow-gray-200/50">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <MapPin className="text-primary -mt-8 drop-shadow-xl" size={32} fill="currentColor" />
                        </div>
                        <Map center={location} zoom={15} onCenterChange={setLocation} />
                    </div>
                    <p className="text-[10px] text-center text-gray-400 font-bold uppercase py-1">Xaritani siljitib markazga tushiring</p>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Telefon Raqam</label>
                    <input
                        type="text"
                        placeholder="+998"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all font-bold"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold border border-red-100">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 flex justify-center items-center gap-3 active:scale-95 transition-transform disabled:opacity-70"
                >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
                    Ro'yxatdan o'tish
                </button>
            </form>

            <div className="text-center pb-8">
                <p className="text-sm text-gray-500 font-medium">
                    Akkauntingiz bormi?{' '}
                    <Link to="/login" className="text-primary font-black hover:underline underline-offset-4">
                        Kirish
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
