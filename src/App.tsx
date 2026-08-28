import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Upload, Wallet, Home, Plus, Search, CalendarDays } from 'lucide-react';

type Account = { id: string; name: string; amount: number; asOf: string; history: {date:string; amount:number}[]; type: string; isDebt?: boolean };
type Bill = { id: string; name: string; frequency: string; amountDue: number; isPaid: boolean; dueDay?: number };
type MonthlyRecord = { month: string; income: number; expense: number; net: number };
type Category = { name: string; lastMonth: number; currentMonth: number; color: string };
type Transaction = { id: string; date: string; description: string; amount: number; category: string; account: string; type: 'income'|'expense' };

const nowStr = () => new Date().toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true });

const INITIAL_LIQUID: Account[] = [
  { id: 'liq-1', name: 'Checking Account Balance', amount: 0, asOf: 'Not set', history: [], type: 'checking' },
  { id: 'liq-2', name: 'Savings Account Balance', amount: 0, asOf: 'Not set', history: [], type: 'savings' },
  { id: 'liq-3', name: 'Capital One Savor Card', amount: 0, asOf: 'Not set', history: [], type: 'credit', isDebt: true },
  { id: 'liq-4', name: 'Chase Amazon Card', amount: 0, asOf: 'Not set', history: [], type: 'credit', isDebt: true },
  { id: 'liq-5', name: 'Delta Blue Amex Card', amount: 0, asOf: 'Not set', history: [], type: 'credit', isDebt: true },
];
const INITIAL_ILLIQUID: Account[] = [
  { id: 'ill-1', name: 'Leesa Empower Retirement', amount: 0, asOf: 'Not set', history: [], type: 'asset' },
  { id: 'ill-2', name: 'Craig Fidelity Retirement', amount: 0, asOf: 'Not set', history: [], type: 'asset' },
  { id: 'ill-3', name: 'Traditional IRA', amount: 0, asOf: 'Not set', history: [], type: 'asset' },
  { id: 'ill-4', name: 'Fundrise', amount: 0, asOf: 'Not set', history: [], type: 'asset' },
  { id: 'ill-5', name: 'Real Estate Value', amount: 0, asOf: 'Not set', history: [], type: 'asset' },
  { id: 'ill-6', name: 'Home Loan', amount: 0, asOf: 'Not set', history: [], type: 'loan', isDebt: true },
  { id: 'ill-7', name: '2025 Honda Pilot Loan', amount: 0, asOf: 'Not set', history: [], type: 'loan', isDebt: true },
  { id: 'ill-8', name: '2016 Hyundai Sonata Loan', amount: 0, asOf: 'Not set', history: [], type: 'loan', isDebt: true },
];
const INITIAL_BILLS: Bill[] = [
  { id: 'b1', name: 'Capital One Savor', frequency: '15th', amountDue: 0, isPaid: false, dueDay: 15 },
  { id: 'b2', name: 'Chase Amazon', frequency: '18th', amountDue: 0, isPaid: false, dueDay: 18 },
  { id: 'b3', name: 'Home Loan', frequency: '1st', amountDue: 0, isPaid: false, dueDay: 1 },
  { id: 'b4', name: 'Hyundai Loan', frequency: '8th', amountDue: 0, isPaid: false, dueDay: 8 },
  { id: 'b5', name: 'Honda Loan', frequency: '15th', amountDue: 0, isPaid: false, dueDay: 15 },
  { id: 'b6', name: 'Childcare', frequency: 'Monthly', amountDue: 0, isPaid: false },
  { id: 'b7', name: 'Sewer Bill', frequency: '24th', amountDue: 0, isPaid: false, dueDay: 24 },
  { id: 'b8', name: 'Trump Accounts', frequency: '1st', amountDue: 0, isPaid: false, dueDay: 1 },
  { id: 'b9', name: 'Georgia School', frequency: 'Monthly', amountDue: 0, isPaid: false },
  { id: 'b10', name: 'Duke Energy', frequency: '16th', amountDue: 0, isPaid: false, dueDay: 16 },
  { id: 'b11', name: 'Water Bill', frequency: 'Quarterly', amountDue: 0, isPaid: false },
  { id: 'b12', name: 'Delta Blue Amex', frequency: 'Rarely', amountDue: 0, isPaid: false },
  { id: 'b13', name: 'Car Insurance', frequency: 'Bi-Yearly', amountDue: 0, isPaid: false },
  { id: 'b14', name: 'Car Tax', frequency: 'Yearly', amountDue: 0, isPaid: false },
];
const INITIAL_MONTHLY: MonthlyRecord[] = [
  { month: 'Jan', income: 0, expense: 0, net: 0 },
  { month: 'Feb', income: 0, expense: 0, net: 0 },
  { month: 'Mar', income: 0, expense: 0, net: 0 },
  { month: 'Apr', income: 0, expense: 0, net: 0 },
  { month: 'May', income: 0, expense: 0, net: 0 },
  { month: 'Jun', income: 0, expense: 0, net: 0 },
  { month: 'Jul', income: 0, expense: 0, net: 0 },
  { month: 'Aug', income: 0, expense: 0, net: 0 },
  { month: 'Sep', income: 0, expense: 0, net: 0 },
  { month: 'Oct', income: 0, expense: 0, net: 0 },
  { month: 'Nov', income: 0, expense: 0, net: 0 },
  { month: 'Dec', income: 0, expense: 0, net: 0 },
];
const INITIAL_CATEGORIES: Category[] = [
  { name: 'Groceries', lastMonth: 0, currentMonth: 0, color: '#10b981' },
  { name: 'Dining', lastMonth: 0, currentMonth: 0, color: '#f59e0b' },
  { name: 'Amazon', lastMonth: 0, currentMonth: 0, color: '#6366f1' },
  { name: 'Shopping', lastMonth: 0, currentMonth: 0, color: '#a855f7' },
  { name: 'Gas', lastMonth: 0, currentMonth: 0, color: '#eab308' },
  { name: 'Utilities', lastMonth: 0, currentMonth: 0, color: '#06b6d4' },
  { name: 'Entertainment', lastMonth: 0, currentMonth: 0, color: '#ec4899' },
  { name: 'Healthcare', lastMonth: 0, currentMonth: 0, color: '#8b5cf6' },
  { name: 'Childcare', lastMonth: 0, currentMonth: 0, color: '#ef4444' },
  { name: 'Auto Loans', lastMonth: 0, currentMonth: 0, color: '#6b7280' },
  { name: 'Housing', lastMonth: 0, currentMonth: 0, color: '#f97316' },
  { name: 'Bills & Fees', lastMonth: 0, currentMonth: 0, color: '#14b8a6' },
  { name: 'Transfers', lastMonth: 0, currentMonth: 0, color: '#94a3b8' },
  { name: 'Other', lastMonth: 0, currentMonth: 0, color: '#cbd5e1' },
  { name: 'Income', lastMonth: 0, currentMonth: 0, color: '#059669' },
];
const FREQUENCIES = ['1st','8th','15th','16th','18th','24th','Monthly','Quarterly','Bi-Yearly','Yearly','Rarely'];

