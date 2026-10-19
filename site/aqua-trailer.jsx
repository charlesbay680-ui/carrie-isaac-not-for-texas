const BG = '#f3f2f2', INK = '#201e1d', RED = '#ec3013';
const FONT = "Archivo, 'Archivo', system-ui, sans-serif";

const MOTION = {
  enter: (T, a, d = 0.6) => Easing.easeOutCubic(clamp((T - a) / d, 0, 1)),
  draw: (T, a, d = 1) => Easing.easeInOutQuart(clamp((T - a) / d, 0, 1)),
  pop: (T, a, d = 0.5) => Easing.easeOutBack(clamp((T - a) / d, 0, 1)),
};
const vis = (T, a, b) => (T >= a && T < b ? 1 : 0);
const layer = { position: 'absolute', inset: 0, overflow: 'hidden' };
const kicker = { font: `700 26px ${FONT}`, letterSpacing: '0.12em', textTransform: 'uppercase' };

function Open({ T, C }) {
  const o = vis(T, -1, C.Her);
  const rule = MOTION.draw(T, C.Open + 0.3, 1.1);
  const k = MOTION.enter(T, C.Open + 0.9);
  const f = MOTION.enter(T, C.Open + 1.5, 0.8);
  return (
    <div style={{ ...layer, background: INK, opacity: o }}>
      <div style={{ position: 'absolute', left: 120, top: 520, height: 8, width: 1680 * rule, background: RED }} />
      <div style={{ position: 'absolute', left: 120, top: 440, color: BG, ...kicker, opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>A Hill Country romance</div>
      <div style={{ position: 'absolute', left: 120, top: 560, color: BG, font: `800 140px/1 ${FONT}`, letterSpacing: '-0.04em', opacity: f, transform: `translateY(${(1 - f) * 40}px)` }}>This fall…</div>
    </div>
  );
}

function Her({ T, C }) {
  const o = vis(T, C.Her, C.Him);
  const z = 1 + 0.12 * clamp((T - C.Her) / 4.4, 0, 1);
  const bar = MOTION.enter(T, C.Her + 0.5, 0.7);
  const line = MOTION.enter(T, C.Her + 1.0, 0.7);
  return (
    <div style={{ ...layer, background: INK, opacity: o }}>
      <img src="uploads/449849664_18259465231216673_3266145505131021017_n.jpg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%', filter: 'grayscale(1) contrast(1.1)', transform: `scale(${z})`, transformOrigin: '55% 40%' }} />
      <div style={{ position: 'absolute', left: 0, bottom: 0, background: BG, padding: '40px 120px 48px', transform: `translateY(${(1 - bar) * 100}%)`, borderTop: `4px solid ${INK}` }}>
        <div style={{ ...kicker, color: RED, fontSize: 22 }}>Carrie Isaac · The Representative</div>
        <div style={{ font: `800 76px/1.05 ${FONT}`, color: INK, letterSpacing: '-0.03em', marginTop: 12, opacity: line }}>She swore to protect the Hill Country.</div>
      </div>
    </div>
  );
}

function Him({ T, C }) {
  const o = vis(T, C.Him, C.Meter);
  const slide = MOTION.enter(T, C.Him - 0.001, 0.8);
  const n = Math.round(89000000 * MOTION.draw(T, C.Him + 0.8, 1.8));
  const sub = MOTION.enter(T, C.Him + 2.3);
  const logoZ = 1.04 - 0.04 * clamp((T - C.Him) / 4, 0, 1);
  return (
    <div style={{ ...layer, background: BG, opacity: o }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 760, borderRight: `4px solid ${INK}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translateX(${(slide - 1) * 760}px)` }}>
        <img src="uploads/1631313661091-a038cf45.jpg" style={{ width: 520, height: 520, objectFit: 'cover', filter: 'grayscale(1)', transform: `scale(${logoZ})` }} />
      </div>
      <div style={{ position: 'absolute', left: 840, right: 100, top: 300 }}>
        <div style={{ ...kicker, color: RED, fontSize: 22, opacity: slide }}>Aqua Texas · The Utility</div>
        <div style={{ font: `800 150px/1 ${FONT}`, color: INK, letterSpacing: '-0.04em', marginTop: 24, fontVariantNumeric: 'tabular-nums' }}>{n.toLocaleString('en-US')}</div>
        <div style={{ font: `700 56px/1.1 ${FONT}`, color: INK, marginTop: 24, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)` }}>gallons over his permit.</div>
        <div style={{ font: `500 28px ${FONT}`, color: INK, marginTop: 18, opacity: sub }}>2022 drought, per the groundwater district.</div>
      </div>
    </div>
  );
}

function Meter({ T, C }) {
  const o = vis(T, C.Meter, C.Well);
  const l1 = MOTION.enter(T, C.Meter + 0.1, 0.6);
  const l2 = MOTION.enter(T, C.Meter + 1.8, 0.7);
  const st = MOTION.pop(T, C.Meter + 3.0, 0.5);
  const drift = 1 + 0.03 * clamp((T - C.Meter) / 4.7, 0, 1);
  return (
    <div style={{ ...layer, background: RED, opacity: o }}>
      <div style={{ position: 'absolute', left: 120, top: 250, right: 120, transform: `scale(${drift})`, transformOrigin: '0 0' }}>
        <div style={{ font: `800 104px/1 ${FONT}`, color: BG, letterSpacing: '-0.035em', opacity: l1, transform: `translateY(${(1 - l1) * 30}px)` }}>The district wanted to meter him.</div>
        <div style={{ font: `800 104px/1 ${FONT}`, color: INK, letterSpacing: '-0.035em', marginTop: 40, opacity: l2, transform: `translateY(${(1 - l2) * 30}px)` }}>She wanted to protect him.</div>
      </div>
      <div style={{ position: 'absolute', right: 140, bottom: 140, border: `6px solid ${BG}`, padding: '18px 30px', color: BG, font: `800 64px/1 ${FONT}`, transform: `rotate(-6deg) scale(${0.4 + 0.6 * st})`, opacity: clamp(st * 2, 0, 1) }}>
        HB 2812
        <div style={{ font: `700 20px ${FONT}`, letterSpacing: '0.1em', marginTop: 10 }}>EXEMPT HIM FROM OVERSIGHT</div>
      </div>
    </div>
  );
}

function Well({ T, C }) {
  const o = vis(T, C.Well, C.Title);
  const water = 1 - MOTION.draw(T, C.Well + 0.4, 2.0);
  const cap = MOTION.enter(T, C.Well + 2.2);
  return (
    <div style={{ ...layer, background: BG, opacity: o }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${water * 100}%`, background: INK }} />
      <div style={{ position: 'absolute', left: 120, top: 180, ...kicker, color: RED, fontSize: 22 }}>The One Who Waited</div>
      <div style={{ position: 'absolute', left: 110, top: 260, font: `800 260px/0.9 ${FONT}`, letterSpacing: '-0.05em', color: BG, mixBlendMode: 'difference' }}>Jacob's Well</div>
      <div style={{ position: 'absolute', left: 120, top: 640, font: `800 80px/1 ${FONT}`, color: RED, opacity: cap, transform: `translateY(${(1 - cap) * 24}px)` }}>Stopped flowing. 2023.</div>
      <div style={{ position: 'absolute', left: 120, top: 740, font: `500 34px ${FONT}`, color: INK, whiteSpace: 'nowrap', opacity: cap }}>Now it flows only after heavy rain.</div>
    </div>
  );
}

