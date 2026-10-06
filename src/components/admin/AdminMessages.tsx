import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  MessageCircle,
  X,
  Reply,
} from 'lucide-react';
import { ContactMessage } from '../../types';

interface AdminMessagesProps {
  messages: ContactMessage[];
  onToggleRead: (id: string, isRead: boolean) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({
  messages,
  onToggleRead,
  onDeleteMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Unread' | 'Read'>('All');
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === 'All'
        ? true
        : filterType === 'Unread'
        ? !m.isRead
        : m.isRead;

    return matchesSearch && matchesFilter;
  });

  const handleOpenMessage = async (msg: ContactMessage) => {
    setActiveMessage(msg);
    if (!msg.isRead) {
      await onToggleRead(msg.id, true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-cream-50">
          Client Correspondence & Inquiries
        </h2>
        <p className="text-xs text-cream-200/70 mt-1">
          Review salon inquiries, bridal consultation bookings, and international shipping questions.
        </p>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-[#062319]/80 border border-[#D4AF37]/30 rounded-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cream-200/50 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries by client name, email, or keywords..."
            className="w-full pl-10 pr-4 py-2 bg-[#041A13] border border-[#D4AF37]/30 rounded-lg text-xs text-cream-100 placeholder-cream-200/40 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4AF37]" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-[#041A13] border border-[#D4AF37]/30 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="All">All Inquiries ({messages.length})</option>
            <option value="Unread">
              Unread ({messages.filter((m) => !m.isRead).length})
            </option>
            <option value="Read">Read ({messages.filter((m) => m.isRead).length})</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-white/5 font-light">
          {filteredMessages.length === 0 ? (
            <div className="py-12 text-center text-cream-200/50 italic text-xs">
              No inquiries found matching criteria.
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.03] transition-colors ${
                  !msg.isRead ? 'bg-[#0B3B2C]/30 border-l-4 border-[#D4AF37]' : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                      !msg.isRead
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                        : 'bg-[#041A13] border-white/10 text-cream-200/50'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif text-sm font-bold text-cream-100">
                        {msg.name}
                      </span>
                      {!msg.isRead && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider bg-[#D4AF37] text-[#041A13]">
                          New
                        </span>
                      )}
                      <span className="text-[11px] text-cream-200/50 font-mono">
                        {msg.email}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#D4AF37]">
                      {msg.subject || 'General Inquiry'}
                    </p>

                    <p className="text-xs text-cream-200/80 line-clamp-2 max-w-2xl font-light">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-[10px] text-cream-200/50 font-mono">
                    {new Date(msg.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onToggleRead(msg.id, !msg.isRead)}
                      className="p-1.5 text-cream-200/60 hover:text-[#D4AF37] hover:bg-white/5 rounded"
                      title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${msg.isRead ? 'text-emerald-400' : 'text-cream-200/40'}`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessageToDelete(msg)}
                      className="p-1.5 text-cream-200/60 hover:text-red-400 hover:bg-white/5 rounded"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Reader Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#062319] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden text-cream-50"
          >
            <div className="p-6 bg-[#041A13] border-b border-[#D4AF37]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                  Atelier Salon Inquiry
                </span>
                <h3 className="font-serif text-lg font-bold text-cream-100">
                  {activeMessage.subject || 'Client Message'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveMessage(null)}
                className="text-cream-200/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-[#041A13] rounded-xl border border-[#D4AF37]/20 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-serif font-bold text-sm text-cream-100">
                    {activeMessage.name}
                  </span>
                  <span className="text-cream-200/50 font-mono text-[10px]">
                    {new Date(activeMessage.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-cream-200/80 font-mono">Email: {activeMessage.email}</p>
                {activeMessage.phone && (
                  <p className="text-cream-200/80 font-mono">Phone: {activeMessage.phone}</p>
                )}
              </div>

              <div className="p-4 bg-[#041A13] rounded-xl border border-white/10 text-xs text-cream-200/90 leading-relaxed whitespace-pre-wrap font-light">
                {activeMessage.message}
              </div>

              <div className="pt-2 flex flex-wrap gap-3 border-t border-white/10">
                <a
                  href={`mailto:${activeMessage.email}?subject=${encodeURIComponent(
                    `Re: ${activeMessage.subject || 'Inquiry regarding Dee Havilah Design'}`
                  )}`}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C378] text-[#041A13] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>

                {activeMessage.phone && (
                  <a
                    href={`https://wa.me/${activeMessage.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${activeMessage.name}, thank you for reaching out to Dee Havilah Design Atelier.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#062319] border border-red-500/50 rounded-2xl p-6 shadow-2xl text-cream-50">
            <h3 className="font-serif text-lg font-bold text-center text-cream-100">
              Delete Message
            </h3>
            <p className="text-xs text-cream-200/80 text-center mt-2 font-light">
              Are you sure you want to remove the message from{' '}
              <strong className="text-white">{messageToDelete.name}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMessageToDelete(null)}
                className="px-4 py-2 border border-white/20 text-cream-200 text-xs uppercase tracking-wider rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onDeleteMessage(messageToDelete.id);
                  setMessageToDelete(null);
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