function splitCsvRow(row: string): string[] {
  const result: string[] = []; let cur=''; let inQuotes=false;
  for (let i=0;i<row.length;i++){ const c=row[i]; if(c==='"'){ if(inQuotes && row[i+1]==='"'){cur+='"'; i++;} else inQuotes=!inQuotes; } else if(c===',' &&!inQuotes){ result.push(cur.trim()); cur=''; } else { cur+=c; } }
  result.push(cur.trim()); return result.map(s=> s.replace(/^"|"$/g,'').trim());
}
function parseDateToISO(raw: string): string {
  if (!raw) return new Date().toISOString().slice(0,10);
  const s=raw.trim(); const ymd=s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/); if(ymd){ return `${ymd[1]}-${ymd[2].padStart(2,'0')}-${ymd[3].padStart(2,'0')}`; }
  const mdy=s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/); if(mdy){ let m=mdy[1].padStart(2,'0'); let d=mdy[2].padStart(2,'0'); let y=mdy[3]; if(y.length===2) y='20'+y; return `${y}-${m}-${d}`; }
  const d=new Date(s); if(!isNaN(d.getTime())) return d.toISOString().slice(0,10); return new Date().toISOString().slice(0,10);
}
function parseAmount(raw: string): number { if(!raw) return 0; const cleaned=raw.replace(/[$",]/g,'').trim(); const n=parseFloat(cleaned); return isNaN(n)?0:n; }

function getCleanCategory(description: string, rawCategory: string, amount: number): string {
  const d = (description||'').toLowerCase();
  const r = (rawCategory||'').toLowerCase();
  // LEARNED override - checks if user previously re-categorized this merchant
  try {
    const learnedMap = JSON.parse(localStorage.getItem('fam-learned')||'{}');
    const key = (description||'').toUpperCase().trim();
    if (learnedMap[key]) return learnedMap[key];
    const baseKey = key.replace(/#\d+/g,'').replace(/\s+\d+$/g,'').trim().replace(/\s+/g,' ');
    const baseKey2 = baseKey.replace(/#.*$/,'').trim();
    if (learnedMap[baseKey]) return learnedMap[baseKey];
    if (learnedMap[baseKey2]) return learnedMap[baseKey2];
    // also check description without store numbers: KROGER #423 -> KROGER
    const merchant = baseKey2.split(' ')[0];
    if (merchant.length>3) {
      for (const [k,v] of Object.entries(learnedMap)) {
        if (k.startsWith(merchant)) return v as string;
      }
    }
  } catch {}


  const isIncome = amount > 0;
  if (isIncome) {
    if (d.includes('autopay pymt') || d.includes('autopay pyment') || d.includes('automatic payment') || d.includes('payment - thank') || d.includes('payment thank') || (d.includes('capital one') && (d.includes('pymt') || d.includes('autopay'))) || (d.includes('chase') && d.includes('autopay')) || d.includes('crcardpmt')) {
      return 'Transfers';
    }
    if (d.includes('venmo cashout') || (d.includes('venmo') && d.includes('cashout'))) {
      return 'Income';
    }
    if (d.includes('payroll') || d.includes('hy-tek') || d.includes('nitto denko') || d.includes('salary') || d.includes('paycheck') || d.includes('interest paid') || (d.includes('irs') && d.includes('tax ref')) || d.includes('tax refund') || (d.includes('echeck deposit') && amount>100) || d.includes('avec payroll')) {
      return 'Income';
    }
    if (d.includes('internet transfer from savings') || d.includes('transfer from savings') || (d.includes('transfer from') && d.includes('savings'))) {
      return 'Transfers';
    }
    return 'Income';
  }
  if (d.includes('craig rother ck transfer') || (d.includes('craig') && d.includes('rother') && d.includes('transfer'))) {
    return 'Auto Loans';
  }
  if (d.includes('crcardpmt') || (d.includes('crcard') && d.includes('pmt')) || d.includes('capital one crcardpmt') || (d.includes('capital one cr') && d.includes('pmt')) || d.includes('capital one autopay') || d.includes('chase credit crd autopay') || d.includes('credit crd autopay') || (d.includes('autopay') && d.includes('credit')) || d.includes('internet transfer to savings') || d.includes('transfer to savings') || d.includes('surprise savings booster') || (d.includes('internet transfer') && d.includes('savings')) || (d.includes('savings account') && d.includes('transfer'))) {
    if (d.includes('joe coffee')) return 'Dining';
    return 'Transfers';
  }
  if (d.includes('newrez') || d.includes('shellpoin') || d.includes('newrez-shellpoin') || d.includes('home loan') || (d.includes('mortgage') &&!d.includes('georgia school'))) {
    return 'Housing';
  }
  if (d.includes('honda pmt') || d.includes('honda financial') || d.includes('hyundai') || d.includes('toyota financial') || (d.includes('honda') && d.includes('8005'))) {
    return 'Auto Loans';
  }
  if (d.includes('kroger') || d.includes('fresh thyme') || d.includes('trader joe') || d.includes('wholefds') || d.includes('whole foods') || d.includes('grocery')) {
    return 'Groceries';
  }
  if (d.includes('sq *') || d.includes('tst*') || d.includes('coffee') || d.includes('starbucks') || d.includes('carabello') || d.includes('fort thomas coffee') || d.includes('governor') || d.includes('proud hound') || d.includes('chick-fil-a') || d.includes('chick fil a') || d.includes('joe coffee') || r==='dining') {
    return 'Dining';
  }
  if (d.includes('amazon') || d.includes('amzn')) return 'Amazon';
  if (!d.includes('shellpoin') &&!d.includes('newrez') && (d.includes('sunoco') || (d.includes('shell') &&!d.includes('shellpoin')) || d.includes(' bp ') || d.startsWith('bp ') || d.startsWith('bp#') || d.includes('bp#') || d.includes('chevron') || d.includes('marathon') || d.includes('speedway') || d.includes('exxon') || d.includes('circle k') || d.includes('circlek') || r==='gas')) {
    return 'Gas';
  }
  if (d.includes('dukeenergy') || d.includes('duke energy') || (d.includes('duke') && d.includes('bill pay'))) return 'Utilities';
  if (d.includes('sanitation distr') || d.includes('northern kentuck') || d.includes('sewer') || d.includes('water bill') || d.includes('trump account') || d.includes('trump accounts')) return 'Bills & Fees';
  if (d.includes('childcare') || d.includes('daycare') || d.includes('georgia school') || d.includes('bluebird christi')) return 'Childcare';
  if (d.includes('venmo payment') || d.includes('venmo *add funds') || d.includes('venmo add funds') || (d.includes('add funds') && d.includes('venmo')) || (d.includes('add funds') && d.includes('7700 eastport'))) {
    return 'Other';
  }
  if (d.includes('venmo')) return 'Other';
  if (d.includes('target') || d.includes('dollar tree') || d.includes('michaels') || d.includes('walmart') || d.includes('tj maxx') || r==='shopping' || (r==='merchandise' &&!d.includes('fresh thyme') &&!d.includes('kroger') &&!d.includes('trader joe')) || r==='personal') return 'Shopping';
  if (d.includes('cvs') || d.includes('walgreens') || d.includes('pharmacy') || r.includes('health')) return 'Healthcare';
  if (d.includes('cinema') || d.includes('movie') || d.includes('spotify') || d.includes('netflix') || d.includes('disney plus') || d.includes('spectrum') || r.includes('entertainment')) return 'Entertainment';
  if (d.includes('check paid #') || d.includes('check paid')) return 'Other';
  return 'Other';
}

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const monthlyFactor = (freq: string) => {
  if (freq==='Monthly' || freq.includes('1st') || freq.includes('8th') || freq.includes('15th') || freq.includes('16th') || freq.includes('18th') || freq.includes('24th')) return 1;
  if (freq==='Quarterly') return 1/3; if (freq==='Bi-Yearly') return 1/6; if (freq==='Yearly') return 1/12; return 0;
};


// --- PASSWORD GATE ---
const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'Rother2026!';
function PasswordGate({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = React.useState(()=> {
    try { return sessionStorage.getItem('fam-auth') === 'true'; } catch { return false; }
  });
  const [pw, setPw] = React.useState('');
  const [error, setError] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (pw === APP_PASSWORD) {
      try { sessionStorage.setItem('fam-auth', 'true'); } catch {}
      setIsAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isAuthed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] grid place-items-center px-4">
      <div className="w-full max-w-[360px] rounded-[24px] bg-white border shadow-sm p-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white grid place-items-center font-black text-xl mx-auto">R</div>
        <h1 className="text-center font-bold text-[18px] mt-4">Rother Family Finance</h1>
        <p className="text-center text-[12px] text-slate-500 mt-1">Enter password to access</p>
        
        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={e=>{setPw(e.target.value); setError(false);}}
              placeholder="Password"
              autoFocus
              className={`w-full px-4 py-3.5 rounded-xl border text-[15px] outline-none focus:ring-2 focus:ring-slate-900 ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
            />
            <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-3.5 text-[12px] text-slate-500 px-2 py-1 rounded-lg hover:bg-slate-100">
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <p className="text-[12px] text-red-600">Incorrect password. Try again.</p>}
          <button type="submit" className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-[14px] hover:bg-black">Unlock</button>
          <p className="text-[10px] text-slate-400 text-center mt-2">Protected • Data stays on your device • Change password in Vercel env VITE_APP_PASSWORD</p>
        </form>
      </div>
    </div>
  );
}
// --- END PASSWORD GATE ---


function EditableAmount({ value, onSave, isDebt }: { value: number; onSave: (v:number)=>void; isDebt?: boolean }) {
  const [editing, setEditing] = React.useState(false); const [tmp, setTmp] = React.useState(String(value));
  React.useEffect(()=> setTmp(String(value)), [value]);
  if (editing) return (
    <div className="flex items-center gap-1">
      <input autoFocus type="number" value={tmp} onChange={e=>setTmp(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ onSave(parseFloat(tmp)||0); setEditing(false);} if(e.key==='Escape') setEditing(false); }} className="w-[120px] px-2 py-1 rounded-lg border border-slate-900 text-sm font-semibold"/>
      <button onClick={()=>{ onSave(parseFloat(tmp)||0); setEditing(false); }} className="px-2 py-1 rounded-lg bg-slate-900 text-white text-xs">Save</button>
    </div>
  );
  return <button onClick={()=>setEditing(true)} className={`text-right font-bold text-[13px] px-2.5 py-1 rounded-lg border ${isDebt?'bg-red-50 border-red-100 text-red-700':'bg-white border-slate-200 hover:bg-slate-50'}`}>{fmt(value)}</button>;
}

export default function App(){
  const [liquid, setLiquid] = React.useState<Account[]>(()=> { try{ const s=localStorage.getItem('fam-liquid'); return s?JSON.parse(s):INITIAL_LIQUID; } catch{ return INITIAL_LIQUID; } });
  const [illiquid, setIlliquid] = React.useState<Account[]>(()=> { try{ const s=localStorage.getItem('fam-illiquid'); return s?JSON.parse(s):INITIAL_ILLIQUID; } catch{ return INITIAL_ILLIQUID; } });
  const [bills, setBills] = React.useState<Bill[]>(()=> { try{ const s=localStorage.getItem('fam-bills'); return s?JSON.parse(s):INITIAL_BILLS; } catch{ return INITIAL_BILLS; } });
  const [monthly, setMonthly] = React.useState<MonthlyRecord[]>(()=> { try{ const s=localStorage.getItem('fam-monthly'); return s?JSON.parse(s):INITIAL_MONTHLY; } catch{ return INITIAL_MONTHLY; } });
  const [transactions, setTransactions] = React.useState<Transaction[]>(()=> { try{ const s=localStorage.getItem('fam-trans'); return s?JSON.parse(s):[]; } catch{ return []; } });
  const [categories, setCategories] = React.useState<Category[]>(()=> { try{ const s=localStorage.getItem('fam-cats'); return s?JSON.parse(s):INITIAL_CATEGORIES; } catch{ return INITIAL_CATEGORIES; } });
  const [tab, setTab] = React.useState<'overview'|'accounts'|'bills'|'transactions'|'categories'>('overview');
  const [search, setSearch] = React.useState(''); const [filterCat, setFilterCat] = React.useState('All'); const [filterYear, setFilterYear] = React.useState('2026'); const [filterMonthOnly, setFilterMonthOnly] = React.useState('08'); // 'All' for whole year
  const filterMonth = filterYear === 'All' ? '' : filterMonthOnly === 'All' ? filterYear : `${filterYear}-${filterMonthOnly}`;
  const [csvPreview, setCsvPreview] = React.useState<Transaction[]|null>(null);
  const [newCatName, setNewCatName] = React.useState(''); const [newCatColor, setNewCatColor] = React.useState('#10b981');
  const [learned, setLearned] = React.useState<Record<string,string>>(()=> {
    try { return JSON.parse(localStorage.getItem('fam-learned')||'{}'); } catch { return {}; }
  });
  React.useEffect(()=>{ localStorage.setItem('fam-learned', JSON.stringify(learned)); }, [learned]);
  const [netWorthHistory, setNetWorthHistory] = React.useState<{date:string, timestamp:number, netWorth:number, liquid:number, illiquid:number}[]>(()=> {
    try { const s=localStorage.getItem('fam-nw-history'); return s?JSON.parse(s):[]; } catch { return []; }
  });
  React.useEffect(()=>{ localStorage.setItem('fam-nw-history', JSON.stringify(netWorthHistory)); }, [netWorthHistory]);

  React.useEffect(()=>{ localStorage.setItem('fam-liquid', JSON.stringify(liquid)); }, [liquid]);
  React.useEffect(()=>{ localStorage.setItem('fam-illiquid', JSON.stringify(illiquid)); }, [illiquid]);
  React.useEffect(()=>{ localStorage.setItem('fam-bills', JSON.stringify(bills)); }, [bills]);
  React.useEffect(()=>{ localStorage.setItem('fam-monthly', JSON.stringify(monthly)); }, [monthly]);
  React.useEffect(()=>{ localStorage.setItem('fam-trans', JSON.stringify(transactions)); }, [transactions]);
  React.useEffect(()=>{ localStorage.setItem('fam-cats', JSON.stringify(categories)); }, [categories]);

  const recalcMonthly = (allTx: Transaction[]) => {
    if (allTx.length === 0) {
      setMonthly(INITIAL_MONTHLY);
      return;
    }
    const monthMap = new Map<string, { income: number; expense: number }>();
    allTx.forEach(t=>{
      if (t.category === 'Transfers') return;
      const mKey = t.date.slice(0,7);
      const cur = monthMap.get(mKey) || { income: 0, expense: 0 };
      if (t.type==='income') cur.income += t.amount; else cur.expense += Math.abs(t.amount);
      monthMap.set(mKey, cur);
    });
    setMonthly(prev=> prev.map(rec=>{
      const monthNum = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(rec.month);
      if (monthNum<0) return rec;
      const key2026 = `2026-${String(monthNum+1).padStart(2,'0')}`;
      let agg = monthMap.get(key2026);
      if (!agg) {
        for (const [k,v] of monthMap.entries()) {
          if (k.endsWith(`-${String(monthNum+1).padStart(2,'0')}`)) { agg = v; break; }
        }
      }
      if (!agg) return {...rec, income: 0, expense: 0, net: 0 };
      return { ...rec, income: Math.round(agg.income*100)/100, expense: Math.round(agg.expense*100)/100, net: Math.round((agg.income-agg.expense)*100)/100 };
    }));
  };

  React.useEffect(()=>{ recalcMonthly(transactions); }, [transactions]);

  const checking = React.useMemo(()=> liquid.find(a=>a.type==='checking')?.amount||0, [liquid]);
  const savings = React.useMemo(()=> liquid.find(a=>a.type==='savings')?.amount||0, [liquid]);
  const liquidDebtTotal = React.useMemo(()=> liquid.filter(a=>a.isDebt).reduce((s,a)=>s+a.amount,0), [liquid]);
  const trueLiquidCash = React.useMemo(()=> checking + savings - liquidDebtTotal, [checking, savings, liquidDebtTotal]);
  
  // Net worth history - log every time accounts change
  const logNetWorth = React.useCallback((liq: Account[], ill: Account[]) => {
    const liqAssets = liq.filter(a=>!a.isDebt).reduce((s,a)=>s+a.amount,0);
    const liqDebt = liq.filter(a=>a.isDebt).reduce((s,a)=>s+a.amount,0);
    const illAssets = ill.filter(a=>!a.isDebt).reduce((s,a)=>s+a.amount,0);
    const illDebt = ill.filter(a=>a.isDebt).reduce((s,a)=>s+a.amount,0);
    const nw = (liqAssets - liqDebt) + (illAssets - illDebt);
    const now = new Date();
    setNetWorthHistory(prev=>{
      // Don't duplicate if same net worth within 5 minutes
      const last = prev[prev.length-1];
      if (last && Math.abs(last.netWorth - nw) < 0.01 && (Date.now() - last.timestamp) < 300000) return prev;
      return [...prev, { date: now.toISOString().slice(0,10), timestamp: now.getTime(), netWorth: nw, liquid: liqAssets - liqDebt, illiquid: illAssets - illDebt }].slice(-100); // keep last 100
    });
  }, []);

  // Initialize history if empty
  React.useEffect(()=>{
    if (netWorthHistory.length===0) {
      logNetWorth(liquid, illiquid);
    }
  }, []); // eslint-disable-line

  React.useEffect(()=>{
    if (liquid.length>0 || illiquid.length>0) {
      // only log if history exists (not on first load)
      if (netWorthHistory.length>0) logNetWorth(liquid, illiquid);
    }
  }, [liquid, illiquid]);
  const totalIlliquidAssets = illiquid.filter(a=>!a.isDebt).reduce((s,a)=>s+a.amount,0);
  const totalIlliquidDebt = illiquid.filter(a=>a.isDebt).reduce((s,a)=>s+a.amount,0);
  const netIlliquid = totalIlliquidAssets - totalIlliquidDebt;
  const totalLiquidAssets = liquid.filter(a=>!a.isDebt).reduce((s,a)=>s+a.amount,0);
  const totalLiquidDebt = liquidDebtTotal;
  const netLiquid = totalLiquidAssets - totalLiquidDebt;
  const netWorth = netLiquid + netIlliquid;
  const ytdNet = monthly.slice(0,8).reduce((s,m)=>s+m.net,0);
  const currentMonthRec = monthly[7] || { month:'Aug', income:0, expense:0, net:0 };
  const monthlyBillsSum = React.useMemo(()=> bills.reduce((s,b)=> s + b.amountDue * monthlyFactor(b.frequency), 0), [bills]);

  const filteredTransactions = React.useMemo(()=> {
    return transactions.filter(t=>{
      const matchesSearch =!search || t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
      const matchesCat = filterCat==='All' || t.category===filterCat;
      const matchesMonth =!filterMonth || t.date.startsWith(filterMonth);
      return matchesSearch && matchesCat && matchesMonth;
    });
  }, [transactions, search, filterCat, filterMonth]);

  const filteredTotal = React.useMemo(()=> {
    // Net of non-transfer transactions only
    const relevant = filteredTransactions.filter(t=> t.category!=='Transfers');
    return relevant.reduce((s,t)=> s + t.amount, 0);
  }, [filteredTransactions]);
  const filteredExpense = React.useMemo(()=> {
    return filteredTransactions.filter(t=> t.amount<0 && t.category!=='Transfers' && t.category!=='Income').reduce((s,t)=> s + Math.abs(t.amount), 0);
  }, [filteredTransactions]);
  const filteredIncome = React.useMemo(()=> {
    return filteredTransactions.filter(t=> t.amount>0 && t.category!=='Transfers').reduce((s,t)=> s + t.amount, 0);
  }, [filteredTransactions]);

  const updateAccountAmount = (id:string, newAmount:number, isLiquid:boolean) => {
    const now = nowStr();
    const isoDate = new Date().toISOString();
    if (isLiquid) setLiquid(prev=> prev.map(a=> a.id===id?{...a, amount:newAmount, asOf:now, history:[...a.history, {date: isoDate, amount:newAmount}]}:a));
    else setIlliquid(prev=> prev.map(a=> a.id===id?{...a, amount:newAmount, asOf:now, history:[...a.history, {date: isoDate, amount:newAmount}]}:a));
    // net worth will be auto-logged via useEffect on liquid/illiquid change
  };

  const handleCsvUpload = (input: File | FileList | File[]) => {
    const files: File[] = input instanceof FileList? Array.from(input) : Array.isArray(input)? input : [input];
    const parseSingleFile = (file: File): Promise<Transaction[]> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = e => {
          const text = e.target?.result as string;
          const rawLines = text.split(/\r?\n/).filter(l=> l.trim().length>0);
          if (rawLines.length < 2) { resolve([]); return; }
          const headerCols = splitCsvRow(rawLines[0]).map(h=> h.trim().toLowerCase());
          const hasDebitCredit = headerCols.includes('debit') && headerCols.includes('credit');
          const hasMemo = headerCols.includes('memo');
          const isCapitalOne = hasDebitCredit;
          const isChase =!isCapitalOne && headerCols.includes('amount') && hasMemo;
          const isChecking = headerCols.some(h=>h.includes('time')) && headerCols.length===5;
          const findIdx = (cands: string[]) => headerCols.findIndex(h=> cands.some(c=> h.includes(c)));
          const idxDate = findIdx(['transaction date','date']);
          const idxDesc = findIdx(['description']);
          const idxCat = findIdx(['category']);
          const idxDebit = findIdx(['debit']);
          const idxCredit = findIdx(['credit']);
          const idxAmount = findIdx(['amount']);
          const parsed: Transaction[] = rawLines.slice(1).map((line,i)=>{
            const cols = splitCsvRow(line);
            if (cols.length < 2) return null as any;
            let dateStr='', desc='', rawCat='', amt=0, account='Checking Account Balance';
            if (isCapitalOne) {
              dateStr = cols[idxDate] || cols[0];
              const debit = idxDebit>=0? parseAmount(cols[idxDebit]) : 0;
              const credit = idxCredit>=0? parseAmount(cols[idxCredit]) : 0;
              if (debit>0) amt = -debit; else if (credit>0) amt = credit;
              desc = cols[idxDesc] || ''; rawCat = cols[idxCat] || '';
            } else if (isChase) {
              dateStr = cols[idxDate] || cols[0];
              amt = parseAmount(cols[idxAmount] || '0');
              desc = cols[idxDesc] || ''; rawCat = cols[idxCat] || ''; account = 'Chase Amazon Card';
            } else if (isChecking) {
              const dIdx = headerCols.findIndex(h=> h.trim()==='date' || h.includes('date'));
              const amtIdx = headerCols.findIndex(h=> h.trim()==='amount');
              const descIdx = headerCols.findIndex(h=> h.trim()==='description');
              dateStr = cols[dIdx>=0?dIdx:0] || ''; amt = parseAmount(cols[amtIdx>=0?amtIdx:2] || '0');
              desc = cols[descIdx>=0?descIdx:4] || cols[cols.length-1] || '';
            } else {
              dateStr = cols[idxDate>=0?idxDate:0] || ''; desc = cols[idxDesc>=0?idxDesc:1] || '';
              amt = parseAmount(cols[idxAmount>=0?idxAmount:2] || '0');
            }
            if (!desc &&!amt) return null as any;
            const isoDate = parseDateToISO(dateStr);
            const cleanCat = getCleanCategory(desc, rawCat, amt);
            return { id: `csv-${Date.now()}-${i}-${Math.random().toString(36).slice(2,5)}`, date: isoDate, description: desc.toUpperCase().trim(), amount: amt, category: cleanCat, account, type: amt >=0? 'income' as const : 'expense' as const } as Transaction;
          }).filter((t:any)=> t && t.amount!==0) as Transaction[];
          resolve(parsed);
        };
        reader.readAsText(file);
      });
    };
    Promise.all(files.map(f=> parseSingleFile(f))).then(results=>{
      const allTx = results.flat();
      const seen = new Set<string>(); const final = allTx.filter(t=>{ const key=`${t.date}|${t.description}|${t.amount}`; if(seen.has(key)) return false; seen.add(key); return true; }).sort((a,b)=> b.date.localeCompare(a.date));
      setCsvPreview(final);
    });
  };

  const confirmCsvImport = () => {
    if (!csvPreview) return;
    const existingKeys = new Set(transactions.map(t=> `${t.date}|${t.description}|${t.amount}`));
    const newOnes = csvPreview.filter(t=>!existingKeys.has(`${t.date}|${t.description}|${t.amount}`));
    const merged = [...newOnes,...transactions].sort((a,b)=> b.date.localeCompare(a.date));
    setTransactions(merged);
    recalcMonthly(merged);
    setCsvPreview(null);
  };

  const resetToBlankSlate = () => {
    if (!confirm('Blank slate? This clears all data.')) return;
    localStorage.clear();
    setLiquid(INITIAL_LIQUID); setIlliquid(INITIAL_ILLIQUID); setBills(INITIAL_BILLS); setMonthly(INITIAL_MONTHLY); setTransactions([]); setCategories(INITIAL_CATEGORIES);
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    if (categories.find(c=>c.name.toLowerCase()===newCatName.trim().toLowerCase())) { alert('exists'); return; }
    setCategories(prev=> [...prev, { name: newCatName.trim(), lastMonth: 0, currentMonth: 0, color: newCatColor }]);
    setNewCatName('');
  };
  const updateCategoryName = (oldName: string, newName: string) => {
    if (!newName.trim() || oldName===newName) return;
    setCategories(prev=> prev.map(c=> c.name===oldName?{...c, name:newName.trim()}:c));
    setTransactions(prev=> prev.map(t=> t.category===oldName?{...t, category:newName.trim()}:t));
  };
  const updateCategoryColor = (name: string, color: string) => {
    setCategories(prev=> prev.map(c=> c.name===name?{...c, color}:c));
  };
  const deleteCategory = (name: string) => {
    if (['Other','Transfers','Income'].includes(name)) { alert('Cannot delete system categories'); return; }
    if (!confirm(`Delete "${name}"? Moves its transactions to Other.`)) return;
    setCategories(prev=> prev.filter(c=>c.name!==name));
    setTransactions(prev=> prev.map(t=> t.category===name?{...t, category:'Other'}:t));
  };

  return (
    <PasswordGate>
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-slate-900 text-white grid place-items-center font-black">R</div><div><h1 className="text-[15px] font-bold">Rother Family Finance</h1><p className="text-[11px] text-slate-500">{nowStr()}</p></div></div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] bg-white">
              {cloudStatus==='synced' && <><Cloud size={12} className="text-emerald-600"/><span className="text-emerald-700">Cloud Synced {lastSync}</span></>}
              {cloudStatus==='syncing' && <><RefreshCw size={12} className="animate-spin"/><span>Syncing...</span></>}
              {cloudStatus==='offline' && <><CloudOff size={12} className="text-slate-400"/><span className="text-slate-500">Local Only</span></>}
              {cloudStatus==='error' && <><CloudOff size={12} className="text-red-500"/><span className="text-red-600">Sync Error</span></>}
            </div>
            <div className="hidden md:flex gap-2"><div className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs">{fmt(netWorth)}</div><div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] border">{fmt(trueLiquidCash)}</div></div>
            <button onClick={exportBackup} className="px-3 py-2 rounded-xl bg-emerald-600 text-white border text-xs font-semibold">Export</button>
            <label className="px-3 py-2 rounded-xl bg-white border text-xs cursor-pointer">Import<input type="file" accept=".json" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) importBackup(f); e.target.value=''; }}/></label>
            {supabase && <><button onClick={manualSync} className="px-3 py-2 rounded-xl bg-slate-900 text-white border text-xs">Push Cloud</button><button onClick={pullFromCloud} className="px-3 py-2 rounded-xl bg-white border text-xs">Pull Cloud</button></>}
            <button onClick={()=>{ try{ sessionStorage.removeItem('fam-auth'); }catch{} location.reload(); }} className="px-3 py-2 rounded-xl bg-white border text-xs">Lock</button><button onClick={resetToBlankSlate} className="px-3 py-2 rounded-xl bg-white border text-xs">Blank</button></div>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto">
          {['overview','accounts','bills','transactions','categories'].map(k=> <button key={k} onClick={()=>setTab(k as any)} className={`px-4 py-3 text-[13px] font-medium border-b-2 ${tab===k?'border-slate-900 text-slate-900':'border-transparent text-slate-500'}`}>{k.charAt(0).toUpperCase()+k.slice(1)}</button>)}
        </div>
      </header>
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        {tab==='overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-white border p-5"><p className="text-[11px] uppercase text-slate-500">Net Worth</p><p className="text-2xl font-bold mt-1">{fmt(netWorth)}</p></div>
              <div className="rounded-2xl bg-white border p-5"><p className="text-[11px] uppercase text-slate-500">True Liquid</p><p className="text-2xl font-bold mt-1">{fmt(trueLiquidCash)}</p></div>
              <div className="rounded-2xl bg-white border p-5"><p className="text-[11px] uppercase text-slate-500">Aug Net</p><p className={`text-2xl font-bold mt-1 ${currentMonthRec.net<0?'text-red-600':'text-emerald-600'}`}>{fmt(currentMonthRec.net)}</p><p className="text-[11px] text-slate-500 mt-1">{transactions.length} txns • YTD {fmt(ytdNet)}</p></div>
              <div className="rounded-2xl bg-white border p-5"><p className="text-[11px] uppercase text-slate-500">Bills Monthly</p><p className="text-2xl font-bold mt-1">{fmt(monthlyBillsSum)}</p></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white border p-5">
                <h3 className="font-semibold text-[13px] mb-1">Spending by Category — {filterMonth || 'All Time'}</h3>
                <p className="text-[11px] text-slate-500 mb-4">Excludes Income & Transfers • {filteredTransactions.filter(t=>t.amount<0).length} expenses</p>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={(() => {
                          const map = new Map<string, number>();
                          const colors = new Map<string, string>();
                          filteredTransactions.filter(t=> t.amount<0 && t.category!=='Transfers' && t.category!=='Income').forEach(t=>{
                            map.set(t.category, (map.get(t.category)||0) + Math.abs(t.amount));
                            const cat = categories.find(c=>c.name===t.category);
                            if (cat) colors.set(t.category, cat.color);
                          });
                          return Array.from(map.entries()).map(([name,value])=> ({ name, value, color: colors.get(name)||'#94a3b8' })).sort((a,b)=>b.value-a.value);
                        })()}
                        cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" nameKey="name" paddingAngle={2}
                      >
                        {(() => {
                          const map = new Map<string, number>();
                          const colors = new Map<string, string>();
                          filteredTransactions.filter(t=> t.amount<0 && t.category!=='Transfers' && t.category!=='Income').forEach(t=>{
                            const cat = categories.find(c=>c.name===t.category);
                            if (cat) colors.set(t.category, cat.color);
                          });
                          return Array.from(colors.values()).map((color,i)=><Cell key={i} fill={color} />);
                        })()}
                      </Pie>
                      <Tooltip formatter={(v:any)=> fmt(v as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 space-y-1 max-h-[140px] overflow-auto">
                  {(() => {
                    const map = new Map<string, number>();
                    filteredTransactions.filter(t=> t.amount<0 && t.category!=='Transfers' && t.category!=='Income').forEach(t=>{
                      map.set(t.category, (map.get(t.category)||0) + Math.abs(t.amount));
                    });
                    const total = Array.from(map.values()).reduce((a,b)=>a+b,0);
                    return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).map(([name,val])=>{
                      const cat = categories.find(c=>c.name===name);
                      return <div key={name} className="flex justify-between text-[11px]"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{background: cat?.color||'#94a3b8'}}/><span>{name}</span></div><span className="font-medium">{fmt(val)} ({total>0? Math.round(val/total*100):0}%)</span></div>;
                    });
                  })()}
                </div>
              </div>

              <div className="rounded-2xl bg-white border p-5">
                <h3 className="font-semibold text-[13px] mb-1">Net Worth History</h3>
                <p className="text-[11px] text-slate-500 mb-4">Logs every time you change an account balance in Accounts tab • {netWorthHistory.length} snapshots</p>
                <div className="h-[280px]">
                  {netWorthHistory.length < 2 ? (
                    <div className="h-full grid place-items-center text-center"><div><p className="text-[13px] font-medium">Not enough history yet</p><p className="text-[11px] text-slate-500 mt-1">Go to Accounts tab and update a balance.<br/>Each save creates a timestamped snapshot.</p><p className="text-[11px] mt-3 font-mono bg-slate-50 border rounded px-2 py-1 inline-block">{fmt(netWorth)} now</p></div></div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={netWorthHistory.map(h=> ({ ...h, dateLabel: new Date(h.timestamp).toLocaleDateString('en-US',{month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                        <XAxis dataKey="dateLabel" tick={{fontSize:10}} interval="preserveStartEnd"/>
                        <YAxis tick={{fontSize:11}} tickFormatter={v=> `$${(v/1000).toFixed(0)}k`}/>
                        <Tooltip formatter={(v:any)=> fmt(v as number)}/>
                        <Legend />
                        <Line type="monotone" dataKey="netWorth" name="Net Worth" stroke="#0f172a" strokeWidth={2.5} dot={{r:3}} />
                        <Line type="monotone" dataKey="liquid" name="Liquid" stroke="#10b981" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="illiquid" name="Illiquid" stroke="#6366f1" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
                {netWorthHistory.length>0 && (
                  <div className="mt-3 text-[11px] flex gap-3">
                    <span>Start: {fmt(netWorthHistory[0].netWorth)}</span>
                    <span className={netWorth - netWorthHistory[0].netWorth >=0 ? 'text-emerald-600' : 'text-red-600'}>Change: {fmt(netWorth - netWorthHistory[0].netWorth)} {netWorthHistory.length>1? `(${(((netWorth / netWorthHistory[0].netWorth)-1)*100).toFixed(1)}%)`: ''}</span>
                    <button onClick={()=> { if(confirm('Clear net worth history?')) { setNetWorthHistory([]); localStorage.removeItem('fam-nw-history'); } }} className="ml-auto text-slate-400 underline">Clear</button>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white border p-5">
              <h3 className="font-semibold text-[13px] mb-4">Monthly — auto-updates from transactions (Transfers excluded)</h3>
              <div className="h-[220px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly.slice(0,8)}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/><XAxis dataKey="month" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/><Tooltip formatter={(v:any)=>fmt(v as number)}/><Bar dataKey="income" fill="#0f172a" radius={[6,6,0,0]}/><Bar dataKey="expense" fill="#ef4444" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>
              <div className="mt-4 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="text-slate-500 bg-slate-50/80"><th className="text-left font-medium px-4 py-2">Month</th><th className="text-right font-medium px-3 py-2">Income</th><th className="text-right font-medium px-3 py-2">Expenses</th><th className="text-right font-medium px-3 py-2">Net</th></tr></thead><tbody>{monthly.slice(0,8).map(m=> <tr key={m.month} className="border-t"><td className="px-4 py-2 font-medium">{m.month}</td><td className="px-3 py-2 text-right">{fmt(m.income)}</td><td className="px-3 py-2 text-right text-red-600">{fmt(m.expense)}</td><td className={`px-3 py-2 text-right font-semibold ${m.net<0?'text-red-600':'text-emerald-600'}`}>{fmt(m.net)}</td></tr>)}<tr className="border-t-2 border-slate-900 font-bold bg-slate-50"><td className="px-4 py-2">YTD</td><td className="px-3 py-2 text-right">{fmt(monthly.slice(0,8).reduce((s,m)=>s+m.income,0))}</td><td className="px-3 py-2 text-right">{fmt(monthly.slice(0,8).reduce((s,m)=>s+m.expense,0))}</td><td className="px-3 py-2 text-right">{fmt(ytdNet)}</td></tr></tbody></table></div>
            </div>
          </div>
        )}
        {tab==='accounts' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border overflow-hidden"><div className="px-5 py-4 border-b"><h3 className="font-semibold text-[13px] flex items-center gap-2"><Wallet size={14}/> Liquid</h3></div><div className="divide-y">{liquid.map(acc=> (<div key={acc.id} className="px-5 py-3.5 flex justify-between items-center"><div><p className="text-[13px] font-medium">{acc.name}</p><p className="text-[11px] text-slate-500">{acc.asOf}</p></div><EditableAmount value={acc.amount} onSave={v=> updateAccountAmount(acc.id, v, true)} isDebt={!!acc.isDebt} /></div>))}</div></div>
            <div className="rounded-2xl bg-white border overflow-hidden"><div className="px-5 py-4 border-b"><h3 className="font-semibold text-[13px] flex items-center gap-2"><Home size={14}/> Illiquid</h3></div><div className="divide-y">{illiquid.map(acc=> (<div key={acc.id} className="px-5 py-3.5 flex justify-between items-center"><div><p className="text-[13px] font-medium">{acc.name}</p><p className="text-[11px] text-slate-500">{acc.asOf}</p></div><EditableAmount value={acc.amount} onSave={v=> updateAccountAmount(acc.id, v, false)} isDebt={!!acc.isDebt} /></div>))}</div></div>
          </div>
        )}
        {tab==='bills' && (
          <div className="rounded-2xl bg-white border overflow-hidden"><div className="px-5 py-4 border-b flex justify-between"><h3 className="font-semibold text-[13px]">Bills</h3><div className="flex gap-2"><button onClick={()=>setBills(prev=> prev.map(b=> ({...b, isPaid: false})))} className="px-2.5 py-1 rounded-full bg-white border text-[11px]">Unpaid all</button><button onClick={()=>setBills(prev=> prev.map(b=> ({...b, isPaid: true})))} className="px-2.5 py-1 rounded-full bg-emerald-50 border text-[11px]">Paid all</button></div></div><div className="overflow-x-auto"><table className="w-full text-[12px]"><thead className="bg-slate-50 text-slate-500"><tr><th className="text-left px-4 py-2.5">Name</th><th className="text-left px-3 py-2.5">Freq</th><th className="text-right px-3 py-2.5">Amount</th><th className="text-center px-3 py-2.5">Paid</th></tr></thead><tbody>{bills.map(b=> (<tr key={b.id} className="border-t"><td className="px-4 py-2.5">{b.name}</td><td className="px-3 py-2.5"><select value={b.frequency} onChange={e=> setBills(prev=> prev.map(x=> x.id===b.id?{...x,frequency:e.target.value}:x))} className="px-2 py-1 rounded-lg border text-[12px]">{FREQUENCIES.map(f=> <option key={f} value={f}>{f}</option>)}</select></td><td className="px-3 py-2.5 text-right"><input type="number" value={b.amountDue} onChange={e=> setBills(prev=> prev.map(x=> x.id===b.id?{...x, amountDue: parseFloat(e.target.value)||0}:x))} className="w-[100px] text-right px-2 py-1 rounded-lg border"/></td><td className="px-3 py-2.5 text-center"><button onClick={()=> setBills(prev=> prev.map(x=> x.id===b.id?{...x,isPaid:!x.isPaid}:x))} className={`px-3 py-1 rounded-full text-[11px] border ${b.isPaid?'bg-emerald-50 border-emerald-200 text-emerald-700':'bg-white border-slate-200'}`}>{b.isPaid?'Paid':'Mark Paid'}</button></td></tr>))}</tbody></table></div></div>
        )}
        {tab==='transactions' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white border p-5">
              <h3 className="font-semibold text-[13px] mb-4">Import CSVs</h3>
              <div onDragOver={e=>e.preventDefault()} onDrop={e=>{ e.preventDefault(); const files=e.dataTransfer.files; if(files.length>0) handleCsvUpload(files); }} className="rounded-2xl border-2 border-dashed bg-slate-50 p-8 text-center"><p className="text-[13px] font-medium">Drag & drop CSVs</p><p className="text-[11px] text-slate-500 mt-1">Multi-file • AUTOMATIC PAYMENT - THANK = Transfer • Venmo cashout = Income</p><label className="mt-3 inline-flex px-4 py-2 rounded-xl bg-slate-900 text-white text-xs cursor-pointer">Browse<input type="file" accept=".csv" multiple className="hidden" onChange={e=> e.target.files && handleCsvUpload(e.target.files)}/></label></div>
              {csvPreview && (<div className="mt-4 border rounded-xl p-4"><p className="text-[12px] font-semibold">{csvPreview.length} preview — Overview will update on Import</p><div className="mt-2 max-h-[160px] overflow-auto text-[11px]">{csvPreview.slice(0,8).map(t=> <div key={t.id} className="flex justify-between"><span className="truncate">{t.date} {t.description}</span><span>{fmt(t.amount)} {t.category}</span></div>)}</div><div className="mt-3 flex gap-2"><button onClick={()=>setCsvPreview(null)} className="px-3 py-2 bg-white border rounded-xl text-xs">Cancel</button><button onClick={confirmCsvImport} className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs">Import {csvPreview.length} → Updates Overview</button></div></div>)}
            </div>
            <div className="rounded-2xl bg-white border overflow-hidden">
              <div className="px-5 py-4 border-b flex gap-2 items-center flex-wrap">
                <Search size={14} className="text-slate-400"/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" className="px-3 py-2 rounded-xl bg-slate-50 border text-xs w-[200px]"/>
                <select value={filterYear} onChange={e=>setFilterYear(e.target.value)} className="px-2.5 py-2 rounded-xl border text-xs bg-white">
                  <option value="All">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  {Array.from(new Set(transactions.map(t=> t.date.slice(0,4)))).filter(y=> !['2026','2025','2024','2023'].includes(y)).map(y=> <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={filterMonthOnly} onChange={e=>setFilterMonthOnly(e.target.value)} disabled={filterYear==='All'} className="px-2.5 py-2 rounded-xl border text-xs bg-white disabled:opacity-50">
                  <option value="All">Whole Year</option>
                  <option value="01">Jan</option>
                  <option value="02">Feb</option>
                  <option value="03">Mar</option>
                  <option value="04">Apr</option>
                  <option value="05">May</option>
                  <option value="06">Jun</option>
                  <option value="07">Jul</option>
                  <option value="08">Aug</option>
                  <option value="09">Sep</option>
                  <option value="10">Oct</option>
                  <option value="11">Nov</option>
                  <option value="12">Dec</option>
                </select>
                <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} className="px-2.5 py-2 rounded-xl border text-xs"><option value="All">All</option>{categories.map(c=> <option key={c.name} value={c.name}>{c.name}</option>)}</select>
                <span className="ml-auto text-[11px]">{filteredTransactions.length} txns • {fmt(filteredExpense)} spent • {filterMonth ? (filterMonthOnly==='All' ? `${filterYear} Year` : filterMonth) : 'All Time'}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-slate-50"><tr><th className="text-left px-4 py-2.5">Date</th><th className="text-left px-3 py-2.5">Description</th><th className="text-right px-3 py-2.5">Amount</th><th className="text-left px-3 py-2.5">Category - editable</th><th className="px-4"></th></tr></thead>
                  <tbody>{filteredTransactions.map(t=> (<tr key={t.id} className="border-t"><td className="px-4 py-2.5 text-slate-600">{t.date}</td><td className="px-3 py-2.5 font-medium max-w-[260px] truncate">{t.description}</td><td className={`px-3 py-2.5 text-right font-semibold ${t.amount<0?'text-red-600':'text-emerald-700'}`}>{fmt(t.amount)}</td><td className="px-3 py-2.5"><select value={t.category} onChange={e=> {
                        const newCat = e.target.value;
                        setTransactions(prev=> prev.map(x=> x.id===t.id?{...x, category:newCat, type:newCat==='Income'?'income': x.type}:x));
                        const key = t.description.toUpperCase().trim();
                        const baseKey = key.replace(/#\d+/g,'').replace(/\s+\d+$/g,'').trim().replace(/\s+/g,' ');
                        const baseKey2 = baseKey.replace(/#.*$/,'').trim();
                        setLearned(prev=> {
                          const next:any = {...prev, [key]: newCat};
                          if (baseKey && baseKey!==key) next[baseKey]=newCat;
                          if (baseKey2 && baseKey2!==key) next[baseKey2]=newCat;
                          return next;
                        });
                      }} className="px-2 py-1 rounded-lg border text-[11px] bg-white w-full"><option value="Income">Income</option>{categories.map(c=> <option key={c.name} value={c.name}>{c.name}</option>)}</select></td><td className="px-4 py-2.5 text-right"><button onClick={()=> setTransactions(prev=> prev.filter(x=>x.id!==t.id))} className="text-[11px] text-slate-400">Delete</button></td></tr>))}</tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-900 bg-slate-50 font-bold">
                      <td className="px-4 py-3 text-[12px]">
                        <div>Total: {filterCat} {filterMonth? `· ${filterMonth}` : ''} {search? `· "${search}"` : ''}</div>
                        <div className="text-[10px] font-normal text-slate-500 mt-0.5">Excludes Transfers • Net = Income - Spent</div>
                      </td>
                      <td className="px-3 py-3 text-right text-[11px] text-slate-500">{filteredTransactions.filter(t=>t.category!=='Transfers').length} txns</td>
                      <td className="px-3 py-3 text-right font-bold text-[13px]">
                        <div className={filteredTotal>=0 ? 'text-emerald-700' : 'text-red-600'}>Net {fmt(filteredTotal)}</div>
                        <div className="text-[10px] font-normal text-slate-500">{filteredIncome>0? `Income ${fmt(filteredIncome)}`:''} {filteredExpense>0 && filteredIncome>0 ? '•' : ''} {filteredExpense>0? `Spent ${fmt(filteredExpense)}`:''}</div>
                      </td>
                      <td className="px-3 py-3 text-[11px] text-slate-500 text-right">
                        {filteredExpense>0? <span className="text-red-600 font-semibold">{fmt(filteredExpense)} spent</span> : ''}
                        {filteredTransactions.filter(t=>t.category==='Transfers').length>0 && <div className="text-[10px] text-slate-400">{filteredTransactions.filter(t=>t.category==='Transfers').length} transfers ignored</div>}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
        {tab==='categories' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white border p-5">
              <div className="flex justify-between mb-4"><h3 className="font-semibold text-[13px]">Manage Categories - rename, recolor, delete</h3><span className="text-[11px] px-2 py-1 rounded-full bg-slate-900 text-white">{categories.length}</span></div>
              <div className="grid gap-2">
                {categories.map(cat=>{
                  const count = transactions.filter(t=>t.category===cat.name).length;
                  const total = transactions.filter(t=>t.category===cat.name && t.type==='expense').reduce((s,t)=>s+Math.abs(t.amount),0);
                  return (
                    <div key={cat.name} className="flex items-center gap-3 p-3 rounded-xl border">
                      <input type="color" value={cat.color} onChange={e=> updateCategoryColor(cat.name, e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer"/>
                      <div className="flex-1">
                        <input defaultValue={cat.name} onBlur={e=> updateCategoryName(cat.name, e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ (e.target as HTMLInputElement).blur(); } }} className="w-full font-medium text-[13px] bg-transparent focus:bg-slate-50 rounded px-1"/>
                        <p className="text-[11px] text-slate-500">{count} txns • {fmt(total)}</p>
                      </div>
                      <button onClick={()=> deleteCategory(cat.name)} className="px-2.5 py-1 rounded-full border text-[11px]">Delete</button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl bg-white border p-5">
              <div className="flex justify-between mb-3"><h3 className="font-semibold text-[13px]">Add New Category</h3><span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">{Object.keys(learned).length} learned</span></div>
              <div className="flex gap-3"><input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="e.g. Pets, Travel, Gifts" className="flex-1 px-3 py-2.5 rounded-xl border text-[13px]"/><input type="color" value={newCatColor} onChange={e=>setNewCatColor(e.target.value)} className="w-12 h-10 rounded border-0"/><button onClick={addCategory} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-[13px] flex items-center gap-1"><Plus size={14}/> Add</button></div>
            </div>
          </div>
        )}
      </main>
    </div>
    </PasswordGate>
  );
}

