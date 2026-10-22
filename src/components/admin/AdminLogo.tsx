import React from 'react'

export const AdminLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-3 select-none py-1">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-indigo-500/25 flex-shrink-0">
        FN
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight leading-tight">
            Fieldnotes
          </span>
          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            PRO
          </span>
        </div>
        <span className="text-[10.5px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
          Studio Command Engine
        </span>
      </div>
    </div>
  )
}

export default AdminLogo
