
export const formatDate = d => new Date(d).toLocaleDateString('en-US',{day:'2-digit',month:'short',year:'numeric'});
export const isOverdue = d => { const t=new Date(); t.setHours(0,0,0,0); return new Date(d)<t; };
export const isToday = d => { const t=new Date(),dt=new Date(d); return dt.getDate()===t.getDate()&&dt.getMonth()===t.getMonth()&&dt.getFullYear()===t.getFullYear(); };
export const pColor = p => p==='high'?'#f43f5e':p==='medium'?'#fbbf24':'#10b981';
export const pLabel = p => p==='high'?'#f87171':p==='medium'?'#fbbf24':'#34d399';

