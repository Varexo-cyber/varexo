import React, { useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckIcon, ArrowIcon } from './Section';
import { RexoMark } from './RexoBanner';

// "Rexo Werknemer" configurator: pick a role, tasks, integrations and your own
// numbers; get an indicative time/cost saving and send the whole setup via WhatsApp.

type L = { nl: string; en: string };
type Task = { id: string; label: L; hours: number };
type Role = { id: string; name: L; desc: L; icon: string; tasks: Task[] };

const WA = '31636075966';

const ROLES: Role[] = [
  {
    id: 'reception', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    name: { nl: 'Receptionist', en: 'Receptionist' },
    desc: { nl: 'Vangt vragen op, plant afspraken en verbindt door.', en: 'Handles questions, books appointments and routes requests.' },
    tasks: [
      { id: 'r1', label: { nl: 'Vragen van klanten beantwoorden', en: 'Answer customer questions' }, hours: 6 },
      { id: 'r2', label: { nl: 'Afspraken inplannen en verzetten', en: 'Book and reschedule appointments' }, hours: 4 },
      { id: 'r3', label: { nl: 'Berichten doorzetten naar de juiste persoon', en: 'Route messages to the right person' }, hours: 2 },
      { id: 'r4', label: { nl: 'Bevestigingen en herinneringen sturen', en: 'Send confirmations and reminders' }, hours: 2 },
    ],
  },
  {
    id: 'office', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    name: { nl: 'Office manager', en: 'Office manager' },
    desc: { nl: 'Houdt mail, agenda en documenten van de baas bij.', en: 'Keeps the boss’s mail, calendar and documents in order.' },
    tasks: [
      { id: 'o1', label: { nl: 'Mail sorteren en samenvatten', en: 'Sort and summarise email' }, hours: 5 },
      { id: 'o2', label: { nl: 'Agenda beheren en vergaderingen plannen', en: 'Manage calendar and plan meetings' }, hours: 3 },
      { id: 'o3', label: { nl: 'Documenten opstellen, openen en printen', en: 'Draft, open and print documents' }, hours: 3 },
      { id: 'o4', label: { nl: 'Notulen en actiepunten bijhouden', en: 'Keep minutes and action points' }, hours: 2 },
    ],
  },
  {
    id: 'support', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    name: { nl: 'Klantenservice', en: 'Customer service' },
    desc: { nl: 'Beantwoordt WhatsApp, mail en DM’s in jouw toon.', en: 'Replies to WhatsApp, email and DMs in your tone.' },
    tasks: [
      { id: 's1', label: { nl: 'WhatsApp- en Instagram-berichten beantwoorden', en: 'Reply to WhatsApp and Instagram messages' }, hours: 6 },
      { id: 's2', label: { nl: 'Veelgestelde vragen afhandelen', en: 'Handle frequently asked questions' }, hours: 4 },
      { id: 's3', label: { nl: 'Status van bestellingen of afspraken opzoeken', en: 'Look up order or appointment status' }, hours: 3 },
      { id: 's4', label: { nl: 'Klachten registreren en doorzetten', en: 'Log and escalate complaints' }, hours: 1 },
    ],
  },
  {
    id: 'admin', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    name: { nl: 'Administratie', en: 'Administration' },
    desc: { nl: 'Neemt het papierwerk en de opvolging over.', en: 'Takes over paperwork and follow-ups.' },
    tasks: [
      { id: 'a1', label: { nl: 'Offertes en facturen klaarzetten', en: 'Prepare quotes and invoices' }, hours: 4 },
      { id: 'a2', label: { nl: 'Betalingsherinneringen opvolgen', en: 'Follow up payment reminders' }, hours: 2 },
      { id: 'a3', label: { nl: 'Gegevens invoeren en bijwerken', en: 'Enter and update data' }, hours: 4 },
      { id: 'a4', label: { nl: 'Bonnetjes en documenten ordenen', en: 'Organise receipts and documents' }, hours: 2 },
    ],
  },
  {
    id: 'planner', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    name: { nl: 'Planner', en: 'Planner' },
    desc: { nl: 'Plant mensen, ritten of klussen en houdt overzicht.', en: 'Schedules people, trips or jobs and keeps the overview.' },
    tasks: [
      { id: 'p1', label: { nl: 'Roosters en planning maken', en: 'Create rosters and schedules' }, hours: 4 },
      { id: 'p2', label: { nl: 'Wijzigingen doorvoeren en iedereen informeren', en: 'Process changes and inform everyone' }, hours: 3 },
      { id: 'p3', label: { nl: 'Dagelijkse overzichten voor de manager', en: 'Daily overviews for the manager' }, hours: 2 },
    ],
  },
  {
    id: 'sales', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    name: { nl: 'Sales-assistent', en: 'Sales assistant' },
    desc: { nl: 'Volgt leads op zodat er geen klant blijft liggen.', en: 'Follows up leads so no customer slips through.' },
    tasks: [
      { id: 'l1', label: { nl: 'Nieuwe aanvragen direct opvolgen', en: 'Follow up new enquiries right away' }, hours: 3 },
      { id: 'l2', label: { nl: 'Leads bijhouden in je klantenlijst of CRM', en: 'Track leads in your customer list or CRM' }, hours: 2 },
      { id: 'l3', label: { nl: 'Herinneringen en follow-up berichten sturen', en: 'Send reminders and follow-up messages' }, hours: 3 },
    ],
  },
];

