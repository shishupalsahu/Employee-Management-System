import React, { useState, useEffect, useContext, useRef } from 'react';
import { Bell, Check, Circle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const NotificationBell = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        if (user?.token) {
            fetchNotifications();
            // Optional: Auto-refresh notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('https://ems-backend-zui4.onrender.com/api/notifications', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (response.ok) setNotifications(data);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    const markAsRead = async (id) => {
    try {
        const response = await fetch(`https://ems-backend-zui4.onrender.com/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => n._id === id ? { ...n, isRead: true } : n)
                );
            }
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Trigger Icon */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative p-2.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-slate-400 hover:text-indigo-400 group focus:outline-none"
            >
                <Bell className="w-5 h-5 group-hover:animate-swing" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Card */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white">Live Activity Feed</h4>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {unreadCount} New
                        </span>
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/40 custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-500">
                                No recent activity alerts logged.
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div 
                                    key={notif._id} 
                                    className={`p-3.5 text-left transition flex gap-3 items-start ${!notif.isRead ? 'bg-indigo-600/5 hover:bg-indigo-600/10' : 'hover:bg-slate-800/40'}`}
                                >
                                    <div className="mt-1">
                                        {!notif.isRead ? (
                                            <Circle className="w-2.5 h-2.5 fill-indigo-500 text-indigo-500 animate-pulse" />
                                        ) : (
                                            <Check className="w-3 h-3 text-slate-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-semibold ${!notif.isRead ? 'text-white' : 'text-slate-400'}`}>
                                            {notif.title}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed break-words">
                                            {notif.message}
                                        </p>
                                        <span className="text-[9px] text-slate-500 block mt-1.5 font-medium">
                                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {!notif.isRead && (
                                        <button 
                                            onClick={() => markAsRead(notif._id)} 
                                            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wide shrink-0 transition"
                                        >
                                            Dismiss
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;