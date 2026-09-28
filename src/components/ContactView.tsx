import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  Building,
  HelpCircle,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import { useToast } from './Toast';

interface ContactDesk {
  name: string;
  department: string;
  location: string;
  phone: string;
  email: string;
  hours: string;
  status: 'Open' | 'Closes at 10 PM' | '24/7 Available';
}

const CAMPUS_DESKS: ContactDesk[] = [
  {
    name: 'Main Library Circulation & Lost Property Hub',
    department: 'University Libraries & Study Facilities',
    location: 'William Knox Building, 1st Floor Central Desk',
    phone: '(555) 880-4100',
    email: 'library-lostfound@university.edu',
    hours: 'Mon – Fri: 7:30 AM – 11:00 PM | Sat – Sun: 9:00 AM – 9:00 PM',
    status: 'Open',
  },
  {
    name: 'Campus Safety & Physical Security HQ',
    department: 'Division of Public Safety',
    location: 'North Campus Operations Center, Suite 102',
    phone: '(555) 880-2222',
    email: 'campussafety@university.edu',
    hours: '24 Hours / 7 Days a Week (Dispatch & Safe Custody)',
    status: '24/7 Available',
  },
  {
    name: 'Student Union Information & Concierge Desk',
    department: 'Student Affairs & Campus Life',
    location: 'Student Union, Ground Floor Atrium',
    phone: '(555) 880-3350',
    email: 'union-help@university.edu',
    hours: 'Mon – Sun: 8:00 AM – 10:00 PM',
    status: 'Closes at 10 PM',
  },
  {
    name: 'Athletics & Recreation Welcome Center',
    department: 'Campus Recreation & Sports Facilities',
    location: 'Athletics Pavilion, Main Entrance Lobby',
    phone: '(555) 880-5580',
    email: 'rec-frontdesk@university.edu',
    hours: 'Mon – Fri: 6:00 AM – 10:00 PM | Sat – Sun: 8:00 AM – 8:00 PM',
    status: 'Open',
  },
];

interface ContactViewProps {
  onReportClick?: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onReportClick }) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [inquiryType, setInquiryType] = useState('Missing Belonging Assistance');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('error', 'Missing Information', 'Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast(
        'success',
        'Inquiry Transmitted',
        'Campus Lost & Found services has received your message and will respond via campus email.'
      );
    }, 700);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setStudentId('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1836] via-[#0f172a] to-[#080d1a] border border-cyan-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 mb-4">
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campus Lost &amp; Found Assistance Directory</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact Campus Recovery &amp; Safety
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Need urgent help finding missing property, reporting high-value tech, or scheduling an in-person physical collection from a campus intake vault? Reach our team and building recovery desks.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-[#091124]/80 px-3.5 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Emergency Dispatch: <strong>(555) 880-2222</strong> (24/7)</span>
            </div>
            <div className="flex items-center gap-2 bg-[#091124]/80 px-3.5 py-1.5 rounded-xl border border-white/10">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>General Inquiries: <strong className="text-cyan-300 font-mono">lostfound@university.edu</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Direct Message Form + Campus Intake Desks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Contact Form */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span>Send a Direct Message</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Our campus staff coordinator responds within 1-2 business hours.
              </p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Agents On Duty" />
          </div>

          {submitted ? (
            <div className="p-8 text-center rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Message Dispatched!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Your inquiry has been routed to the campus lost &amp; found triage team. A confirmation receipt has been sent to <strong>{email}</strong>.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Your Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Smith"
                    className="w-full px-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    University Email <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full px-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Campus ID Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 984021"
                    className="w-full px-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Inquiry Type <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Missing Belonging Assistance">Missing Belonging Assistance</option>
                    <option value="Vault Item Pickup Appointment">Vault Item Pickup Appointment</option>
                    <option value="High-Value Tech Verification">High-Value Tech Verification</option>
                    <option value="Turn-In Location Query">Turn-In Location Query</option>
                    <option value="Other Campus Safety Matter">Other Campus Safety Matter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Detailed Message <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your item, incident time, reference ID if known, or how we can assist you..."
                  className="w-full p-3 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Secure official communication</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 rounded-xl shadow-lg shadow-cyan-900/30 active:scale-95 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Transmitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Physical Drop-Off & Pickup Desks */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-cyan-400" />
              <span>Physical Intake &amp; Claim Desks</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Official campus vaults where turned-in valuables are physically secured.
            </p>
          </div>

          <div className="space-y-3.5">
            {CAMPUS_DESKS.map((desk, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0f172a]/90 backdrop-blur-md border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {desk.name}
                    </h3>
                    <p className="text-xs text-cyan-400 font-medium">{desk.department}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      desk.status === '24/7 Available'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                    }`}
                  >
                    {desk.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{desk.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{desk.hours}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <a
                    href={`tel:${desk.phone}`}
                    className="flex items-center gap-1.5 text-slate-300 hover:text-white font-mono"
                  >
                    <Phone className="w-3 h-3 text-cyan-400" />
                    <span>{desk.phone}</span>
                  </a>

                  <a
                    href={`mailto:${desk.email}`}
                    className="flex items-center gap-1.5 text-cyan-400 hover:underline font-mono"
                  >
                    <Mail className="w-3 h-3 text-cyan-400" />
                    <span>{desk.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Helpful Guidelines Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1836] to-[#0f172a] border border-cyan-500/20 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>ID Verification Required</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Please bring your active University Student or Staff ID Card along with a government-issued photo ID when collecting secured valuables.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-white">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>90-Day Retention Policy</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Unclaimed items are retained in central security custody for 90 calendar days before proceeding through the university surplus donation protocol.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-white">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Critical Items (Passports &amp; Meds)</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Passports, prescription medications, and banking credentials are transferred immediately to Campus Safety HQ for secured lockdown.
          </p>
        </div>
      </div>
    </div>
  );
};
