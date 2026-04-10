import { useState, useMemo } from "react";
import { X, CheckCircle2, Trophy, Map, LayoutList, SlidersHorizontal, RotateCcw, MapPin, Clock } from "lucide-react";

const MW = 680, MH = 540;
const L0 = 0.10, L1 = 3.40, A0 = 40.45, A1 = 42.90;
const pj = (lat, lng) => ({ x: ((lng - L0) / (L1 - L0)) * MW, y: ((A1 - lat) / (A1 - A0)) * MH });

const CAT_PATH = "M128,20 L178,39 268,48 335,76 379,89 437,94 499,103 631,103 659,122 635,162 622,207 594,267 556,305 433,340 305,362 247,396 185,442 144,487 128,532 82,521 31,498 10,430 14,362 25,270 21,180 72,111 93,54 Z";

const ZOOM_VB = { cat: `0 0 ${MW} ${MH}`, metro: "325 250 210 180" };
const PIN_R   = { cat: 5.5, metro: 3.8 };

const TC = {
  Terror:    { c: "#ef4444", e: "👻" },
  Aventura:  { c: "#f59e0b", e: "⚔️"  },
  Misterio:  { c: "#8b5cf6", e: "🔮" },
  "Sci-Fi":  { c: "#06b6d4", e: "🚀" },
  Thriller:  { c: "#f97316", e: "🎭" },
  Histórica: { c: "#84cc16", e: "⚱️"  },
  Detective: { c: "#3b82f6", e: "🔍" },
  Fantasy:   { c: "#ec4899", e: "🧙" },
};

const DIFF_W  = { Baja: 1, Media: 2, Alta: 3 };
const DIFF_CL = { Baja: "#22c55e", Media: "#f59e0b", Alta: "#ef4444" };

