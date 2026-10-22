import React from 'react'

export const AdminIcon: React.FC = () => {
  return (
    <div className="flex items-center gap-2 group select-none">
      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-600 via-indigo-700 to-emerald-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-sm shadow-indigo-500/30 flex-shrink-0">
        FN
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 tracking-tight">
          Fieldnotes Studio
        </span>
        <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
          PRO
        </span>
      </div>
    </div>
  )
}

export default AdminIcon

