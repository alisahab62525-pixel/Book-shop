import React from 'react';
import { Link } from 'react-router-dom';
import { BookX, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-500 flex items-center justify-center">
        <BookX className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-editorial font-bold text-slate-900 dark:text-white">
        404 - Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
        The page, notebook product, or directory you requested does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1b3022] hover:bg-[#25422f] text-white rounded-lg text-xs font-semibold"
      >
        <span>Return to Home</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
