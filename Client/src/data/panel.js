export const STATUSES = [
  { value: 'todo',        label: 'To Do',      color: 'text-slate-500',   bg: 'bg-slate-100',  dot: 'bg-slate-400'   },
  { value: 'in-progress', label: 'In Progress', color: 'text-indigo-600',  bg: 'bg-indigo-50',  dot: 'bg-indigo-500'  },
  { value: 'completed',   label: 'Completed',   color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
];

export const PRIORITY_STYLES = {
  high:   { bar: 'bg-red-500',     badge: 'text-red-600 bg-red-50 border-red-200'             },
  medium: { bar: 'bg-amber-400',   badge: 'text-amber-600 bg-amber-50 border-amber-200'       },
  low:    { bar: 'bg-emerald-500', badge: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
};

export const statusStyles = {
  'in-progress': 'text-indigo-600 border-indigo-200 bg-indigo-50',
  todo: 'text-slate-500 border-slate-200 bg-slate-50',
  completed: 'text-emerald-600 border-emerald-200 bg-emerald-50',
  trash: 'text-red-500 border-red-200 bg-red-50',
};

export const priorityBar = {
  high:   'bg-red-500',
  medium: 'bg-amber-400',
  low:    'bg-emerald-500',
};

export const priorityBadge = {
  high:   'bg-red-50 text-red-600 ring-red-200',
  medium: 'bg-amber-50 text-amber-600 ring-amber-200',
  low:    'bg-emerald-50 text-emerald-600 ring-emerald-200',
};