const INTEGRATIONS: L[] = [
  { nl: 'Gmail / Outlook', en: 'Gmail / Outlook' }, { nl: 'Agenda', en: 'Calendar' }, { nl: 'WhatsApp Business', en: 'WhatsApp Business' },
  { nl: 'Instagram & Facebook', en: 'Instagram & Facebook' }, { nl: 'CRM / klantenlijst', en: 'CRM / customer list' }, { nl: 'Boekhouding', en: 'Accounting' },
  { nl: 'Planningssoftware', en: 'Scheduling software' }, { nl: 'Website-chat', en: 'Website chat' }, { nl: 'Eigen software', en: 'Own software' },
];

const fmt = (n: number) => n.toLocaleString('nl-NL', { maximumFractionDigits: 0 });

const RexoEmployeeBuilder: React.FC = () => {
  const { language } = useLanguage();
  const nl = language === 'nl';
  const tr = (l: L) => (nl ? l.nl : l.en);

  const [roleIds, setRoleIds] = useState<string[]>(['office']);
  const [taskIds, setTaskIds] = useState<string[]>(ROLES.find((r) => r.id === 'office')!.tasks.map((t) => t.id));
  const [integrations, setIntegrations] = useState<number[]>([0, 1]);
  const [wage, setWage] = useState(35);
  const [people, setPeople] = useState(1);
  const [hours, setHours] = useState<'office' | 'extended' | 'always'>('office');
  const [voice, setVoice] = useState<'rexo' | 'own'>('rexo');
  const [langs, setLangs] = useState<string[]>(['NL']);
  const [name, setName] = useState('');

  const roles = ROLES.filter((r) => roleIds.includes(r.id));
  const tasks = roles.flatMap((r) => r.tasks).filter((t) => taskIds.includes(t.id));

  const toggleRole = (r: Role) => {
    if (roleIds.includes(r.id)) {
      if (roleIds.length === 1) return;
      setRoleIds(roleIds.filter((x) => x !== r.id));
      setTaskIds(taskIds.filter((t) => !r.tasks.some((rt) => rt.id === t)));
    } else {
      setRoleIds([...roleIds, r.id]);
      setTaskIds([...taskIds, ...r.tasks.map((t) => t.id)]);
    }
  };
  const toggle = <T,>(list: T[], v: T, set: (x: T[]) => void) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const calc = useMemo(() => {
    const weekly = tasks.reduce((s, t) => s + t.hours, 0) * people;
    const monthlyHours = weekly * 4.33;
    const monthlyCost = monthlyHours * wage;
    const fte = weekly / 38;
    return { weekly, monthlyHours, monthlyCost, yearlyCost: monthlyCost * 12, fte };
  }, [tasks, people, wage]);

  const hoursLabel = { office: nl ? 'Kantooruren' : 'Office hours', extended: nl ? 'Ook ’s avonds en weekend' : 'Evenings & weekends too', always: '24/7' }[hours];

  const summary = [
    `${nl ? 'Hoi Varexo! Ik wil een Rexo Werknemer op maat' : 'Hi Varexo! I would like a custom Rexo Employee'}${name ? ` (${nl ? 'naam' : 'name'}: ${name})` : ''}.`,
    '',
    `${nl ? 'Functies' : 'Roles'}: ${roles.map((r) => tr(r.name)).join(', ')}`,
    `${nl ? 'Taken' : 'Tasks'}:`,
    ...tasks.map((t) => `- ${tr(t.label)}`),
    `${nl ? 'Koppelingen' : 'Integrations'}: ${integrations.map((i) => tr(INTEGRATIONS[i])).join(', ') || '-'}`,
    `${nl ? 'Beschikbaar' : 'Available'}: ${hoursLabel} · ${nl ? 'Talen' : 'Languages'}: ${langs.join(', ')} · ${nl ? 'Stem' : 'Voice'}: ${voice === 'own' ? (nl ? 'eigen stem' : 'own voice') : 'Rexo'}`,
    `${nl ? 'Indicatie' : 'Estimate'}: ±${fmt(calc.monthlyHours)} ${nl ? 'uur per maand' : 'hours per month'} (≈ €${fmt(calc.monthlyCost)} ${nl ? 'per maand aan uren' : 'per month in hours'})`,
  ].join('\n');

  const step = (n: number, title: string) => (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-8 h-8 rounded-full bg-white text-dark-950 text-sm font-bold flex items-center justify-center">{n}</span>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 space-y-6">
        {/* 1. roles */}
        <div className="surface p-6 md:p-8">
          {step(1, nl ? 'Welke functie(s) moet je Rexo Werknemer vervullen?' : 'Which role(s) should your Rexo Employee fill?')}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {ROLES.map((r) => {
              const on = roleIds.includes(r.id);
              return (
                <button key={r.id} type="button" onClick={() => toggleRole(r)}
                  className={`text-left p-4 rounded-2xl border transition ${on ? 'border-primary-400 bg-primary-500/10' : 'border-white/10 hover:border-white/25 bg-white/[0.02]'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <svg className={`w-6 h-6 ${on ? 'text-primary-300' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d={r.icon} /></svg>
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${on ? 'bg-primary-500 border-primary-500 text-dark-950' : 'border-white/20'}`}>{on && <CheckIcon />}</span>
                  </div>
                  <div className="font-semibold text-white">{tr(r.name)}</div>
                  <div className="text-xs text-gray-400 mt-1 leading-relaxed">{tr(r.desc)}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. tasks */}
        <div className="surface p-6 md:p-8">
          {step(2, nl ? 'Welke taken neemt hij over?' : 'Which tasks does it take over?')}
          <div className="space-y-5">
            {roles.map((r) => (
              <div key={r.id}>
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">{tr(r.name)}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {r.tasks.map((t) => {
                    const on = taskIds.includes(t.id);
                    return (
                      <button key={t.id} type="button" onClick={() => toggle(taskIds, t.id, setTaskIds)}
                        className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border text-sm transition ${on ? 'border-primary-500/50 bg-primary-500/[0.08] text-white' : 'border-white/10 text-gray-400 hover:border-white/25'}`}>
                        <span className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center ${on ? 'bg-primary-500 border-primary-500 text-dark-950' : 'border-white/20'}`}>{on && <CheckIcon />}</span>
                        <span className="flex-1">{tr(t.label)}</span>
                        <span className="text-xs text-gray-500 tabular-nums">~{t.hours}{nl ? 'u' : 'h'}/{nl ? 'wk' : 'wk'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. setup */}
        <div className="surface p-6 md:p-8">
          {step(3, nl ? 'Koppelingen en karakter' : 'Integrations and character')}
          <div className="label">{nl ? 'Met welke systemen moet hij werken?' : 'Which systems should it work with?'}</div>
          <div className="flex flex-wrap gap-2 mb-6">
            {INTEGRATIONS.map((g, i) => (
              <button key={i} type="button" onClick={() => toggle(integrations, i, setIntegrations)}
                className={`px-3.5 py-2 rounded-full text-sm border transition ${integrations.includes(i) ? 'bg-primary-500 border-primary-500 text-dark-950 font-semibold' : 'border-white/10 text-gray-300 hover:border-white/30'}`}>
                {tr(g)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <div className="label">{nl ? 'Beschikbaarheid' : 'Availability'}</div>
              <div className="flex flex-col gap-2">
                {(['office', 'extended', 'always'] as const).map((h) => (
                  <button key={h} type="button" onClick={() => setHours(h)} className={`px-3 py-2 rounded-xl text-sm border text-left ${hours === h ? 'border-primary-400 text-white bg-primary-500/10' : 'border-white/10 text-gray-400'}`}>
                    {{ office: nl ? 'Kantooruren' : 'Office hours', extended: nl ? 'Ook ’s avonds en weekend' : 'Evenings & weekends', always: '24/7' }[h]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="label">{nl ? 'Talen' : 'Languages'}</div>
              <div className="flex flex-wrap gap-2">
                {['NL', 'EN', 'DE', 'FR', 'TR', 'AR'].map((l) => (
                  <button key={l} type="button" onClick={() => (langs.includes(l) && langs.length === 1 ? null : toggle(langs, l, setLangs))}
                    className={`w-12 py-2 rounded-xl text-sm border ${langs.includes(l) ? 'border-primary-400 text-white bg-primary-500/10' : 'border-white/10 text-gray-400'}`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="label">{nl ? 'Stem' : 'Voice'}</div>
              <div className="flex flex-col gap-2">
                {(['rexo', 'own'] as const).map((v) => (
                  <button key={v} type="button" onClick={() => setVoice(v)} className={`px-3 py-2 rounded-xl text-sm border text-left ${voice === v ? 'border-primary-400 text-white bg-primary-500/10' : 'border-white/10 text-gray-400'}`}>
                    {v === 'rexo' ? (nl ? 'Rexo-stem' : 'Rexo voice') : (nl ? 'Jouw eigen stem' : 'Your own voice')}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="label" htmlFor="rexo-name">{nl ? 'Geef je werknemer een naam (optioneel)' : 'Give your employee a name (optional)'}</label>
            <input id="rexo-name" className="field max-w-sm" placeholder={nl ? 'Bijv. Sam van de receptie' : 'E.g. Sam from reception'} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
          </div>
        </div>

        {/* 4. numbers */}
        <div className="surface p-6 md:p-8">
          {step(4, nl ? 'Jouw cijfers' : 'Your numbers')}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">{nl ? 'Kosten per uur van een medewerker' : 'Hourly cost of an employee'}</span><span className="text-white font-semibold tabular-nums">€{wage}</span></div>
              <input type="range" min={15} max={90} step={1} value={wage} onChange={(e) => setWage(+e.target.value)} className="range" />
              <div className="text-xs text-gray-500 mt-1">{nl ? 'Inclusief werkgeverslasten' : 'Including employer costs'}</div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">{nl ? 'Aantal mensen die dit nu doen' : 'People doing this now'}</span><span className="text-white font-semibold tabular-nums">{people}</span></div>
              <input type="range" min={1} max={10} step={1} value={people} onChange={(e) => setPeople(+e.target.value)} className="range" />
            </div>
          </div>
        </div>
      </div>

      {/* result */}
      <div className="lg:col-span-4 lg:sticky lg:top-28">
        <div className="price-featured rounded-[1.75rem] p-7">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-300">{nl ? 'Jouw' : 'Your'} <RexoMark className="text-base" /> {nl ? 'Werknemer' : 'Employee'}</span>
            <span className="chip">{nl ? 'Op maat' : 'Custom'}</span>
          </div>
          {name && <div className="text-2xl font-semibold text-white mb-4">{name}</div>}
          <div className="text-xs text-gray-400">{nl ? 'Tijd die je terugkrijgt' : 'Time you get back'}</div>
          <div className="text-5xl font-semibold text-white tracking-tight tabular-nums">±{fmt(calc.monthlyHours)}<span className="text-xl text-gray-400"> {nl ? 'uur/mnd' : 'h/mo'}</span></div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="surface-inner p-3">
              <div className="text-xs text-gray-500">{nl ? 'Aan uren per maand' : 'In hours per month'}</div>
              <div className="text-xl font-semibold text-primary-300 tabular-nums">€{fmt(calc.monthlyCost)}</div>
            </div>
            <div className="surface-inner p-3">
              <div className="text-xs text-gray-500">{nl ? 'Per jaar' : 'Per year'}</div>
              <div className="text-xl font-semibold text-primary-300 tabular-nums">€{fmt(calc.yearlyCost)}</div>
            </div>
          </div>
          <div className="mt-3 surface-inner p-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">{nl ? 'Gelijk aan' : 'Equal to'}</span>
            <span className="text-sm text-white font-medium">{calc.fte.toFixed(1).replace('.', ',')} {nl ? 'fte aan taken' : 'FTE of tasks'}</span>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">{nl ? 'Functies' : 'Roles'}</span><span className="text-gray-200 text-right">{roles.map((r) => tr(r.name)).join(', ')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{nl ? 'Taken' : 'Tasks'}</span><span className="text-gray-200">{tasks.length}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{nl ? 'Koppelingen' : 'Integrations'}</span><span className="text-gray-200">{integrations.length}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{nl ? 'Beschikbaar' : 'Available'}</span><span className="text-gray-200">{hoursLabel}</span></div>
          </div>
          <a href={`https://wa.me/${WA}?text=${encodeURIComponent(summary)}`} target="_blank" rel="noopener noreferrer" className="btn-primary-modern w-full justify-center mt-7">
            {nl ? 'Vraag deze werknemer aan' : 'Request this employee'} <ArrowIcon />
          </a>
          <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">
            {nl
              ? 'Indicatie op basis van jouw invoer en gemiddelde tijd per taak. Je ontvangt een offerte op maat; de werkelijke besparing hangt af van je processen.'
              : 'Estimate based on your input and average time per task. You will receive a custom quote; actual savings depend on your processes.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RexoEmployeeBuilder;
