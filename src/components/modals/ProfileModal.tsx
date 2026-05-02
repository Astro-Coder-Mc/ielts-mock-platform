import React from 'react';
import Modal from './Modal';
import { useAppStore } from '../../store/useAppStore';

export default function ProfileModal() {
  const { isProfileModalOpen, setProfileModalOpen } = useAppStore();

  return (
    <Modal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} title="Profile">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">First name</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </span>
            <input type="text" defaultValue="Jamshid" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Last name</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </span>
            <input type="text" defaultValue="Usmonov" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">Gender</label>
          <div className="flex gap-4">
            <label className="flex-1 flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-zinc-50">
              <input type="radio" name="gender" value="male" defaultChecked className="text-purple-600 focus:ring-purple-500" />
              <span className="text-sm font-medium text-zinc-700">Male</span>
            </label>
            <label className="flex-1 flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-zinc-50">
              <input type="radio" name="gender" value="female" className="text-purple-600 focus:ring-purple-500" />
              <span className="text-sm font-medium text-zinc-700">Female</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Target score</label>
          <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white">
            <option>9</option>
            <option>8.5</option>
            <option>8</option>
            <option>7.5</option>
            <option>7</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Current level</label>
          <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white">
            <option>UPPER_INTERMEDIATE</option>
            <option>ADVANCED</option>
            <option>INTERMEDIATE</option>
          </select>
        </div>

        <button className="w-full py-3 mt-4 rounded-lg text-white font-medium bg-gradient-to-r from-[#a855f7] to-[#7c3aed] hover:opacity-90 transition-opacity">
          Save
        </button>
      </div>
    </Modal>
  );
}
