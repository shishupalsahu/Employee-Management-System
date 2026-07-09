import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { Users, Clock, CheckCircle2, UserCircle, Plus, Trash2, UserPlus, X, Check, Calendar, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { user } = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ employees: 0, leaves: 0, tasks: 0 });
    
    // Modals States
    const [showModal, setShowModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    
    // Form States
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [taskData, setTaskData] = useState({ title: '', description: '', assignedTo: '', priority: 'Medium', deadline: '' });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (user?.token) {
            fetchEmployees();
            fetchLeaves();
            fetchTasks();
        }
    }, [user, activeTab]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/employees', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setEmployees(data);
                setStats(prev => ({ ...prev, employees: data.length }));
            }
        } catch (err) { console.error(err); }
    };

    const fetchLeaves = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/leave/history', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setLeaves(data);
                setStats(prev => ({ ...prev, leaves: data.filter(l => l.status === 'Pending').length }));
            }
        } catch (err) { console.error(err); }
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tasks', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setTasks(data);
                setStats(prev => ({ ...prev, tasks: data.filter(t => t.status !== 'Completed').length }));
            }
        } catch (err) { console.error(err); }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            const response = await fetch('http://localhost:5000/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Failed to onboard employee');
            setShowModal(false);
            setFormData({ name: '', email: '', password: '' });
            fetchEmployees();
        } catch (err) { setFormError(err.message); }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            const response = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify(taskData)
            });
            if (!response.ok) throw new Error('Failed to distribute task');
            setShowTaskModal(false);
            setTaskData({ title: '', description: '', assignedTo: '', priority: 'Medium', deadline: '' });
            fetchTasks();
        } catch (err) { setFormError(err.message); }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Delete this task deployment?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (response.ok) fetchTasks();
            } catch (err) { console.error(err); }
        }
    };

    const handleDeleteEmployee = async (id) => {
        if (window.confirm('Remove employee?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (response.ok) fetchEmployees();
            } catch (err) { console.error(err); }
        }
    };

    const handleLeaveStatusUpdate = async (id, status) => {
        try {
            const response = await fetch(`http://localhost:5000/api/leave/approve/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify({ status })
            });
            if (response.ok) fetchLeaves();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-100">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <header className="h-20 border-b border-slate-900 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-white capitalize">{activeTab} View</h2>
                    <div className="flex items-center gap-3 bg-slate-800/40 px-4 py-2 rounded-xl border border-slate-800">
                        <UserCircle className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm font-medium text-slate-300">{user?.name}</span>
                    </div>
                </header>

                <main className="p-8 max-w-7xl w-full mx-auto">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl shadow-xl shadow-indigo-900/10">
                                <h1 className="text-2xl font-bold text-white">Hello, {user?.name}! 👋</h1>
                                <p className="text-indigo-100 mt-1.5 text-sm">Monitor operations, approve requests and dispatch schedules seamlessly.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between"><div className="tracking-wide"><p className="text-xs font-semibold uppercase text-slate-500">Staff</p><h3 className="text-3xl font-black text-white mt-1">{stats.employees}</h3></div><div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-xl"><Users className="w-6 h-6" /></div></div>
                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between"><div className="tracking-wide"><p className="text-xs font-semibold uppercase text-slate-500">Pending Leaves</p><h3 className="text-3xl font-black text-amber-400 mt-1">{stats.leaves}</h3></div><div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-xl"><Clock className="w-6 h-6" /></div></div>
                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between"><div className="tracking-wide"><p className="text-xs font-semibold uppercase text-slate-500">Active Schedules</p><h3 className="text-3xl font-black text-emerald-400 mt-1">{stats.tasks}</h3></div><div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div></div>
                            </div>
                        </div>
                    )}

                    {/* Employees Tab */}
                    {activeTab === 'employees' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div><h3 className="text-xl font-bold text-white">Organization Roster</h3><p className="text-slate-400 text-sm">Manage or onboard internal employee profiles.</p></div>
                                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition"><Plus className="w-4 h-4" /> Add Employee</button>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                                <table className="w-full text-left border-collapse">
                                    <thead><tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold uppercase text-slate-400"><th className="p-4 pl-6">Name</th><th className="p-4">Email</th><th className="p-4 text-center">Designation</th><th className="p-4 pr-6 text-right">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
                                        {employees.map(emp => (
                                            <tr key={emp._id} className="hover:bg-slate-800/20 transition"><td className="p-4 pl-6 font-semibold text-white">{emp.name}</td><td className="p-4 text-slate-400">{emp.email}</td><td className="p-4 text-center"><span className="px-2.5 py-1 bg-slate-800 text-indigo-400 rounded-md text-xs font-medium border border-slate-700">Staff</span></td><td className="p-4 pr-6 text-right"><button onClick={() => handleDeleteEmployee(emp._id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Leaves Tab */}
                    {activeTab === 'leaves' && (
                        <div className="space-y-6">
                            <div><h3 className="text-xl font-bold text-white">Leave Requests Desk</h3><p className="text-slate-400 text-sm">Review employee absence inquiries.</p></div>
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                                <table className="w-full text-left border-collapse">
                                    <thead><tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold uppercase text-slate-400"><th className="p-4 pl-6">Employee</th><th className="p-4">Type & Reason</th><th className="p-4">Duration</th><th className="p-4 text-center">Status</th><th className="p-4 pr-6 text-right">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
                                        {leaves.map(leave => (
                                            <tr key={leave._id} className="hover:bg-slate-800/20 transition"><td className="p-4 pl-6"><p className="font-semibold text-white">{leave.employeeId?.name || 'Unknown'}</p></td><td className="p-4"><span className="text-xs bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">{leave.leaveType}</span><p className="text-xs text-slate-400 mt-1 max-w-xs truncate">"{leave.reason}"</p></td><td className="p-4 text-xs text-slate-400">{new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</td><td className="p-4 text-center"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : leave.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>{leave.status}</span></td><td className="p-4 pr-6 text-right">{leave.status === 'Pending' ? (<div className="flex gap-2 justify-end"><button onClick={() => handleLeaveStatusUpdate(leave._id, 'Approved')} className="p-1.5 bg-emerald-600/10 text-emerald-400 rounded-lg"><Check className="w-4 h-4" /></button><button onClick={() => handleLeaveStatusUpdate(leave._id, 'Rejected')} className="p-1.5 bg-rose-600/10 text-rose-400 rounded-lg"><X className="w-4 h-4" /></button></div>) : <span className="text-xs text-slate-600 italic">Resolved</span>}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC TASK BOARD TAB */}
                    {activeTab === 'tasks' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div><h3 className="text-xl font-bold text-white">Task Distribution Center</h3><p className="text-slate-400 text-sm">Assign workflows and audit progress limits.</p></div>
                                <button onClick={() => setShowTaskModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition"><Plus className="w-4 h-4" /> Create Task</button>
                            </div>

                            {/* Task Grid Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tasks.length === 0 ? (
                                    <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">No tasks active. Click "Create Task" to deploy.</div>
                                ) : (
                                    tasks.map(task => (
                                        <div key={task._id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${task.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-950 text-slate-400'}`}>{task.priority} Priority</span>
                                                    <button onClick={() => handleDeleteTask(task._id)} className="text-slate-500 hover:text-rose-400 p-1 transition"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                                <h4 className="text-base font-bold text-white mt-3">{task.title}</h4>
                                                <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">{task.description}</p>
                                            </div>
                                            
                                            <div className="border-t border-slate-800/60 mt-4 pt-4 space-y-3">
                                                <div className="flex items-center justify-between text-xs text-slate-400">
                                                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {new Date(task.deadline).toLocaleDateString()}</span>
                                                    <span className="font-semibold text-indigo-400">@{task.assignedTo?.name || 'Unassigned'}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40">
                                                    <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500">Progress</span>
                                                    <span className={`text-xs font-bold ${task.status === 'Completed' ? 'text-emerald-400' : task.status === 'In Progress' ? 'text-sky-400' : 'text-amber-400'}`}>{task.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* EMPLOYEE MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
                        <h3 className="text-lg font-bold text-white mb-4">Onboard Employee</h3>
                        <form onSubmit={handleAddEmployee} className="space-y-4">
                            <input type="text" required placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl text-sm" />
                            <input type="email" required placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl text-sm" />
                            <input type="password" required placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl text-sm" />
                            <button type="submit" className="w-full bg-indigo-600 py-2.5 text-sm font-semibold rounded-xl text-white">Complete Onboarding</button>
                        </form>
                    </div>
                </div>
            )}

            {/* STYLISH TASK ASSIGNMENT MODAL OVERLAY */}
            {showTaskModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                        <button onClick={() => setShowTaskModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
                        
                        <div className="flex gap-2.5 items-center mb-5">
                            <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
                            <h3 className="text-lg font-bold text-white">Deploy New Task</h3>
                        </div>

                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div><label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Task Heading</label><input type="text" required placeholder="Build Authentication API" value={taskData.title} onChange={e => setTaskData({...taskData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2 rounded-xl text-sm focus:outline-none focus:border-indigo-500" /></div>
                            <div><label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Task Description</label><textarea required rows="3" placeholder="Write standard instructions..." value={taskData.description} onChange={e => setTaskData({...taskData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2 rounded-xl text-sm focus:outline-none focus:border-indigo-500 resize-none" /></div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Assign To Staff</label>
                                    <select required value={taskData.assignedTo} onChange={e => setTaskData({...taskData, assignedTo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500">
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Priority Scale</label>
                                    <select value={taskData.priority} onChange={e => setTaskData({...taskData, priority: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500">
                                        <option value="Low">Low Priority</option>
                                        <option value="Medium">Medium Priority</option>
                                        <option value="High">High Priority</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div><label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Deadline Date</label><input type="date" required value={taskData.deadline} onChange={e => setTaskData({...taskData, deadline: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500" /></div>
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-sm transition mt-2 shadow-lg shadow-indigo-600/20">Deploy Schedule</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;