import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { Users, Clock, CheckCircle2, UserCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ employees: 0, leaves: 0, tasks: 0 });

    // Fallback static counts jab tak data fetch hooks integrated na hon
    useEffect(() => {
        setStats({ employees: 8, leaves: 3, tasks: 12 });
    }, []);

    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-100">
            {/* Sidebar Left Component */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                
                {/* Header Navbar */}
                <header className="h-20 border-b border-slate-900 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-white capitalize">{activeTab} View</h2>
                    <div className="flex items-center gap-3 bg-slate-800/40 px-4 py-2 rounded-xl border border-slate-800">
                        <UserCircle className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm font-medium text-slate-300">{user?.name}</span>
                    </div>
                </header>

                {/* Workspace Panels container */}
                <main className="p-8 max-w-7xl w-full mx-auto">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            {/* Welcome Banner */}
                            <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl shadow-xl shadow-indigo-900/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                                <h1 className="text-2xl font-bold text-white">Hello, {user?.name}! 👋</h1>
                                <p className="text-indigo-100 mt-1.5 text-sm max-w-md">Here's your organization status hub. Monitor operations, approve requests and dispatch schedules seamlessly.</p>
                            </div>

                            {/* Stats Summary Panel */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between hover:border-slate-700 transition duration-200">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Registered Staff</p>
                                        <h3 className="text-3xl font-black text-white mt-1">{stats.employees}</h3>
                                    </div>
                                    <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/10">
                                        <Users className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between hover:border-slate-700 transition duration-200">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Leaves</p>
                                        <h3 className="text-3xl font-black text-amber-400 mt-1">{stats.leaves}</h3>
                                    </div>
                                    <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/10">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between hover:border-slate-700 transition duration-200">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Schedules</p>
                                        <h3 className="text-3xl font-black text-emerald-400 mt-1">{stats.tasks}</h3>
                                    </div>
                                    <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'dashboard' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                            <h3 className="text-lg font-bold text-white capitalize">{activeTab} Control Section</h3>
                            <p className="text-slate-400 text-sm mt-1.5">Interactive management list UI components will load here in the upcoming module steps.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;