import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Headphones, BookOpen, PenTool, Mic, Layers, Info } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Badge } from './ui/badge';

export default function PracticeLayout() {
  const { examType } = useAppStore();

  const navItems = [
    { to: '/practice/listening', icon: Headphones, label: 'Listening' },
    { to: '/practice/reading', icon: BookOpen, label: 'Reading' },
    { to: '/practice/writing', icon: PenTool, label: 'Writing' },
    { to: '/practice/speaking', icon: Mic, label: 'Speaking' },
    { to: '/practice/full-mock', icon: Layers, label: 'Full Mock' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-full max-w-7xl mx-auto w-full px-4 md:px-8">
      {/* Sidebar */}
      <aside className="w-full md:w-72 py-4 md:py-8 md:pr-8 flex flex-col shrink-0 border-r-0 md:border-r border-zinc-100 dark:border-zinc-800">
        <div className="mb-8 hidden md:block">
          <h2 className="text-xl font-bold tracking-tight px-4">Practice</h2>
          <p className="text-sm text-zinc-500 px-4 mt-1">Siz tanlagan: <span className="text-purple-600 font-bold">{examType}</span></p>
        </div>
        
        <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 translate-x-1'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm md:text-[15px]">{item.label}</span>
              {item.label === 'Full Mock' && (
                <Badge className="ml-auto bg-amber-400 text-amber-900 border-none text-[10px] hidden lg:block">HOT</Badge>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-8 hidden md:block space-y-4">
          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-4 border border-purple-100 dark:border-purple-800 flex gap-3 text-purple-900 dark:text-purple-100">
            <Info className="w-5 h-5 shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">
              Don't forget to use headphones for listening tests!
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 py-4 md:py-8 min-w-0 md:pl-8"
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
