import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface VatReport {
  id: number;
  quarter: string;
  year: number;
  total_income_excl_vat: number;
  total_income_vat: number;
  total_income_incl_vat: number;
  total_expense_excl_vat: number;
  total_expense_vat: number;
  total_expense_incl_vat: number;
  vat_to_pay_or_refund: number;
  profit: number;
  status: 'open' | 'ready' | 'submitted' | 'closed';
  deadline: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface QuarterCalc {
  quarter: string;
  year: number;
  totalIncomeExclVat: number;
  totalIncomeVat: number;
  totalIncomeInclVat: number;
  totalExpenseExclVat: number;
  totalExpenseVat: number;
  totalExpenseInclVat: number;
  vatToPayOrRefund: number;
  profit: number;
  deadline: string;
}

interface AdminBoekhoudingProps {
  invoices: any[];
  expenses: any[];
}

const AdminBoekhouding: React.FC<AdminBoekhoudingProps> = ({ invoices, expenses }) => {
  const { language } = useLanguage();
  const isNL = language === 'nl';

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [vatReports, setVatReports] = useState<VatReport[]>([]);
  const [quarterCalcs, setQuarterCalcs] = useState<QuarterCalc[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'vat' | 'profit' | 'belasting'>('overview');
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const currentQuarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`;
  const currentYear = new Date().getFullYear();

  const quarterDeadlines: Record<string, string> = {
    'Q1': `${selectedYear}-04-30`,
    'Q2': `${selectedYear}-07-31`,
    'Q3': `${selectedYear}-10-31`,
    'Q4': `${selectedYear + 1}-01-31`
  };

  // Helper: get quarter from date string
  const getQuarterFromDate = (dateStr: string | null | undefined): string | null => {
    if (!dateStr) return null;
    const d = typeof dateStr === 'string' ? dateStr.substring(0, 10) : '';
    const month = parseInt(d.split('-')[1]);
    if (!month) return null;
    return `Q${Math.ceil(month / 3)}`;
  };

  const getYearFromDate = (dateStr: string | null | undefined): number | null => {
    if (!dateStr) return null;
    const d = typeof dateStr === 'string' ? dateStr.substring(0, 10) : '';
    const year = parseInt(d.split('-')[0]);
    return year || null;
  };

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      // Load saved reports from DB
      const res = await fetch(`/.netlify/functions/vat-reports?year=${selectedYear}`);
      const reports = await res.json();
      setVatReports(Array.isArray(reports) ? reports : []);
    } catch (err) {
      console.error('Error loading saved VAT reports:', err);
    }

    // Calculate directly from props (same data as Facturen/Financiën tabs)
    const calcs: QuarterCalc[] = [];
    for (const q of ['Q1', 'Q2', 'Q3', 'Q4']) {
      // Filter invoices for this quarter + year (non-draft)
      const qInvoices = invoices.filter(i => {
        if (i.status === 'draft') return false;
        const date = i.invoiceDate || i.invoice_date || i.createdAt || i.created_at;
        return getQuarterFromDate(date) === q && getYearFromDate(date) === selectedYear;
      });
      const incomeInclVat = qInvoices.reduce((sum: number, i: any) => sum + parseFloat(i.amount || 0), 0);

      // Calculate business expenses for this quarter + year
      // Monthly: counts per month, only for months that have passed or current month
      // Yearly: counts once in the quarter of the expense date
      // One-time: counts once in the quarter of the expense date
      const quarterMonthsMap: Record<string, number[]> = { 'Q1': [1,2,3], 'Q2': [4,5,6], 'Q3': [7,8,9], 'Q4': [10,11,12] };
      const now = new Date();
      const nowMonth = now.getMonth() + 1; // 1-12
      const nowYear = now.getFullYear();
      let expenseInclVat = 0;

      expenses.forEach((e: any) => {
        if (e.type !== 'business') return;
        const amount = parseFloat(e.amount || 0);
        const freq = e.frequency || 'one-time';
        const date = e.expenseDate || e.expense_date || e.createdAt || e.created_at;
        const expYear = getYearFromDate(date);
        const expQuarter = getQuarterFromDate(date);
        const expMonth = parseInt((date || '').toString().substring(5,7)) || 1;

        if (freq === 'monthly') {
          // For each month in this quarter, check if:
          // 1. The month is <= current month (don't count future months)
          // 2. The expense start date is <= that month
          if (expYear && expYear <= selectedYear) {
            const monthsInQ = quarterMonthsMap[q];
            monthsInQ.forEach(m => {
              // Don't count future months
              if (selectedYear === nowYear && m > nowMonth) return;
              // Don't count months before the expense started
              if (selectedYear === expYear && m < expMonth) return;
              expenseInclVat += amount;
            });
          }
        } else if (freq === 'yearly') {
          // Yearly: counts once in the quarter of the original date
          if (expYear === selectedYear && expQuarter === q) {
            expenseInclVat += amount;
          } else if (expYear && expYear < selectedYear) {
            // Recurring yearly from prev year: count in same quarter as original
            if (expQuarter === q) expenseInclVat += amount;
          }
        } else {
          // One-time: only in the exact quarter
          if (expQuarter === q && expYear === selectedYear) {
            expenseInclVat += amount;
          }
        }
      });

      const incomeExclVat = incomeInclVat / 1.21;
      const incomeVat = incomeInclVat - incomeExclVat;
      const expenseExclVat = expenseInclVat / 1.21;
      const expenseVat = expenseInclVat - expenseExclVat;

      calcs.push({
        quarter: q,
        year: selectedYear,
        totalIncomeExclVat: Math.round(incomeExclVat * 100) / 100,
        totalIncomeVat: Math.round(incomeVat * 100) / 100,
        totalIncomeInclVat: Math.round(incomeInclVat * 100) / 100,
        totalExpenseExclVat: Math.round(expenseExclVat * 100) / 100,
        totalExpenseVat: Math.round(expenseVat * 100) / 100,
        totalExpenseInclVat: Math.round(expenseInclVat * 100) / 100,
        vatToPayOrRefund: Math.round((incomeVat - expenseVat) * 100) / 100,
        profit: Math.round((incomeExclVat - expenseExclVat) * 100) / 100,
        deadline: quarterDeadlines[q]
      });
    }
    setQuarterCalcs(calcs);
    setLoading(false);
  }, [selectedYear, invoices, expenses, quarterDeadlines]);

  useEffect(() => {
    loadReports();
  }, [selectedYear, invoices.length, expenses.length]);

  const generateReport = async (quarter: string) => {
    setGenerating(quarter);
    try {
      // Use locally calculated data (same as what's displayed)
      const calc = quarterCalcs.find(q => q.quarter === quarter);
      if (!calc) throw new Error('Quarter not found');

      // Save to DB
      await fetch('/.netlify/functions/vat-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quarter,
          year: selectedYear,
          totalIncomeExclVat: calc.totalIncomeExclVat,
          totalIncomeVat: calc.totalIncomeVat,
          totalIncomeInclVat: calc.totalIncomeInclVat,
          totalExpenseExclVat: calc.totalExpenseExclVat,
          totalExpenseVat: calc.totalExpenseVat,
          totalExpenseInclVat: calc.totalExpenseInclVat,
          vatToPayOrRefund: calc.vatToPayOrRefund,
          profit: calc.profit,
          status: 'ready',
          deadline: calc.deadline
        })
      });

      setToast({ message: isNL ? `BTW rapport ${quarter} ${selectedYear} gegenereerd!` : `VAT report ${quarter} ${selectedYear} generated!`, type: 'success' });
      setTimeout(() => setToast(null), 3000);
      await loadReports();
    } catch (err) {
      console.error('Error generating report:', err);
      setToast({ message: isNL ? 'Fout bij genereren rapport' : 'Error generating report', type: 'error' });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setGenerating(null);
    }
  };

  const updateReportStatus = async (id: number, status: string) => {
    try {
      await fetch(`/.netlify/functions/vat-reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      await loadReports();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Aggregated yearly totals
  const yearlyTotals = quarterCalcs.reduce((acc, q) => ({
    income: acc.income + (q.totalIncomeInclVat || 0),
    incomeExcl: acc.incomeExcl + (q.totalIncomeExclVat || 0),
    expenses: acc.expenses + (q.totalExpenseInclVat || 0),
    expensesExcl: acc.expensesExcl + (q.totalExpenseExclVat || 0),
    vatCollected: acc.vatCollected + (q.totalIncomeVat || 0),
    vatPaid: acc.vatPaid + (q.totalExpenseVat || 0),
    vatNet: acc.vatNet + (q.vatToPayOrRefund || 0),
    profit: acc.profit + (q.profit || 0)
  }), { income: 0, incomeExcl: 0, expenses: 0, expensesExcl: 0, vatCollected: 0, vatPaid: 0, vatNet: 0, profit: 0 });

  // Check deadline warnings
  const getDeadlineWarning = (quarter: string): string | null => {
    const deadline = new Date(quarterDeadlines[quarter]);
    const today = new Date();
    const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return isNL ? 'VERLOPEN!' : 'OVERDUE!';
    if (daysUntil <= 14) return isNL ? `Nog ${daysUntil} dagen!` : `${daysUntil} days left!`;
    return null;
  };

  const fmt = (n: number) => `€${n.toFixed(2)}`;

  const exportCSV = (quarter: string) => {
    const calc = quarterCalcs.find(q => q.quarter === quarter);
    if (!calc) return;

    const rows = [
      ['BTW Aangifte', `${quarter} ${selectedYear}`],
      [''],
      ['Omschrijving', 'Bedrag excl. BTW', 'BTW 21%', 'Bedrag incl. BTW'],
      ['Omzet (verkopen)', calc.totalIncomeExclVat.toFixed(2), calc.totalIncomeVat.toFixed(2), calc.totalIncomeInclVat.toFixed(2)],
      ['Kosten (inkopen)', calc.totalExpenseExclVat.toFixed(2), calc.totalExpenseVat.toFixed(2), calc.totalExpenseInclVat.toFixed(2)],
      [''],
      ['BTW ontvangen (output)', calc.totalIncomeVat.toFixed(2)],
      ['BTW betaald (input)', calc.totalExpenseVat.toFixed(2)],
      ['Te betalen / terug te krijgen', calc.vatToPayOrRefund.toFixed(2)],
      [''],
      ['Winst (excl. BTW)', calc.profit.toFixed(2)],
      ['Deadline aangifte', calc.deadline]
    ];

    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `btw-aangifte-${quarter}-${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportBelastingPDF = (quarter: string) => {
    const calc = quarterCalcs.find(q => q.quarter === quarter);
    if (!calc) return;

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>BTW Aangifte ${quarter} ${selectedYear}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333; background: #fff; }
  .header { background: linear-gradient(135deg, #1a3050, #2a5a8c); color: white; padding: 30px; margin: -40px -40px 30px; }
  .header h1 { font-size: 28px; margin-bottom: 5px; }
  .header p { opacity: 0.8; }
  .section { margin-bottom: 25px; }
  .section h2 { font-size: 18px; color: #1a3050; border-bottom: 2px solid #1a3050; padding-bottom: 8px; margin-bottom: 15px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
  th { background: #f0f4f8; text-align: left; padding: 10px 15px; font-size: 13px; font-weight: 600; color: #1a3050; }
  td { padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
  .amount { text-align: right; font-family: 'Courier New', monospace; }
  .total-row { font-weight: 700; background: #e8f4e8; }
  .warning-row { background: #fef3cd; }
  .refund-row { background: #d4edda; }
  .pay-row { background: #f8d7da; }
  .info-box { background: #e3f2fd; border-left: 4px solid #1a3050; padding: 15px; margin: 20px 0; font-size: 13px; }
  .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 11px; color: #666; }
  @media print { body { padding: 20px; } .header { margin: -20px -20px 20px; } }
</style></head><body>
<div class="header">
  <h1>BTW Aangifte - ${quarter} ${selectedYear}</h1>
  <p>Varexo | Mohammed Taher | Gegenereerd: ${new Date().toLocaleDateString('nl-NL')}</p>
</div>

<div class="section">
  <h2>1. Omzet en BTW</h2>
  <table>
    <tr><th>Omschrijving</th><th class="amount">Excl. BTW</th><th class="amount">BTW 21%</th><th class="amount">Incl. BTW</th></tr>
    <tr><td>Omzet (verkopen)</td><td class="amount">${fmt(calc.totalIncomeExclVat)}</td><td class="amount">${fmt(calc.totalIncomeVat)}</td><td class="amount">${fmt(calc.totalIncomeInclVat)}</td></tr>
    <tr><td>Kosten (zakelijke inkopen)</td><td class="amount">${fmt(calc.totalExpenseExclVat)}</td><td class="amount">${fmt(calc.totalExpenseVat)}</td><td class="amount">${fmt(calc.totalExpenseInclVat)}</td></tr>
  </table>
</div>

<div class="section">
  <h2>2. BTW Berekening (voor Belastingdienst)</h2>
  <table>
    <tr><td><strong>1a. Leveringen/diensten belast met 21%</strong></td><td class="amount">${fmt(calc.totalIncomeExclVat)}</td><td class="amount">${fmt(calc.totalIncomeVat)}</td></tr>
    <tr><td><strong>5b. Voorbelasting (betaalde BTW)</strong></td><td class="amount"></td><td class="amount">${fmt(calc.totalExpenseVat)}</td></tr>
    <tr class="${calc.vatToPayOrRefund >= 0 ? 'pay-row' : 'refund-row'}">
      <td><strong>${calc.vatToPayOrRefund >= 0 ? 'Te betalen BTW' : 'Terug te ontvangen BTW'}</strong></td>
      <td class="amount"></td>
      <td class="amount"><strong>${fmt(Math.abs(calc.vatToPayOrRefund))}</strong></td>
    </tr>
  </table>
</div>

<div class="section">
  <h2>3. Winst- en verliesoverzicht</h2>
  <table>
    <tr><td>Omzet excl. BTW</td><td class="amount">${fmt(calc.totalIncomeExclVat)}</td></tr>
    <tr><td>Kosten excl. BTW</td><td class="amount">- ${fmt(calc.totalExpenseExclVat)}</td></tr>
    <tr class="total-row"><td><strong>Winst ${quarter} ${selectedYear}</strong></td><td class="amount"><strong>${fmt(calc.profit)}</strong></td></tr>
  </table>
</div>

<div class="info-box">
  <strong>Deadline BTW aangifte:</strong> ${new Date(calc.deadline).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
  <strong>Let op:</strong> Dit rapport is automatisch gegenereerd. Controleer de cijfers voordat je aangifte doet bij de Belastingdienst.
</div>

<div class="footer">
  <p>Gegenereerd door Varexo Administratie | ${new Date().toLocaleString('nl-NL')}</p>
  <p>Dit document is geen officieel belastingdocument. Gebruik het als hulpmiddel bij het invullen van je BTW aangifte.</p>
</div>
</body></html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span className="ml-3 text-gray-400">{isNL ? 'Laden...' : 'Loading...'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      {/* Year selector + Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">{isNL ? 'ZZP Boekhouding' : 'Freelancer Accounting'}</h2>
          <p className="text-gray-400 text-sm">{isNL ? 'BTW, winst & belastingaangifte overzicht' : 'VAT, profit & tax filing overview'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedYear(y => y - 1)} className="bg-dark-700 text-gray-300 px-3 py-2 rounded hover:bg-dark-600">←</button>
          <span className="text-white font-bold text-lg">{selectedYear}</span>
          <button onClick={() => setSelectedYear(y => y + 1)} className="bg-dark-700 text-gray-300 px-3 py-2 rounded hover:bg-dark-600">→</button>
          <button onClick={loadReports} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm ml-3">
            {isNL ? 'Ververs' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 bg-dark-800 p-1 rounded-lg">
        {[
          { key: 'overview', label: isNL ? 'Overzicht' : 'Overview' },
          { key: 'vat', label: isNL ? 'BTW Rapporten' : 'VAT Reports' },
          { key: 'profit', label: isNL ? 'Winst & Verlies' : 'Profit & Loss' },
          { key: 'belasting', label: isNL ? 'Belastingaangifte' : 'Tax Filing' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeSection === tab.key
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== OVERVIEW SECTION ==================== */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Yearly summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-dark-800 p-5 rounded-lg border border-dark-700">
              <p className="text-gray-400 text-xs uppercase tracking-wide">{isNL ? 'Omzet (incl. BTW)' : 'Revenue (incl. VAT)'}</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{fmt(yearlyTotals.income)}</p>
              <p className="text-gray-500 text-xs mt-1">{isNL ? 'Excl. BTW:' : 'Excl. VAT:'} {fmt(yearlyTotals.incomeExcl)}</p>
            </div>
            <div className="bg-dark-800 p-5 rounded-lg border border-dark-700">
              <p className="text-gray-400 text-xs uppercase tracking-wide">{isNL ? 'Kosten (incl. BTW)' : 'Expenses (incl. VAT)'}</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{fmt(yearlyTotals.expenses)}</p>
              <p className="text-gray-500 text-xs mt-1">{isNL ? 'Excl. BTW:' : 'Excl. VAT:'} {fmt(yearlyTotals.expensesExcl)}</p>
            </div>
            <div className="bg-dark-800 p-5 rounded-lg border border-dark-700">
              <p className="text-gray-400 text-xs uppercase tracking-wide">{isNL ? 'Winst' : 'Profit'}</p>
              <p className={`text-2xl font-bold mt-1 ${yearlyTotals.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt(yearlyTotals.profit)}</p>
              <p className="text-gray-500 text-xs mt-1">{isNL ? 'Excl. BTW' : 'Excl. VAT'}</p>
            </div>
            <div className="bg-dark-800 p-5 rounded-lg border border-dark-700">
              <p className="text-gray-400 text-xs uppercase tracking-wide">{isNL ? 'BTW Saldo' : 'VAT Balance'}</p>
              <p className={`text-2xl font-bold mt-1 ${yearlyTotals.vatNet >= 0 ? 'text-yellow-400' : 'text-blue-400'}`}>{fmt(Math.abs(yearlyTotals.vatNet))}</p>
              <p className="text-gray-500 text-xs mt-1">{yearlyTotals.vatNet >= 0 ? (isNL ? 'Te betalen' : 'To pay') : (isNL ? 'Terug te krijgen' : 'To receive')}</p>
            </div>
          </div>

          {/* Quarterly breakdown */}
          <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
            <div className="p-4 border-b border-dark-700">
              <h3 className="text-lg font-semibold text-white">{isNL ? 'Kwartaaloverzicht' : 'Quarterly Overview'} {selectedYear}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-700/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">{isNL ? 'Kwartaal' : 'Quarter'}</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">{isNL ? 'Omzet' : 'Revenue'}</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">{isNL ? 'Kosten' : 'Expenses'}</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">{isNL ? 'Winst' : 'Profit'}</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">{isNL ? 'BTW te betalen' : 'VAT to pay'}</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">{isNL ? 'Deadline' : 'Deadline'}</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {quarterCalcs.map((q) => {
                    const savedReport = vatReports.find(r => r.quarter === q.quarter);
                    const warning = getDeadlineWarning(q.quarter);
                    const isCurrent = q.quarter === currentQuarter && selectedYear === currentYear;
                    return (
                      <tr key={q.quarter} className={`${isCurrent ? 'bg-primary-900/20' : ''} hover:bg-dark-700/30`}>
                        <td className="px-4 py-3">
                          <span className="text-white font-semibold">{q.quarter}</span>
                          {isCurrent && <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-0.5 rounded">{isNL ? 'Huidig' : 'Current'}</span>}
                        </td>
                        <td className="px-4 py-3 text-right text-green-400 font-mono text-sm">{fmt(q.totalIncomeInclVat)}</td>
                        <td className="px-4 py-3 text-right text-red-400 font-mono text-sm">{fmt(q.totalExpenseInclVat)}</td>
                        <td className={`px-4 py-3 text-right font-mono text-sm font-semibold ${q.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt(q.profit)}</td>
                        <td className={`px-4 py-3 text-right font-mono text-sm ${q.vatToPayOrRefund >= 0 ? 'text-yellow-400' : 'text-blue-400'}`}>
                          {q.vatToPayOrRefund >= 0 ? fmt(q.vatToPayOrRefund) : `${fmt(Math.abs(q.vatToPayOrRefund))} ↩`}
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          <span className="text-gray-300">{new Date(quarterDeadlines[q.quarter]).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}</span>
                          {warning && <span className="block text-xs text-red-400 font-semibold">{warning}</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {savedReport ? (
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                              savedReport.status === 'submitted' ? 'bg-green-900/50 text-green-400' :
                              savedReport.status === 'ready' ? 'bg-yellow-900/50 text-yellow-400' :
                              savedReport.status === 'closed' ? 'bg-gray-700 text-gray-400' :
                              'bg-blue-900/50 text-blue-400'
                            }`}>
                              {savedReport.status === 'submitted' ? (isNL ? 'Ingediend' : 'Submitted') :
                               savedReport.status === 'ready' ? (isNL ? 'Klaar' : 'Ready') :
                               savedReport.status === 'closed' ? (isNL ? 'Gesloten' : 'Closed') :
                               (isNL ? 'Open' : 'Open')}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deadline warnings */}
          {['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
            const warning = getDeadlineWarning(q);
            const saved = vatReports.find(r => r.quarter === q && r.year === selectedYear);
            if (!warning || (saved && saved.status === 'submitted')) return null;
            return (
              <div key={q} className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 font-semibold">⚠️ {isNL ? 'BTW aangifte' : 'VAT filing'} {q} {selectedYear}</p>
                  <p className="text-yellow-200 text-sm">{warning} — {isNL ? 'Deadline:' : 'Deadline:'} {new Date(quarterDeadlines[q]).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <button onClick={() => { setActiveSection('belasting'); }} className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700">
                  {isNL ? 'Bekijk rapport' : 'View report'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== VAT REPORTS SECTION ==================== */}
      {activeSection === 'vat' && (
        <div className="space-y-6">
          {quarterCalcs.map((q) => {
            const savedReport = vatReports.find(r => r.quarter === q.quarter);
            return (
              <div key={q.quarter} className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
                <div className="p-4 border-b border-dark-700 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{q.quarter} {selectedYear} — {isNL ? 'BTW Rapport' : 'VAT Report'}</h3>
                    <p className="text-gray-400 text-sm">{isNL ? 'Deadline:' : 'Deadline:'} {new Date(quarterDeadlines[q.quarter]).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => generateReport(q.quarter)} disabled={generating === q.quarter}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50">
                      {generating === q.quarter ? '...' : (isNL ? 'Genereer' : 'Generate')}
                    </button>
                    <button onClick={() => exportCSV(q.quarter)} className="bg-dark-700 text-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-dark-600">CSV</button>
                    <button onClick={() => exportBelastingPDF(q.quarter)} className="bg-dark-700 text-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-dark-600">PDF</button>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-500 text-xs">{isNL ? 'BTW ontvangen' : 'VAT collected'}</p>
                    <p className="text-lg font-semibold text-green-400">{fmt(q.totalIncomeVat)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">{isNL ? 'BTW betaald (voorbelasting)' : 'VAT paid (input)'}</p>
                    <p className="text-lg font-semibold text-blue-400">{fmt(q.totalExpenseVat)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">{isNL ? 'Verschil (te betalen / terug)' : 'Difference (to pay / refund)'}</p>
                    <p className={`text-lg font-semibold ${q.vatToPayOrRefund >= 0 ? 'text-yellow-400' : 'text-blue-400'}`}>
                      {q.vatToPayOrRefund >= 0 ? fmt(q.vatToPayOrRefund) : `- ${fmt(Math.abs(q.vatToPayOrRefund))}`}
                    </p>
                    <p className="text-gray-500 text-xs">{q.vatToPayOrRefund >= 0 ? (isNL ? 'Te betalen' : 'To pay') : (isNL ? 'Terug te krijgen' : 'Refund')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Status</p>
                    {savedReport ? (
                      <select
                        value={savedReport.status}
                        onChange={(e) => updateReportStatus(savedReport.id, e.target.value)}
                        className="bg-dark-700 text-white border border-dark-600 rounded px-2 py-1 text-sm mt-1"
                      >
                        <option value="open">Open</option>
                        <option value="ready">{isNL ? 'Klaar' : 'Ready'}</option>
                        <option value="submitted">{isNL ? 'Ingediend' : 'Submitted'}</option>
                        <option value="closed">{isNL ? 'Gesloten' : 'Closed'}</option>
                      </select>
                    ) : (
                      <p className="text-gray-500 text-sm mt-1">{isNL ? 'Nog niet gegenereerd' : 'Not generated yet'}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== PROFIT & LOSS SECTION ==================== */}
      {activeSection === 'profit' && (
        <div className="space-y-6">
          <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
            <h3 className="text-xl font-bold text-white mb-6">{isNL ? 'Winst & Verliesrekening' : 'Profit & Loss Statement'} {selectedYear}</h3>
            
            <div className="space-y-4">
              {/* Income section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">{isNL ? 'Inkomsten' : 'Income'}</h4>
                <div className="bg-dark-700 rounded-lg overflow-hidden">
                  {quarterCalcs.map(q => (
                    <div key={q.quarter} className="flex justify-between items-center px-4 py-3 border-b border-dark-600 last:border-0">
                      <span className="text-gray-300">{isNL ? 'Omzet' : 'Revenue'} {q.quarter}</span>
                      <span className="text-green-400 font-mono">{fmt(q.totalIncomeExclVat)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-3 bg-green-900/20 font-semibold">
                    <span className="text-green-300">{isNL ? 'Totaal inkomsten' : 'Total income'}</span>
                    <span className="text-green-400 font-mono">{fmt(yearlyTotals.incomeExcl)}</span>
                  </div>
                </div>
              </div>

              {/* Expenses section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">{isNL ? 'Uitgaven' : 'Expenses'}</h4>
                <div className="bg-dark-700 rounded-lg overflow-hidden">
                  {quarterCalcs.map(q => (
                    <div key={q.quarter} className="flex justify-between items-center px-4 py-3 border-b border-dark-600 last:border-0">
                      <span className="text-gray-300">{isNL ? 'Kosten' : 'Expenses'} {q.quarter}</span>
                      <span className="text-red-400 font-mono">- {fmt(q.totalExpenseExclVat)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-3 bg-red-900/20 font-semibold">
                    <span className="text-red-300">{isNL ? 'Totaal uitgaven' : 'Total expenses'}</span>
                    <span className="text-red-400 font-mono">- {fmt(yearlyTotals.expensesExcl)}</span>
                  </div>
                </div>
              </div>

              {/* Profit */}
              <div className={`rounded-lg p-5 ${yearlyTotals.profit >= 0 ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">{isNL ? 'Netto winst' : 'Net profit'} {selectedYear}</span>
                  <span className={`text-2xl font-bold font-mono ${yearlyTotals.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt(yearlyTotals.profit)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== BELASTING (TAX FILING) SECTION ==================== */}
      {activeSection === 'belasting' && (
        <div className="space-y-6">
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <p className="text-blue-300 font-semibold">ℹ️ {isNL ? 'Hulpmiddel voor BTW aangifte' : 'Tax filing helper'}</p>
            <p className="text-blue-200 text-sm mt-1">
              {isNL 
                ? 'Dit rapport helpt je bij het invullen van je BTW aangifte bij de Belastingdienst. Kopieer de nummers naar het aangifte formulier. Dit is GEEN automatische indiening.'
                : 'This report helps you fill in your VAT return at the tax office. Copy the numbers to the filing form. This is NOT an automatic submission.'}
            </p>
          </div>

          {quarterCalcs.map((q) => (
            <div key={q.quarter} className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
              <div className="p-4 border-b border-dark-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">{q.quarter} {selectedYear} — {isNL ? 'Belastingaangifte Overzicht' : 'Tax Filing Overview'}</h3>
                <div className="flex gap-2">
                  <button onClick={() => exportBelastingPDF(q.quarter)} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700">
                    📄 {isNL ? 'Export PDF' : 'Export PDF'}
                  </button>
                  <button onClick={() => exportCSV(q.quarter)} className="bg-dark-700 text-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-dark-600">
                    📊 CSV
                  </button>
                  <button onClick={() => generateReport(q.quarter)} disabled={generating === q.quarter}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
                    {generating === q.quarter ? '...' : (isNL ? '💾 Opslaan' : '💾 Save')}
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-600">
                      <th className="text-left py-2 text-gray-400 text-sm">{isNL ? 'Rubriek Belastingdienst' : 'Tax field'}</th>
                      <th className="text-right py-2 text-gray-400 text-sm">{isNL ? 'Omzet / Bedrag' : 'Amount'}</th>
                      <th className="text-right py-2 text-gray-400 text-sm">BTW</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    <tr>
                      <td className="py-3 text-gray-300"><strong>1a.</strong> {isNL ? 'Leveringen/diensten belast met 21%' : 'Supplies/services taxed at 21%'}</td>
                      <td className="py-3 text-right font-mono text-green-400">{fmt(q.totalIncomeExclVat)}</td>
                      <td className="py-3 text-right font-mono text-green-400">{fmt(q.totalIncomeVat)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-300"><strong>5b.</strong> {isNL ? 'Voorbelasting' : 'Input VAT'}</td>
                      <td className="py-3 text-right font-mono text-blue-400"></td>
                      <td className="py-3 text-right font-mono text-blue-400">{fmt(q.totalExpenseVat)}</td>
                    </tr>
                    <tr className={`${q.vatToPayOrRefund >= 0 ? 'bg-yellow-900/20' : 'bg-blue-900/20'}`}>
                      <td className="py-3 text-white font-semibold">
                        {q.vatToPayOrRefund >= 0 
                          ? (isNL ? '🔴 Te betalen BTW' : '🔴 VAT to pay')
                          : (isNL ? '🟢 Terug te ontvangen BTW' : '🟢 VAT refund')}
                      </td>
                      <td className="py-3 text-right"></td>
                      <td className={`py-3 text-right font-mono font-bold ${q.vatToPayOrRefund >= 0 ? 'text-yellow-400' : 'text-blue-400'}`}>
                        {fmt(Math.abs(q.vatToPayOrRefund))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBoekhouding;