const DATA = [
  { id:1,  name:"Elements Escape Room",   city:"Barcelona",      lat:41.394, lng:2.163, price:25, difficulty:"Media",  theme:"Thriller",  rating:4.5, desc:"Salas amb els 4 elements amb tecnologia immersiva i puzzles fisics unics." },
  { id:2,  name:"Enigmik",                city:"Barcelona",      lat:41.377, lng:2.152, price:23, difficulty:"Alta",   theme:"Misterio",  rating:4.6, desc:"Reconegut escape room amb sales molt elaborades. Diversos premis nacionals al millor ER." },
  { id:3,  name:"Cronologic",             city:"Barcelona",      lat:41.406, lng:2.164, price:25, difficulty:"Alta",   theme:"Histórica", rating:4.7, desc:"Viatges en el temps amb narrativa cinematografica. Premi al millor escape room d'Espanya." },
  { id:4,  name:"Horror Box",             city:"Barcelona",      lat:41.380, lng:2.172, price:20, difficulty:"Media",  theme:"Terror",    rating:4.3, desc:"Experiencies de terror immersives amb actors en viu al Raval. Nomes per als mes valents." },
  { id:5,  name:"Abduction",              city:"Barcelona",      lat:41.387, lng:2.147, price:23, difficulty:"Alta",   theme:"Sci-Fi",    rating:4.4, desc:"Escape room de ciencia ficcio amb tecnologia d'ultima generacio i narrativa epica espacial." },
  { id:6,  name:"Breakout Barcelona",     city:"Barcelona",      lat:41.373, lng:2.137, price:22, difficulty:"Media",  theme:"Aventura",  rating:4.2, desc:"Franquicia internacional amb diverses sales tematiques per a tots els nivells de jugador." },
  { id:7,  name:"Clue Hunter",            city:"Barcelona",      lat:41.401, lng:2.201, price:24, difficulty:"Alta",   theme:"Detective", rating:4.5, desc:"Investiga crims reals en un entorn noir cinematografic amb gran atencio al detall." },
  { id:8,  name:"Exit The Room",          city:"Barcelona",      lat:41.392, lng:2.171, price:22, difficulty:"Media",  theme:"Aventura",  rating:4.1, desc:"Cadena internacional amb sales per a families i adults. Diferents nivells de dificultat disponibles." },
  { id:9,  name:"Room Escape Barcelona",  city:"Barcelona",      lat:41.394, lng:2.135, price:20, difficulty:"Media",  theme:"Misterio",  rating:4.0, desc:"Pioners de l'ER a BCN amb sales classiques i noves tematiques molt variades." },
  { id:10, name:"Lock'd",                 city:"Barcelona",      lat:41.409, lng:2.151, price:24, difficulty:"Alta",   theme:"Thriller",  rating:4.6, desc:"Sales de gran dificultat dissenyades per a jugadors experimentats. Mecaniques uniques." },
  { id:11, name:"Wild Immersion",         city:"Barcelona",      lat:41.403, lng:2.211, price:28, difficulty:"Media",  theme:"Aventura",  rating:4.7, desc:"Immersio total en entorns naturals salvatges amb tecnologia XR innovadora. Experiencia unica." },
  { id:12, name:"La Fuga BCN",            city:"Barcelona",      lat:41.384, lng:2.143, price:21, difficulty:"Media",  theme:"Misterio",  rating:4.2, desc:"Escape rooms amb historia i narrativa curada, ideals per a grups d'amics nombrosos." },
  { id:13, name:"Puzz.it",                city:"Barcelona",      lat:41.397, lng:2.175, price:21, difficulty:"Media",  theme:"Misterio",  rating:4.2, desc:"Puzzles innovadors amb mecaniques originals que sorprenen fins i tot als mes veterans." },
  { id:14, name:"Tick Tack Escape",       city:"Barcelona",      lat:41.371, lng:2.128, price:19, difficulty:"Baja",   theme:"Aventura",  rating:4.0, desc:"Ideal per a principiants i grups familiars. Diversio garantida per a tots els publics." },
  { id:15, name:"The Bunker Escape",      city:"L'Hospitalet",   lat:41.362, lng:2.095, price:18, difficulty:"Media",  theme:"Terror",    rating:4.1, desc:"Ambientat en un bunquer de la Guerra Civil. Atmosfera molt opressiva i realista." },
  { id:16, name:"Escape Room Cornella",   city:"Cornella",       lat:41.349, lng:2.072, price:17, difficulty:"Media",  theme:"Aventura",  rating:3.9, desc:"Sala local amb bones mecaniques i puzzles ben dissenyats. Preu molt competitiu." },
  { id:17, name:"Fuga Castelldefels",     city:"Castelldefels",  lat:41.281, lng:1.972, price:19, difficulty:"Media",  theme:"Aventura",  rating:4.0, desc:"Escape room prop de la platja, perfecte per visitar en familia o en parella." },
  { id:18, name:"Enigma Escape Sabadell", city:"Sabadell",       lat:41.543, lng:2.108, price:19, difficulty:"Media",  theme:"Misterio",  rating:4.2, desc:"Sales molt elaborades amb bona relacio qualitat-preu. Recomanat per la comunitat." },
  { id:19, name:"Dark Room Sabadell",     city:"Sabadell",       lat:41.549, lng:2.113, price:18, difficulty:"Alta",   theme:"Terror",    rating:4.1, desc:"L'experiencia de terror mes intensa del Valles Occidental. No apta per a cardiaques." },
  { id:20, name:"The Hatch",              city:"Terrassa",       lat:41.563, lng:2.008, price:20, difficulty:"Alta",   theme:"Sci-Fi",    rating:4.3, desc:"Escape room de ciencia ficcio amb tecnologia puntera. Referent al Valles Occidental." },
  { id:21, name:"Mystery Terrassa",       city:"Terrassa",       lat:41.559, lng:2.018, price:19, difficulty:"Media",  theme:"Thriller",  rating:4.1, desc:"Thriller psicologic al cor de Terrassa amb girs d'argument imprevisibles." },
  { id:22, name:"Escape Valles",          city:"Granollers",     lat:41.609, lng:2.290, price:19, difficulty:"Media",  theme:"Misterio",  rating:4.0, desc:"L'escape room de referencia al Valles Oriental. Diferents sales per triar." },
  { id:23, name:"Maresme Escape",         city:"Mataro",         lat:41.537, lng:2.446, price:18, difficulty:"Media",  theme:"Aventura",  rating:4.1, desc:"Aventures escape a la capital del Maresme. Sala familiar molt recomanada." },
  { id:24, name:"Doctor X",              city:"Mataro",         lat:41.533, lng:2.452, price:20, difficulty:"Alta",   theme:"Terror",    rating:4.4, desc:"Escape room de terror basat en el Doctor X. Experiencia esgarrifosa i molt elaborada." },
  { id:25, name:"Escapum",               city:"Manresa",        lat:41.728, lng:1.825, price:17, difficulty:"Media",  theme:"Histórica", rating:4.1, desc:"Ambientat en la historia medieval de Manresa. Ideal per als amants de la historia local." },
  { id:26, name:"Kronomoria",             city:"Ripollet",       lat:41.497, lng:2.157, price:19, difficulty:"Alta",   theme:"Fantasy",   rating:4.3, desc:"Fantasia medieval amb puzzles unics i narrativa molt elaborada. Comunitat molt activa." },
  { id:27, name:"Escape Bergueda",        city:"Berga",          lat:42.101, lng:1.847, price:16, difficulty:"Baja",   theme:"Histórica", rating:3.9, desc:"Tematic sobre la historia i tradicions del Bergueda. Perfecte per a una escapada rural." },
];

