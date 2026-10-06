import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Scissors,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Mail,
  Trash2,
  Calendar,
  X,
  CheckCircle2,
  Save,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { CustomDesignRequest, CustomRequestStatus } from '../../types';

interface AdminCustomRequestsProps {
  requests: CustomDesignRequest[];
  onUpdateStatus: (id: string, status: CustomRequestStatus, adminNotes?: string) => Promise<void>;
  onDeleteRequest: (id: string) => Promise<void>;
}

const STATUSES: CustomRequestStatus[] = [
  'New',
  'Consultation Scheduled',
  'Sketches In Progress',
  'Approved',
  'In Production',
  'Completed',
  'Archived',
];

export const AdminCustomRequests: React.FC<AdminCustomRequestsProps> = ({
  requests,
  onUpdateStatus,
  onDeleteRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeRequest, setActiveRequest] = useState<CustomDesignRequest | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<CustomDesignRequest | null>(null);
  const [adminNotesDraft, setAdminNotesDraft] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.designType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.preferredFabric.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const openDossier = (req: CustomDesignRequest) => {
    setActiveRequest(req);
    setAdminNotesDraft(req.adminNotes || '');
  };

  const handleStatusChange = async (reqId: string, newStatus: CustomRequestStatus) => {
    try {
      await onUpdateStatus(reqId, newStatus);
      if (activeRequest && activeRequest.id === reqId) {
        setActiveRequest({ ...activeRequest, status: newStatus });
      }
    } catch (e) {
      console.error('Error changing status:', e);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeRequest) return;
    setIsSavingNotes(true);
    try {
      await onUpdateStatus(activeRequest.id, activeRequest.status, adminNotesDraft);
      setActiveRequest({ ...activeRequest, adminNotes: adminNotesDraft });
    } catch (e) {
      console.error('Error saving admin notes:', e);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getStatusBadge = (status: CustomRequestStatus) => {
    switch (status) {
      case 'New':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
      case 'Consultation Scheduled':
        return 'bg-blue-950/80 text-blue-400 border-blue-500/40';
      case 'Sketches In Progress':
        return 'bg-purple-950/80 text-purple-400 border-purple-500/40';
      case 'In Production':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/40';
      case 'Completed':
        return 'bg-stone-900 text-cream-100 border-emerald-400/50';
      default:
        return 'bg-stone-900 text-cream-200 border-white/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-cream-50">
          Haute Couture & Bespoke Commissions
        </h2>
        <p className="text-xs text-cream-200/70 mt-1">
          Review VIP customer custom design submissions, measurements, fabric selections, and consultation pipeline.
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
            placeholder="Search by Client Name, Email, Fabric, or Occasion..."
            className="w-full pl-10 pr-4 py-2 bg-[#041A13] border border-[#D4AF37]/30 rounded-lg text-xs text-cream-100 placeholder-cream-200/40 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4AF37]" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#041A13] border border-[#D4AF37]/30 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="All">All Pipeline Stages ({requests.length})</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-[#062319]/80 border border-[#D4AF37]/30 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-cream-200/90">
            <thead className="bg-[#041A13] border-b border-[#D4AF37]/30 text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
              <tr>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Garment Request</th>
                <th className="py-3.5 px-4">Fabric</th>
                <th className="py-3.5 px-4">Occasion</th>
                <th className="py-3.5 px-4">Target Date</th>
                <th className="py-3.5 px-4">Pipeline Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-light">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cream-200/50 italic">
                    No custom design requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-serif font-bold text-cream-100">{req.fullName}</p>
                        <p className="text-[11px] text-cream-200/60 font-mono">{req.email}</p>
                        <p className="text-[10px] text-cream-200/50">{req.phoneNumber}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                        {req.designType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-cream-100 font-medium">
                      {req.preferredFabric}
                    </td>

                    <td className="py-3.5 px-4 text-cream-200/80">
                      {req.occasion}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-cream-200/70 font-mono">
                      {req.targetDate || 'Not specified'}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value as CustomRequestStatus)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                          req.status
                        )} bg-[#041A13] focus:outline-none cursor-pointer`}
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st} className="bg-[#041A13] text-cream-100">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openDossier(req)}
                          className="px-2.5 py-1 bg-white/10 hover:bg-[#D4AF37] hover:text-[#041A13] text-[#D4AF37] border border-[#D4AF37]/30 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dossier</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRequestToDelete(req)}
                          className="p-1 text-cream-200/50 hover:text-red-400 rounded"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Request Dossier Modal */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#062319] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden text-cream-50"
          >
            {/* Header */}
            <div className="p-6 bg-[#041A13] border-b border-[#D4AF37]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                  Bespoke Commission Ref: {activeRequest.id}
                </span>
                <h3 className="font-serif text-xl font-bold text-cream-50 mt-0.5">
                  {activeRequest.fullName} • {activeRequest.designType}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveRequest(null)}
                className="text-cream-200/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#041A13] border border-[#D4AF37]/20 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#D4AF37] block font-semibold">
                    Client Contact
                  </span>
                  <p className="font-serif text-cream-100 text-sm font-semibold mt-0.5">
                    {activeRequest.fullName} ({activeRequest.gender})
                  </p>
                  <p className="text-cream-200/70 font-mono mt-0.5">{activeRequest.email}</p>
                  <p className="text-cream-200/70 font-mono mt-0.5">{activeRequest.phoneNumber}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-[#D4AF37] block font-semibold">
                    Commission Details
                  </span>
                  <p className="text-cream-100 mt-0.5">
                    Fabric: <strong>{activeRequest.preferredFabric}</strong>
                  </p>
                  <p className="text-cream-100 mt-0.5">
                    Occasion: <strong>{activeRequest.occasion}</strong>
                  </p>
                  <p className="text-cream-100 mt-0.5">
                    Target Date: <strong>{activeRequest.targetDate || 'Flexible'}</strong>
                  </p>
                </div>
              </div>

              {/* Measurements & Brief */}
              <div className="p-4 rounded-xl bg-[#041A13] border border-white/10 space-y-1.5 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                  Measurements & Creative Brief
                </span>
                <p className="text-cream-200/90 whitespace-pre-wrap leading-relaxed font-light">
                  {activeRequest.measurementsNotes || 'No specific measurements entered.'}
                </p>
              </div>

              {/* Inspiration Image */}
              {activeRequest.inspirationImageUrl && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                    Inspiration / Reference Photo
                  </span>
                  <div className="w-48 h-56 rounded-xl overflow-hidden border border-[#D4AF37]/40 bg-[#041A13]">
                    <img
                      src={activeRequest.inspirationImageUrl}
                      alt="Inspiration"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Admin Private Notes */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                  Private Atelier Notes (Internal Only)
                </span>
                <textarea
                  rows={3}
                  value={adminNotesDraft}
                  onChange={(e) => setAdminNotesDraft(e.target.value)}
                  placeholder="Record fitting milestones, fabric yardage, quotation sent, or bespoke details..."
                  className="w-full px-3 py-2 bg-[#041A13] border border-[#D4AF37]/40 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingNotes ? 'Saving Notes...' : 'Save Internal Notes'}</span>
                </button>
              </div>

              {/* Communication Links */}
              <div className="pt-2 flex flex-wrap gap-3 border-t border-white/10">
                <a
                  href={`https://wa.me/${activeRequest.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${activeRequest.fullName}, this is Dee Havilah Design Atelier regarding your bespoke ${activeRequest.designType} request.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect on WhatsApp</span>
                </a>

                <a
                  href={`mailto:${activeRequest.email}?subject=${encodeURIComponent(
                    `Dee Havilah Haute Couture - Bespoke Commission Inquiry (${activeRequest.designType})`
                  )}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-cream-100 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                  <span>Email Client</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {requestToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#062319] border border-red-500/50 rounded-2xl p-6 shadow-2xl text-cream-50">
            <h3 className="font-serif text-lg font-bold text-center text-cream-100">
              Delete Custom Design Request
            </h3>
            <p className="text-xs text-cream-200/80 text-center mt-2 font-light">
              Are you sure you want to remove the bespoke request from{' '}
              <strong className="text-white">{requestToDelete.fullName}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRequestToDelete(null)}
                className="px-4 py-2 border border-white/20 text-cream-200 text-xs uppercase tracking-wider rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onDeleteRequest(requestToDelete.id);
                  setRequestToDelete(null);
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg"
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
