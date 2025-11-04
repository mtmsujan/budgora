import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    HomeIcon,
    WalletIcon,
    FolderIcon,
    TagIcon,
    ArrowRightOnRectangleIcon,
    ArrowLeftOnRectangleIcon,
    UserPlusIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    WalletIcon as WalletIconSolid,
    FolderIcon as FolderIconSolid,
    TagIcon as TagIconSolid,
} from '@heroicons/react/24/solid';

export default function Layout({ children }: { children: React.ReactNode }) {
    const page = usePage<PageProps>();
    const { auth } = page.props;
    const url = page.url;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        return url === path || url.startsWith(path + '/');
    };

    const NavLink = ({ 
        href, 
        icon: Icon, 
        iconSolid: IconSolid, 
        children, 
        method = 'get' as 'get' | 'post',
        onClick
    }: { 
        href: string; 
        icon: React.ComponentType<{ className?: string }>; 
        iconSolid: React.ComponentType<{ className?: string }>; 
        children: React.ReactNode;
        method?: 'get' | 'post';
        onClick?: () => void;
    }) => {
        const active = isActive(href);
        const handleClick = (e: React.MouseEvent) => {
            if (onClick) onClick();
            if (method === 'post') {
                e.preventDefault();
                router.post(href);
            }
        };

        return (
            <Link
                href={href}
                method={method}
                onClick={handleClick}
                className={`
                    group relative flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm
                    transition-all duration-300 ease-out
                    ${active
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
                    }
                `}
            >
                <div className={`
                    relative z-10 flex items-center justify-center transition-transform duration-300
                    ${active ? 'scale-110' : 'group-hover:scale-110'}
                `}>
                    {active ? (
                        <IconSolid className="w-5 h-5 text-white" />
                    ) : (
                        <Icon className="w-5 h-5 transition-colors text-slate-500 group-hover:text-indigo-600" />
                    )}
                </div>
                <span className="relative z-10">{children}</span>
            </Link>
        );
    };

    const mobileNavLinks = auth?.user ? [
        { href: '/dashboard', icon: HomeIcon, iconSolid: HomeIconSolid, label: 'Dashboard' },
        { href: '/accounts', icon: WalletIcon, iconSolid: WalletIconSolid, label: 'Accounts' },
        { href: '/account-groups', icon: FolderIcon, iconSolid: FolderIconSolid, label: 'Account Groups' },
        { href: '/categories', icon: TagIcon, iconSolid: TagIconSolid, label: 'Categories' },
    ] : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-lg shadow-slate-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                    <span className="text-white font-bold text-xl">B</span>
                                </div>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                                Budgora
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            {auth?.user ? (
                                <>
                                    <NavLink href="/dashboard" icon={HomeIcon} iconSolid={HomeIconSolid}>
                                        Dashboard
                                    </NavLink>
                                    <NavLink href="/accounts" icon={WalletIcon} iconSolid={WalletIconSolid}>
                                        Accounts
                                    </NavLink>
                                    <NavLink href="/account-groups" icon={FolderIcon} iconSolid={FolderIconSolid}>
                                        Groups
                                    </NavLink>
                                    <NavLink href="/categories" icon={TagIcon} iconSolid={TagIconSolid}>
                                        Categories
                                    </NavLink>
                                    <div className="h-8 w-px bg-slate-300 mx-2" />
                                    <Link
                                        href="/logout"
                                        method="post"
                                        className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 cursor-pointer"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                                        <span>Logout</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="group flex items-center gap-2 px-5 py-2.5 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-300"
                                    >
                                        <ArrowLeftOnRectangleIcon className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
                                    >
                                        <UserPlusIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                                        <span>Sign Up</span>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-xl">
                        <div className="px-4 py-4 space-y-2">
                            {auth?.user ? (
                                <>
                                    {mobileNavLinks.map((link) => (
                                        <NavLink
                                            key={link.href}
                                            href={link.href}
                                            icon={link.icon}
                                            iconSolid={link.iconSolid}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </NavLink>
                                    ))}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg cursor-pointer"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                        <span>Logout</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                                    >
                                        <UserPlusIcon className="w-5 h-5" />
                                        <span>Sign Up</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            <main>{children}</main>
        </div>
    );
}
