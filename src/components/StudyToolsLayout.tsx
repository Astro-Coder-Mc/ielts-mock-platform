import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BookText, Mic2, Keyboard, PenLine, MessageSquare } from 'lucide-react';

export default function StudyToolsLayout() {
  const navItems = [
    { to: '/study-tools/articles', icon: BookText, label: 'Articles' },
    { to: '/study-tools/shadowing', icon: Mic2, label: 'Shadowing' },
    { to: '/study-tools/typing', icon: Keyboard, label: 'Typing' },
    { to: '/study-tools/writing-samples', icon: PenLine, label: 'Writing Samples' },
    { to: '/study-tools/live-chat', icon: MessageSquare, label: 'Live Chat' },
  ];

  return (
    <div className="flex h-full max-w-7xl mx-auto w-full">
      <aside className="w-64 py-8 pr-8 flex flex-col">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-purple-600 shadow-sm border border-zinc-100'
                    : 'text-zinc-600 hover:bg-white/50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 py-8">
        <Outlet />
      </div>
    </div>
  );
}
