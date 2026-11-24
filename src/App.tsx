import React from 'react';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = "https://vvhjyjidbqixxsdncfjw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2aGp5amlkYnFpeHhzZG5jZmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5Mzk1NTAsImV4cCI6MjEwMzUxNTU1MH0.jFmKLlUEvtWi2iiSjp6y0nWeufqqAHlXBczirvkDsSo";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const CLOUD_TABLE = 'family_finance';
const CLOUD_ID = 'rother_main';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Wallet, Home, Plus, Search, Cloud, CloudOff, RefreshCw, AlertTriangle, CheckCircle2, Info, Sparkles, X } from 'lucide-react';

type Account = { id: string; name: string; amount: number; asOf: string; history: {date:string; amount:number}[]; type: string; isDebt?: boolean };
type Bill = { id: string; name: string; frequency: string; amountDue: number; isPaid: boolean; dueDay?: number; dueMonth?: number };
type MonthlyRecord = { month: string; key?: string; income: number; expense: number; net: number };
type Category = { name: string; lastMonth: number; currentMonth: number; color: string };
type Transaction = { id: string; date: string; description: string; amount: number; category: string; account: string; type: 'income'|'expense'; learnedRule?: boolean };
type BannerNotice = { type: 'success' | 'error' | 'info'; message: string };
type ConfirmDialogState = {
  title: string;
  body: string;
  confirmLabel: string;
  tone?: 'danger' | 'primary';
  requireDoubleConfirm?: boolean;
  onConfirm: () => void;
};

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
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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

function matchLearnedCategory(description: string, learnedMap: Record<string, string>): string | null {
  const key = (description || '').toUpperCase().trim();
  if (!key) return null;
  if (learnedMap[key]) return learnedMap[key];
  const baseKey = key.replace(/#\d+/g, '').replace(/\s+\d+$/g, '').trim().replace(/\s+/g, ' ');
  const baseKey2 = baseKey.replace(/#.*$/, '').trim();
  if (learnedMap[baseKey]) return learnedMap[baseKey];
  if (learnedMap[baseKey2]) return learnedMap[baseKey2];
  const merchant = baseKey2.split(' ')[0];
  if (merchant.length > 3) {
    for (const [k, v] of Object.entries(learnedMap)) {
      if (k.startsWith(merchant)) return v;
    }
  }
  return null;
}

function getCleanCategory(description: string, rawCategory: string, amount: number, learnedMap?: Record<string, string>): { category: string; fromLearned: boolean } {
  const d = (description||'').toLowerCase();
  const r = (rawCategory||'').toLowerCase();
  try {
    const map = learnedMap ?? JSON.parse(localStorage.getItem('fam-learned')||'{}');
    const matched = matchLearnedCategory(description, map);
    if (matched) return { category: matched, fromLearned: true };
  } catch {}

  const isIncome = amount > 0;
  if (isIncome) {
    if (d.includes('autopay pymt') || d.includes('autopay pyment') || d.includes('automatic payment') || d.includes('payment - thank') || d.includes('payment thank') || (d.includes('capital one') && (d.includes('pymt') || d.includes('autopay'))) || (d.includes('chase') && d.includes('autopay')) || d.includes('crcardpmt')) {
      return { category: 'Transfers', fromLearned: false };
    }
    if (d.includes('venmo cashout') || (d.includes('venmo') && d.includes('cashout'))) {
      return { category: 'Income', fromLearned: false };
    }
    if (d.includes('payroll') || d.includes('hy-tek') || d.includes('nitto denko') || d.includes('salary') || d.includes('paycheck') || d.includes('interest paid') || (d.includes('irs') && d.includes('tax ref')) || d.includes('tax refund') || (d.includes('echeck deposit') && amount>100) || d.includes('avec payroll')) {
      return { category: 'Income', fromLearned: false };
    }
    if (d.includes('internet transfer from savings') || d.includes('transfer from savings') || (d.includes('transfer from') && d.includes('savings'))) {
      return { category: 'Transfers', fromLearned: false };
    }
    return { category: 'Income', fromLearned: false };
  }
  if (d.includes('craig rother ck transfer') || (d.includes('craig') && d.includes('rother') && d.includes('transfer'))) {
    return { category: 'Auto Loans', fromLearned: false };
  }
  if (d.includes('crcardpmt') || (d.includes('crcard') && d.includes('pmt')) || d.includes('capital one crcardpmt') || (d.includes('capital one cr') && d.includes('pmt')) || d.includes('capital one autopay') || d.includes('chase credit crd autopay') || d.includes('credit crd autopay') || (d.includes('autopay') && d.includes('credit')) || d.includes('internet transfer to savings') || d.includes('transfer to savings') || d.includes('surprise savings booster') || (d.includes('internet transfer') && d.includes('savings')) || (d.includes('savings account') && d.includes('transfer'))) {
    if (d.includes('joe coffee')) return { category: 'Dining', fromLearned: false };
    return { category: 'Transfers', fromLearned: false };
  }
  if (d.includes('newrez') || d.includes('shellpoin') || d.includes('newrez-shellpoin') || d.includes('home loan') || (d.includes('mortgage') &&!d.includes('georgia school'))) {
    return { category: 'Housing', fromLearned: false };
  }
  if (d.includes('honda pmt') || d.includes('honda financial') || d.includes('hyundai') || d.includes('toyota financial') || (d.includes('honda') && d.includes('8005'))) {
    return { category: 'Auto Loans', fromLearned: false };
  }
  if (d.includes('kroger') || d.includes('fresh thyme') || d.includes('trader joe') || d.includes('wholefds') || d.includes('whole foods') || d.includes('grocery')) {
    return { category: 'Groceries', fromLearned: false };
  }
  if (d.includes('sq *') || d.includes('tst*') || d.includes('coffee') || d.includes('starbucks') || d.includes('carabello') || d.includes('fort thomas coffee') || d.includes('governor') || d.includes('proud hound') || d.includes('chick-fil-a') || d.includes('chick fil a') || d.includes('joe coffee') || r==='dining') {
    return { category: 'Dining', fromLearned: false };
  }
  if (d.includes('amazon') || d.includes('amzn')) return { category: 'Amazon', fromLearned: false };
  if (!d.includes('shellpoin') &&!d.includes('newrez') && (d.includes('sunoco') || (d.includes('shell') &&!d.includes('shellpoin')) || d.includes(' bp ') || d.startsWith('bp ') || d.startsWith('bp#') || d.includes('bp#') || d.includes('chevron') || d.includes('marathon') || d.includes('speedway') || d.includes('exxon') || d.includes('circle k') || d.includes('circlek') || r==='gas')) {
    return { category: 'Gas', fromLearned: false };
  }
  if (d.includes('dukeenergy') || d.includes('duke energy') || (d.includes('duke') && d.includes('bill pay'))) return { category: 'Utilities', fromLearned: false };
  if (d.includes('sanitation distr') || d.includes('northern kentuck') || d.includes('sewer') || d.includes('water bill') || d.includes('trump account') || d.includes('trump accounts')) return { category: 'Bills & Fees', fromLearned: false };
  if (d.includes('childcare') || d.includes('daycare') || d.includes('georgia school') || d.includes('bluebird christi')) return { category: 'Childcare', fromLearned: false };
  if (d.includes('venmo payment') || d.includes('venmo *add funds') || d.includes('venmo add funds') || (d.includes('add funds') && d.includes('venmo')) || (d.includes('add funds') && d.includes('7700 eastport'))) {
    return { category: 'Other', fromLearned: false };
  }
  if (d.includes('venmo')) return { category: 'Other', fromLearned: false };
  if (d.includes('target') || d.includes('dollar tree') || d.includes('michaels') || d.includes('walmart') || d.includes('tj maxx') || r==='shopping' || (r==='merchandise' &&!d.includes('fresh thyme') &&!d.includes('kroger') &&!d.includes('trader joe')) || r==='personal') return { category: 'Shopping', fromLearned: false };
  if (d.includes('cvs') || d.includes('walgreens') || d.includes('pharmacy') || r.includes('health')) return { category: 'Healthcare', fromLearned: false };
  if (d.includes('cinema') || d.includes('movie') || d.includes('spotify') || d.includes('netflix') || d.includes('disney plus') || d.includes('spectrum') || r.includes('entertainment')) return { category: 'Entertainment', fromLearned: false };
  if (d.includes('check paid #') || d.includes('check paid')) return { category: 'Other', fromLearned: false };
  return { category: 'Other', fromLearned: false };
}

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const monthlyFactor = (freq: string) => {
  if (freq==='Monthly' || freq.includes('1st') || freq.includes('8th') || freq.includes('15th') || freq.includes('16th') || freq.includes('18th') || freq.includes('24th')) return 1;
  if (freq==='Quarterly') return 1/3; if (freq==='Bi-Yearly') return 1/6; if (freq==='Yearly') return 1/12; return 0;
};

function isBillDueInMonth(b: Bill, targetMonth: number): { due: boolean; reason: string } {
  const freq = b.frequency;
  const dueMonth = b.dueMonth;
  if (freq === 'Monthly' || ['1st','8th','15th','16th','18th','24th'].includes(freq)) {
    return { due: true, reason: `Monthly (${freq})` };
  }
  if (freq === 'Yearly') {
    if (!dueMonth) return { due: true, reason: 'Yearly (no month set — defaulted to this month)' };
    return {
      due: dueMonth === targetMonth,
      reason: dueMonth === targetMonth ? `Due in ${MONTH_NAMES[targetMonth - 1]}` : `Due in ${MONTH_NAMES[dueMonth - 1]}`
    };
  }
  if (freq === 'Bi-Yearly') {
    if (!dueMonth) return { due: true, reason: 'Bi-Yearly (no month set — defaulted to this month)' };
    const secondMonth = ((dueMonth + 5) % 12) + 1;
    const isDue = dueMonth === targetMonth || secondMonth === targetMonth;
    return {
      due: isDue,
      reason: `Due ${MONTH_NAMES[dueMonth - 1]} & ${MONTH_NAMES[secondMonth - 1]}`
    };
  }
  if (freq === 'Quarterly') {
    if (!dueMonth) return { due: true, reason: 'Quarterly (no month set — defaulted to this month)' };
    const qMonths = [
      dueMonth,
      ((dueMonth + 2) % 12) + 1,
      ((dueMonth + 5) % 12) + 1,
      ((dueMonth + 8) % 12) + 1,
    ];
    return {
      due: qMonths.includes(targetMonth),
      reason: `Quarterly (${qMonths.map(m => MONTH_NAMES[m - 1]).join(', ')})`
    };
  }
  if (freq === 'Rarely') {
    if (!dueMonth) return { due: false, reason: 'Rarely (excluded unless Due Month is set)' };
    return {
      due: dueMonth === targetMonth,
      reason: dueMonth === targetMonth ? `Due in ${MONTH_NAMES[targetMonth - 1]}` : `Scheduled ${MONTH_NAMES[dueMonth - 1]}`
    };
  }
  return { due: false, reason: 'Excluded' };
}


// --- SUPABASE AUTH GATE ---
function PasswordGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<any>(null);
  const [checkingSession, setCheckingSession] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setCheckingSession(false);
    }).catch(() => {
      if (!active) return;
      setCheckingSession(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession ?? null);
      setCheckingSession(false);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim() || !pw) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pw,
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg(error.message || 'Sign-in failed. Check your credentials.');
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#f8fafc] grid place-items-center px-4">
        <div className="rounded-2xl bg-white border px-6 py-4 text-xs text-slate-500">Checking session...</div>
      </div>
    );
  }

  if (session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] grid place-items-center px-4">
      <div className="w-full max-w-[360px] rounded-[24px] bg-white border shadow-sm p-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white grid place-items-center font-black text-xl mx-auto">R</div>
        <h1 className="text-center font-bold text-[18px] mt-4">Rother Family Finance</h1>
        <p className="text-center text-[12px] text-slate-500 mt-1">Sign in with your Supabase account</p>
        
        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <div>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrorMsg(''); }}
              placeholder="Email address"
              autoFocus
              autoComplete="email"
              className={`w-full px-4 py-3 rounded-xl border text-[14px] outline-none focus:ring-2 focus:ring-slate-900 ${errorMsg ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
            />
          </div>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={e => { setPw(e.target.value); setErrorMsg(''); }}
              placeholder="Password"
              autoComplete="current-password"
              className={`w-full px-4 py-3 rounded-xl border text-[14px] outline-none focus:ring-2 focus:ring-slate-900 ${errorMsg ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-[12px] text-slate-500 px-2 py-1 rounded-lg hover:bg-slate-100">
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {errorMsg && <p className="text-[12px] text-red-600">{errorMsg}</p>}
          <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-[14px] hover:bg-black disabled:opacity-60">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-[10px] text-slate-400 text-center mt-2">Authenticated via Supabase Auth • Enforced by Row Level Security</p>
        </form>
      </div>
    </div>
  );
}
// --- END SUPABASE AUTH GATE ---


