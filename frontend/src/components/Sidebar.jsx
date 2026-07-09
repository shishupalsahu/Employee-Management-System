import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, FileText, CheckSquare, LogOut, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { logout, user } = useContext(AuthContext);

    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'employees', name: 'Employees', icon: <Users className="w-5 h-5" /> },
        { id: 'leaves', name: 'Leave Requests', icon: <FileText className="w-5 h-5" /> },
        { id: 'tasks', name: 'Task Board', icon: <CheckSquare className="w-5 h-5" /> },
    ];

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen text-gray-400 sticky top-0">
            <div>
                {/* Logo Area */}
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-600/30">
                        E
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-base leading-tight">EMS Workspace</h1>
                        <span className="text-xs text-indigo-400 font-medium capitalize">{user?.role} Portal</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-1.5 mt-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                activeTab === item.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'hover:bg-slate-800/60 hover:text-gray-200'
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Logout Section */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout Account</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;