import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

export function ClassScheduleWidget({ userRole, classes }) {
    const [view, setView] = useState('today');

    const getDayName = (offset = 0) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const d = new Date();
        d.setDate(d.getDate() + offset);
        return days[d.getDay()];
    };

    const targetDay = getDayName(view === 'today' ? 0 : 1);
    const filteredClasses = classes.filter(c => c.days?.includes(targetDay));

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
            border: '1px solid #e5e7eb',
            padding: '24px',
            marginTop: '24px',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                        <Calendar size={20} color="#7c3aed" />
                        Class Schedule
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
                        {view === 'today' ? "Today's Classes" : "Tomorrow's Classes"} ({targetDay})
                    </p>
                </div>
                <div style={{
                    display: 'flex',
                    background: '#f3f4f6',
                    borderRadius: '10px',
                    padding: '3px',
                }}>
                    <button
                        onClick={() => setView('today')}
                        style={{
                            padding: '6px 16px',
                            fontSize: '0.85rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: view === 'today' ? '600' : '400',
                            background: view === 'today' ? 'white' : 'transparent',
                            color: view === 'today' ? '#7c3aed' : '#6b7280',
                            boxShadow: view === 'today' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setView('tomorrow')}
                        style={{
                            padding: '6px 16px',
                            fontSize: '0.85rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: view === 'tomorrow' ? '600' : '400',
                            background: view === 'tomorrow' ? 'white' : 'transparent',
                            color: view === 'tomorrow' ? '#7c3aed' : '#6b7280',
                            boxShadow: view === 'tomorrow' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Tomorrow
                    </button>
                </div>
            </div>

            {/* Class List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'stretch',
                            padding: '16px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            transition: 'all 0.2s ease',
                            cursor: 'default',
                            background: '#fafafa',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#f3f0ff'; e.currentTarget.style.borderColor = '#c4b5fd'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                        >
                            {/* Time Column */}
                            <div style={{
                                width: '72px',
                                flexShrink: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '16px',
                                borderRight: '2px solid #e5e7eb',
                                paddingRight: '16px',
                            }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937' }}>{cls.startTime}</span>
                                <span style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '2px 0' }}>to</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#6b7280' }}>{cls.endTime}</span>
                            </div>

                            {/* Details Column */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>{cls.courseName}</h4>
                                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{cls.courseCode} • {cls.type || 'Lecture'}</span>
                                    </div>
                                    <span style={{
                                        padding: '3px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.72rem',
                                        fontWeight: '600',
                                        whiteSpace: 'nowrap',
                                        background: cls.status === 'Cancelled' ? '#fef2f2' : '#ecfdf5',
                                        color: cls.status === 'Cancelled' ? '#dc2626' : '#059669',
                                        border: cls.status === 'Cancelled' ? '1px solid #fecaca' : '1px solid #a7f3d0',
                                    }}>
                                        {cls.status || 'Scheduled'}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#6b7280' }}>
                                        <MapPin size={14} color="#9ca3af" />
                                        <span>{cls.room}{cls.building ? ` (${cls.building})` : ''}</span>
                                    </div>
                                    {userRole === 'student' && cls.instructor && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#6b7280' }}>
                                            <User size={14} color="#9ca3af" />
                                            <span>{cls.instructor}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '32px 16px',
                        color: '#9ca3af',
                        background: '#f9fafb',
                        borderRadius: '12px',
                        border: '1px dashed #d1d5db',
                    }}>
                        <Calendar size={28} color="#d1d5db" style={{ margin: '0 auto 8px' }} />
                        <p style={{ margin: 0 }}>No classes scheduled for {view === 'today' ? 'today' : 'tomorrow'} ({targetDay}).</p>
                    </div>
                )}
            </div>
        </div>
    );
}
