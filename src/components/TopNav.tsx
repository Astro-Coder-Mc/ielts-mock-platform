import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Headphones, ChevronDown, User, Lock, Layers, LogOut, Menu, X, Coins, Terminal, LayoutGrid, Cpu, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './ui/button';

export default function TopNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { coins, setProfileModalOpen, setPasswordModalOpen, setExamTypeModalOpen, user, logout } = useAppStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutGrid },
    { to: '/practice', label: 'Practice', icon: Cpu },
    { to: '/study-tools', label: 'Analytics', icon: Terminal },
    { to: '/billing', label: 'Billing', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-50 font-sans shadow-sm">
      <div className="flex items-center gap-10">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-[#141414] hover:bg-[#141414]/5"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
            S
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-bold tracking-tight text-zinc-900 leading-none">ScoreUp</span>
            <span className="text-[10px] font-medium text-zinc-400">IELTS Preparation</span>
          </div>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`
              }
            >
              <link.icon className="w-3 h-3 opacity-50" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Coins Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100">
          <Coins className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          <span className="font-bold text-sm text-amber-700">{coins}</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900 rounded-full">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        <div className="h-4 w-px bg-zinc-200 mx-2 hidden sm:block" />

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1 md:pr-2 rounded-full hover:bg-zinc-50 transition-all border border-zinc-100"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              {(user?.username || 'J').charAt(0)}
            </div>
            <span className="font-semibold text-zinc-700 text-sm hidden md:block">{user?.username || 'Jamshid'}</span>
            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute right-0 mt-3 w-64 bg-white border border-zinc-100 shadow-xl rounded-2xl py-2 z-50 overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Student Profile</p>
                  <p className="text-sm font-bold text-zinc-900">{user?.username || 'Jamshid'}</p>
                  <p className="text-xs text-zinc-500">{user?.phone || 'Not linked'}</p>
                </div>
                <div className="p-2 space-y-0.5">
                  {[
                    { label: 'Profile Settings', icon: User, action: () => setProfileModalOpen(true) },
                    { label: 'Security', icon: Lock, action: () => setPasswordModalOpen(true) },
                    { label: 'Exam Configuration', icon: Layers, action: () => setExamTypeModalOpen(true) },
                    ...(user?.isAdmin ? [{ label: 'Admin Panel', icon: ShieldCheck, action: () => navigate('/admin') }] : []),
                  ].map((item, i) => (
                    <button 
                      key={i}
                      onClick={() => { item.action(); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      <item.icon className="w-4 h-4 opacity-70" />
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="h-px bg-zinc-100 my-1 mx-2"></div>
                <div className="p-2">
                  <button 
                    onClick={() => { logout(); setIsDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-16 left-0 w-full bg-white border-b border-zinc-200 shadow-2xl md:hidden overflow-hidden z-40"
          >
            <div className="p-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-5 py-4 rounded-2xl text-sm font-bold tracking-tight transition-all flex items-center gap-4 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