const LBL = [
  { n: "BARCELONA",     lat: 41.355, lng: 2.230, fs: 10, fw: "800", dim: false },
  { n: "Sabadell",      lat: 41.522, lng: 2.068, fs: 8,  fw: "600", dim: false },
  { n: "Terrassa",      lat: 41.545, lng: 1.965, fs: 8,  fw: "600", dim: false },
  { n: "Granollers",    lat: 41.585, lng: 2.335, fs: 8,  fw: "600", dim: false },
  { n: "Mataro",        lat: 41.516, lng: 2.460, fs: 8,  fw: "600", dim: false },
  { n: "Manresa",       lat: 41.708, lng: 1.790, fs: 8,  fw: "600", dim: false },
  { n: "Berga",         lat: 42.082, lng: 1.847, fs: 8,  fw: "600", dim: false },
  { n: "Ripollet",      lat: 41.478, lng: 2.112, fs: 7,  fw: "600", dim: false },
  { n: "Castelldefels", lat: 41.260, lng: 1.960, fs: 7,  fw: "600", dim: false },
  { n: "L'Hospitalet",  lat: 41.342, lng: 2.053, fs: 7,  fw: "600", dim: false },
  { n: "Cornella",      lat: 41.333, lng: 2.073, fs: 7,  fw: "600", dim: false },
  { n: "Lleida",        lat: 41.617, lng: 0.570, fs: 8,  fw: "600", dim: true  },
  { n: "Girona",        lat: 41.982, lng: 2.882, fs: 8,  fw: "600", dim: true  },
  { n: "Tarragona",     lat: 41.095, lng: 1.192, fs: 8,  fw: "600", dim: true  },
];

