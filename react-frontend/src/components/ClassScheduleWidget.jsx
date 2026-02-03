import React, { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import '../styles/Dashboard.css';

export function ClassScheduleWidget({ userRole, classes }) {
    const [view, setView] = useState('today');

    // Helper to get day name
    const getDayName = (offset = 0) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const d = new Date();
        d.setDate(d.getDate() + offset);
        return days[d.getDay()];
    };

    const targetDay = getDayName(view === 'today' ? 0 : 1);

    // Filter classes for the target day
    const filteredClasses = classes.filter(c => c.days.includes(targetDay));

    return (
        <div className="card p-6 mt-6">
            <div className="flex-between-center mb-4">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Calendar size={20} className="text-purple-600" />
                        Class Schedule
                    </h3>
                    <p className="text-sm text-gray-500">
                        {view === 'today' ? "Today's Classes" : "Tomorrow's Classes"} ({targetDay})
                    </p>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setView('today')}
                        className={`px-4 py-1.5 text-sm rounded-md transition-all ${view === 'today' ? 'bg-white shadow-sm text-purple-700 font-medium' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setView('tomorrow')}
                        className={`px-4 py-1.5 text-sm rounded-md transition-all ${view === 'tomorrow' ? 'bg-white shadow-sm text-purple-700 font-medium' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Tomorrow
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls, index) => (
                        <div key={index} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-16 flex-shrink-0 text-center mr-4">
                                <div className="text-sm font-bold text-gray-800">{cls.startTime}</div>
                                <div className="text-xs text-gray-500">to</div>
                                <div className="text-sm text-gray-600">{cls.endTime}</div>
                            </div>

                            <div className="flex-1 border-l pl-4 border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{cls.courseName}</h4>
                                        <div className="text-sm text-gray-600">{cls.courseCode} • {cls.type || 'Lecture'}</div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {cls.status || 'Scheduled'}
                                    </span>
                                </div>

                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {cls.room} ({cls.building})
                                    </div>
                                    {userRole === 'student' && (
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {cls.instructor}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                        <p>No classes scheduled for {view === 'today' ? 'today' : 'tomorrow'}.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
