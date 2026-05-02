import React, { useEffect, useState } from 'react';
import { AlertTriangle, Maximize } from 'lucide-react';

interface AntiCheatWrapperProps {
  children: React.ReactNode;
  onTerminate: () => void;
}

export default function AntiCheatWrapper({ children, onTerminate }: AntiCheatWrapperProps) {
  const [cheatWarnings, setCheatWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const MAX_WARNINGS = 3;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatWarnings((prev) => {
          const newWarnings = prev + 1;
          if (newWarnings >= MAX_WARNINGS) {
            onTerminate();
          } else {
            alert(`Ogohlantirish! Test vaqtida boshqa oynaga o'tish taqiqlangan. Bu ${newWarnings}-ogohlantirish.`);
          }
          return newWarnings;
        });
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onTerminate]);

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  if (!isFullscreen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-zinc-50 rounded-3xl border border-zinc-200 p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-6" />
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2">
          Testni boshlash uchun to'liq ekran rejimiga o'ting
        </h2>
        <p className="text-zinc-500 max-w-md mb-8">
          Anti-Cheat tizimi faollashgan. Test vaqtida boshqa oynaga o'tish yoki to'liq ekrandan chiqish qoidabuzarlik hisoblanadi.
        </p>
        <button
          onClick={requestFullscreen}
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors"
        >
          <Maximize className="w-5 h-5" />
          To'liq ekranga o'tish
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {cheatWarnings > 0 && (
        <div className="absolute top-4 right-4 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 z-50 shadow-sm border border-red-200">
          <AlertTriangle className="w-4 h-4" />
          Ogohlantirishlar: {cheatWarnings}/{MAX_WARNINGS}
        </div>
      )}
      {children}
    </div>
  );
}
