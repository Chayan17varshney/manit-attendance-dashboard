import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';

const ServicesLayout: React.FC = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const services = [
        {
            name: 'Department Management',
            path: '/admin/services/department',
            icon: <BusinessIcon className="w-8 h-8" />,
            description: 'Manage academic departments and faculty'
        },
        {
            name: 'Course Management',
            path: '/admin/services/course',
            icon: <MenuBookIcon className="w-8 h-8" />,
            description: 'Handle course creation and curriculum'
        },
        {
            name: 'Session Management',
            path: '/admin/services/session',
            icon: <CalendarTodayIcon className="w-8 h-8" />,
            description: 'Schedule and organize academic sessions'
        },
        {
            name: 'Branch Management',
            path: '/admin/services/branch',
            icon: <AccountTreeIcon className="w-8 h-8" />,
            description: 'Coordinate multiple campus branches'
        },
        {
            name: 'Semester Configuration',
            path: '/admin/services/semester',
            icon: <SettingsIcon className="w-8 h-8" />,
            description: 'Configure semester settings and timelines'
        },
        {
            name: 'Student Management',
            path: '/admin/services/student',
            icon: <SchoolIcon className="w-8 h-8" />,
            description: 'Handle student records and enrollment'
        },
        {
            name: 'User Management',
            path: '/admin/services/users',
            icon: <PeopleIcon className="w-8 h-8" />,
            description: 'Manage user accounts and permissions'
        },
        {
            name: 'Reports',
            path: '/admin/services/reports',
            icon: <AssessmentIcon className="w-8 h-8" />,
            description: 'Generate and view institutional reports'
        },
    ];

    return (
        <div className="container mx-auto px-4 py-6 sm:py-8">
            <h1 className="text-3xl font-bold mb-3 text-blue-800 drop-shadow-md">Administrative Services</h1>
            <p className="text-gray-600 mb-8 max-w-3xl">Manage your educational institution efficiently with our comprehensive administrative tools</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {services.map((service) => (
                    <Link
                        key={service.path}
                        to={service.path}
                        className={`group p-5 sm:p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${currentPath === service.path
                            ? 'bg-blue-50 border-2 border-blue-500 shadow-md shadow-blue-200'
                            : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-blue-200/50 shadow'
                            }`}
                        aria-label={`Go to ${service.name}`}
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <div className={`p-3 rounded-full ${currentPath === service.path
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-500'
                                } transition-colors duration-300`}>
                                {service.icon}
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">{service.name}</h2>
                                <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{service.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ServicesLayout;