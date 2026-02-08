import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-white">
            <div className="mb-8 p-4 bg-primary/20 rounded-full">
                <div className="bg-primary p-4 rounded-full">
                    <ShoppingBag size={40} color="white" />
                </div>
            </div>

            <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-gray-900 shadow-xl">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
