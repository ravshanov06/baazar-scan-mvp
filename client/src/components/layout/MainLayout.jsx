import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Map, Store, ShoppingBag, BarChart2 } from 'lucide-react';

const MainLayout = () => {
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="flex-1 overflow-hidden relative">
                <Outlet />
            </div>

            <nav className="bg-white border-t border-gray-200 flex justify-around p-3 pb-safe z-50">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`
                    }
                >
                    <Map size={24} />
                    <span>Explore</span>
                </NavLink>

                <NavLink
                    to="/stats"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`
                    }
                >
                    <BarChart2 size={24} />
                    <span>Stats</span>
                </NavLink>

                <NavLink
                    to="/products"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`
                    }
                >
                    <ShoppingBag size={24} />
                    <span>Products</span>
                </NavLink>

                <NavLink
                    to="/vendor"
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`
                    }
                >
                    <Store size={24} />
                    <span>Vendor</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default MainLayout;
