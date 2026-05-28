import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { notification, toastKey } = useApp();

  if (!notification) return null;

  return (
    <div
      key={toastKey}
      className={`fixed bottom-6 right-6 z-50 flex items-center p-4 rounded-2xl shadow-2xl animate-toast border ${
        notification.type === 'error'
          ? 'bg-rose-950/95 text-rose-100 border-rose-800/50 backdrop-blur-md'
          : 'bg-emerald-950/95 text-emerald-100 border-emerald-800/50 backdrop-blur-md'
      }`}
      style={{ minWidth: '300px' }}
    >
      <div className="text-xs font-extrabold tracking-wide flex items-center space-x-3 w-full">
        <span className="text-base">{notification.type === 'error' ? '❌' : '✅'}</span>
        <span className="flex-1 leading-normal">{notification.message}</span>
      </div>
    </div>
  );
}