export default function EscapeTracker() {
  const [rooms, setRooms] = useState(() => DATA.map(r => ({ ...r, completed: false })));
  const [selId, setSelId]   = useState(null);
  const [hovId, setHovId]   = useState(null);
  const [view,  setView]    = useState("map");
  const [zoom,  setZoom]    = useState("cat");
  const [filters, setFilters] = useState({ city: "all", theme: "all", diff: "all", status: "all", maxPrice: 30 });

  const sel      = useMemo(() => rooms.find(r => r.id === selId) ?? null, [rooms, selId]);
  const cities   = useMemo(() => [...new Set(DATA.map(r => r.city))].sort(), []);
  const filtSet  = useMemo(() => new Set(
    rooms.filter(r => {
      if (filters.city   !== "all" && r.city       !== filters.city)   return false;
      if (filters.theme  !== "all" && r.theme      !== filters.theme)  return false;
      if (filters.diff   !== "all" && r.difficulty !== filters.diff)   return false;
      if (filters.status === "completed" && !r.completed)              return false;
      if (filters.status === "pending"   &&  r.completed)              return false;
      if (r.price > filters.maxPrice)                                   return false;
      return true;
    }).map(r => r.id)
  ), [rooms, filters]);

  const filtered = useMemo(() => rooms.filter(r => filtSet.has(r.id)), [rooms, filtSet]);

  const stats = useMemo(() => {
    const done = rooms.filter(r => r.completed).length;
    return { done, pending: rooms.length - done, pct: Math.round(done / rooms.length * 100) };
  }, [rooms]);

  const toggle  = id  => setRooms(p => p.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  const setF    = (k, v) => setFilters(p => ({ ...p, [k]: v }));
  const resetF  = () => setFilters({ city: "all", theme: "all", diff: "all", status: "all", maxPrice: 30 });

  const vbStr  = ZOOM_VB[zoom];
  const pinR   = PIN_R[zoom];
  const hovRoom = rooms.find(r => r.id === hovId);

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden" style={{ fontFamily: "system-ui,sans-serif" }}>

      {/* ── FILTERS SIDEBAR ──────────────────────────────────────────── */}
      <div className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden flex-shrink-0">
        <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-blue-400" />
            <span className="font-bold text-sm">Filtres</span>
          </div>
          <button onClick={resetF} className="text-gray-600 hover:text-gray-300 flex items-center gap-1 text-xs transition-colors">
            <RotateCcw size={11} /> Reset
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">

          {/* Municipi */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Municipi</p>
            <select value={filters.city} onChange={e => setF("city", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 outline-none text-sm">
              <option value="all">Tots</option>
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Tematica */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Temàtica</p>
            <div className="flex flex-wrap gap-1">
              <button onClick={() => setF("theme","all")}
                className={`px-2 py-0.5 rounded text-xs border transition-all ${filters.theme==="all" ? "bg-blue-600 border-blue-600 text-white" : "border-gray-700 text-gray-400 hover:border-gray-600"}`}>
                Totes
              </button>
              {Object.entries(TC).map(([t, { e }]) => (
                <button key={t} onClick={() => setF("theme", t)}
                  className={`px-2 py-0.5 rounded text-xs border transition-all ${filters.theme===t ? "bg-blue-600 border-blue-600 text-white" : "border-gray-700 text-gray-400 hover:border-gray-600"}`}>
                  {e} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Dificultat */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Dificultat</p>
            <div className="grid grid-cols-4 gap-1">
              {["all","Baja","Media","Alta"].map(d => (
                <button key={d} onClick={() => setF("diff", d)}
                  className={`py-1.5 rounded text-xs border transition-all ${filters.diff===d ? "bg-blue-600 border-blue-600 text-white" : "border-gray-700 text-gray-400 hover:border-gray-600"}`}>
                  {d === "all" ? "Tot" : d}
                </button>
              ))}
            </div>
          </div>

          {/* Estat */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Estat</p>
            <div className="space-y-1">
              {[["all","🗺 Totes"],["pending","⏳ Pendents"],["completed","✅ Completades"]].map(([v,l]) => (
                <button key={v} onClick={() => setF("status", v)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm border transition-all ${filters.status===v ? "bg-blue-600/20 border-blue-500 text-blue-300" : "border-gray-700 text-gray-400 hover:border-gray-600"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Preu */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Preu màx.</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xl font-bold text-white">{filters.maxPrice}</span>
              <span className="text-xs text-gray-500">€ / persona</span>
            </div>
            <input type="range" min={15} max={35} value={filters.maxPrice}
              onChange={e => setF("maxPrice", +e.target.value)}
              className="w-full accent-blue-500" />
            <div className="flex justify-between text-xs text-gray-700 mt-0.5">
              <span>15€</span><span>35€</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-800 text-xs text-gray-500">
            Mostrant <span className="text-white font-semibold">{filtered.length}</span> de {rooms.length} sales
          </div>
        </div>

        {/* Legend */}
        <div className="p-3 border-t border-gray-800">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Llegenda</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            {Object.entries(TC).map(([t, { c, e }]) => (
              <div key={t} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />
                <span className="text-xs text-gray-500 truncate">{e} {t}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 col-span-2 mt-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0 bg-green-500" />
              <span className="text-xs text-green-600">✓ Completada</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN AREA ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <div className="bg-gray-900 border-b border-gray-800 px-5 py-2 flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-blue-400" />
            <div>
              <h1 className="font-bold text-sm leading-tight">Escape Rooms · Catalunya</h1>
              <p className="text-xs text-gray-600 leading-none">Mapa interactiu de tracking</p>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-5 border-l border-gray-800 pl-4">
            <div className="flex items-center gap-1.5">
              <Trophy size={13} className="text-yellow-400" />
              <span className="text-sm"><span className="font-bold text-yellow-400">{stats.done}</span><span className="text-gray-500"> fetes</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-gray-500" />
              <span className="text-sm"><span className="font-bold text-gray-300">{stats.pending}</span><span className="text-gray-500"> pendents</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${stats.pct}%` }} />
              </div>
              <span className="text-xs text-gray-400">{stats.pct}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-800 pl-4">
            {view === "map" && (
              <div className="flex gap-0.5 bg-gray-800 rounded-lg p-0.5 mr-1">
                {[["cat","🌍 Catalunya"],["metro","🏙 Gran BCN"]].map(([v,l]) => (
                  <button key={v} onClick={() => setZoom(v)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${zoom===v ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
                    {l}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-0.5 bg-gray-800 rounded-lg p-0.5">
              <button onClick={() => setView("map")}
                className={`p-1.5 rounded transition-all ${view==="map" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}>
                <Map size={13}/>
              </button>
              <button onClick={() => setView("list")}
                className={`p-1.5 rounded transition-all ${view==="list" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}>
                <LayoutList size={13}/>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden">

          {/* ── MAP VIEW ── */}
          {view === "map" && (
            <div className="w-full h-full" style={{ background: "linear-gradient(160deg,#04101e 0%,#070e1a 60%,#060b14 100%)" }}>
              <svg viewBox={vbStr} className="w-full h-full" style={{ cursor: "crosshair" }}>
                <defs>
                  <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  <filter id="glow2"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>

                {/* Context text */}
                <text x={590} y={430} textAnchor="middle" fill="#0b2340" fontSize={13} fontWeight="700" letterSpacing="2" opacity={0.8}>MAR MEDITERRÀNIA</text>
                <text x={50} y={310} textAnchor="middle" fill="#081828" fontSize={10} transform="rotate(-90,50,310)" opacity={0.6}>ARAGÓ</text>
                <text x={350} y={13} textAnchor="middle" fill="#081828" fontSize={9} letterSpacing="1" opacity={0.6}>FRANÇA · PIRINEUS</text>

                {/* Catalonia polygon */}
                <path d={CAT_PATH} fill="#0c1d31" stroke="#183a63" strokeWidth={1.5} />

                {/* Pyrenees dashed hint */}
                <path d="M93,54 L128,20 L178,39 L268,48 L335,76 L379,89 L437,94 L499,103 L631,103"
                  fill="none" stroke="#122540" strokeWidth={1} strokeDasharray="3,4" opacity={0.5}/>

                {/* City labels */}
                {LBL.map(lb => {
                  const { x, y } = pj(lb.lat, lb.lng);
                  return (
                    <text key={lb.n} x={x} y={y} textAnchor="middle"
                      fill={lb.dim ? "#0b2035" : "#1a4878"}
                      fontSize={lb.fs} fontWeight={lb.fw} letterSpacing="0.07em"
                      opacity={lb.dim ? 0.5 : 0.8} style={{ userSelect: "none" }}>
                      {lb.n}
                    </text>
                  );
                })}

                {/* Dimmed (filtered-out) pins */}
                {rooms.filter(r => !filtSet.has(r.id)).map(r => {
                  const { x, y } = pj(r.lat, r.lng);
                  return <circle key={`d${r.id}`} cx={x} cy={y} r={pinR * 0.5}
                    fill={r.completed ? "#10b981" : (TC[r.theme]?.c || "#888")} opacity={0.12} />;
                })}

                {/* Active pins */}
                {filtered.map(r => {
                  const { x, y } = pj(r.lat, r.lng);
                  const isSel = selId === r.id, isHov = hovId === r.id;
                  const color = r.completed ? "#10b981" : (TC[r.theme]?.c || "#888");
                  const R = isSel ? pinR * 1.7 : isHov ? pinR * 1.35 : pinR;
                  return (
                    <g key={r.id} style={{ cursor: "pointer" }}
                      onClick={() => setSelId(selId === r.id ? null : r.id)}
                      onMouseEnter={() => setHovId(r.id)}
                      onMouseLeave={() => setHovId(null)}>
                      {(isSel || isHov) && (
                        <circle cx={x} cy={y} r={R + 5} fill="none"
                          stroke={color} strokeWidth={1.5} opacity={isSel ? 0.5 : 0.3} />
                      )}
                      <circle cx={x} cy={y} r={R} fill={color}
                        opacity={isSel ? 1 : 0.88}
                        filter={isSel ? "url(#glow2)" : isHov ? "url(#glow)" : "none"} />
                      {r.completed && (
                        <path
                          d={`M${x - R*0.45},${y + R*0.05} L${x - R*0.1},${y + R*0.45} L${x + R*0.55},${y - R*0.45}`}
                          stroke="white" strokeWidth={R * 0.22} fill="none"
                          strokeLinecap="round" strokeLinejoin="round" />
                      )}
                    </g>
                  );
                })}

                {/* Hover tooltip */}
                {hovRoom && (() => {
                  const { x, y } = pj(hovRoom.lat, hovRoom.lng);
                  const nm = hovRoom.name;
                  const tw = nm.length * 6.2 + 18;
                  const tx = Math.max(2, Math.min(x - tw / 2, MW - tw - 2));
                  return (
                    <g pointerEvents="none">
                      <rect x={tx} y={y - 36} width={tw} height={22} rx={4}
                        fill="#0d1e32" stroke="#1e4a7a" strokeWidth={1} opacity={0.97} />
                      <text x={tx + tw / 2} y={y - 19} textAnchor="middle"
                        fill="white" fontSize={11} fontWeight="600">{nm}</text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          )}

          {/* ── LIST VIEW ── */}
          {view === "list" && (
            <div className="h-full overflow-y-auto p-5">
              <div className="grid grid-cols-2 gap-3 max-w-3xl mx-auto">
                {filtered.map(r => (
                  <div key={r.id} onClick={() => setSelId(selId === r.id ? null : r.id)}
                    className={`rounded-xl p-4 cursor-pointer border transition-all ${selId === r.id ? "bg-blue-950 border-blue-600" : "bg-gray-900 border-gray-800 hover:border-gray-700"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 pr-2 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-base">{TC[r.theme]?.e}</span>
                          <span className="font-semibold text-sm truncate">{r.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">📍 {r.city}</span>
                      </div>
                      <button onClick={e => { e.stopPropagation(); toggle(r.id); }}
                        className={`p-1.5 rounded-lg border flex-shrink-0 transition-all ${r.completed ? "bg-green-500/20 border-green-500/50 text-green-400" : "bg-gray-800 border-gray-700 text-gray-600 hover:text-green-400 hover:border-green-500/50"}`}>
                        <CheckCircle2 size={15} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>💶 {r.price}€</span>
                      <span>⭐ {r.rating}</span>
                      <span className="px-1.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: `${TC[r.theme]?.c}22`, color: TC[r.theme]?.c }}>
                        {r.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-2 py-20 text-center text-gray-600">
                    <MapPin size={36} className="mx-auto mb-3 opacity-20" />
                    <p>Cap sala amb aquests filtres</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── DETAIL PANEL ─────────────────────────────────────────────── */}
      {sel && (
        <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden flex-shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xl">{TC[sel.theme]?.e}</span>
                  <h2 className="font-bold text-sm leading-snug">{sel.name}</h2>
                </div>
                <p className="text-xs text-gray-500">📍 {sel.city}</p>
              </div>
              <button onClick={() => setSelId(null)} className="text-gray-600 hover:text-white transition-colors flex-shrink-0">
                <X size={15} />
              </button>
            </div>
            <div className="flex items-center gap-0.5 mt-2">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={s <= Math.round(sel.rating) ? "text-yellow-400" : "text-gray-700"}>★</span>
              ))}
              <span className="text-xs text-gray-400 ml-1">{sel.rating}/5</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">Preu</p>
                <p className="font-bold text-white">{sel.price}€<span className="text-xs font-normal text-gray-400">/pers.</span></p>
              </div>
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">Temàtica</p>
                <p className="font-bold text-sm" style={{ color: TC[sel.theme]?.c }}>{TC[sel.theme]?.e} {sel.theme}</p>
              </div>
            </div>

            {/* Difficulty bar */}
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-500">Dificultat</span>
                <span className="text-xs font-semibold" style={{ color: DIFF_CL[sel.difficulty] }}>{sel.difficulty}</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${(DIFF_W[sel.difficulty] || 2) / 3 * 100}%`, background: DIFF_CL[sel.difficulty] || "#f59e0b" }} />
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/50">
              <p className="text-xs text-gray-400 leading-relaxed">{sel.desc}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border"
                style={{ background: `${TC[sel.theme]?.c}22`, borderColor: `${TC[sel.theme]?.c}55`, color: TC[sel.theme]?.c }}>
                {TC[sel.theme]?.e} {sel.theme}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs border border-gray-700 text-gray-400">
                ⭐ {sel.rating}
              </span>
            </div>
          </div>

          {/* Complete button */}
          <div className="p-4 border-t border-gray-800">
            <button onClick={() => toggle(sel.id)}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                sel.completed
                  ? "bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}>
              <CheckCircle2 size={16} />
              {sel.completed ? "✓ Sala Completada!" : "Marcar com a Completada"}
            </button>
            {sel.completed && <p className="text-center text-xs text-green-600 mt-2">🎉 Enhorabona!</p>}
          </div>
        </div>
      )}
    </div>
  );
}