function Title({ T, C }) {
  const o = vis(T, C.Title, 1e9);
  const top = MOTION.enter(T, C.Title + 0.05, 0.5);
  const big = MOTION.pop(T, C.Title + 0.45, 0.6);
  const foot = MOTION.enter(T, C.Title + 1.4, 0.6);
  const drift = 1 + 0.025 * clamp((T - C.Title) / 4, 0, 1);
  return (
    <div style={{ ...layer, background: INK, opacity: o }}>
      <div style={{ position: 'absolute', left: 120, top: 250, transform: `scale(${drift})`, transformOrigin: '0 50%' }}>
        <div style={{ font: `800 110px/1 ${FONT}`, color: BG, letterSpacing: '-0.04em', opacity: top, transform: `translateY(${(1 - top) * 20}px)` }}>Carrie <span style={{ color: RED }}>Loves</span></div>
        <div style={{ font: `800 330px/0.85 ${FONT}`, color: BG, letterSpacing: '-0.06em', marginTop: 10, transform: `scale(${0.85 + 0.15 * big})`, transformOrigin: '0 50%', opacity: clamp(big * 1.6, 0, 1) }}>Aqua</div>
      </div>
      <div style={{ position: 'absolute', left: 120, right: 120, bottom: 110, borderTop: `4px solid ${BG}`, paddingTop: 28, display: 'flex', justifyContent: 'space-between', color: BG, opacity: foot }}>
        <span style={{ ...kicker, color: RED }}>Episode 01</span>
        <span style={{ ...kicker, fontSize: 22 }}>Parody · Every fact sourced</span>
      </div>
    </div>
  );
}

function Piece() {
  const { T, CUES: C } = useComposition();
  return (
    <div data-screen-label={`t=${Math.floor(T)}s`} style={{ ...layer, background: INK, fontFamily: FONT }}>
      <Open T={T} C={C} />
      <Her T={T} C={C} />
      <Him T={T} C={C} />
      <Meter T={T} C={C} />
      <Well T={T} C={C} />
      <Title T={T} C={C} />
    </div>
  );
}

function AquaTrailer() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true });
  return (
    <>
      <CompositionStage width={1920} height={1080} bg={INK} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <Piece />
      </CompositionStage>
      <TweaksPanel>
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </>
  );
}

window.AquaTrailer = AquaTrailer;
