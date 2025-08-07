"use client";

 
import { FaPlus, FaPaperPlane } from "react-icons/fa";

interface NewsletterActionsProps {
  onAddSubscriber: () => void;
  onSendNewsletter: () => void;
  sendingNewsletter: boolean;
}

export default function NewsletterActions({ 
  onAddSubscriber, 
  onSendNewsletter, 
  sendingNewsletter 
}: NewsletterActionsProps) {
  return (
    <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Newsletter Management</h2>
          <p className="text-gray-400">Manage subscribers and send newsletters</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onAddSubscriber}
            className="px-4 py-2 bg-gradient-to-r from-purple-900/80 via-purple-700/80 to-purple-900/80 hover:from-purple-800/80 hover:via-purple-600/80 hover:to-purple-800/80 text-white font-bold rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Add Subscriber
          </button>
          
          <button
            onClick={onSendNewsletter}
            disabled={sendingNewsletter}
            className="px-4 py-2 bg-gradient-to-r from-green-900/80 via-green-700/80 to-green-900/80 hover:from-green-800/80 hover:via-green-600/80 hover:to-green-800/80 text-white font-bold rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            <FaPaperPlane className="w-4 h-4" />
            Send Newsletter
          </button>
        </div>
      </div>
    </div>
  );
}
