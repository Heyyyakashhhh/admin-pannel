
import React from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-6 relative animate-fade-in-up">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
          <h2 className="text-2xl font-bold text-cyan-400">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <CloseIcon className="w-7 h-7" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// Add keyframes for modal animation in a style tag in index.html, or here if needed.
// For simplicity, let's assume a simple fade-in effect can be managed with Tailwind classes.
// But for a custom animation `animate-fade-in-up`, you'd need to define it in tailwind.config.js
// or add a style tag to your index.html. Let's add it here conceptually.
// The code will work but without the animation. 
// A user could add this to their tailwind config:
/*
theme: {
  extend: {
    keyframes: {
      'fade-in-up': {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
    animation: {
      'fade-in-up': 'fade-in-up 0.3s ease-out',
    },
  },
},
*/
   