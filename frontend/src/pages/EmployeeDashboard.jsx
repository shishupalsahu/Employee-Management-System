import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, FileText, UserCircle, Calendar, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
const EmployeeDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { user } = useContext(AuthContext);
    
    // Core States
    const [tasks, setTasks] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [stats, setStats] = useState({ activeTasks: 0, pendingLeaves: 0, completedTasks: 0 });
    const [salaryData, setSalaryData] = useState(null);
    const [salaryError, setSalaryError] = useState(''); 
    // Leave Form State
    const [leaveForm, setLeaveForm] = useState({ leaveType: 'Sick Leave', startDate: '', endDate: '', reason: '' });
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user?.token) {
            fetchMyTasks();
            fetchMyLeaves();
        }
        if (user?.token) {
        fetchMyTasks();
        fetchMyLeaves();
        if (activeTab === 'payroll') {
            fetchMyPayroll();
        }
    }
    }, [user, activeTab]);

    const fetchMyPayroll = async () => {
    setSalaryError('');
    try {
        const response = await fetch(`http://localhost:5000/api/salary/${user._id}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (response.ok) {
            setSalaryData(data);
        } else {
            setSalaryError(data.message || 'No payroll matrix generated yet.');
        }
    } catch (err) {
        setSalaryError('Failed to fetch corporate payroll information.');
    }
     };


    const fetchMyTasks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tasks', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setTasks(data);
                setStats(prev => ({
                    ...prev,
                    activeTasks: data.filter(t => t.status !== 'Completed').length,
                    completedTasks: data.filter(t => t.status === 'Completed').length
                }));
            }
        } catch (err) { console.error(err); }
    };

    const fetchMyLeaves = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/leave/history', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setLeaves(data);
                setStats(prev => ({ ...prev, pendingLeaves: data.filter(l => l.status === 'Pending').length }));
            }
        } catch (err) { console.error(err); }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) fetchMyTasks();
        } catch (err) { console.error(err); }
    };

    const handleLeaveSubmit = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });
        try {
            const response = await fetch('http://localhost:5000/api/leave/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(leaveForm)
            });
            const data = await response.json();
            if (response.ok) {
                setFormMessage({ type: 'success', text: 'Leave application filed successfully!' });
                setLeaveForm({ leaveType: 'Sick Leave', startDate: '', endDate: '', reason: '' });
                fetchMyLeaves();
            } else {
                throw new Error(data.message || 'Submission failed');
            }
        } catch (err) {
            setFormMessage({ type: 'error', text: err.message });
        }
    };

    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-100">
            {/* Using the same generic Sidebar layout */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <header className="h-20 border-b border-slate-900 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-white capitalize">Employee Workspace</h2>
                    <div className="flex items-center gap-4">
                    <NotificationBell /> {/* <-- Yeh component yahan inject karein */}
                   <div className="flex items-center gap-3 bg-slate-800/40 px-4 py-2 rounded-xl border border-slate-800">
                    <UserCircle className="w-5 h-5 text-indigo-400" />
                     <span className="text-sm font-medium text-slate-300">{user?.name}</span>
              </div>
             </div>
              </header>

                <main className="p-8 max-w-7xl w-full mx-auto">
                    {/* Metrics Dashboard Overview */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-800 rounded-2xl shadow-xl shadow-indigo-950/10">
                                <h1 className="text-2xl font-bold text-white">Welcome Back, {user?.name}! ✨</h1>
                                <p className="text-slate-400 mt-1.5 text-sm">Track your tasks schedule, change progress boards, and maintain your absence profiles.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                                    <div><p className="text-xs font-semibold uppercase text-slate-500">My Active Tasks</p><h3 className="text-3xl font-black text-white mt-1">{stats.activeTasks}</h3></div>
                                    <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-xl"><CheckSquare className="w-6 h-6" /></div>
                                </div>
                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                                    <div><p className="text-xs font-semibold uppercase text-slate-500">Pending Leaves</p><h3 className="text-3xl font-black text-indigo-400 mt-1">{stats.pendingLeaves}</h3></div>
                                    <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-xl"><Clock className="w-6 h-6" /></div>
                                </div>
                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                                    <div><p className="text-xs font-semibold uppercase text-slate-500">Tasks Completed</p><h3 className="text-3xl font-black text-emerald-400 mt-1">{stats.completedTasks}</h3></div>
                                    <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Employee Profile Placeholder (Using regular template handler if navbar clicked) */}
                    {activeTab === 'employees' && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                            <h3 className="text-lg font-bold text-white">Profile Workspace</h3>
                            <p className="text-slate-400 text-sm mt-1">Name: {user?.name} | Email: {user?.email}</p>
                        </div>
                    )}

                    {/* SLEEK LEAVE FILING & HISTORY SECTION */}
                    {activeTab === 'leaves' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Apply Form Card */}
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit shadow-xl">
                                <h3 className="text-base font-bold text-white mb-4">Request Absence Leave</h3>
                                {formMessage.text && (
                                    <div className={`text-xs p-3 rounded-xl mb-4 border ${formMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                        {formMessage.text}
                                    </div>
                                )}
                                <form onSubmit={handleLeaveSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Leave Type</label>
                                        <select value={leaveForm.leaveType} onChange={e => setLeaveForm({...leaveForm, leaveType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500">
                                            <option value="Sick Leave">Sick Leave</option><option value="Casual Leave">Casual Leave</option><option value="Earned Leave">Earned Leave</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Start Date</label><input type="date" required value={leaveForm.startDate} onChange={e => setLeaveForm({...leaveForm, startDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500" /></div>
                                        <div><label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">End Date</label><input type="date" required value={leaveForm.endDate} onChange={e => setLeaveForm({...leaveForm, endDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500" /></div>
                                    </div>
                                    <div><label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Reason Statement</label><textarea required rows="3" placeholder="Explain reason..." value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500 resize-none" /></div>
                                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20">File Leave</button>
                                </form>
                            </div>

                            {/* Leave History List */}
                            <div className="lg:col-span-2 space-y-4">
                                <h3 className="text-base font-bold text-white">My Absence Records</h3>
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                                    <table className="w-full text-left border-collapse">
                                        <thead><tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] font-semibold uppercase text-slate-400"><th className="p-4 pl-6">Type</th><th className="p-4">Duration</th><th className="p-4 text-center">Status</th></tr></thead>
                                        <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300">
                                            {leaves.length === 0 ? (
                                                <tr><td colSpan="3" className="p-8 text-center text-slate-500">No logs generated yet.</td></tr>
                                            ) : (
                                                leaves.map(l => (
                                                    <tr key={l._id} className="hover:bg-slate-800/20 transition">
                                                        <td className="p-4 pl-6"><span className="font-semibold text-white block">{l.leaveType}</span><span className="text-[10px] text-slate-500 max-w-xs block truncate mt-0.5">"{l.reason}"</span></td>
                                                        <td className="p-4 text-slate-400">{new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}</td>
                                                        <td className="p-4 text-center"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${l.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : l.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>{l.status}</span></td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC PROGRESSIVE TASK TRACKER BOARD */}
                    {activeTab === 'tasks' && (
                        <div className="space-y-6">
                            <div><h3 className="text-xl font-bold text-white">My Assigned Schedules</h3><p className="text-slate-400 text-sm">Update active timeline milestones directly.</p></div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tasks.length === 0 ? (
                                    <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">You don't have any schedules assigned yet.</div>
                                ) : (
                                    tasks.map(task => (
                                        <div key={task._id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
                                            <div>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${task.priority === 'High' ? 'bg-rose-500/10 text-rose-400' : task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-950 text-slate-400'}`}>{task.priority} Priority</span>
                                                <h4 className="text-base font-bold text-white mt-3">{task.title}</h4>
                                                <p className="text-xs text-slate-400 mt-1 line-clamp-3">{task.description}</p>
                                            </div>

                                            <div className="border-t border-slate-800/60 mt-4 pt-4 space-y-3">
                                                <span className="flex items-center gap-1.5 text-xs text-slate-400"><Calendar className="w-3.5 h-3.5 text-slate-500" /> Target: {new Date(task.deadline).toLocaleDateString()}</span>
                                                
                                                <div className="space-y-1">
                                                    <label className="block text-[10px] font-semibold text-slate-500 uppercase">Change Status State</label>
                                                    <select 
                                                        value={task.status} 
                                                        onChange={e => handleStatusChange(task._id, e.target.value)}
                                                        className={`w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none ${task.status === 'Completed' ? 'text-emerald-400' : task.status === 'In Progress' ? 'text-sky-400' : 'text-amber-400'}`}
                                                    >
                                                        <option value="Pending">⌛ Pending</option>
                                                        <option value="In Progress">⚡ In Progress</option>
                                                        <option value="Completed">✅ Completed</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* CORPORATE PAYROLL VIEWER TAB */}
                    {activeTab === 'payroll' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div>
                                <h3 className="text-xl font-bold text-white">My Financial Statements</h3>
                                <p className="text-slate-400 text-sm">View or print your active monthly breakdown profiles.</p>
                            </div>

                            {salaryError ? (
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
                                    ⚠️ {salaryError}
                                </div>
                            ) : salaryData ? (
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-1.5 before:bg-gradient-to-r before:from-indigo-500 before:to-emerald-500">
                                    {/* Pay-Slip Header */}
                                    <div className="flex justify-between items-start border-b border-slate-800/60 pb-6">
                                        <div>
                                            <h4 className="text-lg font-black text-white tracking-wide">EMS CORPORATE INVOICE</h4>
                                            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">Salary Statement Certificate</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[10px] font-bold uppercase tracking-wide">Disbursed</span>
                                        </div>
                                    </div>

                                    {/* Meta Information Grid */}
                                    <div className="grid grid-cols-2 gap-4 my-6 text-xs bg-slate-950/40 p-4 rounded-xl border border-slate-800/40">
                                        <div><p className="text-slate-500 font-medium">Employee Name</p><p className="text-white font-bold mt-0.5">{user?.name}</p></div>
                                        <div><p className="text-slate-500 font-medium">Account Email</p><p className="text-slate-300 font-medium mt-0.5 truncate">{user?.email}</p></div>
                                    </div>

                                    {/* Earnings vs Deductions Matrix */}
                                    <div className="space-y-3.5 text-xs">
                                        <div className="flex justify-between items-center text-slate-400"><span className="font-medium">Basic Fixed Component</span><span className="font-bold text-slate-200">₹{salaryData.basicSalary}</span></div>
                                        <div className="flex justify-between items-center text-slate-400"><span className="font-medium">House Rent Allowance (HRA)</span><span className="font-bold text-slate-200">₹{salaryData.hra}</span></div>
                                        <div className="flex justify-between items-center text-slate-400"><span className="font-medium">Special Dynamic Perks</span><span className="font-bold text-slate-200">₹{salaryData.allowances}</span></div>
                                        <div className="flex justify-between items-center text-rose-400/90 border-t border-slate-800/40 pt-3.5"><span className="font-medium">Statutory Tax Deductions</span><span className="font-bold">-(₹{salaryData.deductions})</span></div>
                                        
                                        {/* Total Net Take Home */}
                                        <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800 mt-4">
                                            <span className="text-sm font-bold text-white">Net Take-Home Salary</span>
                                            <span className="text-lg font-black text-emerald-400">₹{salaryData.netSalary}</span>
                                        </div>
                                    </div>

                                    {/* Print/Download Button */}
                                    <button 
                                        onClick={() => window.print()} 
                                        className="w-full mt-6 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold py-2.5 rounded-xl border border-slate-800 transition shadow-md"
                                    >
                                        🖨️ Print Statement
                                    </button>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500 text-xs">Loading payroll environment...</div>
                            )}
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default EmployeeDashboard;