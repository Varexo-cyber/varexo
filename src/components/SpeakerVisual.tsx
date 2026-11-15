import React, { useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Real Jabra Speak 510 photo rendered as a 3D puck that tilts with the mouse.
// With `hotspots`, every button gets a marker; hovering/tapping shows what it does.

type Spot = { id: string; x: number; y: number; nl: [string, string]; en: [string, string] };

const SPOTS: Spot[] = [
  { id: 'mute', x: 49.4, y: 5.4, nl: ['Microfoon uit', 'Zet de microfoon direct uit. De assistent hoort dan niets: handig als je even privé wilt praten.'], en: ['Mute', 'Turns the microphone off instantly. The assistant hears nothing: handy for a private moment.'] },
  { id: 'bt', x: 27.6, y: 11.8, nl: ['Bluetooth', 'Koppelt de speaker draadloos met je telefoon, tablet of laptop.'], en: ['Bluetooth', 'Pairs the speaker wirelessly with your phone, tablet or laptop.'] },
  { id: 'battery', x: 71.6, y: 11.8, nl: ['Batterij', 'Laat zien hoe vol de batterij is. Je kunt hem dus ook zonder kabel neerzetten.'], en: ['Battery', 'Shows how full the battery is, so it can also stand without a cable.'] },
  { id: 'voldown', x: 5.2, y: 49.6, nl: ['Volume lager', 'Zet het geluid zachter.'], en: ['Volume down', 'Turns the sound down.'] },
  { id: 'volup', x: 94.2, y: 49.6, nl: ['Volume hoger', 'Zet het geluid harder. Helder geluid door de hele ruimte.'], en: ['Volume up', 'Turns the sound up. Clear sound across the whole room.'] },
  { id: 'smart', x: 88.6, y: 71.4, nl: ['Smart-knop', 'Snelknop voor de spraakassistent. Wij stellen in wat deze knop voor jou doet.'], en: ['Smart button', 'Shortcut for the voice assistant. We set up what this button does for you.'] },
  { id: 'answer', x: 27.2, y: 87.6, nl: ['Opnemen', 'Neem een gesprek aan of start een gesprek, handsfree vanaf tafel.'], en: ['Answer', 'Answer or start a call, hands-free from the table.'] },
  { id: 'end', x: 71.6, y: 87.6, nl: ['Ophangen', 'Beëindig het gesprek met één tik.'], en: ['End call', 'End the call with a single tap.'] },
  { id: 'power', x: 49.6, y: 93.8, nl: ['Aan / uit', 'Zet de speaker aan of uit.'], en: ['Power', 'Turns the speaker on or off.'] },
];

const LAYERS = 30; // puck thickness: 30 x 1.5px
const BASE = 12;   // smaller foot underneath (cable wrap base)

const SpeakerVisual: React.FC<{ className?: string; hotspots?: boolean; listening?: boolean }> = ({ className = '', hotspots = false, listening = true }) => {
  const { language } = useLanguage();
  const nl = language === 'nl';
  const wrap = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const spotRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [active, setActive] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);

  const baseX = active ? 24 : 58;
  const tilt = (rx: number, rz: number, ry = 0) => {
    if (body.current) body.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
  };

  const onMove = (e: React.MouseEvent) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tilt(baseX - py * 14, -8 + px * 10, px * 10);
    if (active) placeTip(active);
  };

  const placeTip = (id: string) => {
    const s = spotRefs.current[id];
    const w = wrap.current;
    if (!s || !w) return;
    const a = s.getBoundingClientRect();
    const b = w.getBoundingClientRect();
    // keep the 240px tooltip inside the viewport
    const x = Math.min(Math.max(a.left + a.width / 2, 132), window.innerWidth - 132) - b.left;
    setTip({ x, y: a.top - b.top });
  };

  const activate = (id: string) => {
    setActive(id);
    tilt(24, -4);
    // wait for the flatten transition before measuring the marker position
    setTimeout(() => placeTip(id), 360);
    placeTip(id);
  };

  const reset = () => {
    setActive(null);
    setTip(null);
    tilt(58, -8);
  };

  const spot = SPOTS.find((s) => s.id === active);
  const [title, text] = spot ? (nl ? spot.nl : spot.en) : ['', ''];

  return (
    <div ref={wrap} onMouseMove={onMove} onMouseLeave={reset} className={`j3d ${listening ? 'is-listening' : ''} ${className}`}>
      <span className="speaker-wave w1" />
      <span className="speaker-wave w2" />
      <span className="speaker-wave w3" />
      <div className="j3d-shadow" />
      <div ref={body} className="j3d-body" style={{ transform: 'rotateX(58deg) rotateZ(-8deg)' }}>
        {Array.from({ length: BASE }).map((_, i) => (
          <div key={`b${i}`} className="j3d-base" style={{ transform: `translateZ(${-(LAYERS * 1.5) - (i + 1) * 1.5}px)` }} />
        ))}
        {Array.from({ length: LAYERS }).map((_, i) => (
          <div
            key={i}
            className={`j3d-edge ${i === 0 ? 'j3d-edge-rim' : ''}`}
            style={{ transform: `translateZ(${-(i + 1) * 1.5}px)`, filter: `brightness(${1.25 - (i / LAYERS) * 0.7})` }}
          />
        ))}
        <div className="j3d-top">
          <img src="/ai/jabra-speak-510.webp" alt="Jabra Speak 510" draggable={false} />
          <div className="j3d-gloss" />
          {hotspots && SPOTS.map((s) => (
            <button
              key={s.id}
              ref={(el) => { spotRefs.current[s.id] = el; }}
              type="button"
              aria-label={(nl ? s.nl : s.en)[0]}
              className={`j3d-spot ${active === s.id ? 'is-active' : ''}`}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              onMouseEnter={() => activate(s.id)}
              onFocus={() => activate(s.id)}
              onClick={() => (active === s.id ? reset() : activate(s.id))}
            />
          ))}
        </div>
      </div>
      {hotspots && spot && tip && (
        <div className="j3d-tip" style={{ left: tip.x, top: tip.y }}>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-gray-300 leading-relaxed mt-1">{text}</div>
        </div>
      )}
    </div>
  );
};

export default SpeakerVisual;
