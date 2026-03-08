import { useState, useEffect } from "react";

const G = "#C9920A", GL = "#F0B429";
const DARK = "#0A0A0A", S1 = "#111111", S2 = "#181818", S3 = "#202020", S4 = "#2A2A2A";
const TEXT = "#F2EDE4", MUTED = "#7A7060", DIM = "#2E2A24";
const RED = "#E05252", GREEN = "#4CAF7D", BLUE = "#4A9EE0";
const FH = "'Playfair Display', serif", FB = "'DM Sans', sans-serif";

const COUNTRIES = [
  { name: "فلسطين",   flag: "🇵🇸", currency: "ILS", symbol: "₪" },
  { name: "الأردن",   flag: "🇯🇴", currency: "JOD", symbol: "د.أ" },
  { name: "السعودية", flag: "🇸🇦", currency: "SAR", symbol: "﷼" },
  { name: "الإمارات", flag: "🇦🇪", currency: "AED", symbol: "د.إ" },
  { name: "الكويت",   flag: "🇰🇼", currency: "KWD", symbol: "د.ك" },
  { name: "قطر",      flag: "🇶🇦", currency: "QAR", symbol: "﷼" },
  { name: "مصر",      flag: "🇪🇬", currency: "EGP", symbol: "ج.م" },
  { name: "لبنان",    flag: "🇱🇧", currency: "LBP", symbol: "ل.ل" },
  { name: "العراق",   flag: "🇮🇶", currency: "IQD", symbol: "د.ع" },
  { name: "تركيا",    flag: "🇹🇷", currency: "TRY", symbol: "₺" },
  { name: "المملكة المتحدة", flag: "🇬🇧", currency: "GBP", symbol: "£" },
  { name: "الولايات المتحدة", flag: "🇺🇸", currency: "USD", symbol: "$" },
];

const INIT_USERS = [
  { id: 1, name: "أحمد ناصر",   email: "owner@swaybar.com",     password: "Admin@2026!", role: "owner",   avatar: "أ", phone: "0599-100200", branch_id: null, created: "2024-01-01" },
  { id: 2, name: "ملاك ملحس",   email: "mlakmalhas@swaybar.com", password: "Mlak@1999s",  role: "manager", avatar: "م", phone: "", branch_id: 1, created: "2024-03-15" },
  { id: 3, name: "ينال العاصي", email: "yanalassi@swaybar.com",  password: "Yanal@4525",  role: "manager", avatar: "ي", phone: "", branch_id: 2, created: "2024-04-01" },
];
const INIT_BRANCHES = [
  { id: 1, name: "فلسطين - نابلس", country: "فلسطين", flag: "🇵🇸", currency: "ILS", symbol: "₪",   manager_id: 2 },
  { id: 2, name: "الأردن - عمّان", country: "الأردن",  flag: "🇯🇴", currency: "JOD", symbol: "د.أ", manager_id: 3 },
];
const INIT_CLIENTS  = [];
const INIT_EVENTS   = [];
const INIT_EXPENSES = [];
const INIT_INV      = [];

const calcQty = ops => ops.reduce((s, o) => o.type === "add" ? s + o.qty : s - o.qty, 0);

function pwStrength(pw) {
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[a-z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw), pw.length >= 12];
  const score = checks.filter(Boolean).length;
  if (score <= 2) return { label: "ضعيفة",    color: RED,        pct: 20 };
  if (score <= 3) return { label: "مقبولة",   color: "#E0A030",  pct: 50 };
  if (score <= 4) return { label: "جيدة",     color: BLUE,       pct: 72 };
  return               { label: "قوية جداً", color: GREEN,      pct: 100 };
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:${DARK};color:${TEXT};font-family:${FB};min-height:100vh}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${S1}}::-webkit-scrollbar-thumb{background:${G};border-radius:2px}

.auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:${DARK};position:relative;overflow:hidden}
.auth-glow{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(201,146,10,0.08),transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
.auth-dots{position:absolute;inset:0;background-image:radial-gradient(rgba(201,146,10,0.08) 1px,transparent 1px);background-size:32px 32px;pointer-events:none}
.auth-card{background:${S1};border:1px solid rgba(201,146,10,0.18);border-radius:22px;padding:42px;width:430px;max-width:94vw;position:relative;z-index:1;box-shadow:0 32px 72px rgba(0,0,0,0.7)}
.auth-brand{text-align:center;margin-bottom:34px}
.auth-brand-name{font-family:${FH};font-size:44px;font-weight:900;color:${GL};letter-spacing:5px;line-height:1}
.auth-brand-sub{font-size:9px;letter-spacing:5px;color:${MUTED};text-transform:uppercase;margin-top:6px}
.auth-head{font-family:${FH};font-size:21px;font-weight:700;margin-bottom:6px}
.auth-sub{font-size:13px;color:${MUTED};margin-bottom:26px}
.fl{display:flex;flex-direction:column;gap:5px;margin-bottom:14px}
.fl-label{font-size:10px;letter-spacing:2px;color:${MUTED};text-transform:uppercase}
.fl-wrap{position:relative}
.fl-input{width:100%;background:${S2};border:1.5px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px 44px 12px 14px;font-size:14px;color:${TEXT};font-family:${FB};outline:none;transition:border-color .2s;direction:rtl}
.fl-input:focus{border-color:${G}}
.fl-input.err{border-color:${RED}}
.fl-ico{position:absolute;top:50%;right:15px;transform:translateY(-50%);color:${MUTED};pointer-events:none;font-size:14px}
.fl-toggle{position:absolute;top:50%;left:13px;transform:translateY(-50%);background:none;border:none;color:${MUTED};cursor:pointer;font-size:11px;font-family:${FB};padding:3px 6px;border-radius:4px;transition:color .15s}
.fl-toggle:hover{color:${TEXT}}
.fl-err{font-size:11px;color:${RED};margin-top:3px}
.pw-bar{height:4px;background:${S3};border-radius:2px;margin-top:6px}
.pw-fill{height:100%;border-radius:2px;transition:width .35s,background .35s}
.pw-lbl{font-size:11px;margin-top:3px}
.auth-btn{width:100%;background:linear-gradient(135deg,${G},${GL});color:${DARK};border:none;border-radius:10px;padding:13px;font-size:15px;font-weight:600;font-family:${FB};cursor:pointer;transition:all .2s;margin-top:6px}
.auth-btn:hover{opacity:.87;transform:translateY(-1px)}
.auth-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.auth-err{background:rgba(224,82,82,0.09);border:1px solid rgba(224,82,82,0.28);border-radius:8px;padding:10px 14px;font-size:13px;color:${RED};margin-bottom:14px}
.auth-ok{background:rgba(76,175,125,0.09);border:1px solid rgba(76,175,125,0.28);border-radius:8px;padding:10px 14px;font-size:13px;color:${GREEN};margin-bottom:14px}
.auth-link-btn{background:none;border:none;color:${MUTED};font-size:12px;cursor:pointer;font-family:${FB};display:block;margin:12px auto 0;transition:color .15s;text-align:center}
.auth-link-btn:hover{color:${GL}}
.auth-divider{display:flex;align-items:center;gap:8px;color:${MUTED};font-size:11px;margin:10px 0}
.auth-divider::before,.auth-divider::after{content:'';flex:1;border-top:1px solid ${DIM}}
.sec-badges{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:20px}
.sec-b{background:rgba(74,158,224,0.07);border:1px solid rgba(74,158,224,0.18);border-radius:20px;padding:4px 10px;font-size:10px;color:${BLUE};letter-spacing:.5px}
.steps{display:flex;gap:5px;margin-bottom:22px}
.step-bar{flex:1;height:3px;border-radius:2px;transition:background .3s}

.sway-root{display:flex;min-height:100vh}
.sidebar{width:236px;min-width:236px;background:${S1};border-right:1px solid rgba(201,146,10,0.1);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
.sb-logo{padding:24px 22px 16px;border-bottom:1px solid rgba(201,146,10,0.09)}
.sb-logo-name{font-family:${FH};font-size:24px;font-weight:900;color:${GL};letter-spacing:2px}
.sb-logo-sub{font-size:9px;letter-spacing:3px;color:${MUTED};text-transform:uppercase;margin-top:2px}
.br-badge{margin:12px 18px;background:rgba(201,146,10,0.07);border:1px solid rgba(201,146,10,0.2);border-radius:10px;padding:10px 12px;cursor:pointer;transition:all .18s}
.br-badge:hover{background:rgba(201,146,10,0.13)}
.br-badge-lbl{font-size:9px;color:${MUTED};letter-spacing:2px;text-transform:uppercase}
.br-badge-name{font-size:13px;font-weight:600;color:${GL};margin-top:1px}
.br-badge-cur{font-size:10px;color:${MUTED};margin-top:1px}
.br-menu{margin:0 12px 8px;background:${S3};border-radius:10px;overflow:hidden;border:1px solid rgba(201,146,10,0.13)}
.br-opt{padding:10px 13px;cursor:pointer;font-size:13px;transition:background .15s;display:flex;align-items:center;gap:8px}
.br-opt:hover{background:rgba(201,146,10,0.07)}
.br-opt.active{background:rgba(201,146,10,0.11);color:${GL};font-weight:500}
.nav{padding:4px 0;flex:1}
.nav-lbl{font-size:9px;letter-spacing:2.5px;color:${MUTED};text-transform:uppercase;padding:10px 20px 4px}
.nav-it{display:flex;align-items:center;gap:10px;padding:10px 20px;cursor:pointer;transition:all .16s;border-left:2px solid transparent;font-size:13.5px;color:${MUTED};user-select:none}
.nav-it:hover{color:${TEXT};background:rgba(255,255,255,0.02)}
.nav-it.active{color:${GL};border-left-color:${G};background:rgba(201,146,10,0.06);font-weight:500}
.nav-ic{width:18px;text-align:center;font-size:14px;flex-shrink:0}
.sb-foot{padding:12px 18px;border-top:1px solid rgba(201,146,10,0.09)}
.user-pill{display:flex;align-items:center;gap:9px;padding:7px 9px;border-radius:9px;cursor:pointer;transition:background .15s}
.user-pill:hover{background:rgba(255,255,255,0.03)}
.av{border-radius:50%;background:linear-gradient(135deg,${G},#7A5500);display:flex;align-items:center;justify-content:center;font-weight:700;color:${DARK};flex-shrink:0}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.topbar{background:${S1};border-bottom:1px solid rgba(201,146,10,0.09);padding:0 26px;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.pg-title{font-family:${FH};font-size:18px;font-weight:700}
.topbar-r{display:flex;align-items:center;gap:12px}
.content{flex:1;padding:24px 26px;overflow-y:auto}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 15px;border-radius:8px;font-size:13px;font-weight:500;font-family:${FB};cursor:pointer;transition:all .16s;border:none}
.btn-gold{background:linear-gradient(135deg,${G},${GL});color:${DARK}}
.btn-gold:hover{opacity:.87;transform:translateY(-1px)}
.btn-gold:disabled{opacity:.45;cursor:not-allowed;transform:none}
.btn-outline{background:transparent;border:1px solid rgba(201,146,10,0.32);color:${GL}}
.btn-outline:hover{background:rgba(201,146,10,0.09)}
.btn-ghost{background:${S3};color:${TEXT}}
.btn-ghost:hover{background:${S4}}
.card{background:${S2};border:1px solid rgba(255,255,255,0.052);border-radius:12px;padding:20px}
.card-gold{border-color:rgba(201,146,10,0.2);background:linear-gradient(135deg,rgba(201,146,10,0.055),${S2})}
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:20px}
.sc{background:${S2};border:1px solid rgba(255,255,255,0.052);border-radius:12px;padding:17px;position:relative;overflow:hidden}
.sc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${G},transparent)}
.sc-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${MUTED}}
.sc-val{font-family:${FH};font-size:24px;font-weight:700;margin:6px 0 2px}
.sc-val.gold{color:${GL}}.sc-val.green{color:${GREEN}}.sc-val.red{color:${RED}}
.sc-sub{font-size:11px;color:${MUTED}}
.sc-ico{position:absolute;top:15px;right:15px;font-size:20px;opacity:.2}
.sec-t{font-family:${FH};font-size:15px;font-weight:700;margin-bottom:13px;display:flex;align-items:center;justify-content:space-between}
.tw{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px}
thead tr{border-bottom:1px solid rgba(255,255,255,0.046)}
th{text-align:right;padding:9px 11px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};font-weight:500}
td{padding:10px 11px;border-bottom:1px solid rgba(255,255,255,0.03);color:${TEXT};text-align:right}
tr:hover td{background:rgba(255,255,255,0.013)}
.badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:500}
.bg{background:rgba(76,175,125,0.13);color:${GREEN}}
.ba{background:rgba(201,146,10,0.13);color:${GL}}
.br{background:rgba(224,82,82,0.13);color:${RED}}
.bb{background:rgba(74,158,224,0.13);color:${BLUE}}
.bm{background:rgba(138,128,112,0.13);color:${MUTED}}
.mo{position:fixed;inset:0;background:rgba(0,0,0,0.78);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(5px)}
.modal{background:${S1};border:1px solid rgba(201,146,10,0.2);border-radius:18px;padding:26px;width:560px;max-width:96vw;max-height:92vh;overflow-y:auto;direction:rtl}
.modal-w{width:680px}
.modal-t{font-family:${FH};font-size:18px;font-weight:700;margin-bottom:18px;color:${GL};display:flex;align-items:center;justify-content:space-between}
.modal-x{background:none;border:none;color:${MUTED};cursor:pointer;font-size:18px;padding:2px 6px;border-radius:4px;transition:color .15s}
.modal-x:hover{color:${TEXT}}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:13px}
.fgr{display:flex;flex-direction:column;gap:4px}
.fl2{font-size:10px;color:${MUTED};letter-spacing:1px;text-transform:uppercase}
.fi{background:${S3};border:1.5px solid rgba(255,255,255,0.065);border-radius:8px;padding:9px 12px;font-size:13.5px;color:${TEXT};font-family:${FB};transition:border-color .18s;direction:rtl;outline:none}
.fi:focus{border-color:${G}}
select.fi option{background:${S3}}
.fb{display:flex;gap:9px;margin-bottom:16px;align-items:center;flex-wrap:wrap}
.si{background:${S2};border:1px solid rgba(255,255,255,0.065);border-radius:8px;padding:9px 12px;font-size:13px;color:${TEXT};font-family:${FB};flex:1;min-width:150px;direction:rtl;outline:none}
.si:focus{border-color:${G}}
.tabs{display:flex;gap:2px;background:${S2};border-radius:9px;padding:3px}
.tab{padding:7px 13px;border-radius:7px;cursor:pointer;font-size:12.5px;color:${MUTED};transition:all .18s;user-select:none}
.tab.active{background:linear-gradient(135deg,${G},${GL});color:${DARK};font-weight:600}
.pb{background:${S3};border-radius:4px;height:5px;overflow:hidden}
.pf{height:100%;border-radius:4px;background:linear-gradient(90deg,${G},${GL});transition:width .5s}
.chip{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;background:rgba(201,146,10,0.09);color:${GL};margin:1px}
.div{border:none;border-top:1px solid rgba(255,255,255,0.05);margin:16px 0}
.es{text-align:center;padding:36px;color:${MUTED}}
.al{display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.033)}
.al:last-child{border-bottom:none}
.ald{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.bc{display:flex;align-items:flex-end;gap:7px;height:88px;padding:0 3px}
.bw{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;height:100%;justify-content:flex-end}
.bar{width:100%;border-radius:3px 3px 0 0;background:linear-gradient(180deg,${GL},${G})}
.bar-l{font-size:9px;color:${MUTED}}
.cp{background:#FAFAF8;color:#1A1A1A;border-radius:10px;padding:28px;font-family:'Times New Roman',serif;direction:rtl;font-size:13px;line-height:1.9;border:2px solid ${G}}
.cl{border-bottom:1px dashed #CCC;padding-bottom:2px;margin-bottom:2px}
.pg-grid{display:grid;grid-template-columns:270px 1fr;gap:18px;align-items:start}
.pg-card{background:${S2};border:1px solid rgba(201,146,10,0.18);border-radius:14px;padding:22px;text-align:center}
.ps{background:${S2};border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:22px;margin-bottom:14px}
.ir{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.035)}
.ir:last-child{border-bottom:none}
.ik{font-size:12px;color:${MUTED}}
.iv{font-size:13.5px;font-weight:500}
.si-item{display:flex;align-items:center;gap:10px;padding:10px;border-radius:9px;background:${S3};margin-bottom:7px}
.toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:${S1};border:1px solid rgba(76,175,125,0.32);color:${GREEN};padding:11px 22px;border-radius:10px;font-size:13px;font-weight:500;z-index:999;box-shadow:0 8px 28px rgba(0,0,0,0.45);animation:slideUp .25s ease}
@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.dg{display:grid;grid-template-columns:1.55fr 1fr;gap:16px}
.cg{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:5px}
.co{padding:10px 6px;border-radius:8px;border:1.5px solid rgba(255,255,255,0.06);background:${S3};cursor:pointer;text-align:center;transition:all .16s}
.co:hover{border-color:rgba(201,146,10,0.28)}
.co.sel{border-color:${G};background:rgba(201,146,10,0.1);color:${GL}}
.co-flag{font-size:20px;display:block;margin-bottom:2px}
.co-cur{font-size:9px;color:${MUTED};margin-top:1px}
.cur-preview{background:rgba(201,146,10,0.07);border:1px solid rgba(201,146,10,0.22);border-radius:9px;padding:11px 14px;display:flex;align-items:center;gap:12px;margin-top:8px}
/* ── MOBILE DRAWER ── */
.mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:100;backdrop-filter:blur(3px)}
.mob-menu-btn{display:none;background:none;border:none;color:${TEXT};font-size:22px;cursor:pointer;padding:4px 8px;border-radius:6px;transition:background .15s}
.mob-menu-btn:hover{background:rgba(255,255,255,0.06)}
.mob-close-btn{display:none;background:none;border:none;color:${MUTED};font-size:20px;cursor:pointer;padding:4px 8px;margin-right:auto}
.bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:${S1};border-top:1px solid rgba(201,146,10,0.15);z-index:50;padding:6px 0 env(safe-area-inset-bottom,6px)}
.bottom-nav-inner{display:flex;justify-content:space-around;align-items:center}
.bn-item{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 10px;cursor:pointer;border-radius:8px;transition:all .15s;color:${MUTED};min-width:52px}
.bn-item.active{color:${GL}}
.bn-item-ic{font-size:20px;line-height:1}
.bn-item-lbl{font-size:9px;letter-spacing:.3px}
.mob-more-menu{position:fixed;bottom:64px;left:0;right:0;background:${S1};border-top:1px solid rgba(201,146,10,0.15);z-index:60;padding:10px 16px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.mob-more-item{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 6px;cursor:pointer;border-radius:8px;transition:background .15s;color:${MUTED};font-size:12px;text-align:center}
.mob-more-item:hover{background:rgba(255,255,255,0.04);color:${TEXT}}
.mob-more-item.active{color:${GL}}
.mob-more-item-ic{font-size:22px}

@media(max-width:900px){.sg{grid-template-columns:1fr 1fr}.dg{grid-template-columns:1fr}.fg{grid-template-columns:1fr}.pg-grid{grid-template-columns:1fr}}
@media(max-width:768px){
  .sidebar{position:fixed;top:0;right:0;height:100vh;z-index:110;transform:translateX(100%);transition:transform .28s cubic-bezier(.4,0,.2,1);width:260px}
  .sidebar.open{transform:translateX(0)}
  .mob-overlay.open{display:block}
  .mob-menu-btn{display:flex;align-items:center;justify-content:center}
  .mob-close-btn{display:block}
  .bottom-nav{display:block}
  .content{padding:14px 14px 80px}
  .sg{grid-template-columns:1fr 1fr}
  .topbar{padding:0 14px}
  .pg-title{font-size:15px}
  .topbar-r .branch-info{display:none}
}
@media(max-width:480px){
  .sg{grid-template-columns:1fr}
  .auth-card{padding:28px 20px}
  .fg{grid-template-columns:1fr}
  .cg{grid-template-columns:repeat(3,1fr)}
}
`;

function Toast({ msg, done }) {
  useEffect(() => { const t = setTimeout(done, 2600); return () => clearTimeout(t); }, []);
  return <div className="toast">✓ {msg}</div>;
}
function Modal({ title, onClose, wide, children }) {
  return (
    <div className="mo" onClick={onClose}>
      <div className={`modal ${wide ? "modal-w" : ""}`} onClick={e => e.stopPropagation()}>
        <div className="modal-t"><span>{title}</span><button className="modal-x" onClick={onClose}>✕</button></div>
        {children}
      </div>
    </div>
  );
}
function SBadge({ s }) {
  const m = { "مدفوع": "bg", "قادم": "ba", "غير مدفوع": "br" };
  return <span className={`badge ${m[s] || "bm"}`}>{s}</span>;
}

// ── AUTH ─────────────────────────────────────────────────────────────────────
function LoginPage({ users, onLogin, onReset }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const go = () => {
    setErr("");
    if (!email || !pw) { setErr("يرجى ملء جميع الحقول"); return; }
    setLoading(true);
    setTimeout(() => {
      const u = users.find(u => u.email === email.trim() && u.password === pw);
      if (u) onLogin(u);
      else setErr("البريد الإلكتروني أو كلمة السر غير صحيحة");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-wrap" dir="rtl">
      <div className="auth-glow" /><div className="auth-dots" />
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-name">SWAY</div>
          <div className="auth-brand-sub">Event Management System</div>
        </div>
        <div className="auth-head">تسجيل الدخول</div>
        <div className="auth-sub">أدخل بياناتك للوصول إلى النظام</div>
        {err && <div className="auth-err">🔒 {err}</div>}
        <div className="fl">
          <div className="fl-label">البريد الإلكتروني</div>
          <div className="fl-wrap">
            <input className={`fl-input${err ? " err" : ""}`} value={email} onChange={e => setEmail(e.target.value)} placeholder="example@swaybar.com" onKeyDown={e => e.key === "Enter" && go()} />
            <span className="fl-ico">✉</span>
          </div>
        </div>
        <div className="fl">
          <div className="fl-label">كلمة السر</div>
          <div className="fl-wrap">
            <input className={`fl-input${err ? " err" : ""}`} type={show ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && go()} style={{ paddingLeft: 64 }} />
            <span className="fl-ico">🔑</span>
            <button className="fl-toggle" onClick={() => setShow(!show)}>{show ? "إخفاء" : "إظهار"}</button>
          </div>
        </div>
        <button className="auth-btn" onClick={go} disabled={loading}>{loading ? "جاري التحقق..." : "دخول ←"}</button>
        <div className="auth-divider">أو</div>
        <button className="auth-link-btn" onClick={onReset}>نسيت كلمة السر؟</button>
        <div className="sec-badges">
          <span className="sec-b">🔒 SSL</span>
          <span className="sec-b">🛡 حماية البيانات</span>
          <span className="sec-b">✓ صلاحيات متعددة</span>
        </div>
        <div style={{ marginTop: 18, textAlign: "center", fontSize: 11, color: MUTED }}>
          تم التطوير بواسطة <span style={{ color: GL, fontWeight: 600 }}>Data_Lab_by_JihadAbusaleh</span>
        </div>
      </div>
    </div>
  );
}

function ResetPage({ users, setUsers, onBack }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [npw, setNpw] = useState("");
  const [cpw, setCpw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const str = pwStrength(npw);

  const s1 = () => {
    setErr("");
    if (!email.trim()) { setErr("يرجى إدخال البريد الإلكتروني"); return; }
    if (!users.find(u => u.email === email.trim())) { setErr("البريد الإلكتروني غير مسجل في النظام"); return; }
    setOk("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
    setTimeout(() => { setStep(2); setOk(""); }, 1600);
  };
  const s2 = () => {
    setErr("");
    if (!code) { setErr("يرجى إدخال الرمز"); return; }
    if (code.length < 4) { setErr("الرمز غير صحيح"); return; }
    setStep(3);
  };
  const s3 = () => {
    setErr("");
    if (npw.length < 8) { setErr("8 أحرف على الأقل"); return; }
    if (npw !== cpw) { setErr("كلمتا السر غير متطابقتين"); return; }
    if (str.label === "ضعيفة") { setErr("كلمة السر ضعيفة جداً"); return; }
    setUsers(p => p.map(u => u.email === email ? { ...u, password: npw } : u));
    setOk("✓ تم تغيير كلمة السر بنجاح!");
    setTimeout(onBack, 1500);
  };

  return (
    <div className="auth-wrap" dir="rtl">
      <div className="auth-glow" /><div className="auth-dots" />
      <div className="auth-card">
        <div className="auth-brand"><div className="auth-brand-name">SWAY</div><div className="auth-brand-sub">إعادة تعيين كلمة السر</div></div>
        <div className="steps">{[1,2,3].map(s => <div key={s} className="step-bar" style={{ background: step >= s ? GL : DIM }} />)}</div>
        {err && <div className="auth-err">{err}</div>}
        {ok  && <div className="auth-ok">{ok}</div>}
        {step === 1 && <>
          <div className="auth-head" style={{ marginBottom: 6 }}>أدخل بريدك الإلكتروني</div>
          <div className="fl"><div className="fl-label">البريد</div><div className="fl-wrap"><input className="fl-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@swaybar.com" onKeyDown={e => e.key === "Enter" && s1()} /><span className="fl-ico">✉</span></div></div>
          <button className="auth-btn" onClick={s1}>إرسال الرمز ←</button>
        </>}
        {step === 2 && <>
          <div className="auth-head" style={{ marginBottom: 6 }}>رمز التحقق</div>
          <div className="fl"><div className="fl-label">الرمز</div><input className="fl-input" value={code} onChange={e => setCode(e.target.value)} maxLength={6} style={{ textAlign: "center", letterSpacing: 8, fontSize: 22 }} onKeyDown={e => e.key === "Enter" && s2()} /></div>
          <button className="auth-btn" onClick={s2}>تحقق ←</button>
        </>}
        {step === 3 && <>
          <div className="auth-head" style={{ marginBottom: 6 }}>كلمة السر الجديدة</div>
          <div className="fl">
            <div className="fl-label">كلمة السر الجديدة</div>
            <div className="fl-wrap"><input className="fl-input" type={showPw ? "text" : "password"} value={npw} onChange={e => setNpw(e.target.value)} placeholder="••••••••" style={{ paddingLeft: 64 }} /><span className="fl-ico">🔑</span><button className="fl-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? "إخفاء" : "إظهار"}</button></div>
            {npw && <><div className="pw-bar"><div className="pw-fill" style={{ width: `${str.pct}%`, background: str.color }} /></div><div className="pw-lbl" style={{ color: str.color }}>القوة: {str.label}</div></>}
          </div>
          <div className="fl"><div className="fl-label">تأكيد كلمة السر</div><input className="fl-input" type="password" value={cpw} onChange={e => setCpw(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && s3()} /></div>
          <button className="auth-btn" onClick={s3}>حفظ ←</button>
        </>}
        <button className="auth-link-btn" onClick={onBack}>← العودة لتسجيل الدخول</button>
      </div>
    </div>
  );
}

// ── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage({ user, users, setUsers, branches, toast }) {
  const [editInfo, setEditInfo] = useState(false);
  const [editPw, setEditPw] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "" });
  const [pwf, setPwf] = useState({ cur: "", new: "", con: "" });
  const [showPw, setShowPw] = useState({});
  const [err, setErr] = useState("");
  const str = pwStrength(pwf.new);
  const br = branches.find(b => b.id === user.branch_id);
  const rl = { owner: "مالك النظام", manager: "مدير فرع", staff: "موظف" };
  const rb = { owner: "ba", manager: "bb", staff: "bm" };

  const saveInfo = () => {
    if (!form.name.trim()) return;
    setUsers(p => p.map(u => u.id === user.id ? { ...u, ...form } : u));
    toast("تم تحديث المعلومات"); setEditInfo(false);
  };
  const savePw = () => {
    setErr("");
    if (pwf.cur !== user.password) { setErr("كلمة السر الحالية غير صحيحة"); return; }
    if (pwf.new.length < 8) { setErr("8 أحرف على الأقل"); return; }
    if (pwf.new !== pwf.con) { setErr("كلمتا السر غير متطابقتين"); return; }
    if (str.label === "ضعيفة") { setErr("كلمة السر ضعيفة جداً"); return; }
    setUsers(p => p.map(u => u.id === user.id ? { ...u, password: pwf.new } : u));
    toast("تم تغيير كلمة السر"); setPwf({ cur: "", new: "", con: "" }); setEditPw(false);
  };

  return (
    <div style={{ maxWidth: 840 }}>
      <div className="pg-grid">
        <div className="pg-card">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <div className="av" style={{ width: 70, height: 70, fontSize: 26 }}>{user.avatar}</div>
          </div>
          <div style={{ fontFamily: FH, fontSize: 19, fontWeight: 700, marginBottom: 3 }}>{user.name}</div>
          <div style={{ color: MUTED, fontSize: 12, marginBottom: 10 }}>{user.email}</div>
          <span className={`badge ${rb[user.role]}`} style={{ padding: "4px 14px" }}>{rl[user.role]}</span>
          {br && <div style={{ marginTop: 12, background: S3, borderRadius: 8, padding: "9px 13px" }}>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 2 }}>الفرع</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{br.flag} {br.name}</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>العملة: <span style={{ color: GL }}>{br.currency} ({br.symbol})</span></div>
          </div>}
          <div style={{ marginTop: 12, fontSize: 11, color: MUTED }}>عضو منذ {user.created}</div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 7 }}>
            <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => setEditInfo(true)}>✎ تعديل المعلومات</button>
            <button className="btn btn-ghost"   style={{ width: "100%", justifyContent: "center" }} onClick={() => setEditPw(true)}>🔑 تغيير كلمة السر</button>
          </div>
        </div>
        <div>
          <div className="ps">
            <div className="sec-t">المعلومات الشخصية</div>
            {[["الاسم", user.name], ["البريد الإلكتروني", user.email], ["الهاتف", user.phone || "—"], ["الدور", rl[user.role]], ["الفرع", br ? `${br.flag} ${br.name}` : "جميع الفروع"]].map(([k, v]) => (
              <div className="ir" key={k}><span className="ik">{k}</span><span className="iv">{v}</span></div>
            ))}
          </div>
          <div className="ps">
            <div className="sec-t">أمان الحساب 🔒</div>
            <div className="ir"><span className="ik">حالة كلمة السر</span><span className="badge bg">✓ محمي</span></div>
            <div className="ir"><span className="ik">مستوى الوصول</span><span className={`badge ${rb[user.role]}`}>{rl[user.role]}</span></div>
            <div style={{ marginTop: 12, background: "rgba(74,158,224,0.06)", border: "1px solid rgba(74,158,224,0.16)", borderRadius: 8, padding: "10px 13px", fontSize: 12, color: BLUE }}>
              🛡 استخدم كلمة سر تحتوي على حروف كبيرة وصغيرة وأرقام ورموز
            </div>
          </div>
          <div className="ps">
            <div className="sec-t">الجلسة الحالية</div>
            <div className="si-item">
              <span style={{ fontSize: 20 }}>💻</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>متصفح الويب</div><div style={{ fontSize: 11, color: MUTED }}>نشطة الآن</div></div>
              <span className="badge bg">✓ نشطة</span>
            </div>
          </div>
        </div>
      </div>

      {editInfo && (
        <Modal title="✎ تعديل المعلومات" onClose={() => setEditInfo(false)}>
          <div className="fg">
            <div className="fgr" style={{ gridColumn: "1/-1" }}><label className="fl2">الاسم الكامل</label><input className="fi" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="fgr" style={{ gridColumn: "1/-1" }}><label className="fl2">رقم الهاتف</label><input className="fi" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0599-000000" /></div>
          </div>
          <div style={{ display: "flex", gap: 9, marginTop: 18, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={() => setEditInfo(false)}>إلغاء</button>
            <button className="btn btn-gold" onClick={saveInfo}>💾 حفظ</button>
          </div>
        </Modal>
      )}

      {editPw && (
        <Modal title="🔑 تغيير كلمة السر" onClose={() => { setEditPw(false); setErr(""); setPwf({ cur: "", new: "", con: "" }); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {err && <div className="auth-err">{err}</div>}
            {[
              { label: "كلمة السر الحالية", key: "cur", k: "cur" },
              { label: "كلمة السر الجديدة", key: "new", k: "new" },
              { label: "تأكيد كلمة السر الجديدة", key: "con", k: "con" },
            ].map(({ label, key, k }) => (
              <div key={k}>
                <div className="fl2" style={{ marginBottom: 5 }}>{label}</div>
                <div className="fl-wrap">
                  <input className="fi" type={showPw[k] ? "text" : "password"} value={pwf[k]} onChange={e => setPwf({ ...pwf, [k]: e.target.value })} placeholder="••••••••" style={{ paddingLeft: 64 }} />
                  <button className="fl-toggle" onClick={() => setShowPw(p => ({ ...p, [k]: !p[k] }))}>{showPw[k] ? "إخفاء" : "إظهار"}</button>
                  {k === "con" && pwf.con && <span style={{ position: "absolute", top: "50%", left: 70, transform: "translateY(-50%)", color: pwf.con === pwf.new ? GREEN : RED }}>{pwf.con === pwf.new ? "✓" : "✕"}</span>}
                </div>
                {k === "new" && pwf.new && (
                  <><div className="pw-bar" style={{ marginTop: 5 }}><div className="pw-fill" style={{ width: `${str.pct}%`, background: str.color }} /></div><div className="pw-lbl" style={{ color: str.color }}>القوة: {str.label}</div></>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 9, marginTop: 18, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={() => { setEditPw(false); setErr(""); }}>إلغاء</button>
            <button className="btn btn-gold" onClick={savePw}>🔑 تغيير كلمة السر</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Footer() {
  return (
    <div style={{ textAlign: "center", padding: "24px 0 8px", fontSize: 11, color: MUTED, letterSpacing: 1 }}>
      تم التطوير بواسطة <span style={{ color: GL, fontWeight: 600 }}>Data_Lab_by_JihadAbusaleh</span>
    </div>
  );
}
function Dashboard({ branch, clients, events, expenses, inventory }) {
  const ev  = events.filter(e => e.branch_id === branch.id);
  const ex  = expenses.filter(e => e.branch_id === branch.id);
  const inv = inventory.filter(i => i.branch_id === branch.id);
  const rev = ev.reduce((s, e) => s + e.paid, 0);
  const exp = ex.reduce((s, e) => s + e.amount, 0);
  const prf = rev - exp;
  const up  = ev.filter(e => e.status === "قادم").slice(0, 5);
  const unp = ev.filter(e => e.status === "غير مدفوع");

  // إيرادات شهرية حقيقية من البيانات
  const now = new Date();
  const monthNames = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  const last6 = Array.from({length:6}, (_,i) => { const d = new Date(now.getFullYear(), now.getMonth()-5+i, 1); return { m: d.getMonth(), y: d.getFullYear(), label: monthNames[d.getMonth()].slice(0,3) }; });
  const maxRev = Math.max(...last6.map(({m,y}) => ev.filter(e => { const d = new Date(e.date); return d.getMonth()===m && d.getFullYear()===y; }).reduce((s,e)=>s+e.paid,0)), 1);
  const bars = last6.map(({m,y,label}) => ({ label, val: ev.filter(e => { const d = new Date(e.date); return d.getMonth()===m && d.getFullYear()===y; }).reduce((s,e)=>s+e.paid,0) }));

  // تنبيهات المخزون الحقيقية
  const lowInv = inv.filter(i => calcQty(i.ops) <= i.min_qty);

  return (
    <div>
      <div className="sg">
        {[
          { l: "الإيرادات",  v: `${rev.toLocaleString()} ${branch.symbol}`, c: "gold",  i: "💰", s: "إجمالي المدفوعات" },
          { l: "المصاريف",   v: `${exp.toLocaleString()} ${branch.symbol}`, c: "red",   i: "📤", s: "إجمالي المصاريف" },
          { l: "صافي الربح", v: `${prf.toLocaleString()} ${branch.symbol}`, c: prf >= 0 ? "green" : "red", i: "📈", s: "الإيرادات - المصاريف" },
          { l: "الفعاليات",  v: ev.length, c: "", i: "🎉", s: `${up.length} قادمة • ${unp.length} غير مدفوعة` },
        ].map(s => (
          <div className="sc" key={s.l}><span className="sc-ico">{s.i}</span><div className="sc-lbl">{s.l}</div><div className={`sc-val ${s.c}`}>{s.v}</div><div className="sc-sub">{s.s}</div></div>
        ))}
      </div>
      <div className="dg">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="sec-t">الفعاليات القادمة <span className="badge ba">{up.length}</span></div>
            {up.length === 0 ? <div className="es"><div>🎉</div><div style={{marginTop:6}}>لا توجد فعاليات قادمة</div></div> : (
              <div className="tw"><table><thead><tr><th>العميل</th><th>التاريخ</th><th>الموقع</th><th>المبلغ</th></tr></thead><tbody>
                {up.map(e => { const c = clients.find(x => x.id === e.client_id); return <tr key={e.id}><td style={{ fontWeight: 500 }}>{c?.name}</td><td style={{ color: GL }}>{e.date}</td><td style={{ color: MUTED }}>{e.location}</td><td>{e.total.toLocaleString()} {branch.symbol}</td></tr>; })}
              </tbody></table></div>
            )}
          </div>
          <div className="card">
            <div className="sec-t">الإيرادات الشهرية</div>
            {rev === 0 ? <div className="es" style={{padding:20}}><div style={{fontSize:12,color:MUTED}}>لا توجد بيانات بعد</div></div> : (
              <div className="bc">{bars.map(b => <div className="bw" key={b.label}><div className="bar" style={{ height: `${Math.max(4, Math.round((b.val/maxRev)*100))}%` }} /><div className="bar-l">{b.label}</div></div>)}</div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card card-gold">
            <div className="sec-t">⚠️ تنبيهات المخزون</div>
            {lowInv.length === 0 ? <div style={{textAlign:"center",color:GREEN,fontSize:13,padding:14}}>✓ المخزون بمستوى جيد</div> : lowInv.map(x => { const q = calcQty(x.ops); return <div className="al" key={x.id}><div className="ald" style={{ background: RED }} /><div><div style={{ fontSize: 13 }}>{x.name}</div><div style={{ fontSize: 11, color: MUTED }}>{q}/{x.min_qty} {x.unit}</div></div></div>; })}
          </div>
          <div className="card">
            <div className="sec-t">عقود غير مدفوعة</div>
            {unp.length === 0 ? <div style={{ textAlign: "center", color: GREEN, fontSize: 13, padding: 14 }}>✓ كل العقود مسددة</div> : unp.map(e => { const c = clients.find(x => x.id === e.client_id); const pct = Math.round((e.paid / e.total) * 100); return <div key={e.id} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>{c?.name}</span><span style={{ color: RED }}>{(e.total - e.paid).toLocaleString()} {branch.symbol}</span></div><div className="pb"><div className="pf" style={{ width: `${pct}%` }} /></div><div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{pct}% مدفوع</div></div>; })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CLIENTS ──────────────────────────────────────────────────────────────────
function Clients({ branch, clients, setClients, toast }) {
  const [s, setS] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState({ name: "", phone: "", notes: "" });
  const list = clients.filter(c => c.branch_id === branch.id && (c.name.includes(s) || (c.phone||"").includes(s)));

  const openAdd  = () => { setEditing(null); setF({ name: "", phone: "", notes: "" }); setShow(true); };
  const openEdit = (c) => { setEditing(c); setF({ name: c.name, phone: c.phone||"", notes: c.notes||"" }); setShow(true); };
  const save = () => {
    if (!f.name) return;
    if (editing) {
      setClients(p => p.map(c => c.id === editing.id ? { ...c, ...f } : c));
      toast("تم تحديث بيانات العميل");
    } else {
      setClients(p => [...p, { ...f, id: Date.now(), branch_id: branch.id }]);
      toast("تمت إضافة العميل");
    }
    setShow(false);
  };
  const del = (id) => { if (window.confirm("هل تريد حذف هذا العميل؟")) { setClients(p => p.filter(c => c.id !== id)); toast("تم حذف العميل"); }};

  return (<div>
    <div className="fb"><input className="si" placeholder="🔍 بحث..." value={s} onChange={e => setS(e.target.value)} /><button className="btn btn-gold" onClick={openAdd}>+ عميل</button></div>
    <div className="card"><div className="tw"><table><thead><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th>ملاحظات</th><th></th></tr></thead><tbody>
      {list.map((c, i) => <tr key={c.id}>
        <td style={{ color: MUTED }}>{i+1}</td>
        <td style={{ fontWeight: 500 }}>{c.name}</td>
        <td style={{ color: GL }}>{c.phone||"—"}</td>
        <td style={{ color: MUTED, fontSize: 12 }}>{c.notes || "—"}</td>
        <td style={{ display:"flex", gap:5 }}>
          <button className="btn btn-ghost" style={{padding:"4px 9px",fontSize:11}} onClick={() => openEdit(c)}>✎</button>
          <button className="btn" style={{padding:"4px 9px",fontSize:11,background:"rgba(224,82,82,0.1)",color:RED,border:"none"}} onClick={() => del(c.id)}>🗑</button>
        </td>
      </tr>)}
    </tbody></table>{list.length === 0 && <div className="es"><div>👥</div><div style={{marginTop:6}}>لا يوجد عملاء في هذا الفرع</div></div>}</div></div>
    {show && <Modal title={editing ? "✎ تعديل العميل" : "+ إضافة عميل"} onClose={() => setShow(false)}>
      <div className="fg">
        <div className="fgr"><label className="fl2">الاسم *</label><input className="fi" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>
        <div className="fgr"><label className="fl2">الهاتف</label><input className="fi" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></div>
        <div className="fgr" style={{ gridColumn: "1/-1" }}><label className="fl2">ملاحظات</label><input className="fi" value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} /></div>
      </div>
      <div style={{ display: "flex", gap: 9, marginTop: 16, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" onClick={() => setShow(false)}>إلغاء</button>
        <button className="btn btn-gold" onClick={save}>💾 حفظ</button>
      </div>
    </Modal>}
  </div>);
}

// ── EVENTS ───────────────────────────────────────────────────────────────────
function Events({ branch, clients, events, setEvents, toast }) {
  const [filter, setFilter] = useState("الكل"); const [showAdd, setShowAdd] = useState(false); const [contract, setContract] = useState(null);
  const [f, setF] = useState({ client_id: "", date: "", time: "", location: "", zone: "", total: "", deposit: "", party1: "شركة SWAY للفعاليات", extras: "", guests: "" });
  const brEv = events.filter(e => e.branch_id === branch.id);
  const filtered = filter === "الكل" ? brEv : brEv.filter(e => e.status === filter);
  const brCl = clients.filter(c => c.branch_id === branch.id);
  const save = () => {
    if (!f.client_id || !f.date) return;
    if (f.location && brEv.find(e => e.date === f.date && e.location === f.location)) { alert("⚠️ تعارض في المواعيد!"); return; }
    const total = +f.total || 0, dep = +f.deposit || 0;
    const ev = { id: Date.now(), client_id: +f.client_id, date: f.date, time: f.time, location: f.location, zone: f.zone, total, paid: dep, status: dep >= total ? "مدفوع" : "قادم", branch_id: branch.id, party1: f.party1, extras: f.extras, guests: f.guests, deposit: dep };
    setEvents(p => [...p, ev]); toast("تمت إضافة الفعالية وتوليد العقد"); setContract(ev); setShowAdd(false);
    setF({ client_id: "", date: "", time: "", location: "", zone: "", total: "", deposit: "", party1: "شركة SWAY للفعاليات", extras: "", guests: "" });
  };
  const del = (id) => { if (window.confirm("هل تريد حذف هذه الفعالية؟ سيتم حذف العقد المرتبط بها أيضاً.")) { setEvents(p => p.filter(e => e.id !== id)); toast("تم حذف الفعالية"); }};
  return (<div>
    <div style={{ display: "flex", gap: 9, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
      <div className="tabs">{["الكل","قادم","مدفوع","غير مدفوع"].map(s => <div key={s} className={`tab${filter===s?" active":""}`} onClick={() => setFilter(s)}>{s}</div>)}</div>
      <div style={{ flex: 1 }} /><button className="btn btn-gold" onClick={() => setShowAdd(true)}>+ فعالية جديدة</button>
    </div>
    <div className="card"><div className="tw"><table><thead><tr><th>العميل</th><th>التاريخ</th><th>الموقع</th><th>المبلغ</th><th>الحالة</th><th></th></tr></thead><tbody>
      {filtered.map(e => { const c = clients.find(x => x.id === e.client_id); return <tr key={e.id}>
        <td style={{ fontWeight: 500 }}>{c?.name}</td>
        <td style={{ color: GL }}>{e.date}</td>
        <td>{e.location}</td>
        <td>{e.total.toLocaleString()} {branch.symbol}</td>
        <td><SBadge s={e.status} /></td>
        <td style={{ display:"flex", gap:5 }}>
          <button className="btn btn-outline" style={{ padding: "3px 9px", fontSize: 12 }} onClick={() => setContract(e)}>📄</button>
          <button className="btn" style={{padding:"3px 9px",fontSize:12,background:"rgba(224,82,82,0.1)",color:RED,border:"none"}} onClick={() => del(e.id)}>🗑</button>
        </td>
      </tr>; })}
    </tbody></table>{filtered.length === 0 && <div className="es"><div>🎉</div><div style={{marginTop:6}}>لا توجد فعاليات</div></div>}</div></div>
    {showAdd && <Modal title="🎉 فعالية جديدة" onClose={() => setShowAdd(false)} wide><div className="fg"><div className="fgr" style={{ gridColumn: "1/-1" }}><label className="fl2">العميل *</label><select className="fi" value={f.client_id} onChange={e => setF({ ...f, client_id: e.target.value })}><option value="">— اختر —</option>{brCl.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div className="fgr"><label className="fl2">التاريخ *</label><input className="fi" type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} /></div><div className="fgr"><label className="fl2">الوقت</label><input className="fi" type="time" value={f.time} onChange={e => setF({ ...f, time: e.target.value })} /></div><div className="fgr"><label className="fl2">القاعة</label><input className="fi" value={f.location} onChange={e => setF({ ...f, location: e.target.value })} /></div><div className="fgr"><label className="fl2">المنطقة</label><input className="fi" value={f.zone} onChange={e => setF({ ...f, zone: e.target.value })} /></div><div className="fgr"><label className="fl2">المبلغ الإجمالي</label><input className="fi" type="number" value={f.total} onChange={e => setF({ ...f, total: e.target.value })} /></div><div className="fgr"><label className="fl2">العربون</label><input className="fi" type="number" value={f.deposit} onChange={e => setF({ ...f, deposit: e.target.value })} /></div><div className="fgr"><label className="fl2">عدد الأشخاص</label><input className="fi" value={f.guests} onChange={e => setF({ ...f, guests: e.target.value })} /></div><div className="fgr"><label className="fl2">الطرف الأول</label><input className="fi" value={f.party1} onChange={e => setF({ ...f, party1: e.target.value })} /></div><div className="fgr" style={{ gridColumn: "1/-1" }}><label className="fl2">الخدمات الإضافية</label><input className="fi" value={f.extras} onChange={e => setF({ ...f, extras: e.target.value })} /></div></div><div style={{ display: "flex", gap: 9, marginTop: 18, justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>إلغاء</button><button className="btn btn-gold" onClick={save}>📄 حفظ وتوليد العقد</button></div></Modal>}
    {contract && <Modal title="📄 عقد الفعالية" onClose={() => setContract(null)} wide>
      <div className="cp"><div style={{ textAlign: "center", marginBottom: 16 }}><span style={{ fontFamily: FH, fontSize: 18, fontWeight: 700, color: G, display: "block" }}>عقد خدمات تنظيم حفل</span><div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>تاريخ الإصدار: {new Date().toLocaleDateString("ar")}</div></div>
        <hr style={{ borderColor: G, marginBottom: 12 }} />
        {[["الطرف الأول",contract.party1],["الطرف الثاني",clients.find(c=>c.id===contract.client_id)?.name],["المدينة",contract.zone],["تاريخ الحفل",contract.date],["الساعة",contract.time],["القاعة",contract.location],["عدد الأشخاص",contract.guests],["الخدمات",contract.extras||"الخدمة الأساسية"],["المبلغ الإجمالي",`${contract.total?.toLocaleString()} ${branch.symbol}`],["العربون",`${contract.deposit?.toLocaleString()} ${branch.symbol}`],["المتبقي",`${(contract.total-contract.deposit)?.toLocaleString()} ${branch.symbol}`]].map(([k,v]) => <p className="cl" key={k}><strong>{k}:</strong> {v||"—"}</p>)}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>{["الطرف الأول","الطرف الثاني"].map(s => <div key={s} style={{ textAlign: "center" }}><div>{`توقيع ${s}`}</div><div style={{ borderBottom: "1px solid #888", width: 100, marginTop: 24 }} /></div>)}</div>
      </div>
      <div style={{ display: "flex", gap: 9, marginTop: 12, justifyContent: "flex-end" }}><button className="btn btn-gold" onClick={() => window.print()}>📥 طباعة</button><button className="btn btn-ghost" onClick={() => setContract(null)}>إغلاق</button></div>
    </Modal>}
  </div>);
}

// ── PAYMENTS ─────────────────────────────────────────────────────────────────
function Payments({ branch, clients, events, payments, setPayments, toast }) {
  const [show, setShow] = useState(false); const [f, setF] = useState({ event_id: "", amount: "", method: "نقد", note: "" });
  const brP = payments.filter(p => p.branch_id === branch.id); const brEv = events.filter(e => e.branch_id === branch.id);
  const save = () => { if (!f.event_id || !f.amount) return; setPayments(p => [...p, { id: Date.now(), event_id: +f.event_id, amount: +f.amount, method: f.method, note: f.note, branch_id: branch.id, date: new Date().toISOString().split("T")[0] }]); toast("تم تسجيل الدفعة"); setF({ event_id: "", amount: "", method: "نقد", note: "" }); setShow(false); };
  return (<div>
    <div className="fb"><div style={{ flex: 1 }} /><button className="btn btn-gold" onClick={() => setShow(true)}>+ دفعة</button></div>
    <div className="card"><div className="tw"><table><thead><tr><th>الفعالية</th><th>المبلغ</th><th>الطريقة</th><th>التاريخ</th><th>ملاحظة</th></tr></thead><tbody>
      {brP.map(p => { const e = events.find(x => x.id === p.event_id); const c = clients.find(x => x.id === e?.client_id); return <tr key={p.id}><td>{c?.name} — {e?.location}</td><td style={{ color: GREEN, fontWeight: 600 }}>{p.amount.toLocaleString()} {branch.symbol}</td><td><span className="badge ba">{p.method}</span></td><td style={{ color: MUTED }}>{p.date}</td><td style={{ color: MUTED, fontSize: 12 }}>{p.note||"—"}</td></tr>; })}
    </tbody></table>{brP.length === 0 && <div className="es"><div>💳</div><div>لا توجد مدفوعات</div></div>}</div></div>
    {show && <Modal title="💳 تسجيل دفعة" onClose={() => setShow(false)}><div className="fg"><div className="fgr" style={{ gridColumn: "1/-1" }}><label className="fl2">الفعالية *</label><select className="fi" value={f.event_id} onChange={e => setF({ ...f, event_id: e.target.value })}><option value="">— اختر —</option>{brEv.map(e => { const c = clients.find(x => x.id === e.client_id); return <option key={e.id} value={e.id}>{c?.name} — {e.date}</option>; })}</select></div><div className="fgr"><label className="fl2">المبلغ *</label><input className="fi" type="number" value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} /></div><div className="fgr"><label className="fl2">الطريقة</label><select className="fi" value={f.method} onChange={e => setF({ ...f, method: e.target.value })}><option>نقد</option><option>تحويل</option><option>بطاقة</option></select></div><div className="fgr" style={{ gridColumn: "1/-1" }}><label className="fl2">ملاحظة</label><input className="fi" value={f.note} onChange={e => setF({ ...f, note: e.target.value })} /></div></div><div style={{ background: "rgba(224,82,82,0.06)", border: "1px solid rgba(224,82,82,0.16)", borderRadius: 8, padding: "9px 12px", marginTop: 10, fontSize: 12, color: RED }}>⚠️ المدفوعات محمية من الحذف والتعديل</div><div style={{ display: "flex", gap: 9, marginTop: 14, justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={() => setShow(false)}>إلغاء</button><button className="btn btn-gold" onClick={save}>💾 تسجيل</button></div></Modal>}
  </div>);
}

// ── EXPENSES ─────────────────────────────────────────────────────────────────
function Expenses({ branch, events, clients, expenses, setExpenses, toast }) {
  const [show, setShow] = useState(false); const [f, setF] = useState({ type: "ديكور", amount: "", event_id: "", note: "", date: "" });
  const brEx = expenses.filter(e => e.branch_id === branch.id); const brEv = events.filter(e => e.branch_id === branch.id);
  const total = brEx.reduce((s, e) => s + e.amount, 0);
  const save = () => { if (!f.amount) return; setExpenses(p => [...p, { id: Date.now(), type: f.type, amount: +f.amount, event_id: f.event_id ? +f.event_id : null, note: f.note, branch_id: branch.id, date: f.date || new Date().toISOString().split("T")[0] }]); toast("تمت إضافة المصروف"); setF({ type: "ديكور", amount: "", event_id: "", note: "", date: "" }); setShow(false); };
  return (<div>
    <div className="sg" style={{ gridTemplateColumns: "repeat(1,1fr)", marginBottom: 16 }}><div className="sc"><div className="sc-lbl">إجمالي المصاريف</div><div className="sc-val red">{total.toLocaleString()} {branch.symbol}</div></div></div>
    <div className="fb"><div style={{ flex: 1 }} /><button className="btn btn-gold" onClick={() => setShow(true)}>+ مصروف</button></div>
    <div className="card"><div className="tw"><table><thead><tr><th>النوع</th><th>المبلغ</th><th>الفعالية</th><th>التاريخ</th><th>ملاحظة</th></tr></thead><tbody>
      {brEx.map(x => { const e = x.event_id ? events.find(ev => ev.id === x.event_id) : null; const c = e ? clients.find(cl => cl.id === e.client_id) : null; return <tr key={x.id}><td><span className="chip">{x.type}</span></td><td style={{ color: RED, fontWeight: 600 }}>{x.amount.toLocaleString()} {branch.symbol}</td><td style={{ color: MUTED, fontSize: 12 }}>{c?.name||"عام"}</td><td style={{ color: MUTED }}>{x.date}</td><td style={{ color: MUTED, fontSize: 12 }}>{x.note||"—"}</td></tr>; })}
    </tbody></table>{brEx.length === 0 && <div className="es"><div>📊</div><div>لا توجد مصاريف</div></div>}</div></div>
    {show && <Modal title="📊 مصروف جديد" onClose={() => setShow(false)}><div className="fg"><div className="fgr"><label className="fl2">النوع</label><select className="fi" value={f.type} onChange={e => setF({ ...f, type: e.target.value })}>{["ديكور","كهرباء","تجهيزات","مواصلات","أجور","أخرى"].map(t => <option key={t}>{t}</option>)}</select></div><div className="fgr"><label className="fl2">المبلغ *</label><input className="fi" type="number" value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} /></div><div className="fgr"><label className="fl2">الفعالية</label><select className="fi" value={f.event_id} onChange={e => setF({ ...f, event_id: e.target.value })}><option value="">— عام —</option>{brEv.map(e => { const c = clients.find(x => x.id === e.client_id); return <option key={e.id} value={e.id}>{c?.name} — {e.date}</option>; })}</select></div><div className="fgr"><label className="fl2">التاريخ</label><input className="fi" type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} /></div><div className="fgr" style={{ gridColumn: "1/-1" }}><label className="fl2">ملاحظة</label><input className="fi" value={f.note} onChange={e => setF({ ...f, note: e.target.value })} /></div></div><div style={{ display: "flex", gap: 9, marginTop: 18, justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={() => setShow(false)}>إلغاء</button><button className="btn btn-gold" onClick={save}>💾 حفظ</button></div></Modal>}
  </div>);
}

// ── INVENTORY ─────────────────────────────────────────────────────────────────
function Inventory({ branch, events, clients, inventory, setInventory, toast }) {
  const [showAdd, setShowAdd] = useState(false); const [showOp, setShowOp] = useState(null);
  const [f, setF] = useState({ name: "", unit: "قطعة", min_qty: "", initial: "" });
  const [op, setOp] = useState({ type: "add", qty: "", event_id: "" });
  const brInv = inventory.filter(i => i.branch_id === branch.id); const brEv = events.filter(e => e.branch_id === branch.id);
  const add = () => { if (!f.name) return; setInventory(p => [...p, { id: Date.now(), name: f.name, unit: f.unit, min_qty: +f.min_qty||0, branch_id: branch.id, ops: [{ type: "add", qty: +f.initial||0, date: new Date().toISOString().split("T")[0] }] }]); toast("تمت إضافة عنصر المخزون"); setF({ name: "", unit: "قطعة", min_qty: "", initial: "" }); setShowAdd(false); };
  const doOp = () => { if (!op.qty) return; setInventory(p => p.map(i => i.id === showOp.id ? { ...i, ops: [...i.ops, { type: op.type, qty: +op.qty, event_id: op.event_id||null, date: new Date().toISOString().split("T")[0] }] } : i)); toast("تم تحديث المخزون"); setOp({ type: "add", qty: "", event_id: "" }); setShowOp(null); };
  return (<div>
    <div className="fb"><div style={{ flex: 1 }} /><button className="btn btn-gold" onClick={() => setShowAdd(true)}>+ عنصر</button></div>
    <div className="card"><div className="tw"><table><thead><tr><th>العنصر</th><th>الوحدة</th><th>الكمية</th><th>الحد الأدنى</th><th>الحالة</th><th>تحديث</th></tr></thead><tbody>
      {brInv.map(item => { const q = calcQty(item.ops); const low = q <= item.min_qty; return <tr key={item.id}><td style={{ fontWeight: 500 }}>{item.name}</td><td style={{ color: MUTED }}>{item.unit}</td><td style={{ fontFamily: FH, fontSize: 18, color: low ? RED : GREEN }}>{q}</td><td style={{ color: MUTED }}>{item.min_qty}</td><td>{low ? <span className="badge br">⚠ منخفض</span> : <span className="badge bg">✓ كافٍ</span>}</td><td><button className="btn btn-outline" style={{ padding: "3px 9px", fontSize: 12 }} onClick={() => setShowOp(item)}>+/−</button></td></tr>; })}
    </tbody></table>{brInv.length === 0 && <div className="es"><div>📦</div><div>لا يوجد مخزون</div></div>}</div></div>
    {showAdd && <Modal title="📦 إضافة عنصر" onClose={() => setShowAdd(false)}><div className="fg"><div className="fgr" style={{ gridColumn: "1/-1" }}><label className="fl2">الاسم *</label><input className="fi" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div><div className="fgr"><label className="fl2">الوحدة</label><select className="fi" value={f.unit} onChange={e => setF({ ...f, unit: e.target.value })}>{["قطعة","متر","كيلو","لتر","علبة"].map(u => <option key={u}>{u}</option>)}</select></div><div className="fgr"><label className="fl2">الحد الأدنى</label><input className="fi" type="number" value={f.min_qty} onChange={e => setF({ ...f, min_qty: e.target.value })} /></div><div className="fgr" style={{ gridColumn: "1/-1" }}><label className="fl2">الكمية الأولية</label><input className="fi" type="number" value={f.initial} onChange={e => setF({ ...f, initial: e.target.value })} /></div></div><div style={{ display: "flex", gap: 9, marginTop: 16, justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>إلغاء</button><button className="btn btn-gold" onClick={add}>💾 إضافة</button></div></Modal>}
    {showOp && <Modal title={`تحديث: ${showOp.name}`} onClose={() => setShowOp(null)}><div style={{ textAlign: "center", marginBottom: 16 }}><div style={{ fontSize: 44, fontFamily: FH, color: GL }}>{calcQty(showOp.ops)}</div><div style={{ color: MUTED, fontSize: 12 }}>الكمية الحالية</div></div><div className="fg"><div className="fgr"><label className="fl2">العملية</label><select className="fi" value={op.type} onChange={e => setOp({ ...op, type: e.target.value })}><option value="add">➕ إضافة</option><option value="out">➖ سحب</option></select></div><div className="fgr"><label className="fl2">الكمية *</label><input className="fi" type="number" value={op.qty} onChange={e => setOp({ ...op, qty: e.target.value })} /></div><div className="fgr" style={{ gridColumn: "1/-1" }}><label className="fl2">ربط بفعالية</label><select className="fi" value={op.event_id} onChange={e => setOp({ ...op, event_id: e.target.value })}><option value="">— لا يوجد —</option>{brEv.map(e => { const c = clients.find(x => x.id === e.client_id); return <option key={e.id} value={e.id}>{c?.name} — {e.date}</option>; })}</select></div></div><div style={{ display: "flex", gap: 9, marginTop: 16, justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={() => setShowOp(null)}>إلغاء</button><button className="btn btn-gold" onClick={doOp}>💾 تحديث</button></div></Modal>}
  </div>);
}

// ── REPORTS ──────────────────────────────────────────────────────────────────
function Reports({ branch, branches, events, expenses, isOwner }) {
  const visBranches = isOwner ? branches : branches.filter(b => b.id === branch.id);
  return (<div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
    {visBranches.map(br => {
      const brEv = events.filter(e => e.branch_id === br.id); const brEx = expenses.filter(e => e.branch_id === br.id);
      const rev = brEv.reduce((s, e) => s + e.paid, 0); const exp = brEx.reduce((s, e) => s + e.amount, 0); const prf = rev - exp;
      const pct = rev > 0 ? Math.max(0, Math.round((prf / rev) * 100)) : 0;
      return (<div key={br.id} className="card card-gold">
        <div style={{ fontSize: 28, marginBottom: 7 }}>{br.flag}</div>
        <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>{br.name}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[["الإيرادات", rev, GL], ["المصاريف", exp, RED]].map(([l, v, c]) => <div key={l} style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: MUTED, fontSize: 13 }}>{l}</span><span style={{ color: c, fontWeight: 600 }}>{v.toLocaleString()} {br.symbol}</span></div>)}
          <hr className="div" style={{ margin: "3px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600 }}>صافي الربح</span><span style={{ color: prf >= 0 ? GREEN : RED, fontWeight: 700, fontSize: 16 }}>{prf.toLocaleString()} {br.symbol}</span></div>
          <div style={{ marginTop: 4 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: MUTED, marginBottom: 3 }}><span>نسبة الربح</span><span>{pct}%</span></div><div className="pb"><div className="pf" style={{ width: `${pct}%` }} /></div></div>
          <div style={{fontSize:11,color:MUTED,marginTop:4}}>عدد الفعاليات: <span style={{color:TEXT}}>{brEv.length}</span> • عدد العملاء المخدومين: <span style={{color:TEXT}}>{new Set(brEv.map(e=>e.client_id)).size}</span></div>
        </div>
      </div>);
    })}
    {visBranches.length === 0 && <div className="es" style={{gridColumn:"1/-1"}}><div>📈</div><div style={{marginTop:6}}>لا توجد بيانات</div></div>}
  </div>);
}

// ── BRANCHES PAGE with auto-currency ─────────────────────────────────────────
function BranchesPage({ branches, setBranches, users, setUsers, toast }) {
  const [show, setShow] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [selC, setSelC] = useState(null);
  const [mgrType, setMgrType] = useState("existing");
  const [f, setF] = useState({ name: "", manager_id: "" });
  const [newMgr, setNewMgr] = useState({ name: "", email: "", password: "", phone: "" });
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const managers = users.filter(u => u.role === "manager");
  const str = pwStrength(newMgr.password);

  const selectCountry = (c) => {
    setSelC(c);
    if (!f.name) setF(p => ({ ...p, name: `${c.name} - ` }));
  };

  const openEdit = (br) => {
    setEditBranch(br);
    const c = COUNTRIES.find(c => c.name === br.country);
    setSelC(c || null);
    setF({ name: br.name, manager_id: br.manager_id || "" });
    setMgrType(br.manager_id ? "existing" : "none");
    setErr("");
    setShow(true);
  };

  const reset = () => { setShow(false); setSelC(null); setErr(""); setEditBranch(null); setF({ name: "", manager_id: "" }); setNewMgr({ name: "", email: "", password: "", phone: "" }); setMgrType("existing"); };

  const save = () => {
    setErr("");
    if (!f.name || !selC) { setErr("اختر البلد واسم الفرع"); return; }
    let manager_id = editBranch ? (editBranch.manager_id || null) : null;

    if (mgrType === "new") {
      if (!newMgr.name || !newMgr.email || !newMgr.password) { setErr("أكمل بيانات المدير الجديد"); return; }
      if (users.find(u => u.email === newMgr.email)) { setErr("البريد الإلكتروني مستخدم مسبقاً"); return; }
      if (str.label === "ضعيفة") { setErr("كلمة سر المدير ضعيفة جداً"); return; }
      const newUser = { id: Date.now(), name: newMgr.name, email: newMgr.email, password: newMgr.password, phone: newMgr.phone, role: "manager", avatar: newMgr.name.charAt(0), branch_id: null, created: new Date().toISOString().split("T")[0] };
      setUsers(p => [...p, newUser]);
      manager_id = newUser.id;
    } else if (mgrType === "existing") {
      manager_id = f.manager_id ? +f.manager_id : null;
    } else if (mgrType === "none") {
      manager_id = null;
    }

    if (editBranch) {
      setBranches(p => p.map(b => b.id === editBranch.id ? { ...b, name: f.name, country: selC.name, flag: selC.flag, currency: selC.currency, symbol: selC.symbol, manager_id } : b));
      if (manager_id) setUsers(p => p.map(u => u.id === manager_id ? { ...u, branch_id: editBranch.id } : u));
      toast("تم تحديث بيانات الفرع");
    } else {
      const branch = { id: Date.now(), name: f.name, country: selC.name, flag: selC.flag, currency: selC.currency, symbol: selC.symbol, manager_id };
      setBranches(p => [...p, branch]);
      if (manager_id) setUsers(p => p.map(u => u.id === manager_id ? { ...u, branch_id: branch.id } : u));
      toast("تمت إضافة الفرع" + (mgrType === "new" ? " وإنشاء حساب المدير" : ""));
    }
    reset();
  };

  return (<div>
    <div className="fb"><div style={{ flex: 1 }} /><button className="btn btn-gold" onClick={() => { setEditBranch(null); setShow(true); }}>+ فرع جديد</button></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
      {branches.map(br => { const mgr = users.find(u => u.id === br.manager_id); return (
        <div key={br.id} className="card card-gold" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 38, marginBottom: 7 }}>{br.flag}</div>
          <div style={{ fontFamily: FH, fontSize: 17, fontWeight: 700 }}>{br.name}</div>
          <div style={{ marginTop: 10, fontSize: 12, color: MUTED, display: "flex", flexDirection: "column", gap: 4 }}>
            <div>البلد: <span style={{ color: TEXT }}>{br.country}</span></div>
            <div>العملة: <span style={{ color: GL, fontWeight: 700, fontSize: 14 }}>{br.currency} ({br.symbol})</span></div>
            {mgr && <div>المدير: <span style={{ color: TEXT }}>{mgr.name}</span></div>}
            {!mgr && <div style={{ color: RED, fontSize: 11 }}>لا يوجد مدير</div>}
          </div>
          <button className="btn btn-outline" style={{ marginTop: 12, fontSize: 12 }} onClick={() => openEdit(br)}>✎ تعديل</button>
        </div>
      ); })}
    </div>

    {show && <Modal title={editBranch ? "✎ تعديل الفرع" : "🏢 إضافة فرع جديد"} onClose={reset} wide>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {err && <div className="auth-err">{err}</div>}

        {/* اختيار البلد */}
        <div>
          <div className="fl2" style={{ marginBottom: 8 }}>اختر البلد — العملة ستتحدد تلقائياً *</div>
          <div className="cg">
            {COUNTRIES.map(c => (
              <div key={c.name} className={`co${selC?.name === c.name ? " sel" : ""}`} onClick={() => selectCountry(c)}>
                <span className="co-flag">{c.flag}</span>
                <div style={{ fontSize: 11, fontWeight: 500 }}>{c.name}</div>
                <div className="co-cur">{c.currency}</div>
              </div>
            ))}
          </div>
        </div>

        {selC && <div className="cur-preview">
          <span style={{ fontSize: 26 }}>{selC.flag}</span>
          <div><div style={{ fontSize: 10, color: MUTED, marginBottom: 2 }}>العملة تلقائياً</div><div style={{ fontFamily: FH, fontSize: 18, color: GL, fontWeight: 700 }}>{selC.currency} ({selC.symbol})</div></div>
          <span className="badge bg" style={{ marginRight: "auto" }}>✓</span>
        </div>}

        {/* اسم الفرع */}
        <div className="fgr"><label className="fl2">اسم الفرع *</label><input className="fi" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="مثال: السعودية - جدة" /></div>

        {/* قسم المدير */}
        <div style={{ background: S2, borderRadius: 10, padding: "14px 16px", border: `1px solid rgba(255,255,255,0.055)` }}>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 10, letterSpacing: 1 }}>المدير المسؤول</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {[["existing","مدير موجود"],["new","مدير جديد"],["none","بدون مدير"]].map(([v,l]) => (
              <button key={v} className={`btn ${mgrType===v?"btn-gold":"btn-ghost"}`} style={{ flex:1, justifyContent:"center", fontSize:12, padding:"7px 8px" }} onClick={() => setMgrType(v)}>{l}</button>
            ))}
          </div>

          {mgrType === "existing" && (
            <select className="fi" value={f.manager_id} onChange={e => setF({ ...f, manager_id: e.target.value })}>
              <option value="">— اختر مديراً —</option>
              {managers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
          )}

          {mgrType === "new" && (
            <div className="fg" style={{ marginTop: 4 }}>
              <div className="fgr"><label className="fl2">الاسم الكامل *</label><input className="fi" value={newMgr.name} onChange={e => setNewMgr({...newMgr, name: e.target.value})} placeholder="اسم المدير" /></div>
              <div className="fgr"><label className="fl2">رقم الهاتف</label><input className="fi" value={newMgr.phone} onChange={e => setNewMgr({...newMgr, phone: e.target.value})} placeholder="0599-000000" /></div>
              <div className="fgr" style={{ gridColumn:"1/-1" }}><label className="fl2">البريد الإلكتروني *</label><input className="fi" value={newMgr.email} onChange={e => setNewMgr({...newMgr, email: e.target.value})} placeholder="manager@swaybar.com" /></div>
              <div className="fgr" style={{ gridColumn:"1/-1" }}>
                <label className="fl2">كلمة السر *</label>
                <div className="fl-wrap">
                  <input className="fi" type={showPw?"text":"password"} value={newMgr.password} onChange={e => setNewMgr({...newMgr, password: e.target.value})} placeholder="••••••••" style={{ paddingLeft:64 }} />
                  <button className="fl-toggle" onClick={() => setShowPw(!showPw)}>{showPw?"إخفاء":"إظهار"}</button>
                </div>
                {newMgr.password && <><div className="pw-bar" style={{marginTop:5}}><div className="pw-fill" style={{width:`${str.pct}%`,background:str.color}}/></div><div className="pw-lbl" style={{color:str.color}}>القوة: {str.label}</div></>}
              </div>
              <div style={{ gridColumn:"1/-1", background:"rgba(74,158,224,0.06)", border:"1px solid rgba(74,158,224,0.16)", borderRadius:8, padding:"9px 13px", fontSize:12, color:BLUE }}>
                ℹ سيتم إنشاء حساب للمدير تلقائياً وربطه بهذا الفرع
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 9, marginTop: 20, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" onClick={reset}>إلغاء</button>
        <button className="btn btn-gold" disabled={!selC || !f.name} onClick={save}>💾 إضافة الفرع</button>
      </div>
    </Modal>}
  </div>);
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [users,       setUsers]     = useState(INIT_USERS);
  const [currentUser, setCurrent]   = useState(null);
  const [authPage,    setAuthPage]  = useState("login");
  const [branches,    setBranches]  = useState(INIT_BRANCHES);
  const [clients,     setClients]   = useState(INIT_CLIENTS);
  const [events,      setEvents]    = useState(INIT_EVENTS);
  const [expenses,    setExpenses]  = useState(INIT_EXPENSES);
  const [inventory,   setInventory] = useState(INIT_INV);
  const [payments,    setPayments]  = useState([]);
  const [page,        setPage]      = useState("dashboard");
  const [brId,        setBrId]      = useState(1);
  const [brMenu,      setBrMenu]    = useState(false);
  const [toastMsg,    setToastMsg]  = useState("");
  const [sideOpen,    setSideOpen]  = useState(false);
  const [moreOpen,    setMoreOpen]  = useState(false);

  useEffect(() => {
    if (currentUser) {
      const up = users.find(u => u.id === currentUser.id);
      if (up) setCurrent(up);
    }
  }, [users]);

  const toast = msg => setToastMsg(msg);
  const login = user => { setCurrent(user); if (user.role !== "owner" && user.branch_id) setBrId(user.branch_id); setPage("dashboard"); };
  const logout = () => { setCurrent(null); setAuthPage("login"); };

  if (!currentUser) return (
    <>
      <style>{CSS}</style>
      {authPage === "reset"
        ? <ResetPage users={users} setUsers={setUsers} onBack={() => setAuthPage("login")} />
        : <LoginPage users={users} onLogin={login} onReset={() => setAuthPage("reset")} />}
    </>
  );

  const isOwner = currentUser.role === "owner";
  const branch  = branches.find(b => b.id === brId) || branches[0];
  const visBr   = isOwner ? branches : branches.filter(b => b.id === currentUser.branch_id);

  const NAV = [
    { id: "dashboard", l: "لوحة التحكم", i: "⊡" },
    { id: "events",    l: "الفعاليات",   i: "🎉" },
    { id: "clients",   l: "العملاء",     i: "👥" },
    { id: "payments",  l: "المدفوعات",   i: "💳" },
    { id: "expenses",  l: "المصاريف",    i: "📊" },
    { id: "inventory", l: "المخزون",     i: "📦" },
    { id: "reports",   l: "التقارير",    i: "📈" },
    ...(isOwner ? [{ id: "branches", l: "الفروع", i: "🏢" }] : []),
    { id: "profile",   l: "حسابي",       i: "👤" },
  ];
  const TITLES = { dashboard: "لوحة التحكم", events: "الفعاليات", clients: "العملاء", payments: "المدفوعات", expenses: "المصاريف", inventory: "المخزون", reports: "التقارير", branches: "إدارة الفروع", profile: "حسابي الشخصي" };

  const render = () => {
    const p = { branch, clients, events, expenses, inventory, payments, toast };
    switch (page) {
      case "dashboard": return <Dashboard {...p} />;
      case "clients":   return <Clients   {...p} setClients={setClients} />;
      case "events":    return <Events    {...p} setEvents={setEvents} />;
      case "payments":  return <Payments  {...p} setPayments={setPayments} />;
      case "expenses":  return <Expenses  {...p} setExpenses={setExpenses} />;
      case "inventory": return <Inventory {...p} setInventory={setInventory} />;
      case "reports":   return <Reports   branch={branch} branches={branches} events={events} expenses={expenses} isOwner={isOwner} />;
      case "branches":  return <BranchesPage branches={branches} setBranches={setBranches} users={users} setUsers={setUsers} toast={toast} />;
      case "profile":   return <ProfilePage user={currentUser} users={users} setUsers={setUsers} branches={branches} toast={toast} />;
      default: return null;
    }
  };

  const goPage = (p) => { setPage(p); setSideOpen(false); setMoreOpen(false); };
  const BOT_NAV = [
    { id: "dashboard", l: "الرئيسية", i: "⊡" },
    { id: "events",    l: "الفعاليات", i: "🎉" },
    { id: "clients",   l: "العملاء",  i: "👥" },
    { id: "payments",  l: "المدفوعات", i: "💳" },
  ];
  const MORE_NAV = [
    { id: "expenses",  l: "المصاريف",  i: "📊" },
    { id: "inventory", l: "المخزون",   i: "📦" },
    { id: "reports",   l: "التقارير",  i: "📈" },
    ...(isOwner ? [{ id: "branches", l: "الفروع", i: "🏢" }] : []),
    { id: "profile",   l: "حسابي",    i: "👤" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="sway-root" dir="rtl">

        {/* MOBILE OVERLAY */}
        <div className={`mob-overlay${sideOpen ? " open" : ""}`} onClick={() => setSideOpen(false)} />

        {/* MORE MENU (mobile) */}
        {moreOpen && (
          <div className="mob-more-menu" dir="rtl">
            {MORE_NAV.map(n => (
              <div key={n.id} className={`mob-more-item${page===n.id?" active":""}`} onClick={() => goPage(n.id)}>
                <span className="mob-more-item-ic">{n.i}</span>{n.l}
              </div>
            ))}
          </div>
        )}

        <aside className={`sidebar${sideOpen ? " open" : ""}`}>
          <div className="sb-logo" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div><div className="sb-logo-name">SWAY</div><div className="sb-logo-sub">Event Management</div></div>
            <button className="mob-close-btn" onClick={() => setSideOpen(false)}>✕</button>
          </div>
          <div className="br-badge" onClick={() => setBrMenu(!brMenu)}>
            <div className="br-badge-lbl">الفرع الحالي ▾</div>
            <div className="br-badge-name">{branch.flag} {branch.name}</div>
            <div className="br-badge-cur">{branch.currency} ({branch.symbol})</div>
          </div>
          {brMenu && <div className="br-menu">
            {visBr.map(b => <div key={b.id} className={`br-opt${b.id === brId ? " active" : ""}`} onClick={() => { setBrId(b.id); setBrMenu(false); }}>
              <span>{b.flag}</span><div><div style={{ fontSize: 13 }}>{b.name}</div><div style={{ fontSize: 10, color: MUTED }}>{b.currency} ({b.symbol})</div></div>
            </div>)}
          </div>}
          <nav className="nav">
            {NAV.map(n => <div key={n.id} className={`nav-it${page === n.id ? " active" : ""}`} onClick={() => goPage(n.id)}><span className="nav-ic">{n.i}</span>{n.l}</div>)}
            <div style={{ borderTop: `1px solid ${DIM}`, margin: "6px 0" }} />
            <div className="nav-it" onClick={logout}><span className="nav-ic">⇠</span>تسجيل خروج</div>
          </nav>
          <div className="sb-foot"><div className="user-pill" onClick={() => goPage("profile")}><div className="av" style={{ width: 32, height: 32, fontSize: 13 }}>{currentUser.avatar}</div><div><div style={{ fontSize: 13, fontWeight: 500 }}>{currentUser.name}</div><div style={{ fontSize: 10, color: MUTED }}>{isOwner ? "مالك النظام" : "مدير فرع"}</div></div></div></div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button className="mob-menu-btn" onClick={() => { setSideOpen(true); setMoreOpen(false); }}>☰</button>
              <div className="pg-title">{TITLES[page]}</div>
            </div>
            <div className="topbar-r">
              <span className="branch-info" style={{ fontSize: 12, color: MUTED }}>{branch.flag} {branch.name}</span>
              <span className="branch-info" style={{ color: GL, fontSize: 13, fontWeight: 600 }}>{branch.currency}</span>
              <div style={{ width: 1, height: 16, background: DIM }} />
              <div className="av" style={{ width: 30, height: 30, fontSize: 12, cursor: "pointer" }} onClick={() => goPage("profile")}>{currentUser.avatar}</div>
            </div>
          </header>
          <div className="content">{render()}<Footer /></div>
        </main>

        {/* BOTTOM NAV (mobile) */}
        <nav className="bottom-nav">
          <div className="bottom-nav-inner">
            {BOT_NAV.map(n => (
              <div key={n.id} className={`bn-item${page===n.id?" active":""}`} onClick={() => { goPage(n.id); setMoreOpen(false); }}>
                <span className="bn-item-ic">{n.i}</span>
                <span className="bn-item-lbl">{n.l}</span>
              </div>
            ))}
            <div className={`bn-item${moreOpen?" active":""}`} onClick={() => setMoreOpen(!moreOpen)}>
              <span className="bn-item-ic">⋯</span>
              <span className="bn-item-lbl">المزيد</span>
            </div>
          </div>
        </nav>

      </div>
      {toastMsg && <Toast msg={toastMsg} done={() => setToastMsg("")} />}
    </>
  );
}