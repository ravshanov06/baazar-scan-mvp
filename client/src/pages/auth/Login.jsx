import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, ArrowRight, Loader2, Store } from 'lucide-react';

/**
 * Login page: Vendor authentication using phone number.
 */
const Login = () => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!phone) return setError('Telefon raqamingizni kiriting');

        setLoading(true);
        setError('');

        const res = await login(phone);
        if (res.success) {
            navigate('/vendor');
        } else {
            setError(res.error || 'Login xatosi');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
                <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-2">
                    <Store size={32} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Xush kelibsiz!</h1>
                <p className="text-gray-500 font-medium">Do'koningizni boshqarish uchun tizimga kiring</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Telefon Raqam</label>
                    <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="+998"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all font-bold text-lg"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-xs font-bold text-red-500 ml-1">{error}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 flex justify-center items-center gap-3 active:scale-95 transition-transform disabled:opacity-70"
                >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
                    Kirish
                </button>
            </form>

            <div className="text-center">
                <p className="text-sm text-gray-500 font-medium">
                    Do'koningiz yo'qmi?{' '}
                    <Link to="/register" className="text-primary font-black hover:underline underline-offset-4">
                        Ro'yxatdan o'ting
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
