import React from 'react';
import { Calendar, Users, Building, MapPin, Star, ShieldCheck, Download, Moon, Mail, RefreshCw } from 'lucide-react';

interface NavbarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onRunBatch: () => void;
  onTriggerReminders: () => void;
  onResetData: () => void;
  onDownloadZip: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onRunBatch,
  onTriggerReminders,
  onResetData,
  onDownloadZip
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-lg tracking-tight">EVENTFORCE</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Naan Mudhalvan CRM</span>
        </div>
        <p className="text-xs text-slate-500">Event Planner Solutions • Enterprise Cloud Architecture</p>
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        {/* Role Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span className="text-slate-600 font-medium">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="bg-transparent font-semibold text-blue-700 outline-none cursor-pointer"
          >
            <option value="Event Admin">Event Admin (Full)</option>
            <option value="Event Coordinator">Event Coordinator</option>
            <option value="Vendor Manager">Vendor Manager</option>
            <option value="Client">Client (Ananya Pandey)</option>
          </select>
        </div>

        {/* Nightly Batch Trigger (Apex BatchCompleteEvents) */}
        <button
          onClick={onRunBatch}
          title="Simulate Daily Batch Apex (BatchCompleteEvents) to mark past events Completed"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition"
        >
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
          Nightly Batch
        </button>

        {/* 3-Day Reminder Flow */}
        <button
          onClick={onTriggerReminders}
          title="Trigger Salesforce Record-Triggered Flow (3-Day Reminder)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
        >
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          3-Day Flow
        </button>

        {/* Reset Database */}
        <button
          onClick={onResetData}
          title="Reset database to default seed records"
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
        >
          <RefreshCw className="w-3 h-3 text-slate-500" />
          Reset Seed
        </button>

        {/* Download Standalone ZIP */}
        <button
          onClick={onDownloadZip}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5" />
          EventForce.zip
        </button>
      </div>
    </header>
  );
};