function EditableAmount({ value, onSave, isDebt }: { value: number; onSave: (v:number)=>void; isDebt?: boolean }) {
  const [editing, setEditing] = React.useState(false); const [tmp, setTmp] = React.useState(String(value));
  React.useEffect(()=> setTmp(String(value)), [value]);
  if (editing) return (
    <div className="flex items-center gap-1">
      <input autoFocus type="number" value={tmp} onChange={e=>setTmp(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ onSave(Math.abs(parseFloat(tmp)||0)); setEditing(false);} if(e.key==='Escape') setEditing(false); }} className="w-[120px] px-2 py-1 rounded-lg border border-slate-900 text-sm font-semibold"/>
      <button onClick={()=>{ onSave(Math.abs(parseFloat(tmp)||0)); setEditing(false); }} className="px-2 py-1 rounded-lg bg-slate-900 text-white text-xs">Save</button>
    </div>
  );
  return <button onClick={()=>setEditing(true)} className={`text-right font-bold text-[13px] px-2.5 py-1 rounded-lg border ${isDebt?'bg-red-50 border-red-100 text-red-700':'bg-white border-slate-200 hover:bg-slate-50'}`}>{fmt(value)}</button>;
}

export default function App(){
  const [liquid, setLiquid] = React.useState<Account[]>(()=> { try{ const s=localStorage.getItem('fam-liquid'); return s?JSON.parse(s):INITIAL_LIQUID; } catch{ return INITIAL_LIQUID; } });
  const [illiquid, setIlliquid] = React.useState<Account[]>(()=> { try{ const s=localStorage.getItem('fam-illiquid'); return s?JSON.parse(s):INITIAL_ILLIQUID; } catch{ return INITIAL_ILLIQUID; } });
  const [bills, setBills] = React.useState<Bill[]>(()=> { try{ const s=localStorage.getItem('fam-bills'); return s?JSON.parse(s):INITIAL_BILLS; } catch{ return INITIAL_BILLS; } });
  const [monthly, setMonthly] = React.useState<MonthlyRecord[]>(()=> { try{ const s=localStorage.getItem('fam-monthly'); return s?JSON.parse(s):INITIAL_MONTHLY; } catch{ return INITIAL_MONTHLY; } });
  const [netWorthHistory, setNetWorthHistory] = React.useState<{date:string, timestamp:number, netWorth:number, liquid:number, illiquid:number}[]>(()=> { try { const s=localStorage.getItem('fam-nw-history'); return s?JSON.parse(s):[]; } catch { return []; } });
  const [cloudStatus, setCloudStatus] = React.useState<'offline'|'syncing'|'synced'|'error'>('syncing');
  const [lastSync, setLastSync] = React.useState<string>('');
  const [lastImport, setLastImport] = React.useState<string>(()=> { try { return localStorage.getItem('fam-last-import') || ''; } catch { return ''; } });
  const isInitialCloudLoad = React.useRef(true);
  const isApplyingRemote = React.useRef(false);
  const lastPushTime = React.useRef(0);

  const [banner, setBanner] = React.useState<BannerNotice | null>(null);
  const [confirmDialog, setConfirmDialog] = React.useState<ConfirmDialogState | null>(null);
  const [confirmStepTwo, setConfirmStepTwo] = React.useState(false);
  const [pendingRestore, setPendingRestore] = React.useState<any | null>(null);

  const showNotice = React.useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setBanner({ type, message });
  }, []);

  React.useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(null), 5000);
    return () => clearTimeout(timer);
  }, [banner]);

  const exportBackup = ()=> {
    try {
      const data = { liquid, illiquid, bills, monthly, transactions, categories, learned, netWorthHistory, lastImport, exportedAt: new Date().toISOString(), version: 3 };
      const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;
      a.download=`rother-finance-backup-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotice('success', 'Backup JSON downloaded.');
    } catch(e){
      showNotice('error', `Export failed: ${e}`);
    }
  };

  const importBackup = (file: File)=> {
    const reader = new FileReader();
    reader.onload = (e)=> {
      try {
        const data = JSON.parse(e.target?.result as string);
        setPendingRestore(data);
      } catch(err){
        showNotice('error', `Invalid backup file: ${err}`);
      }
    };
    reader.readAsText(file);
  };

  const applyPendingRestore = () => {
    if (!pendingRestore) return;
    const data = pendingRestore;
    if (data.liquid) setLiquid(data.liquid);
    if (data.illiquid) setIlliquid(data.illiquid);
    if (data.bills) setBills(data.bills);
    if (data.transactions) setTransactions(data.transactions);
    if (data.categories) setCategories(data.categories);
    if (data.learned) setLearned(data.learned);
    if (data.netWorthHistory) setNetWorthHistory(data.netWorthHistory);
    if (data.lastImport) setLastImport(data.lastImport);
    setPendingRestore(null);
    showNotice('success', `Restored ${data.transactions?.length || 0} transactions from backup.`);
  };

  const [transactions, setTransactions] = React.useState<Transaction[]>(()=> { try{ const s=localStorage.getItem('fam-trans'); return s?JSON.parse(s):[]; } catch{ return []; } });
  const [categories, setCategories] = React.useState<Category[]>(()=> { try{ const s=localStorage.getItem('fam-cats'); return s?JSON.parse(s):INITIAL_CATEGORIES; } catch{ return INITIAL_CATEGORIES; } });
  const [tab, setTab] = React.useState<'overview'|'accounts'|'bills'|'transactions'|'categories'>('overview');
  const [search, setSearch] = React.useState('');
  const [filterCat, setFilterCat] = React.useState('All');
  const [filterYear, setFilterYear] = React.useState(String(new Date().getFullYear()));
  const [filterMonthOnly, setFilterMonthOnly] = React.useState(String(new Date().getMonth()+1).padStart(2,'0'));
  const [showAddTx, setShowAddTx] = React.useState(false);
  const [newTx, setNewTx] = React.useState<{date:string, description:string, amount:string, category:string, type:'income'|'expense'}>({date: new Date().toISOString().slice(0,10), description:'', amount:'', category:'Other', type:'expense'});
  const [addTxError, setAddTxError] = React.useState('');
  const [highlightedTxId, setHighlightedTxId] = React.useState<string | null>(null);
  const filterMonth = filterYear === 'All' ? '' : filterMonthOnly === 'All' ? filterYear : `${filterYear}-${filterMonthOnly}`;
  const [csvPreview, setCsvPreview] = React.useState<Transaction[]|null>(null);
  const [newCatName, setNewCatName] = React.useState('');
  const [newCatColor, setNewCatColor] = React.useState('#10b981');
  const [learned, setLearned] = React.useState<Record<string,string>>(()=> {
    try { return JSON.parse(localStorage.getItem('fam-learned')||'{}'); } catch { return {}; }
  });
  React.useEffect(()=>{ localStorage.setItem('fam-learned', JSON.stringify(learned)); }, [learned]);

  React.useEffect(()=>{ localStorage.setItem('fam-nw-history', JSON.stringify(netWorthHistory)); }, [netWorthHistory]);
  React.useEffect(()=>{ if (netWorthHistory.length===0 && (liquid.length>0 || illiquid.length>0)) { const totalLiquidAssets = liquid.filter(a=>!a.isDebt).reduce((s,a)=>s+a.amount,0); const totalLiquidDebt = liquid.filter(a=>a.isDebt).reduce((s,a)=>s+a.amount,0); const netLiquid = totalLiquidAssets - totalLiquidDebt; const totalIlliquidAssets = illiquid.filter(a=>!a.isDebt).reduce((s,a)=>s+a.amount,0); const totalIlliquidDebt = illiquid.filter(a=>a.isDebt).reduce((s,a)=>s+a.amount,0); const netIlliquid = totalIlliquidAssets - totalIlliquidDebt; const nw = netLiquid + netIlliquid; if (nw>0) { setNetWorthHistory([{date: new Date().toISOString().slice(0,10), timestamp: Date.now(), netWorth: nw, liquid: netLiquid, illiquid: netIlliquid}]); } } }, []);
  const [authReady, setAuthReady] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setAuthReady(Boolean(data.session));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setAuthReady(Boolean(nextSession));
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  React.useEffect(()=> { 
    if (!authReady) {
      setCloudStatus('offline');
      return;
    }
    const load = async ()=> { 
      try { 
        setCloudStatus('syncing'); 
        const { data, error } = await supabase.from(CLOUD_TABLE).select('data, updated_at').eq('id', CLOUD_ID).single(); 
        if (error && error.code !== 'PGRST116') throw error; 
        if (data?.data && Object.keys(data.data).length>0) { 
          const d = data.data as any; 
          isApplyingRemote.current = true;
          if (d.liquid) setLiquid(d.liquid); 
          if (d.illiquid) setIlliquid(d.illiquid); 
          if (d.bills) setBills(d.bills); 
          if (d.transactions && d.transactions.length>0) setTransactions(d.transactions); 
          if (d.categories) setCategories(d.categories); 
          if (d.learned) setLearned(d.learned); 
          if (d.netWorthHistory) setNetWorthHistory(d.netWorthHistory);
          if ((d as any).lastImport) setLastImport((d as any).lastImport);
          setLastSync(new Date(data.updated_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })); 
          setTimeout(()=> { isApplyingRemote.current = false; }, 2000);
        } 
        setCloudStatus('synced'); 
        isInitialCloudLoad.current=false; 
      } catch(e){ console.error(e); setCloudStatus('error'); isInitialCloudLoad.current=false; } 
    }; 
    load(); 
    const channel = supabase.channel('family-finance-live').on('postgres_changes', { event: '*', schema: 'public', table: CLOUD_TABLE, filter: `id=eq.${CLOUD_ID}` }, (payload:any)=> { 
      try { 
        const d = (payload.new as any)?.data; 
        if (!d || isInitialCloudLoad.current) return; 
        const remoteTime = new Date((payload.new as any).updated_at || 0).getTime(); 
        if (remoteTime && remoteTime <= lastPushTime.current) return; 
        isApplyingRemote.current = true; 
        if (d.liquid) setLiquid(d.liquid); 
        if (d.illiquid) setIlliquid(d.illiquid); 
        if (d.bills) setBills(d.bills); 
        if (d.transactions) setTransactions(d.transactions); 
        if (d.categories) setCategories(d.categories); 
        if (d.learned) setLearned(d.learned); 
        if (d.netWorthHistory) setNetWorthHistory(d.netWorthHistory);
        if ((d as any).lastImport) setLastImport((d as any).lastImport); 
        setLastSync(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })); 
        setCloudStatus('synced'); 
        setTimeout(()=> { isApplyingRemote.current = false; }, 2000); 
      } catch(e){ console.error('realtime error', e); } 
    }).subscribe(); 
    return ()=> { supabase.removeChannel(channel); }; 
  }, [authReady]);
  React.useEffect(()=> { 
    if (!authReady) return;
    if (isInitialCloudLoad.current) return; 
    if (isApplyingRemote.current) return; 
    setCloudStatus('syncing'); 
    const payload = { liquid, illiquid, bills, transactions, categories, learned, netWorthHistory, lastImport }; 
    const t = setTimeout(async ()=> { 
      try { 
        const now = Date.now(); 
        const {error}=await supabase.from(CLOUD_TABLE).upsert({id:CLOUD_ID, data:payload, updated_at:new Date().toISOString()}, {onConflict:'id'}); 
        if(error) throw error; 
        lastPushTime.current = now; 
        setCloudStatus('synced'); 
        setLastSync(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })); 
      } catch(e){ console.error(e); setCloudStatus('error'); } 
    }, 2000); 
    return ()=> clearTimeout(t); 
  }, [liquid, illiquid, bills, transactions, categories, learned, netWorthHistory, lastImport]);

  React.useEffect(()=>{ localStorage.setItem('fam-liquid', JSON.stringify(liquid)); }, [liquid]);
  React.useEffect(()=>{ localStorage.setItem('fam-illiquid', JSON.stringify(illiquid)); }, [illiquid]);
  React.useEffect(()=>{ localStorage.setItem('fam-bills', JSON.stringify(bills)); }, [bills]);
  React.useEffect(()=>{ localStorage.setItem('fam-monthly', JSON.stringify(monthly)); }, [monthly]);
  React.useEffect(()=>{ localStorage.setItem('fam-trans', JSON.stringify(transactions)); }, [transactions]);
  React.useEffect(()=>{ localStorage.setItem('fam-cats', JSON.stringify(categories)); }, [categories]);
  React.useEffect(()=>{ if(lastImport) localStorage.setItem('fam-last-import', lastImport); }, [lastImport]);

  const activeOverviewYear = React.useMemo(() => {
    const nowYear = new Date().getFullYear();
    if (filterYear !== 'All') {
      const parsed = parseInt(filterYear, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return nowYear;
  }, [filterYear]);

  const recalcMonthly = React.useCallback((allTx: Transaction[], targetYear: number) => {
    const monthMap = new Map<string, { income: number; expense: number }>();
    allTx.forEach(t=>{
      if (t.category === 'Transfers') return;
      const mKey = t.date.slice(0,7);
      if (!/^\d{4}-\d{2}$/.test(mKey)) return;
      const cur = monthMap.get(mKey) || { income: 0, expense: 0 };
      if (t.type==='income') cur.income += Math.abs(t.amount); else cur.expense += Math.abs(t.amount);
      monthMap.set(mKey, cur);
    });
    const now = new Date();
    const isCurrentYear = targetYear === now.getFullYear();
    const currentMonthInYear = isCurrentYear ? now.getMonth()+1 : 12;
    const maxMonthWithData = Array.from(monthMap.keys())
      .filter(k=>k.startsWith(String(targetYear)+'-'))
      .map(k=> parseInt(k.slice(5,7), 10))
      .reduce((a,b)=> Math.max(a,b), 0);
    const endMonth = isCurrentYear ? Math.max(currentMonthInYear, maxMonthWithData) : Math.max(12, maxMonthWithData);
    const months: {key:string, label:string}[] = [];
    for (let m=1; m<=endMonth; m++) {
      const key = `${targetYear}-${String(m).padStart(2,'0')}`;
      const label = new Date(targetYear, m-1, 1).toLocaleDateString('en-US',{month:'short', year:'numeric'});
      months.push({key, label});
    }
    const newMonthly = months.map(({key, label})=>{
      const v = monthMap.get(key) || {income:0, expense:0};
      return { month: label, key, income: Math.round(v.income*100)/100, expense: Math.round(v.expense*100)/100, net: Math.round((v.income - v.expense)*100)/100 };
    });
    setMonthly(newMonthly);
  }, []);

  React.useEffect(()=>{ recalcMonthly(transactions, activeOverviewYear); }, [transactions, activeOverviewYear, recalcMonthly]);

  const checking = React.useMemo(()=> liquid.find(a=>a.type==='checking')?.amount||0, [liquid]);
  const savings = React.useMemo(()=> liquid.find(a=>a.type==='savings')?.amount||0, [liquid]);
  const liquidDebtTotal = React.useMemo(()=> liquid.filter(a=>a.isDebt).reduce((s,a)=>s+a.amount,0), [liquid]);
  const trueLiquidCash = React.useMemo(()=> checking + savings - liquidDebtTotal, [checking, savings, liquidDebtTotal]);
  
  const logNetWorth = React.useCallback((liq: Account[], ill: Account[]) => {
    const liqAssets = liq.filter(a=>!a.isDebt).reduce((s,a)=>s+a.amount,0);
    const liqDebt = liq.filter(a=>a.isDebt).reduce((s,a)=>s+a.amount,0);
    const illAssets = ill.filter(a=>!a.isDebt).reduce((s,a)=>s+a.amount,0);
    const illDebt = ill.filter(a=>a.isDebt).reduce((s,a)=>s+a.amount,0);
    const nw = (liqAssets - liqDebt) + (illAssets - illDebt);
    const now = new Date();
    setNetWorthHistory(prev=>{
      const last = prev[prev.length-1];
      if (last && Math.abs(last.netWorth - nw) < 0.01 && (Date.now() - last.timestamp) < 300000) return prev;
      return [...prev, { date: now.toISOString().slice(0,10), timestamp: now.getTime(), netWorth: nw, liquid: liqAssets - liqDebt, illiquid: illAssets - illDebt }].slice(-100);
    });
  }, []);

  React.useEffect(()=>{
    if (netWorthHistory.length===0) {
      logNetWorth(liquid, illiquid);
    }
  }, []); // eslint-disable-line

  React.useEffect(()=>{
    if (liquid.length>0 || illiquid.length>0) {
      if (netWorthHistory.length>0) logNetWorth(liquid, illiquid);
    }
  }, [liquid, illiquid]); // eslint-disable-line

  const totalIlliquidAssets = illiquid.filter(a=>!a.isDebt).reduce((s,a)=>s+a.amount,0);
  const totalIlliquidDebt = illiquid.filter(a=>a.isDebt).reduce((s,a)=>s+a.amount,0);
  const netIlliquid = totalIlliquidAssets - totalIlliquidDebt;
  const totalLiquidAssets = liquid.filter(a=>!a.isDebt).reduce((s,a)=>s+a.amount,0);
  const totalLiquidDebt = liquidDebtTotal;
  const netLiquid = totalLiquidAssets - totalLiquidDebt;
  const netWorth = netLiquid + netIlliquid;
  const ytdNet = monthly.reduce((s,m)=>s+m.net,0);
  const currentYear = new Date().getFullYear();
  const currentMonthRec = monthly.find(m=> m.key === `${currentYear}-${String(new Date().getMonth()+1).padStart(2,'0')}`) || monthly[monthly.length-1] || { month: new Date().toLocaleDateString('en-US',{month:'short', year:'numeric'}), income:0, expense:0, net:0 };

  const currentCalendarMonth = new Date().getMonth() + 1;
  const billsSummary = React.useMemo(() => {
    let dueThisMonthTotal = 0;
    let paidThisMonthTotal = 0;
    let unpaidThisMonthTotal = 0;
    let dueThisMonthCount = 0;
    let paidThisMonthCount = 0;
    let unpaidThisMonthCount = 0;
    let annualizedMonthlyAvg = 0;

    bills.forEach(b => {
      const amt = b.amountDue || 0;
      annualizedMonthlyAvg += amt * monthlyFactor(b.frequency);
      const { due } = isBillDueInMonth(b, currentCalendarMonth);
      if (due) {
        dueThisMonthTotal += amt;
        dueThisMonthCount += 1;
        if (b.isPaid) {
          paidThisMonthTotal += amt;
          paidThisMonthCount += 1;
        } else {
          unpaidThisMonthTotal += amt;
          unpaidThisMonthCount += 1;
        }
      }
    });

    return {
      dueThisMonthTotal,
      paidThisMonthTotal,
      unpaidThisMonthTotal,
      dueThisMonthCount,
      paidThisMonthCount,
      unpaidThisMonthCount,
      annualizedMonthlyAvg,
    };
  }, [bills, currentCalendarMonth]);

  const filteredTransactions = React.useMemo(()=> {
    return transactions.filter(t=>{
      const matchesSearch =!search || t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
      const matchesCat = filterCat==='All' || t.category===filterCat;
      const matchesMonth =!filterMonth || t.date.startsWith(filterMonth);
      return matchesSearch && matchesCat && matchesMonth;
    });
  }, [transactions, search, filterCat, filterMonth]);

  const categoryBreakdown = React.useMemo(() => {
    const map = new Map<string, number>();
    filteredTransactions
      .filter(t => t.amount < 0 && t.category !== 'Transfers' && t.category !== 'Income')
      .forEach(t => {
        map.set(t.category, (map.get(t.category) || 0) + Math.abs(t.amount));
      });
    const total = Array.from(map.values()).reduce((a, b) => a + b, 0);
    const items = Array.from(map.entries())
      .map(([name, value]) => {
        const cat = categories.find(c => c.name === name);
        return { name, value, color: cat?.color || '#94a3b8' };
      })
      .sort((a, b) => b.value - a.value);
    return { items, total };
  }, [filteredTransactions, categories]);

  const [overviewCat, setOverviewCat] = React.useState<string>('All');
  const [overviewDateMode, setOverviewDateMode] = React.useState<'synced' | 'last_month' | 'custom'>('synced');
  const [overviewStartDate, setOverviewStartDate] = React.useState<string>(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [overviewEndDate, setOverviewEndDate] = React.useState<string>(() => new Date().toISOString().slice(0, 10));

  const overviewPeriodInfo = React.useMemo(() => {
    const now = new Date();
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthKey = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;
    const prevMonthLabel = prevMonthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (overviewDateMode === 'last_month') {
      return {
        label: `Last Month (${prevMonthLabel})`,
        referenceMonthDate: prevMonthDate,
        matchesDate: (dateStr: string) => dateStr.startsWith(prevMonthKey),
      };
    }
    if (overviewDateMode === 'custom') {
      const refDate = overviewEndDate ? new Date(`${overviewEndDate}T12:00:00`) : now;
      return {
        label: `${overviewStartDate || 'Start'} to ${overviewEndDate || 'End'}`,
        referenceMonthDate: isNaN(refDate.getTime()) ? now : refDate,
        matchesDate: (dateStr: string) => {
          if (overviewStartDate && dateStr < overviewStartDate) return false;
          if (overviewEndDate && dateStr > overviewEndDate) return false;
          return true;
        },
      };
    }

    let refDate = now;
    if (filterYear !== 'All') {
      const y = parseInt(filterYear, 10);
      const m = filterMonthOnly !== 'All' ? parseInt(filterMonthOnly, 10) - 1 : now.getMonth();
      if (!isNaN(y) && !isNaN(m)) refDate = new Date(y, m, 1);
    }

    return {
      label: filterMonth ? (filterMonthOnly === 'All' ? `${filterYear} Year` : filterMonth) : 'All Time',
      referenceMonthDate: refDate,
      matchesDate: (dateStr: string) => !filterMonth || dateStr.startsWith(filterMonth),
    };
  }, [overviewDateMode, overviewStartDate, overviewEndDate, filterMonth, filterYear, filterMonthOnly]);

  const overviewPeriodExpenses = React.useMemo(() => {
    return transactions.filter(t => {
      if (!(t.amount < 0 && t.category !== 'Transfers' && t.category !== 'Income')) return false;
      if (!overviewPeriodInfo.matchesDate(t.date)) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [transactions, overviewPeriodInfo, search]);

  const overviewPeriodBreakdown = React.useMemo(() => {
    const map = new Map<string, number>();
    overviewPeriodExpenses.forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + Math.abs(t.amount));
    });
    const total = Array.from(map.values()).reduce((a, b) => a + b, 0);
    const items = Array.from(map.entries())
      .map(([name, value]) => {
        const cat = categories.find(c => c.name === name);
        return { name, value, color: cat?.color || '#94a3b8' };
      })
      .sort((a, b) => b.value - a.value);
    return { items, total };
  }, [overviewPeriodExpenses, categories]);

  const overviewFilteredExpenses = React.useMemo(() => {
    if (overviewCat === 'All') return overviewPeriodExpenses;
    return overviewPeriodExpenses.filter(t => t.category === overviewCat);
  }, [overviewPeriodExpenses, overviewCat]);

  const overviewDisplayedBreakdown = React.useMemo(() => {
    if (overviewCat === 'All') return overviewPeriodBreakdown;
    const total = overviewFilteredExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const cat = categories.find(c => c.name === overviewCat);
    const items = total > 0
      ? [{ name: overviewCat, value: total, color: cat?.color || '#94a3b8' }]
      : [];
    return { items, total };
  }, [overviewCat, overviewPeriodBreakdown, overviewFilteredExpenses, categories]);

  const overviewCategoryComparison = React.useMemo(() => {
    const now = new Date();
    const ref = overviewPeriodInfo.referenceMonthDate;
    const refYear = ref.getFullYear();
    const refMonthIdx = ref.getMonth();
    const daysInMonth = new Date(refYear, refMonthIdx + 1, 0).getDate();
    const isCurrentCalendarMonth = refYear === now.getFullYear() && refMonthIdx === now.getMonth();
    const elapsedDays = isCurrentCalendarMonth ? Math.max(1, Math.min(now.getDate(), daysInMonth)) : daysInMonth;
    const paceMultiplier = daysInMonth / elapsedDays;

    const priorMonthDate = new Date(refYear, refMonthIdx - 1, 1);
    const priorMonthKey = `${priorMonthDate.getFullYear()}-${String(priorMonthDate.getMonth() + 1).padStart(2, '0')}`;
    const priorMonthLabel = priorMonthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const sixMonthKeys = new Set<string>();
    for (let i = 1; i <= 6; i++) {
      const mDate = new Date(refYear, refMonthIdx - i, 1);
      sixMonthKeys.add(`${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, '0')}`);
    }

    const baseExpenses = transactions.filter(
      t => t.amount < 0 && t.category !== 'Transfers' && t.category !== 'Income'
    );

    const currentSpend = overviewDisplayedBreakdown.total;
    const onPaceSpend = currentSpend * paceMultiplier;
    const paceNote = isCurrentCalendarMonth
      ? `Day ${elapsedDays} of ${daysInMonth} (${paceMultiplier.toFixed(2)}x pace)`
      : `Full ${daysInMonth}-day month`;

    const lastMonthSpend = baseExpenses
      .filter(t => t.date.startsWith(priorMonthKey) && (overviewCat === 'All' || t.category === overviewCat))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const sixMonthTotal = baseExpenses
      .filter(t => sixMonthKeys.has(t.date.slice(0, 7)) && (overviewCat === 'All' || t.category === overviewCat))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const sixMonthAvg = sixMonthTotal / 6;

    const vsLastMonthDiff = onPaceSpend - lastMonthSpend;
    const vsLastMonthPct = lastMonthSpend > 0 ? ((onPaceSpend - lastMonthSpend) / lastMonthSpend) * 100 : null;
    const vsSixMonthDiff = onPaceSpend - sixMonthAvg;
    const vsSixMonthPct = sixMonthAvg > 0 ? ((onPaceSpend - sixMonthAvg) / sixMonthAvg) * 100 : null;

    return {
      currentSpend,
      onPaceSpend,
      paceNote,
      elapsedDays,
      daysInMonth,
      isCurrentCalendarMonth,
      lastMonthSpend,
      priorMonthLabel,
      sixMonthAvg,
      vsLastMonthDiff,
      vsLastMonthPct,
      vsSixMonthDiff,
      vsSixMonthPct,
    };
  }, [transactions, overviewPeriodInfo, overviewDisplayedBreakdown.total, overviewCat]);

  const filteredTotal = React.useMemo(()=> {
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
            const clean = getCleanCategory(desc, rawCat, amt, learned);
            return {
              id: `csv-${Date.now()}-${i}-${Math.random().toString(36).slice(2,5)}`,
              date: isoDate,
              description: desc.toUpperCase().trim(),
              amount: amt,
              category: clean.category,
              learnedRule: clean.fromLearned,
              account,
              type: amt >=0? 'income' as const : 'expense' as const
            } as Transaction;
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
    setLastImport(nowStr());
    setCsvPreview(null);
    showNotice('success', `Imported ${newOnes.length} new transactions (${csvPreview.length - newOnes.length} duplicates skipped).`);
  };

  const resetToBlankSlate = () => {
    localStorage.clear();
    setLiquid(INITIAL_LIQUID);
    setIlliquid(INITIAL_ILLIQUID);
    setBills(INITIAL_BILLS);
    setMonthly(INITIAL_MONTHLY);
    setTransactions([]);
    setCategories(INITIAL_CATEGORIES);
    setNetWorthHistory([]);
    setLearned({});
    showNotice('info', 'All data cleared locally. Cloud sync will update in 2 seconds. Import a backup JSON anytime to restore.');
  };

  const openResetConfirm = () => {
    setConfirmStepTwo(false);
    setConfirmDialog({
      title: 'Reset All Data to Blank Slate?',
      body: `This will permanently delete all ${transactions.length} transactions, account balances, bills, and history from this device and cloud sync.`,
      confirmLabel: 'Continue',
      tone: 'danger',
      requireDoubleConfirm: true,
      onConfirm: () => {
        resetToBlankSlate();
        setConfirmDialog(null);
        setConfirmStepTwo(false);
      },
    });
  };

  const addManualTransaction = () => {
    if (!newTx.description.trim() || !newTx.amount) {
      setAddTxError('Please enter both a description and a non-zero amount.');
      return;
    }
    const amtNum = parseFloat(newTx.amount);
    if (isNaN(amtNum) || amtNum===0) {
      setAddTxError('Please enter a valid non-zero number for the amount.');
      return;
    }
    setAddTxError('');
    const finalAmount = newTx.type==='expense' ? -Math.abs(amtNum) : Math.abs(amtNum);
    const tx: Transaction = {
      id: `manual-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      date: newTx.date,
      description: newTx.description.toUpperCase().trim(),
      amount: finalAmount,
      category: newTx.category,
      account: 'Manual',
      type: newTx.type,
      learnedRule: false,
    };
    setTransactions(prev=> [tx, ...prev].sort((a,b)=> b.date.localeCompare(a.date)));
    setShowAddTx(false);
    setNewTx({date: new Date().toISOString().slice(0,10), description:'', amount:'', category:'Other', type:'expense'});
    setHighlightedTxId(tx.id);
    setTimeout(() => setHighlightedTxId(null), 2500);
    showNotice('success', `Added ${tx.description} (${fmt(tx.amount)}).`);
  };

  const duplicateTransaction = (t: Transaction) => {
    const defaultDate =
      filterYear !== 'All' && filterMonthOnly !== 'All'
        ? `${filterYear}-${filterMonthOnly}-${String(new Date().getDate()).padStart(2, '0')}`
        : new Date().toISOString().slice(0, 10);
    const dup: Transaction = {
      ...t,
      id: `dup-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      date: defaultDate,
    };
    setTransactions(prev=> [dup, ...prev].sort((a,b)=> b.date.localeCompare(a.date)));
    setHighlightedTxId(dup.id);
    setTimeout(() => setHighlightedTxId(null), 2500);
    showNotice('success', `Duplicated "${t.description}" on ${defaultDate}.`);
  };

  const requestDeleteTransaction = (t: Transaction) => {
    setConfirmStepTwo(false);
    setConfirmDialog({
      title: 'Delete Transaction?',
      body: `Remove "${t.description}" (${fmt(t.amount)}) on ${t.date}?`,
      confirmLabel: 'Delete Transaction',
      tone: 'danger',
      onConfirm: () => {
        setTransactions(prev => prev.filter(x => x.id !== t.id));
        setConfirmDialog(null);
        showNotice('info', `Deleted "${t.description}".`);
      },
    });
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    if (categories.find(c=>c.name.toLowerCase()===newCatName.trim().toLowerCase())) {
      showNotice('error', `Category "${newCatName.trim()}" already exists.`);
      return;
    }
    setCategories(prev=> [...prev, { name: newCatName.trim(), lastMonth: 0, currentMonth: 0, color: newCatColor }]);
    showNotice('success', `Added category "${newCatName.trim()}".`);
    setNewCatName('');
  };
  const updateCategoryName = (oldName: string, newName: string) => {
    if (!newName.trim() || oldName===newName) return;
    setCategories(prev=> prev.map(c=> c.name===oldName?{...c, name:newName.trim()}:c));
    setTransactions(prev=> prev.map(t=> t.category===oldName?{...t, category:newName.trim()}:t));
    showNotice('success', `Renamed "${oldName}" to "${newName.trim()}".`);
  };
  const updateCategoryColor = (name: string, color: string) => {
    setCategories(prev=> prev.map(c=> c.name===name?{...c, color}:c));
  };
  const deleteCategory = (name: string) => {
    if (['Other','Transfers','Income'].includes(name)) {
      showNotice('error', `"${name}" is a protected system category and cannot be deleted.`);
      return;
    }
    setConfirmStepTwo(false);
    setConfirmDialog({
      title: `Delete "${name}" Category?`,
      body: `All transactions currently tagged "${name}" will be moved to "Other".`,
      confirmLabel: 'Delete Category',
      tone: 'danger',
      onConfirm: () => {
        setCategories(prev=> prev.filter(c=>c.name!==name));
        setTransactions(prev=> prev.map(t=> t.category===name?{...t, category:'Other'}:t));
        setConfirmDialog(null);
        showNotice('info', `Deleted "${name}" and moved its transactions to Other.`);
      },
    });
  };

  const hasActiveFilters = Boolean(search || filterCat !== 'All' || filterMonth);
  const clearFilters = () => {
    setSearch('');
    setFilterCat('All');
    setFilterYear('All');
    setFilterMonthOnly('All');
  };

  return (
    <PasswordGate>
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 flex justify-between items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white grid place-items-center font-black">R</div>
            <div>
              <h1 className="text-[15px] font-bold">Rother Family Finance</h1>
              <p className="text-[11px] text-slate-500">{lastImport ? `Last import: ${lastImport}` : nowStr()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Cloud Sync Status Badge */}
            <div
              title={lastSync ? `Last cloud sync: ${lastSync}` : 'Cloud sync status'}
              className={`px-2.5 py-1.5 rounded-full border text-[11px] font-medium flex items-center gap-1.5 ${
                cloudStatus === 'synced'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : cloudStatus === 'syncing'
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : cloudStatus === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {cloudStatus === 'synced' && <Cloud size={12} />}
              {cloudStatus === 'syncing' && <RefreshCw size={12} className="animate-spin" />}
              {cloudStatus === 'error' && <CloudOff size={12} />}
              {cloudStatus === 'offline' && <CloudOff size={12} />}
              <span>
                {cloudStatus === 'synced' && `Saved${lastSync ? ` · ${lastSync}` : ''}`}
                {cloudStatus === 'syncing' && 'Syncing...'}
                {cloudStatus === 'error' && 'Sync Error'}
                {cloudStatus === 'offline' && 'Offline'}
              </span>
            </div>

            <div className="hidden md:flex gap-2">
              <div className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs">{fmt(netWorth)}</div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] border">{fmt(trueLiquidCash)}</div>
            </div>
            <button onClick={exportBackup} className="px-3 py-2 rounded-xl bg-emerald-600 text-white border text-xs font-semibold hover:bg-emerald-700">Export</button>
            <label className="px-3 py-2 rounded-xl bg-white border text-xs cursor-pointer hover:bg-slate-50">
              Import
              <input type="file" accept=".json" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) importBackup(f); e.target.value=''; }}/>
            </label>
            <button onClick={async ()=>{ try{ sessionStorage.removeItem('fam-auth'); await supabase.auth.signOut(); }catch{} location.reload(); }} className="px-3 py-2 rounded-xl bg-white border text-xs hover:bg-slate-50">Lock</button>
            <button onClick={async ()=>{ try{ sessionStorage.removeItem('fam-auth'); localStorage.removeItem('fam-auth'); await supabase.auth.signOut(); }catch{} location.reload(); }} className="px-3 py-2 rounded-xl bg-slate-100 border text-xs font-medium text-slate-700 hover:bg-slate-200">Logout</button>
            <button onClick={openResetConfirm} className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-100">Reset</button>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto">
          {['overview','accounts','bills','transactions','categories'].map(k=> <button key={k} onClick={()=>setTab(k as any)} className={`px-4 py-3 text-[13px] font-medium border-b-2 ${tab===k?'border-slate-900 text-slate-900':'border-transparent text-slate-500'}`}>{k.charAt(0).toUpperCase()+k.slice(1)}</button>)}
        </div>
      </header>

      {/* Inline Feedback Banner */}
      {banner && (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-4">
          <div className={`rounded-xl border px-4 py-3 flex items-center justify-between gap-3 text-[12px] ${
            banner.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : banner.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-slate-100 border-slate-300 text-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              {banner.type === 'success' && <CheckCircle2 size={15} />}
              {banner.type === 'error' && <AlertTriangle size={15} />}
              {banner.type === 'info' && <Info size={15} />}
              <span className="font-medium">{banner.message}</span>
            </div>
            <button onClick={() => setBanner(null)} className="p-1 rounded hover:bg-black/5">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs grid place-items-center px-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white border shadow-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 grid place-items-center shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="font-bold text-[15px] text-slate-900">
                  {confirmStepTwo ? 'Final Confirmation: Blank Slate Reset' : confirmDialog.title}
                </h3>
                <p className="text-[12px] text-slate-600 mt-1">
                  {confirmStepTwo
                    ? 'This cannot be undone unless you have exported a backup JSON file. Proceed with wiping all local and cloud records?'
                    : confirmDialog.body}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setConfirmDialog(null); setConfirmStepTwo(false); }}
                className="px-3.5 py-2 rounded-xl bg-white border text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDialog.requireDoubleConfirm && !confirmStepTwo) {
                    setConfirmStepTwo(true);
                  } else {
                    confirmDialog.onConfirm();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                {confirmStepTwo ? 'Yes, Wipe Everything' : confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Restore Modal */}
      {pendingRestore && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs grid place-items-center px-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white border shadow-xl p-6 space-y-4">
            <h3 className="font-bold text-[15px]">Restore Backup File?</h3>
            <p className="text-[12px] text-slate-600">
              Exported at <span className="font-semibold">{pendingRestore.exportedAt || 'unknown date'}</span> with{' '}
              <span className="font-semibold">{pendingRestore.transactions?.length || 0}</span> transactions. This will replace your current workspace data.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setPendingRestore(null)} className="px-3.5 py-2 rounded-xl bg-white border text-xs font-medium hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={applyPendingRestore} className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700">
                Restore Backup
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        {tab==='overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-white border p-5"><p className="text-[11px] uppercase text-slate-500">Net Worth</p><p className="text-2xl font-bold mt-1">{fmt(netWorth)}</p></div>
              <div className="rounded-2xl bg-white border p-5"><p className="text-[11px] uppercase text-slate-500">True Liquid</p><p className="text-2xl font-bold mt-1">{fmt(trueLiquidCash)}</p></div>
              <div className="rounded-2xl bg-white border p-5"><p className="text-[11px] uppercase text-slate-500">{currentMonthRec.month?.toUpperCase() || new Date().toLocaleDateString('en-US',{month:'short', year:'numeric'}).toUpperCase()} NET</p><p className={`text-2xl font-bold mt-1 ${currentMonthRec.net<0?'text-red-600':'text-emerald-600'}`}>{fmt(currentMonthRec.net)}</p><p className="text-[11px] text-slate-500 mt-1">{transactions.length} txns • {activeOverviewYear} Net {fmt(ytdNet)}</p></div>
              <div className="rounded-2xl bg-white border p-5">
                <p className="text-[11px] uppercase text-slate-500">Bills Due — {new Date().toLocaleDateString('en-US',{month:'long', year:'numeric'})}</p>
                <p className="text-2xl font-bold mt-1">{fmt(billsSummary.dueThisMonthTotal)}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  <span className="text-emerald-700 font-medium">{fmt(billsSummary.paidThisMonthTotal)} paid</span> ·{' '}
                  <span className="text-amber-700 font-medium">{fmt(billsSummary.unpaidThisMonthTotal)} remaining</span> ({billsSummary.unpaidThisMonthCount} unpaid)
                </p>
              </div>
            </div>
            <div className="grid lg:grid-cols-1 gap-6">
              <div className="rounded-2xl bg-white border p-5">
                <div className="flex justify-between items-start gap-3 flex-wrap mb-1">
                  <div>
                    <h3 className="font-semibold text-[13px]">
                      Spending by Category — {overviewCat === 'All' ? 'All Categories' : overviewCat} ({overviewPeriodInfo.label})
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Excludes Income & Transfers • {overviewFilteredExpenses.length} expenses • Total {fmt(overviewDisplayedBreakdown.total)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      aria-label="Filter spending by date range"
                      value={overviewDateMode}
                      onChange={e => setOverviewDateMode(e.target.value as 'synced' | 'last_month' | 'custom')}
                      className="px-3 py-1.5 rounded-xl border text-xs bg-white font-medium text-slate-800"
                    >
                      <option value="synced">Period: {filterMonth ? (filterMonthOnly === 'All' ? `${filterYear} Year` : filterMonth) : 'All Time'}</option>
                      <option value="last_month">Last Month</option>
                      <option value="custom">Custom Date Range</option>
                    </select>
                    {overviewDateMode === 'custom' && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <input
                          type="date"
                          aria-label="Start date"
                          value={overviewStartDate}
                          onChange={e => setOverviewStartDate(e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border text-xs bg-white"
                        />
                        <span className="text-[11px] text-slate-400">to</span>
                        <input
                          type="date"
                          aria-label="End date"
                          value={overviewEndDate}
                          onChange={e => setOverviewEndDate(e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border text-xs bg-white"
                        />
                      </div>
                    )}
                    <select
                      aria-label="Filter spending by category"
                      value={overviewCat}
                      onChange={e => setOverviewCat(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border text-xs bg-white font-medium text-slate-800"
                    >
                      <option value="All">All Spending Categories</option>
                      {categories
                        .filter(c => !['Income', 'Transfers'].includes(c.name))
                        .map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    {(overviewCat !== 'All' || overviewDateMode !== 'synced') && (
                      <button
                        onClick={() => { setOverviewCat('All'); setOverviewDateMode('synced'); }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs hover:bg-slate-200"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Comparison Strip: Current + On-Pace vs Last Month vs 6-Month Average */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div className="rounded-xl bg-slate-50 border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      {overviewCat === 'All' ? 'Current & On-Pace Spend' : `${overviewCat} Current & Pace`}
                    </p>
                    <div className="flex items-baseline justify-between gap-2 mt-0.5 flex-wrap">
                      <div>
                        <span className="text-[10px] text-slate-500 mr-1">Actual:</span>
                        <span className="text-sm font-bold text-slate-900">{fmt(overviewCategoryComparison.currentSpend)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-700 font-medium mr-1">On Pace:</span>
                        <span className="text-base font-bold text-indigo-700">{fmt(overviewCategoryComparison.onPaceSpend)}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {overviewCategoryComparison.paceNote} • {overviewFilteredExpenses.length} expenses
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Last Month ({overviewCategoryComparison.priorMonthLabel})
                    </p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">{fmt(overviewCategoryComparison.lastMonthSpend)}</p>
                    <p className={`text-[10px] font-medium mt-0.5 ${
                      overviewCategoryComparison.vsLastMonthDiff > 0
                        ? 'text-red-600'
                        : overviewCategoryComparison.vsLastMonthDiff < 0
                        ? 'text-emerald-700'
                        : 'text-slate-500'
                    }`}>
                      {overviewCategoryComparison.vsLastMonthDiff > 0 ? '▲ +' : overviewCategoryComparison.vsLastMonthDiff < 0 ? '▼ ' : ''}
                      {fmt(overviewCategoryComparison.vsLastMonthDiff)} pace vs last mo
                      {overviewCategoryComparison.vsLastMonthPct !== null
                        ? ` (${overviewCategoryComparison.vsLastMonthPct > 0 ? '+' : ''}${overviewCategoryComparison.vsLastMonthPct.toFixed(0)}%)`
                        : ''}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      6-Month Avg ({overviewCat === 'All' ? 'All Spending' : overviewCat})
                    </p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">{fmt(overviewCategoryComparison.sixMonthAvg)}</p>
                    <p className={`text-[10px] font-medium mt-0.5 ${
                      overviewCategoryComparison.vsSixMonthDiff > 0
                        ? 'text-red-600'
                        : overviewCategoryComparison.vsSixMonthDiff < 0
                        ? 'text-emerald-700'
                        : 'text-slate-500'
                    }`}>
                      {overviewCategoryComparison.vsSixMonthDiff > 0 ? '▲ +' : overviewCategoryComparison.vsSixMonthDiff < 0 ? '▼ ' : ''}
                      {fmt(overviewCategoryComparison.vsSixMonthDiff)} pace vs 6-mo avg
                      {overviewCategoryComparison.vsSixMonthPct !== null
                        ? ` (${overviewCategoryComparison.vsSixMonthPct > 0 ? '+' : ''}${overviewCategoryComparison.vsSixMonthPct.toFixed(0)}%)`
                        : ''}
                    </p>
                  </div>
                </div>

                <div className="h-[280px] mt-3">
                  {overviewDisplayedBreakdown.items.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={overviewDisplayedBreakdown.items}
                          cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" nameKey="name" paddingAngle={2}
                        >
                          {overviewDisplayedBreakdown.items.map((item) => <Cell key={item.name} fill={item.color} />)}
                        </Pie>
                        <Tooltip formatter={(v:any)=> fmt(v as number)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full rounded-xl border border-dashed bg-slate-50 grid place-items-center text-xs text-slate-500 px-4 text-center">
                      No spending recorded for {overviewCat} in {overviewPeriodInfo.label}.
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-1 max-h-[140px] overflow-auto">
                  {overviewDisplayedBreakdown.items.map(({ name, value, color }) => (
                    <div key={name} className="flex justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{background: color}}/>
                        <span>{name}</span>
                      </div>
                      <span className="font-medium">
                        {fmt(value)} ({overviewPeriodBreakdown.total>0? Math.round(value/overviewPeriodBreakdown.total*100):0}% of period spend)
                      </span>
                    </div>
                  ))}
                </div>
                {overviewCat !== 'All' && overviewFilteredExpenses.length > 0 && (
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-semibold text-slate-700">
                        {overviewCat} Transactions ({overviewFilteredExpenses.length})
                      </span>
                      <button
                        onClick={() => { setFilterCat(overviewCat); setTab('transactions'); }}
                        className="text-[11px] font-medium text-slate-900 underline hover:text-slate-600"
                      >
                        Open in Transactions →
                      </button>
                    </div>
                    <div className="max-h-[160px] overflow-auto divide-y text-[11px]">
                      {overviewFilteredExpenses.slice(0, 12).map(tx => (
                        <div key={tx.id} className="py-1.5 flex justify-between items-center gap-3">
                          <div className="min-w-0">
                            <span className="text-slate-500 mr-2">{tx.date}</span>
                            <span className="font-medium text-slate-800 truncate">{tx.description}</span>
                          </div>
                          <span className="font-semibold text-red-600 shrink-0">{fmt(tx.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white border p-5">
              <div className="flex justify-between items-center gap-2 flex-wrap mb-4">
                <div>
                  <h3 className="font-semibold text-[13px]">Monthly Cash Flow ({activeOverviewYear}) — Transfers excluded</h3>
                  <p className="text-[11px] text-slate-500">
                    {filterYear === 'All'
                      ? `Showing current calendar year (${activeOverviewYear}). Select a specific year in Transactions to view historical annual charts.`
                      : `Aligned with selected Transactions year (${activeOverviewYear}).`}
                  </p>
                </div>
              </div>
              <div className="h-[220px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/><XAxis dataKey="month" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/><Tooltip formatter={(v:any)=>fmt(v as number)}/><Bar dataKey="income" fill="#0f172a" radius={[6,6,0,0]}/><Bar dataKey="expense" fill="#ef4444" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>
              <div className="mt-4 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="text-slate-500 bg-slate-50/80"><th className="text-left font-medium px-4 py-2">Month</th><th className="text-right font-medium px-3 py-2">Income</th><th className="text-right font-medium px-3 py-2">Expenses</th><th className="text-right font-medium px-3 py-2">Net</th></tr></thead><tbody>{monthly.map(m=> <tr key={m.month} className="border-t"><td className="px-4 py-2 font-medium">{m.month}</td><td className="px-3 py-2 text-right">{fmt(m.income)}</td><td className="px-3 py-2 text-right text-red-600">{fmt(m.expense)}</td><td className={`px-3 py-2 text-right font-semibold ${m.net<0?'text-red-600':'text-emerald-600'}`}>{fmt(m.net)}</td></tr>)}<tr className="border-t-2 border-slate-900 font-bold bg-slate-50"><td className="px-4 py-2">{activeOverviewYear} Total</td><td className="px-3 py-2 text-right">{fmt(monthly.reduce((s,m)=>s+m.income,0))}</td><td className="px-3 py-2 text-right">{fmt(monthly.reduce((s,m)=>s+m.expense,0))}</td><td className="px-3 py-2 text-right">{fmt(ytdNet)}</td></tr></tbody></table></div>
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
          <div className="space-y-4">
            {/* Clear Breakdown of Due This Month vs. Paid vs. Remaining vs. Annualized Avg */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-slate-900 text-white p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-300">Due in {new Date().toLocaleDateString('en-US',{month:'long'})}</p>
                <p className="text-xl font-bold mt-1">{fmt(billsSummary.dueThisMonthTotal)}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{billsSummary.dueThisMonthCount} bills scheduled this month</p>
              </div>
              <div className="rounded-2xl bg-white border p-4">
                <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">Paid This Month</p>
                <p className="text-xl font-bold text-emerald-700 mt-1">{fmt(billsSummary.paidThisMonthTotal)}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{billsSummary.paidThisMonthCount} of {billsSummary.dueThisMonthCount} due bills paid</p>
              </div>
              <div className="rounded-2xl bg-white border p-4">
                <p className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">Remaining Unpaid</p>
                <p className="text-xl font-bold text-amber-700 mt-1">{fmt(billsSummary.unpaidThisMonthTotal)}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{billsSummary.unpaidThisMonthCount} due bills left to pay</p>
              </div>
              <div className="rounded-2xl bg-white border p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Annualized Monthly Avg</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{fmt(billsSummary.annualizedMonthlyAvg)}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Prorated across all 12 months</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white border overflow-hidden">
              <div className="px-5 py-4 border-b flex justify-between items-center gap-2 flex-wrap">
                <div>
                  <h3 className="font-semibold text-[13px]">Bills Schedule — {new Date().toLocaleDateString('en-US',{month:'long', year:'numeric'})}</h3>
                  <p className="text-[11px] text-slate-500">Highlighted rows are included in this month&apos;s due total; muted rows are scheduled for other months.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setConfirmStepTwo(false);
                      setConfirmDialog({
                        title: 'Reset All Bill Amounts to $0?',
                        body: 'This will set the Amount Due for every bill in the table to $0.00.',
                        confirmLabel: 'Reset Amounts',
                        tone: 'danger',
                        onConfirm: () => {
                          setBills(prev=> prev.map(b=> ({...b, amountDue: 0})));
                          setConfirmDialog(null);
                          showNotice('info', 'All bill amounts reset to $0.');
                        }
                      });
                    }}
                    className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold hover:bg-red-100"
                  >
                    Reset Amounts to $0
                  </button>
                  <button onClick={()=>setBills(prev=> prev.map(b=> ({...b, isPaid: false})))} className="px-2.5 py-1 rounded-full bg-white border text-[11px] hover:bg-slate-50">Unpaid all</button>
                  <button onClick={()=>setBills(prev=> prev.map(b=> ({...b, isPaid: true})))} className="px-2.5 py-1 rounded-full bg-emerald-50 border text-[11px] hover:bg-emerald-100">Paid all</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="text-left px-4 py-2.5">Name</th>
                      <th className="text-left px-3 py-2.5">This Month</th>
                      <th className="text-left px-3 py-2.5">Freq</th>
                      <th className="text-left px-3 py-2.5">Due Month</th>
                      <th className="text-right px-3 py-2.5">Amount</th>
                      <th className="text-center px-3 py-2.5">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map(b => {
                      const status = isBillDueInMonth(b, currentCalendarMonth);
                      return (
                        <tr key={b.id} className={`border-t ${status.due ? 'bg-white' : 'bg-slate-50/70 text-slate-400'}`}>
                          <td className="px-4 py-2.5 font-medium">
                            <span className={status.due ? 'text-slate-900' : 'text-slate-500'}>{b.name}</span>
                          </td>
                          <td className="px-3 py-2.5">
                            {status.due ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Included · {status.reason}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                Not Due · {status.reason}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <select value={b.frequency} onChange={e=> setBills(prev=> prev.map(x=> x.id===b.id?{...x,frequency:e.target.value}:x))} className="px-2 py-1 rounded-lg border text-[12px] bg-white text-slate-900">
                              {FREQUENCIES.map(f=> <option key={f} value={f}>{f}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-2.5">
                            <select value={b.dueMonth || ''} onChange={e=> setBills(prev=> prev.map(x=> x.id===b.id?{...x,dueMonth: e.target.value ? parseInt(e.target.value) : undefined}:x))} className="px-2 py-1 rounded-lg border text-[12px] bg-white text-slate-900">
                              <option value="">—</option>
                              <option value="1">Jan</option><option value="2">Feb</option><option value="3">Mar</option><option value="4">Apr</option><option value="5">May</option><option value="6">Jun</option><option value="7">Jul</option><option value="8">Aug</option><option value="9">Sep</option><option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option>
                            </select>
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <input type="number" value={b.amountDue} onChange={e=> setBills(prev=> prev.map(x=> x.id===b.id?{...x, amountDue: parseFloat(e.target.value)||0}:x))} className="w-[100px] text-right px-2 py-1 rounded-lg border bg-white text-slate-900"/>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <button onClick={()=> setBills(prev=> prev.map(x=> x.id===b.id?{...x,isPaid:!x.isPaid}:x))} className={`px-3 py-1 rounded-full text-[11px] border ${b.isPaid?'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold':'bg-white border-slate-200 text-slate-700'}`}>
                              {b.isPaid?'Paid':'Mark Paid'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {tab==='transactions' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white border p-5">
              <h3 className="font-semibold text-[13px] mb-4">Import CSVs</h3>
              <div onDragOver={e=>e.preventDefault()} onDrop={e=>{ e.preventDefault(); const files=e.dataTransfer.files; if(files.length>0) handleCsvUpload(files); }} className="rounded-2xl border-2 border-dashed bg-slate-50 p-8 text-center"><p className="text-[13px] font-medium">Drag & drop CSVs</p><p className="text-[11px] text-slate-500 mt-1">Multi-file • AUTOMATIC PAYMENT - THANK = Transfer • Venmo cashout = Income</p><label className="mt-3 inline-flex px-4 py-2 rounded-xl bg-slate-900 text-white text-xs cursor-pointer">Browse<input type="file" accept=".csv" multiple className="hidden" onChange={e=> e.target.files && handleCsvUpload(e.target.files)}/></label></div>
              {csvPreview && (<div className="mt-4 border rounded-xl p-4"><p className="text-[12px] font-semibold">{csvPreview.length} preview — Overview will update on Import</p><div className="mt-2 max-h-[160px] overflow-auto text-[11px]">{csvPreview.slice(0,8).map(t=> <div key={t.id} className="flex justify-between gap-2"><span className="truncate">{t.date} {t.description}</span><span className="shrink-0">{fmt(t.amount)} · {t.category}{t.learnedRule ? ' (Learned)' : ''}</span></div>)}</div><div className="mt-3 flex gap-2"><button onClick={()=>setCsvPreview(null)} className="px-3 py-2 bg-white border rounded-xl text-xs">Cancel</button><button onClick={confirmCsvImport} className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs">Import {csvPreview.length} → Updates Overview</button></div></div>)}
            </div>
            <div className="rounded-2xl bg-white border overflow-hidden">
              <div className="px-5 py-4 border-b flex gap-2 items-center flex-wrap">
                <button onClick={()=> { setShowAddTx(v=>!v); setAddTxError(''); }} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold">+ Add Transaction</button>
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
                <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} className="px-2.5 py-2 rounded-xl border text-xs bg-white"><option value="All">All Categories</option>{categories.map(c=> <option key={c.name} value={c.name}>{c.name}</option>)}</select>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="px-2.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs hover:bg-slate-200">
                    Clear Filters
                  </button>
                )}
                <span className="ml-auto text-[11px] font-medium text-slate-600">
                  Showing: {filterMonth ? (filterMonthOnly==='All' ? `${filterYear} Year` : filterMonth) : 'All Time'}
                  {filterCat !== 'All' ? ` · ${filterCat}` : ''}
                  {search ? ` · "${search}"` : ''} ({filteredTransactions.length} txns • {fmt(filteredExpense)} spent)
                </span>
              </div>
              {showAddTx && (
                <div className="px-5 py-4 bg-emerald-50/50 border-b space-y-2">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    <input type="date" value={newTx.date} onChange={e=> { setNewTx({...newTx, date:e.target.value}); setAddTxError(''); }} className="px-2 py-2 rounded-lg border text-xs bg-white"/>
                    <input value={newTx.description} onChange={e=> { setNewTx({...newTx, description:e.target.value}); setAddTxError(''); }} placeholder="Description" className="px-2 py-2 rounded-lg border text-xs col-span-2 bg-white"/>
                    <input type="number" step="0.01" value={newTx.amount} onChange={e=> { setNewTx({...newTx, amount:e.target.value}); setAddTxError(''); }} placeholder="Amount e.g. 25.50" className="px-2 py-2 rounded-lg border text-xs bg-white"/>
                    <select value={newTx.type} onChange={e=> setNewTx({...newTx, type:e.target.value as any})} className="px-2 py-2 rounded-lg border text-xs bg-white">
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                    <select value={newTx.category} onChange={e=> setNewTx({...newTx, category:e.target.value})} className="px-2 py-2 rounded-lg border text-xs bg-white">
                      <option value="Income">Income</option>
                      {categories.map(c=> <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  {addTxError && (
                    <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                      <AlertTriangle size={12} /> {addTxError}
                    </p>
                  )}
                  <div className="flex gap-2 justify-end">
                    <button onClick={()=> { setShowAddTx(false); setAddTxError(''); }} className="px-3 py-1.5 rounded-lg bg-white border text-xs">Cancel</button>
                    <button onClick={addManualTransaction} className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold">Add</button>
                  </div>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-slate-50"><tr><th className="text-left px-4 py-2.5">Date</th><th className="text-left px-3 py-2.5">Description</th><th className="text-right px-3 py-2.5">Amount</th><th className="text-left px-3 py-2.5">Category - editable</th><th className="px-4"></th></tr></thead>
                  <tbody>
                    {filteredTransactions.map(t=> {
                      const isLearnedMatch = Boolean(t.learnedRule || matchLearnedCategory(t.description, learned) === t.category);
                      return (
                        <tr key={t.id} className={`border-t transition-colors ${highlightedTxId === t.id ? 'bg-emerald-50/90' : ''}`}>
                          <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{t.date}</td>
                          <td className="px-3 py-2.5 font-medium max-w-[280px]">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate" title={t.description}>{t.description}</span>
                              {isLearnedMatch && (
                                <span
                                  title="Category matched via learned merchant rule"
                                  className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                                >
                                  <Sparkles size={9} /> Learned
                                </span>
                              )}
                            </div>
                          </td>
                          <td className={`px-3 py-2.5 text-right font-semibold whitespace-nowrap ${t.amount<0?'text-red-600':'text-emerald-700'}`}>{fmt(t.amount)}</td>
                          <td className="px-3 py-2.5 min-w-[160px]">
                            <select
                              value={t.category}
                              onChange={e=> {
                                const newCat = e.target.value;
                                const newType = newCat==='Income' ? 'income' as const : newCat==='Transfers' ? t.type : 'expense' as const;
                                setTransactions(prev=> prev.map(x=> x.id===t.id?{...x, category:newCat, type:newType, learnedRule: true}:x));
                                const key = t.description.toUpperCase().trim();
                                const baseKey = key.replace(/#\d+/g,'').replace(/\s+\d+$/g,'').trim().replace(/\s+/g,' ');
                                const baseKey2 = baseKey.replace(/#.*$/,'').trim();
                                setLearned(prev=> {
                                  const next: Record<string, string> = {...prev, [key]: newCat};
                                  if (baseKey && baseKey!==key) next[baseKey]=newCat;
                                  if (baseKey2 && baseKey2!==key) next[baseKey2]=newCat;
                                  return next;
                                });
                                setHighlightedTxId(t.id);
                                setTimeout(() => setHighlightedTxId(null), 2000);
                                showNotice('success', `Updated "${t.description}" to ${newCat} and saved merchant rule.`);
                              }}
                              className="px-2 py-1 rounded-lg border text-[11px] bg-white w-full"
                            >
                              <option value="Income">Income</option>
                              {categories.filter(c => c.name !== 'Income').map(c=> <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={()=> duplicateTransaction(t)} className="text-[11px] px-2 py-1 rounded bg-white border hover:bg-slate-50">Duplicate</button>
                              <button onClick={()=> requestDeleteTransaction(t)} className="text-[11px] px-2 py-1 rounded text-red-600 hover:bg-red-50">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
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
                      <button onClick={()=> deleteCategory(cat.name)} className="px-2.5 py-1 rounded-full border text-[11px] hover:bg-red-50 hover:border-red-200 hover:text-red-700">Delete</button>
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
