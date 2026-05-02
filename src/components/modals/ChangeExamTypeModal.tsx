import React, { useState } from 'react';
import Modal from './Modal';
import { useAppStore } from '../../store/useAppStore';
import { Rocket, Sparkles } from 'lucide-react';

export default function ChangeExamTypeModal() {
  const { isExamTypeModalOpen, setExamTypeModalOpen, examType, setExamType } = useAppStore();
  const [selectedType, setSelectedType] = useState(examType);

  const handleSave = () => {
    setExamType(selectedType);
    setExamTypeModalOpen(false);
  };

  return (
    <Modal isOpen={isExamTypeModalOpen} onClose={() => setExamTypeModalOpen(false)} title="Change exam type">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* IELTS Card */}
          <button 
            onClick={() => setSelectedType('IELTS')}
            className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
              selectedType === 'IELTS' ? 'ring-2 ring-offset-2 ring-red-500' : 'opacity-70 hover:opacity-100'
            }`}
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 mb-8">
                <Rocket className="w-4 h-4" />
              </div>
              <p className="text-white/90 text-sm font-medium mb-1">Academic / General</p>
              <h3 className="text-white text-3xl font-bold">IELTS</h3>
            </div>
          </button>

          {/* CEFR Card */}
          <button 
            onClick={() => setSelectedType('CEFR')}
            className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
              selectedType === 'CEFR' ? 'ring-2 ring-offset-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
            }`}
            style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-500 mb-8">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-white/90 text-sm font-medium mb-1">B1, B2, C1 levels</p>
              <h3 className="text-white text-3xl font-bold">CEFR</h3>
            </div>
          </button>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#a855f7] to-[#7c3aed] hover:opacity-90 transition-opacity"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
