import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 text-center flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
        <div>© 2026 Take Your Time. All rights reserved.</div>
        <div className="space-x-4 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          <a href="mailto:support@takeyourtime.app" className="hover:text-slate-900 transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
