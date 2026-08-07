import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotifications } from './hooks/useNotifications';

export default function NotificationMenu() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/dashboard/notifications')}
        className="flex items-center justify-center text-primary relative p-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer pointer-events-auto"
        title="الإشعارات"
      >
        <Bell size={21} className={`${unreadCount > 0 ? 'text-primary animate-[wiggle_1s_ease-in-out_infinite]' : 'text-gray-500 dark:text-gray-400'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -end-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse z-10">
            {unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}