<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0b1018">
  <meta name="description" content="Aura Tracker — organize seus estudos, acompanhe ciclos e transforme constância em progresso.">
  <title>Aura Tracker — Estudos e progresso</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0b1018;
      --surface: #111925;
      --surface-2: #151f2d;
      --surface-3: #1b2737;
      --border: #253245;
      --text: #edf3fb;
      --muted: #8e9eb3;
      --faint: #65758b;
      --green: #53e0a0;
      --green-dark: #173e35;
      --yellow: #f5c96b;
      --red: #fb7887;
      --blue: #7cacf9;
      --purple: #b9a0ff;
      --radius: 18px;
      --shadow: 0 18px 48px rgba(0,0,0,.24);
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; background: var(--bg); color: var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 14px; line-height: 1.5; }
    button, input, select, textarea { font: inherit; }
    button { cursor: pointer; }
    button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }
    button:disabled { opacity: .45; cursor: not-allowed; }
    .app-root { min-height: 100vh; background: var(--bg); padding-bottom: 116px; }
    .topbar { position: sticky; top: 0; z-index: 30; display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 15px clamp(16px, 4vw, 54px); border-bottom: 1px solid rgba(37,50,69,.9); background: rgba(11,16,24,.93); backdrop-filter: blur(18px); }
    .brand-wrap, .brand, .top-actions, .profile-chip, .wallet-chip, .nav-tabs, .section-heading, .heading-actions, .task-topline, .task-meta, .task-actions, .progress-numbers, .modal-head, .toast-row, .shop-card-head { display: flex; align-items: center; }
    .brand-wrap { gap: 34px; }
    .brand { gap: 11px; text-decoration: none; color: var(--text); }
    .brand-mark { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; color: #082017; background: linear-gradient(135deg, #74f2b5, #2dc88a); box-shadow: 0 6px 22px rgba(83,224,160,.17); }
    .brand-mark svg { width: 22px; height: 22px; }
    .brand-name { font-size: 16px; font-weight: 800; letter-spacing: -.55px; }
    .brand-sub { display: block; margin-top: -3px; color: var(--muted); font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; }
    .nav-tabs { gap: 5px; padding: 4px; border: 1px solid var(--border); border-radius: 13px; background: var(--surface); }
    .nav-tab { display: flex; align-items: center; gap: 8px; padding: 9px 13px; color: var(--muted); border: 0; border-radius: 9px; background: transparent; font-weight: 650; transition: .18s ease; }
    .nav-tab:hover { color: var(--text); background: var(--surface-2); }
    .nav-tab.active { color: var(--text); background: var(--surface-3); box-shadow: inset 0 0 0 1px #2b3b50; }
    .nav-tab.active .nav-icon { color: var(--green); }
    .nav-icon { width: 16px; height: 16px; display: inline-block; }
    .top-actions { gap: 10px; }
    .profile-chip { gap: 9px; padding: 5px 11px 5px 5px; border: 1px solid var(--border); border-radius: 13px; background: var(--surface); }
    .avatar { display: grid; place-items: center; width: 31px; height: 31px; border-radius: 9px; color: #c7f9e1; font-weight: 800; background: #20493d; }
    .profile-name { font-size: 12px; font-weight: 750; }
    .profile-rank { color: var(--muted); font-size: 10px; }
    .wallet-chip { gap: 7px; padding: 10px 12px; border: 1px solid rgba(245,201,107,.24); border-radius: 12px; background: rgba(245,201,107,.07); color: var(--yellow); font-weight: 800; white-space: nowrap; }
    .wallet-chip svg { width: 16px; height: 16px; }
    .icon-btn { display: inline-grid; place-items: center; width: 37px; height: 37px; border: 1px solid var(--border); border-radius: 11px; background: var(--surface); color: var(--muted); }
    .icon-btn:hover { color: var(--text); border-color: #40516a; background: var(--surface-2); }
    .icon-btn svg { width: 17px; height: 17px; }
    .container { width: min(1240px, calc(100% - 40px)); margin: 0 auto; }
    .hero { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; padding: 34px 0 23px; }
    .eyebrow { display: flex; align-items: center; gap: 8px; color: var(--green); text-transform: uppercase; letter-spacing: 1.65px; font-size: 10px; font-weight: 800; }
    .eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 12px rgba(83,224,160,.7); }
    h1 { margin: 7px 0 5px; font-size: clamp(26px, 4vw, 35px); line-height: 1.18; letter-spacing: -1.2px; }
    .hero p { margin: 0; color: var(--muted); font-size: 13px; }
    .hero-buttons { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 9px; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 39px; padding: 9px 13px; border: 1px solid var(--border); border-radius: 11px; background: var(--surface-2); color: var(--text); font-size: 12px; font-weight: 750; transition: transform .16s, border-color .16s, background .16s; }
    .btn:hover { border-color: #40516a; background: var(--surface-3); transform: translateY(-1px); }
    .btn svg { width: 15px; height: 15px; }
    .btn-primary { border-color: var(--green); background: var(--green); color: #072318; box-shadow: 0 7px 18px rgba(83,224,160,.11); }
    .btn-primary:hover { border-color: #78edb7; background: #78edb7; color: #072318; }
    .btn-quiet { background: transparent; }
    .btn-danger { color: var(--red); }
    .btn-small { min-height: 31px; padding: 6px 9px; border-radius: 9px; font-size: 11px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 16px; }
    .stat-card { position: relative; overflow: hidden; min-height: 114px; padding: 17px 18px; border: 1px solid var(--border); border-radius: var(--radius); background: linear-gradient(145deg, var(--surface), #101722); }
    .stat-card::after { content: ""; position: absolute; right: -30px; bottom: -44px; width: 105px; height: 105px; border-radius: 50%; background: var(--glow, rgba(83,224,160,.05)); filter: blur(2px); }
    .stat-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--muted); font-size: 11px; font-weight: 650; }
    .stat-icon { display: grid; place-items: center; width: 29px; height: 29px; border-radius: 9px; color: var(--stat-color, var(--green)); background: var(--stat-bg, rgba(83,224,160,.1)); }
    .stat-icon svg { width: 16px; height: 16px; }
    .stat-value { position: relative; z-index: 1; margin: 7px 0 0; font-size: 27px; font-weight: 850; letter-spacing: -.8px; line-height: 1.1; }
    .stat-foot { position: relative; z-index: 1; margin-top: 5px; color: var(--faint); font-size: 10px; }
    .panel { border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
    .progress-panel { padding: 18px 20px; margin-bottom: 25px; }
    .section-heading { justify-content: space-between; gap: 14px; flex-wrap: wrap; }
    .section-title { margin: 0; font-size: 14px; font-weight: 800; letter-spacing: -.2px; }
    .section-subtitle { margin: 3px 0 0; color: var(--muted); font-size: 11px; }
    .select-control { max-width: 180px; min-height: 35px; padding: 7px 30px 7px 11px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 11px; }
    .progress-overview { display: grid; grid-template-columns: minmax(0, 1fr) minmax(170px, 220px); align-items: center; gap: 26px; margin-top: 21px; }
    .progress-numbers { justify-content: space-between; gap: 10px; margin-bottom: 9px; font-size: 11px; }
    .progress-numbers strong { font-size: 12px; }
    .progress-track { overflow: hidden; height: 9px; border-radius: 99px; background: #202b3a; }
    .progress-fill { height: 100%; width: 0; border-radius: inherit; background: linear-gradient(90deg, #29c783, #7cf3bc); box-shadow: 0 0 16px rgba(83,224,160,.24); transition: width .5s ease; }
    .cycle-mini-stats { display: flex; align-items: center; gap: 7px; margin-top: 12px; flex-wrap: wrap; }
    .mini-pill { padding: 4px 8px; border: 1px solid var(--border); border-radius: 7px; color: var(--muted); background: var(--surface-2); font-size: 10px; }
    .percent-ring { display: flex; align-items: center; justify-content: center; gap: 13px; padding-left: 20px; border-left: 1px solid var(--border); }
    .ring { position: relative; display: grid; place-items: center; width: 64px; height: 64px; border-radius: 50%; background: conic-gradient(var(--green) var(--p, 0%), #263243 0); }
    .ring::before { content: ""; position: absolute; inset: 6px; border-radius: 50%; background: var(--surface); }
    .ring span { position: relative; font-size: 14px; font-weight: 850; }
    .ring-label { color: var(--muted); font-size: 10px; }
    .ring-label strong { display: block; color: var(--text); font-size: 12px; }
    .tasks-section { margin-bottom: 26px; }
    .section-heading-spaced { margin-bottom: 14px; }
    .count-badge { display: inline-grid; place-items: center; min-width: 24px; height: 22px; margin-left: 7px; padding: 0 6px; border-radius: 7px; color: var(--green); background: rgba(83,224,160,.1); font-size: 10px; vertical-align: 1px; }
    .heading-actions { gap: 8px; }
    .search-box { position: relative; }
    .search-box svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: var(--faint); pointer-events: none; }
    .search-input { width: 190px; min-height: 36px; padding: 8px 10px 8px 31px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); color: var(--text); font-size: 11px; }
    .task-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 13px; }
    .task-card { position: relative; display: flex; flex-direction: column; min-height: 213px; padding: 16px; border: 1px solid var(--border); border-radius: 16px; background: linear-gradient(145deg, #121b27, #101722); transition: border-color .18s, transform .18s, opacity .18s; }
    .task-card:hover { border-color: #3a4b61; transform: translateY(-2px); }
    .task-card.completed { opacity: .64; background: #101720; }
    .task-card.completed .task-title { color: var(--muted); text-decoration: line-through; text-decoration-color: #6d7d91; }
    .task-topline { justify-content: space-between; gap: 8px; margin-bottom: 11px; }
    .tag-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
    .tag { display: inline-flex; align-items: center; gap: 5px; padding: 4px 7px; border-radius: 6px; border: 1px solid transparent; font-size: 9px; font-weight: 750; white-space: nowrap; }
    .tag::before { content: ""; width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
    .tag-low { color: var(--green); border-color: rgba(83,224,160,.15); background: rgba(83,224,160,.08); }
    .tag-medium { color: var(--yellow); border-color: rgba(245,201,107,.14); background: rgba(245,201,107,.08); }
    .tag-high { color: var(--red); border-color: rgba(251,120,135,.16); background: rgba(251,120,135,.08); }
    .tag-cycle { color: var(--blue); border-color: rgba(124,172,249,.15); background: rgba(124,172,249,.07); }
    .task-menu { width: 28px; height: 28px; flex: 0 0 auto; border: 0; border-radius: 8px; background: transparent; color: var(--faint); font-size: 18px; line-height: 1; }
    .task-menu:hover { background: var(--surface-3); color: var(--text); }
    .task-title { margin: 0; font-size: 14px; font-weight: 800; line-height: 1.45; letter-spacing: -.15px; overflow-wrap: anywhere; }
    .task-subject { margin-top: 5px; color: var(--muted); font-size: 10px; }
    .task-meta { gap: 7px; flex-wrap: wrap; margin-top: 13px; color: var(--faint); font-size: 10px; }
    .task-meta span { display: inline-flex; align-items: center; gap: 5px; }
    .task-meta svg { width: 12px; height: 12px; }
    .task-link { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; margin-top: 12px; color: var(--blue); text-decoration: none; font-size: 10px; font-weight: 750; overflow-wrap: anywhere; }
    .task-link:hover { color: #b5d1ff; }
    .task-link svg { width: 12px; height: 12px; flex: 0 0 auto; }
    .task-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: auto; padding-top: 15px; }
    .task-award { color: var(--muted); font-size: 10px; }
    .task-award strong { color: var(--green); }
    .complete-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 10px; border: 1px solid #2a5a49; border-radius: 9px; background: rgba(83,224,160,.09); color: var(--green); font-size: 10px; font-weight: 800; white-space: nowrap; }
    .complete-btn:hover { background: rgba(83,224,160,.16); }
    .completed .complete-btn { border-color: var(--border); background: var(--surface-2); color: var(--muted); }
    .complete-btn svg { width: 13px; height: 13px; }
    .empty-state { grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 230px; padding: 30px; border: 1px dashed #304055; border-radius: 17px; text-align: center; background: rgba(17,25,37,.55); }
    .empty-icon { display: grid; place-items: center; width: 49px; height: 49px; border: 1px solid #2c493f; border-radius: 15px; margin-bottom: 12px; color: var(--green); background: #152a25; }
    .empty-icon svg { width: 23px; height: 23px; }
    .empty-state h3 { margin: 0; font-size: 14px; }
    .empty-state p { max-width: 370px; margin: 6px 0 15px; color: var(--muted); font-size: 11px; }
    .shop-intro { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin: 27px 0 20px; padding: 23px; border: 1px solid rgba(245,201,107,.19); border-radius: 18px; background: radial-gradient(circle at 90% 20%, rgba(245,201,107,.1), transparent 35%), var(--surface); }
    .shop-intro h1 { font-size: 27px; }
    .shop-intro p { max-width: 500px; color: var(--muted); font-size: 12px; margin: 7px 0 0; }
    .shop-balance { padding: 13px 16px; border: 1px solid rgba(245,201,107,.24); border-radius: 13px; background: rgba(245,201,107,.08); color: var(--yellow); white-space: nowrap; }
    .shop-balance small { display: block; color: #ad9c77; font-size: 10px; }
    .shop-balance strong { font-size: 21px; }
    .shop-layout { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 17px; align-items: start; }
    .shop-main { min-width: 0; }
    .shop-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 13px; }
    .shop-card { padding: 16px; border: 1px solid var(--border); border-radius: 16px; background: var(--surface); }
    .shop-symbol { display: grid; place-items: center; width: 41px; height: 41px; border-radius: 13px; color: var(--yellow); background: rgba(245,201,107,.1); font-size: 21px; }
    .shop-card-head { align-items: flex-start; justify-content: space-between; gap: 12px; }
    .shop-card h3 { margin: 13px 0 4px; font-size: 13px; }
    .shop-card p { margin: 0; min-height: 31px; color: var(--muted); font-size: 10px; }
    .shop-cost { color: var(--yellow); font-weight: 850; font-size: 12px; white-space: nowrap; }
    .shop-card-bottom { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 17px; padding-top: 13px; border-top: 1px solid var(--border); }
    .owned-tag { color: var(--green); font-size: 10px; }
    .shop-side { padding: 18px; }
    .shop-side h3 { margin: 0 0 5px; font-size: 13px; }
    .shop-side > p { margin: 0 0 16px; color: var(--muted); font-size: 11px; }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .field label { color: #b8c5d6; font-size: 10px; font-weight: 750; }
    .field input, .field select, .field textarea { width: 100%; min-width: 0; padding: 10px 11px; border: 1px solid var(--border); border-radius: 10px; background: #0d141e; color: var(--text); font-size: 12px; }
    .field textarea { min-height: 72px; resize: vertical; }
    .field input::placeholder, .field textarea::placeholder, .search-input::placeholder { color: #586a81; }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 12px; }
    .span-2 { grid-column: 1 / -1; }
    .hint { color: var(--faint); font-size: 10px; }
    .bottom-dock { position: fixed; z-index: 25; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; padding: 12px 18px calc(12px + env(safe-area-inset-bottom)); border-top: 1px solid rgba(37,50,69,.88); background: rgba(11,16,24,.95); backdrop-filter: blur(18px); }
    .dock-inner { display: flex; justify-content: space-between; align-items: center; gap: 18px; width: min(1240px, 100%); }
    .dock-label { color: var(--faint); font-size: 10px; font-weight: 750; text-transform: uppercase; letter-spacing: .8px; }
    .dock-controls { display: flex; align-items: center; gap: 9px; }
    .segmented { display: inline-flex; gap: 3px; padding: 3px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .segment { padding: 6px 10px; border: 0; border-radius: 7px; background: transparent; color: var(--muted); font-size: 10px; font-weight: 750; }
    .segment.active { background: var(--surface-3); color: var(--text); box-shadow: inset 0 0 0 1px #2b3b50; }
    .dock-sort { min-height: 33px; max-width: 145px; padding: 6px 26px 6px 9px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface); color: var(--muted); font-size: 10px; }
    .dock-divider { width: 1px; height: 24px; background: var(--border); }
    .add-dock-btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 12px; border: 1px solid var(--green); border-radius: 10px; background: var(--green); color: #072318; font-size: 11px; font-weight: 850; white-space: nowrap; }
    .add-dock-btn svg { width: 14px; height: 14px; }
    .overlay { position: fixed; z-index: 60; inset: 0; display: none; align-items: center; justify-content: center; padding: 18px; background: rgba(3,7,12,.72); backdrop-filter: blur(7px); }
    .overlay.open { display: flex; }
    .modal { width: min(610px, 100%); max-height: min(88vh, 850px); overflow: auto; border: 1px solid #314156; border-radius: 19px; background: #111925; box-shadow: var(--shadow); }
    .modal.wide { width: min(760px, 100%); }
    .modal-head { position: sticky; top: 0; z-index: 2; justify-content: space-between; gap: 15px; padding: 18px 21px; border-bottom: 1px solid var(--border); background: rgba(17,25,37,.97); }
    .modal-head h2 { margin: 0; font-size: 16px; letter-spacing: -.3px; }
    .modal-head p { margin: 3px 0 0; color: var(--muted); font-size: 11px; }
    .modal-body { padding: 20px 21px; }
    .modal-foot { display: flex; justify-content: flex-end; align-items: center; gap: 8px; padding: 15px 21px; border-top: 1px solid var(--border); }
    .close-btn { width: 31px; height: 31px; border: 1px solid var(--border); border-radius: 9px; background: var(--surface-2); color: var(--muted); font-size: 19px; line-height: 1; }
    .divider { height: 1px; margin: 19px 0; background: var(--border); }
    .subsection-title { margin: 0 0 5px; font-size: 12px; }
    .subsection-copy { margin: 0 0 13px; color: var(--muted); font-size: 10px; }
    .rank-list { display: grid; gap: 7px; }
    .rank-row { display: flex; align-items: center; gap: 11px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 11px; background: var(--surface-2); }
    .rank-row.current { border-color: rgba(83,224,160,.5); background: rgba(83,224,160,.07); }
    .rank-insignia { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px; color: var(--blue); background: rgba(124,172,249,.1); }
    .rank-row.current .rank-insignia { color: var(--green); background: rgba(83,224,160,.1); }
    .rank-insignia svg { width: 17px; height: 17px; }
    .rank-copy { flex: 1; min-width: 0; }
    .rank-name { font-weight: 800; font-size: 11px; }
    .rank-xp { color: var(--muted); font-size: 10px; }
    .rank-status { font-size: 9px; color: var(--green); font-weight: 800; }
    .cycle-manager-row { display: grid; grid-template-columns: 1fr 1fr 110px; gap: 12px; }
    .danger-zone { padding: 14px; border: 1px solid rgba(251,120,135,.18); border-radius: 12px; background: rgba(251,120,135,.04); }
    .danger-zone .field { margin-bottom: 0; }
    .toast-stack { position: fixed; z-index: 90; right: 20px; bottom: 91px; display: grid; gap: 9px; width: min(370px, calc(100vw - 32px)); }
    .toast { padding: 13px 14px; border: 1px solid #315847; border-radius: 13px; background: #14251f; box-shadow: var(--shadow); animation: toastIn .22s ease-out; }
    .toast-row { justify-content: space-between; gap: 10px; }
    .toast-title { color: #dffced; font-size: 11px; font-weight: 800; }
    .toast-detail { margin-top: 2px; color: #9dc9b6; font-size: 10px; }
    .toast-undo { padding: 6px 9px; border: 1px solid #43745e; border-radius: 8px; background: transparent; color: var(--green); font-size: 10px; font-weight: 800; white-space: nowrap; }
    .toast-timer { height: 2px; margin: 10px -14px -13px; border-radius: 0 0 13px 13px; background: var(--green); transform-origin: left; animation: toastTimer 5s linear forwards; }
    @keyframes toastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes toastTimer { from { transform: scaleX(1); } to { transform: scaleX(0); } }
    .notice { padding: 11px 12px; border: 1px solid rgba(124,172,249,.18); border-radius: 10px; background: rgba(124,172,249,.06); color: #bcd3fa; font-size: 10px; }
    .hidden { display: none !important; }
    .context-menu { position: fixed; z-index: 45; min-width: 155px; padding: 5px; border: 1px solid var(--border); border-radius: 11px; background: #172130; box-shadow: var(--shadow); }
    .context-item { display: flex; align-items: center; width: 100%; gap: 8px; padding: 9px 10px; border: 0; border-radius: 7px; background: transparent; color: var(--text); text-align: left; font-size: 11px; }
    .context-item:hover { background: var(--surface-3); }
    .context-item.danger { color: var(--red); }
    .context-item svg { width: 14px; height: 14px; }
    .toast-neutral { border-color: var(--border); background: #172130; }
    .toast-neutral .toast-title { color: var(--text); }
    .toast-neutral .toast-detail { color: var(--muted); }
    footer { padding: 22px 0 8px; color: var(--faint); font-size: 10px; text-align: center; }
    footer span { color: var(--green); }
    @media (max-width: 1000px) {
      .brand-wrap { gap: 16px; }
      .task-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .shop-layout { grid-template-columns: minmax(0, 1fr) 260px; }
    }
    @media (max-width: 720px) {
      .topbar { flex-wrap: wrap; padding: 12px 16px; }
      .brand-wrap { flex: 1; justify-content: space-between; }
      .nav-tabs { order: 2; width: 100%; }
      .nav-tab { flex: 1; justify-content: center; }
      .top-actions { gap: 6px; }
      .profile-chip { padding-right: 8px; }
      .profile-name, .profile-rank { max-width: 85px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .container { width: min(100% - 28px, 540px); }
      .hero { align-items: flex-start; flex-direction: column; padding-top: 26px; }
      .hero-buttons { justify-content: flex-start; }
      .progress-overview { grid-template-columns: 1fr; gap: 17px; }
      .percent-ring { justify-content: flex-start; padding-left: 0; padding-top: 14px; border-left: 0; border-top: 1px solid var(--border); }
      .task-grid { grid-template-columns: 1fr; }
      .task-card { min-height: 195px; }
      .search-input { width: min(185px, 45vw); }
      .shop-layout { grid-template-columns: 1fr; }
      .shop-grid { grid-template-columns: 1fr; }
      .shop-intro { align-items: flex-start; flex-direction: column; padding: 18px; }
      .shop-balance { align-self: stretch; }
      .bottom-dock { padding: 9px 10px calc(9px + env(safe-area-inset-bottom)); }
      .dock-inner { flex-direction: column; align-items: stretch; gap: 8px; }
      .dock-label { display: none; }
      .dock-controls { justify-content: space-between; gap: 5px; }
      .segment { padding: 6px 8px; }
      .dock-sort { max-width: 124px; flex: 1; }
      .add-dock-btn { justify-content: center; min-height: 35px; }
      .app-root { padding-bottom: 132px; }
      .toast-stack { right: 10px; bottom: 122px; }
      .cycle-manager-row { grid-template-columns: 1fr; gap: 0; }
    }
    @media (max-width: 420px) {
      .brand-sub { letter-spacing: 1px; }
      .brand-name { font-size: 14px; }
      .brand-mark { width: 34px; height: 34px; }
      .profile-chip { gap: 6px; }
      .avatar { width: 28px; height: 28px; }
      .wallet-chip { padding: 8px 9px; }
      .wallet-chip span { font-size: 12px; }
      .hero-buttons .btn { padding: 8px 10px; }
      .stats-grid { gap: 9px; }
      .stat-card { min-height: 107px; padding: 13px; }
      .stat-value { font-size: 24px; }
      .section-heading { align-items: flex-start; }
      .heading-actions { flex-wrap: wrap; justify-content: flex-start; width: 100%; }
      .search-box { flex: 1; }
      .search-input { width: 100%; }
      .dock-controls { flex-wrap: wrap; }
      .segmented { flex: 1; justify-content: space-between; }
      .dock-sort { max-width: 48%; }
      .dock-divider { display: none; }
      .modal-body { padding: 16px; }
      .modal-head, .modal-foot { padding-left: 16px; padding-right: 16px; }
      .form-grid { grid-template-columns: 1fr; }
      .span-2 { grid-column: auto; }
    }
  </style>
</head>
<body>
  <div class="app-root">
    <header class="topbar">
      <div class="brand-wrap">
        <a class="brand" href="#" aria-label="Aura Tracker início" onclick="return false;">
          <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2.8 20.2 7.4v9.2L12 21.2 3.8 16.6V7.4L12 2.8Z" stroke="currentColor" stroke-width="1.7"/><path d="m8 15.9 4-8.1 4 8.1M9.7 12.8h4.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <span><span class="brand-name">AURA TRACKER</span><span class="brand-sub">Study command center</span></span>
        </a>
        <nav class="nav-tabs" aria-label="Navegação principal">
          <button class="nav-tab active" data-view="tasks"><svg class="nav-icon" viewBox="0 0 24 24" fill="none"><path d="M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Missões</button>
          <button class="nav-tab" data-view="shop"><svg class="nav-icon" viewBox="0 0 24 24" fill="none"><path d="M4 8h16l-1.2 12H5.2L4 8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> Recompensas</button>
        </nav>
      </div>
      <div class="top-actions">
        <button class="profile-chip" id="profileButton" title="Ver patentes" aria-label="Ver patentes">
          <span class="avatar" id="avatarText">F</span>
          <span style="text-align:left"><span class="profile-name" id="profileName">Felipe</span><span class="profile-rank" id="profileRank">2º Tenente</span></span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="wallet-chip" title="Saldo de moedas"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M15 8.5c-.7-.6-1.7-1-3-1-1.8 0-3 .9-3 2.1 0 3 6 1.2 6 4.4 0 1.3-1.3 2.5-3.3 2.5-1.1 0-2.2-.4-3.1-1.1M12 5.5v13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span id="coinBalance">0</span></div>
        <button class="icon-btn" id="settingsButton" aria-label="Configurações de ciclos" title="Configurações de ciclos"><svg viewBox="0 0 24 24" fill="none"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" stroke="currentColor" stroke-width="1.7"/><path d="m19.4 13.5 1.1.9-1.5 2.6-1.4-.5a7.8 7.8 0 0 1-1.6.9l-.3 1.5h-3l-.4-1.5a7.8 7.8 0 0 1-1.6-.9l-1.4.5-1.5-2.6 1.1-.9a7.9 7.9 0 0 1 0-1.8l-1.1-.9 1.5-2.6 1.4.5a7.8 7.8 0 0 1 1.6-.9l.4-1.5h3l.3 1.5a7.8 7.8 0 0 1 1.6.9l1.4-.5 1.5 2.6-1.1.9a7.9 7.9 0 0 1 0 1.8Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" transform="translate(-1 -1)"/></svg></button>
      </div>
    </header>

    <main class="container" id="tasksView">
      <section class="hero">
        <div>
          <div class="eyebrow"><span class="eyebrow-dot"></span> Seu progresso começa agora</div>
          <h1>Central de estudos<span style="color:var(--green)">.</span></h1>
          <p>Disciplina diária. Evolução constante. Uma missão de cada vez.</p>
        </div>
        <div class="hero-buttons">
          <button class="btn" id="exportCsvButton"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3v12m-4-4 4 4 4-4M5 17v3h14v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Exportar CSV</button>
          <button class="btn" id="backupButton"><svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4m-4 4 4-4 4 4M5 14v5h14v-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Backup</button>
          <button class="btn btn-primary" id="heroAddButton"><svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Nova missão</button>
        </div>
      </section>

      <section class="stats-grid" aria-label="Resumo do progresso">
        <article class="stat-card" style="--stat-color:var(--green);--stat-bg:rgba(83,224,160,.1);--glow:rgba(83,224,160,.07)">
          <div class="stat-head"><span>XP ACUMULADO</span><span class="stat-icon"><svg viewBox="0 0 24 24" fill="none"><path d="m12 2 2.7 6.1 6.6.6-5 4.3 1.5 6.5-5.8-3.5-5.8 3.5 1.5-6.5-5-4.3 6.6-.6L12 2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></span></div>
          <div class="stat-value" id="xpTotal">0 <span style="font-size:12px;color:var(--muted);font-weight:650">XP</span></div><div class="stat-foot" id="xpFoot">Comece sua primeira missão</div>
        </article>
        <article class="stat-card" style="--stat-color:var(--blue);--stat-bg:rgba(124,172,249,.1);--glow:rgba(124,172,249,.06)">
          <div class="stat-head"><span>MISSÕES CONCLUÍDAS</span><span class="stat-icon"><svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4.5 4.5L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>
          <div class="stat-value" id="completedTotal">0</div><div class="stat-foot" id="completedFoot">de 0 missões cadastradas</div>
        </article>
        <article class="stat-card" style="--stat-color:var(--yellow);--stat-bg:rgba(245,201,107,.1);--glow:rgba(245,201,107,.05)">
          <div class="stat-head"><span>MOEDAS DISPONÍVEIS</span><span class="stat-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M15 8.5c-.7-.6-1.7-1-3-1-1.8 0-3 .9-3 2.1 0 3 6 1.2 6 4.4 0 1.3-1.3 2.5-3.3 2.5-1.1 0-2.2-.4-3.1-1.1M12 5.5v13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></div>
          <div class="stat-value" id="coinsStat">0</div><div class="stat-foot">Troque moedas por recompensas</div>
        </article>
        <article class="stat-card" style="--stat-color:var(--purple);--stat-bg:rgba(185,160,255,.1);--glow:rgba(185,160,255,.06)">
          <div class="stat-head"><span>PRÓXIMA PATENTE</span><span class="stat-icon"><svg viewBox="0 0 24 24" fill="none"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></span></div>
          <div class="stat-value" id="nextRankValue" style="font-size:20px">2º Tenente</div><div class="stat-foot" id="nextRankFoot">501 XP para evoluir</div>
        </article>
      </section>

      <section class="panel progress-panel">
        <div class="section-heading">
          <div><h2 class="section-title">Progresso dos ciclos</h2><p class="section-subtitle">Acompanhe sua evolução por etapa do plano de estudos.</p></div>
          <select class="select-control" id="progressCycle" aria-label="Selecionar ciclo de progresso"><option value="all">Todos os ciclos</option><option value="1">1º Ciclo</option><option value="2">2º Ciclo</option><option value="3">3º Ciclo</option><option value="4">4º Ciclo</option></select>
        </div>
        <div class="progress-overview">
          <div>
            <div class="progress-numbers"><span id="progressCopy">0 de 0 missões concluídas</span><strong id="progressPercent">0%</strong></div>
            <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
            <div class="cycle-mini-stats"><span class="mini-pill" id="pendingPill">0 pendentes</span><span class="mini-pill" id="cycleCountPill">4 ciclos ativos</span><span class="mini-pill" id="duePill">0 com prazo definido</span></div>
          </div>
          <div class="percent-ring"><div class="ring" id="progressRing" style="--p:0%"><span id="ringPercent">0%</span></div><div class="ring-label"><strong>Conclusão geral</strong><span id="ringSubtext">Vamos começar</span></div></div>
        </div>
      </section>

      <section class="tasks-section">
        <div class="section-heading section-heading-spaced">
          <div><h2 class="section-title">Quadro de missões <span class="count-badge" id="visibleTaskCount">0</span></h2><p class="section-subtitle">Transforme seu edital em pequenas vitórias diárias.</p></div>
          <div class="heading-actions">
            <div class="search-box"><svg viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><input class="search-input" id="searchInput" type="search" placeholder="Buscar missão ou disciplina..." aria-label="Buscar missões"></div>
            <button class="btn btn-small" id="importButton"><svg viewBox="0 0 24 24" fill="none"><path d="M12 15V3m-4 4 4-4 4 4M5 14v6h14v-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Importar CSV</button><input class="hidden" id="csvFileInput" type="file" accept=".csv,text/csv">
          </div>
        </div>
        <div class="task-grid" id="taskGrid"></div>
      </section>
      <footer>Feito para manter o foco no que importa. <span>Pequenos passos, grandes conquistas.</span></footer>
    </main>

    <main class="container hidden" id="shopView">
      <section class="shop-intro">
        <div><div class="eyebrow"><span class="eyebrow-dot" style="background:var(--yellow);box-shadow:0 0 12px rgba(245,201,107,.5)"></span> Recompense sua consistência</div><h1>Loja de recompensas<span style="color:var(--yellow)">.</span></h1><p>Você cumpriu suas metas. Agora, use as moedas que conquistou para liberar recompensas da vida real.</p></div>
        <div class="shop-balance"><small>SEU SALDO ATUAL</small><strong>◉ <span id="shopCoinBalance">0</span> moedas</strong></div>
      </section>
      <section class="shop-layout">
        <div class="shop-main"><div class="section-heading section-heading-spaced"><div><h2 class="section-title">Suas recompensas</h2><p class="section-subtitle">Prêmios que ajudam a manter a motivação.</p></div><span class="count-badge" id="rewardCount">0 itens</span></div><div class="shop-grid" id="shopGrid"></div>
          <div class="panel" style="padding:17px;margin-top:16px"><div class="section-heading"><div><h2 class="section-title">Resgates recentes</h2><p class="section-subtitle">Histórico de recompensas compradas.</p></div></div><div id="redemptionHistory" style="margin-top:12px"></div></div>
        </div>
        <aside class="panel shop-side"><h3>Adicionar recompensa</h3><p>Crie um prêmio pessoal para trocar pelas suas moedas.</p><form id="rewardForm"><div class="field"><label for="rewardName">Nome do prêmio</label><input id="rewardName" maxlength="80" placeholder="Ex.: Assistir a um filme" required></div><div class="field"><label for="rewardDescription">Descrição (opcional)</label><textarea id="rewardDescription" maxlength="200" placeholder="Uma pausa merecida depois de estudar..."></textarea></div><div class="field"><label for="rewardCost">Preço em moedas</label><input id="rewardCost" type="number" min="1" max="1000000" step="1" placeholder="Ex.: 50" required></div><button class="btn btn-primary" type="submit" style="width:100%"><svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Criar recompensa</button></form><div class="divider"></div><div class="notice">Dica: defina preços que façam sentido para você. As moedas são ganhas ao concluir missões de estudo.</div></aside>
      </section>
      <footer>Equilíbrio também faz parte da jornada. <span>Estude, evolua, aproveite.</span></footer>
    </main>

    <div class="bottom-dock" id="taskDock">
      <div class="dock-inner">
        <div class="dock-label">Visualização das missões</div>
        <div class="dock-controls">
          <div class="segmented" role="group" aria-label="Filtrar por status"><button class="segment active" data-status="pending">Pendentes</button><button class="segment" data-status="completed">Concluídas</button><button class="segment" data-status="all">Todas</button></div>
          <div class="dock-divider"></div>
          <select class="dock-sort" id="sortSelect" aria-label="Ordenar missões"><option value="title">Título A–Z</option><option value="newest">Mais novas</option><option value="oldest">Mais antigas</option><option value="deadline">Prazo mais próximo</option><option value="importance">Maior relevância</option></select>
          <button class="add-dock-btn" id="dockAddButton"><svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Nova missão</button>
        </div>
      </div>
    </div>
  </div>

  <div class="overlay" id="taskModal" role="dialog" aria-modal="true" aria-labelledby="taskModalTitle">
    <div class="modal">
      <div class="modal-head"><div><h2 id="taskModalTitle">Nova missão</h2><p>Cadastre um item do seu edital para acompanhar o progresso.</p></div><button class="close-btn" data-close="taskModal" aria-label="Fechar">×</button></div>
      <form id="taskForm"><div class="modal-body"><div class="form-grid">
        <div class="field span-2"><label for="taskTitle">Título da missão *</label><input id="taskTitle" maxlength="180" placeholder="Ex.: 1.2 — Fundamentos de redes" required></div>
        <div class="field"><label for="taskSubject">Disciplina</label><input id="taskSubject" maxlength="80" placeholder="Ex.: Redes de computadores"></div>
        <div class="field"><label for="taskCycle">Ciclo</label><select id="taskCycle"><option value="1">1º Ciclo</option><option value="2">2º Ciclo</option><option value="3">3º Ciclo</option><option value="4">4º Ciclo</option></select></div>
        <div class="field"><label for="taskImportance">Relevância</label><select id="taskImportance"><option value="low">Baixa · 10 XP / 5 moedas</option><option value="medium" selected>Média · 20 XP / 10 moedas</option><option value="high">Alta · 30 XP / 15 moedas</option></select></div>
        <div class="field"><label for="taskDeadline">Prazo (opcional)</label><input id="taskDeadline" type="date"></div>
        <div class="field span-2"><label for="taskLink">Link do Gemini Notebook (opcional)</label><input id="taskLink" type="text" maxlength="1000" placeholder="https://notebook.google.com/notebook/..."><span class="hint">Você pode colar o endereço completo ou sem https://.</span></div>
      </div></div><div class="modal-foot"><button class="btn btn-quiet" type="button" data-close="taskModal">Cancelar</button><button class="btn btn-primary" id="saveTaskButton" type="submit">Salvar missão</button></div></form>
    </div>
  </div>

  <div class="overlay" id="cycleModal" role="dialog" aria-modal="true" aria-labelledby="cycleModalTitle">
    <div class="modal wide">
      <div class="modal-head"><div><h2 id="cycleModalTitle">Gerenciador de ciclos</h2><p>Copie missões para um novo ciclo ou remova um ciclo por completo.</p></div><button class="close-btn" data-close="cycleModal" aria-label="Fechar">×</button></div>
      <div class="modal-body">
        <h3 class="subsection-title">Duplicar missões entre ciclos</h3><p class="subsection-copy">As cópias começam pendentes. O prazo é deslocado pela quantidade de dias informada.</p>
        <form id="duplicateCycleForm"><div class="cycle-manager-row"><div class="field"><label for="cycleFrom">Ciclo de origem</label><select id="cycleFrom"><option value="1">1º Ciclo</option><option value="2">2º Ciclo</option><option value="3">3º Ciclo</option><option value="4">4º Ciclo</option></select></div><div class="field"><label for="cycleTo">Ciclo de destino</label><select id="cycleTo"><option value="2">2º Ciclo</option><option value="3">3º Ciclo</option><option value="4">4º Ciclo</option><option value="1">1º Ciclo</option></select></div><div class="field"><label for="cycleOffset">+ Dias</label><input id="cycleOffset" type="number" min="-3650" max="3650" step="1" value="30"></div></div><button class="btn btn-primary" type="submit"><svg viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="1.7"/></svg> Duplicar missões</button></form>
        <div class="divider"></div>
        <div class="danger-zone"><h3 class="subsection-title" style="color:var(--red)">Zona de exclusão</h3><p class="subsection-copy">Remove todas as missões daquele ciclo. Essa ação não pode ser desfeita.</p><form id="deleteCycleForm" style="display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap"><div class="field" style="flex:1;min-width:140px"><label for="cycleDelete">Ciclo para excluir</label><select id="cycleDelete"><option value="1">1º Ciclo</option><option value="2">2º Ciclo</option><option value="3">3º Ciclo</option><option value="4">4º Ciclo</option></select></div><button class="btn btn-danger" type="submit"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 14h11l1-14M9 7V4h6v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg> Excluir ciclo</button></form></div>
        <div class="divider"></div><h3 class="subsection-title">Dados e privacidade</h3><p class="subsection-copy">O progresso fica salvo neste navegador. Use o backup para levar os dados a outro dispositivo.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-small" id="cycleBackupButton">Baixar backup JSON</button><button class="btn btn-small" id="cycleRestoreButton">Restaurar backup JSON</button><input class="hidden" type="file" id="backupFileInput" accept=".json,application/json"></div>
      </div>
    </div>
  </div>

  <div class="overlay" id="rankModal" role="dialog" aria-modal="true" aria-labelledby="rankModalTitle">
    <div class="modal">
      <div class="modal-head"><div><h2 id="rankModalTitle">Hierarquia de patentes</h2><p>Continue concluindo missões para subir de patente.</p></div><button class="close-btn" data-close="rankModal" aria-label="Fechar">×</button></div><div class="modal-body"><div id="rankList" class="rank-list"></div></div><div class="modal-foot"><button class="btn btn-primary" data-close="rankModal">Continuar estudando</button></div>
    </div>
  </div>

  <div class="overlay" id="editRewardModal" role="dialog" aria-modal="true" aria-labelledby="editRewardTitle"><div class="modal"><div class="modal-head"><div><h2 id="editRewardTitle">Editar recompensa</h2><p>Atualize os detalhes do prêmio.</p></div><button class="close-btn" data-close="editRewardModal" aria-label="Fechar">×</button></div><form id="editRewardForm"><div class="modal-body"><input type="hidden" id="editRewardId"><div class="field"><label for="editRewardName">Nome</label><input id="editRewardName" maxlength="80" required></div><div class="field"><label for="editRewardDescription">Descrição</label><textarea id="editRewardDescription" maxlength="200"></textarea></div><div class="field"><label for="editRewardCost">Preço em moedas</label><input id="editRewardCost" type="number" min="1" max="1000000" required></div></div><div class="modal-foot"><button class="btn btn-quiet" type="button" data-close="editRewardModal">Cancelar</button><button class="btn btn-primary" type="submit">Salvar alterações</button></div></form></div></div>

  <div class="context-menu hidden" id="taskContextMenu" role="menu"></div>
  <div class="toast-stack" id="toastStack" aria-live="polite" aria-atomic="true"></div>

  <script>
    (() => {
      'use strict';
      const STORAGE_KEY = 'auraTracker.data.v1';
      const RANKS = [
        { name: '2º Tenente', min: 0, max: 500 },
        { name: '1º Tenente', min: 501, max: 1200 },
        { name: 'Capitão', min: 1201, max: 2200 },
        { name: 'Major', min: 2201, max: 3500 },
        { name: 'Tenente-Coronel', min: 3501, max: 5000 },
        { name: 'Coronel', min: 5001, max: 7000 },
        { name: 'General de Brigada', min: 7001, max: 9500 },
        { name: 'General de Divisão', min: 9501, max: 12500 },
        { name: 'General de Exército', min: 12501, max: 16000 },
        { name: 'Marechal', min: 16001, max: Infinity }
      ];
      const IMPORTANCE = {
        low: { label: 'Baixa', xp: 10, coins: 5, cls: 'tag-low', rank: 1 },
        medium: { label: 'Média', xp: 20, coins: 10, cls: 'tag-medium', rank: 2 },
        high: { label: 'Alta', xp: 30, coins: 15, cls: 'tag-high', rank: 3 }
      };
      const CYCLE_NAMES = { 1: '1º Ciclo', 2: '2º Ciclo', 3: '3º Ciclo', 4: '4º Ciclo' };
      const INITIAL_MISSION_ROWS = [
        ["01 - Engenharia de Software: Fundamentos: Ciclo de vida de software: abordagens de ciclo de vida preditiva, iterativa, incremental adaptativa, inclusive suas combinações.","https://notebook.google.com/notebook/2ddcb0cc-0408-46ad-9575-ca1f84ab1b66","ES","m"],
        ["02 - Abordagem ágil, Kanban, Lean Software Development.","https://notebook.google.com/notebook/db9a1a37-a1ca-4dab-b3f5-3097b4a93102","ES","m"],
        ["03 - Scrum","https://notebook.google.com/notebook/ba528b2b-3a30-444c-bffe-4de32736a010","ES","h"],
        ["04 - Extreming Programin (XP)","https://notebook.google.com/notebook/3a70b2cc-10bb-4fcb-99bf-1cb4f075ee11","ES","l"],
        ["05 - Levantamento, especificação, análise, validação e gerenciamento de requisitos funcionais e não funcionais: histórias de usuário, casos de uso e critérios de aceite.","https://notebook.google.com/notebook/0b53f89a-b916-4347-a2bb-4a66f91915b6","ES","h"],
        ["06 - Modelagem de sistemas e processos com UML.","https://notebook.google.com/notebook/25740573-ffa4-4d83-8eb6-2256a0fe1113","ES","m"],
        ["07 - Qualidade de software: desempenho, escalabilidade, disponibilidade, confiabilidade e manutenibilidade.","https://notebook.google.com/notebook/095b8e6e-cc80-4ca4-a451-1910c0f88b71","ES","m"],
        ["08 - Testes de software: unitários, de integração, funcionais, de regressão, de carga e de estresse: testes automatizados. Revisão de código refatoração: dívida técnica.","https://notebook.google.com/notebook/698868ef-7adc-4d7f-bf3a-883aa9bd2523","ES","m"],
        ["09 - Arquitetura de software: padrões arquiteturais, arquitetura em camadas, coesão e acoplamento.","https://notebook.google.com/notebook/3a5d82d7-641e-4ad4-b055-9b6e00769289","ES","h"],
        ["10 - Arquitetura de software: orientada a serviços (SOA).","https://notebook.google.com/notebook/823cb88c-8b4b-45ba-9792-2d25c35f2862","ES","h"],
        ["11 - Arquitetura de software: microsserviços e orientada a eventos: princípios SOLID, DRY.","https://notebook.google.com/notebook/37eb7b7d-f16d-4531-add1-c91c52b02ce9","ES","h"],
        ["11.5 - Padrões de projeto de software (design patterns), incluindo padrões criacionais, estruturais e comportamentais.","https://notebook.google.com/notebook/fde66d4c-7b1c-45d5-8896-aa27e7729a77","ES","h"],
        ["11.6 - YAGNI","https://notebook.google.com/notebook/e7c653dd-ffaa-428d-afdd-433b9a0ff3bb","ES","l"],
        ["12 - Redes de computadores.","https://notebook.google.com/notebook/4e47a80b-0e6e-4696-9606-78e27ada1db4","REDE","m"],
        ["13 - Arquitetura TCP/IP","https://notebook.google.com/notebook/0c9adefb-5483-4aa9-9170-bbb8ff6fed70","REDE","h"],
        ["14 - Noções de redes sem fio.","https://notebook.google.com/notebook/20958666-0f0a-41ce-a3d8-f39435978866","REDE","l"],
        ["15 - Endereçamento IPv4","https://notebook.google.com/notebook/9900553c-45bf-401e-90fd-d5a502a59c5b","REDE","l"],
        ["16 - Endereçamento IPv6","https://notebook.google.com/notebook/bf81daa7-b020-426d-a0d4-17ae3b938f39","REDE","l"],
        ["17 - Protocolos HTTP/2, HTTP/3 e HTTPS, SMTP","https://notebook.google.com/notebook/d3e6996e-ff1f-4c51-8070-ef05ad314864","REDE","m"],
        ["18 - DNS e DHCP, FTP e SSH","https://notebook.google.com/notebook/c27e8540-9cfa-437a-aea5-4125d2d3865c","REDE","m"],
        ["19 - Observabilidade e monitoramento de sistemas: métricas, logs e traces: telemetria, instrumentação, correlação de eventos, alertas e acompanhamento de indicadores técnicos de aplicações e infraestrutura.","https://notebook.google.com/notebook/88088a12-1c85-46b0-822e-4d02ae030261","REDE","m"],
        ["20 - Princípios de Segurança da Informação e Redes de Computadores","https://notebook.google.com/notebook/03207368-3206-49f0-b2b5-45d52a3d830a","REDE","h"],
        ["21 - Proxies e firewalls: antivírus, IDS/IPS: Conceito de Zero Trust.","https://notebook.google.com/notebook/11bd63be-1b84-4353-bdd3-d799274b41de","REDE","m"],
        ["22 - VPN","https://notebook.google.com/notebook/3b18e4e9-61e2-4802-b738-6fa814654f4b","REDE","m"],
        ["23 - Malware, ransomware, phishing e engenharia social. Segurança em aplicações: OWASP Top 10: testes de invasão e análise de vulnerabilidades.","https://notebook.google.com/notebook/b14bc3ee-344b-46f7-924b-71cfab8ff2d3","REDE","h"],
        ["24 - Criptografia simétrica e assimétrica","https://notebook.google.com/notebook/17f66bc6-f925-45c8-89c6-09454027ceb4","REDE","h"],
        ["25 - Infraestrutura de chaves públicas: certificados e assinatura digital","https://notebook.google.com/notebook/9e3a2994-49d3-4014-9f2c-53eb76ad8efd","REDE","h"],
        ["26 - Backup","https://notebook.google.com/notebook/5c11ab05-e047-416d-802d-f3cbe2d2210a","REDE","m"],
        ["27 - Continuidade de negócios e recuperação de desastres.","https://notebook.google.com/notebook/0fdb3365-719d-429e-be84-5145aef7e62f","REDE","m"],
        ["28 - Computação em nuvem: modelo IaaS, PaaS e SaaS: computação serveless: escalabilidade e alta disponibilidade: integração entre ambientes locais e nuvem: monitoramento de infraestrutura. Segurança em containers e em ambientes de nuvem.","https://notebook.google.com/notebook/98c9d96e-68b7-494a-9324-015ee6dd5579","REDE","h"],
        ["29 - Família de normas ABNT NBR ISO/IEC 27000 (gestão da segurança da informação)","https://notebook.google.com/notebook/6196acc1-b6bd-4dda-a338-f537bc6decbf","REDE","h"],
        ["30 - Lógica de programação","https://notebook.google.com/notebook/162863db-6952-4337-a85c-9926628ee77c","DEV","h"],
        ["31 - Estruturas de daos","https://notebook.google.com/notebook/ceac082a-7ed0-4300-800b-85aad441cc32","DEV","m"],
        ["32 - Algorítmos","https://notebook.google.com/notebook/679edaff-b6ff-49c6-ad5f-64359d84edfa","DEV","h"],
        ["33 - Programação orientada a objetos e programação funcional","https://notebook.google.com/notebook/8901cec0-2b3e-42e3-a369-f5f05dbbcb0e","DEV","h"],
        ["34 - Programação em Java (conceitos básicos)","https://notebook.google.com/notebook/adb543e5-c5df-424c-825e-8cb2362ffdf3","DEV","h"],
        ["35 - Desenvolvimento web: HTML 5.","https://notebook.google.com/notebook/5fb95bcc-4ece-4ddd-931e-07e5600b730d","DEV","l"],
        ["36 - CSS3","https://notebook.google.com/notebook/4ea7bb2e-e7a5-4319-98c0-fca1f0ceba62","DEV","l"],
        ["37 - Programação em JavaScript","https://notebook.google.com/notebook/5e1b3cd6-1980-41c2-ada5-a5011e5f577c","DEV","h"],
        ["38 - Desenvolvimento front-end com React. Node.js. Conceitos de GraphQL e WebSockets: TypeScript.","https://notebook.google.com/notebook/e9ef6014-52e0-44d5-94c3-bb7fa0b5e4e0","DEV","m"],
        ["39 - Programação em Python","https://notebook.google.com/notebook/c1b91880-63da-4684-9a76-afbb795f04a4","DEV","h"],
        ["40 - Desenvolvimento de APIs RESTful: Documentação de APIs (OpenAPI/Swagger).","https://notebook.google.com/notebook/4a5beed1-065d-4cef-8097-8a7aea9374cb","DEV","h"],
        ["41 - Formatos JSON","https://notebook.google.com/notebook/53bf6b29-1390-4bbc-b43b-b402268884e6","DEV","m"],
        ["42 - Formatos XML","https://notebook.google.com/notebook/42a451a3-21ac-4c71-9f13-b27ac49c6946","DEV","l"],
        ["43 - Controle de versão com Git. Controles de versão distribuído com Git: plataformas de hospedagem, colaboração e automação baseadas em Git, incluindo GitHub e GitLab: estratégias de branching, incluindo GiotFlow e trunk-based development: pull requests/merge requests e revisão de código","https://notebook.google.com/notebook/91b99401-d1c9-42d3-aae4-9deb87be5283","DEV","h"],
        ["44 - DevOps, Plataforma de Desenvolvimento e Engenharia de Entrega Integração, entrega e  implementação contínuas (CI/CD): pipelines de desenvolvimento: automação de build e de testes. Infraestrutura como código e gerenciamento de configuração.","https://notebook.google.com/notebook/930b5236-04ed-4fda-8793-7065654787da","DEV","h"],
        ["45 - Conteinerização: Docker e Docker Compose: orquestração de containers com Kubernetes.","https://notebook.google.com/notebook/5ac2b498-d1b3-47dd-8696-00f5fa1c49c0","DEV","h"],
        ["46 - Ambientes de desenvolvimento, homologação e produção. Gerenciamento de dependências, empacotamento e publicação de aplicações.","https://notebook.google.com/notebook/b3381945-0c40-461a-8e08-d6fbf5d98351","DEV","m"],
        ["47 - Automação de pipelines: GitHub Actions, Git CI/CD, Jenkings e ferramentas correlatas.","https://notebook.google.com/notebook/a2476197-7bc3-4b54-a222-8fa287e2242b","DEV","h"],
        ["48 - KISS","https://notebook.google.com/notebook/df95625a-939c-4b5d-8ea4-16ccb8bea559","DEV","l"],
        ["49 - Desenvolvimento de software assistido por IA","https://notebook.google.com/notebook/63d71968-8e28-4d5b-ad13-af368cd26118","DEV","m"],
        ["50 - Sistemas operacionais: gerenciamento de processos, memória e sistemas de arquivos","https://notebook.google.com/notebook/32bc65e4-1c97-4052-834a-6cc4c36bf521","SO","m"],
        ["51 - Sistemas operacionais Windows: administração básica. Comandos básicos de Windows PowerShell: automação por scripts. Serviços de diretório: Active Directory e LDAP.","https://notebook.google.com/notebook/5d2a8022-96d3-44e7-b8e9-774d446f54de","SO","l"],
        ["52 - Sistemas operacionais Linux: administração básica. Comandos básicos de shell (Linux): automação por scripts. Serviços de diretório: LDAP.","https://notebook.google.com/notebook/e9065f73-d55a-490d-a8f7-352649588f8c","SO","l"],
        ["53 - Balanceamento de carga.","https://notebook.google.com/notebook/396ee8ba-9f40-4867-a035-dc5d7ad2a9f4","SO","m"],
        ["54 - Virtualização e containers.","https://notebook.google.com/notebook/f658256c-1499-4a1b-b57f-ab60aab2b072","SO","m"],
        ["55 - Aplicação técnica de Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018) no desenvolvimento e na operação de sistemas: privacy by design e by default, minimização e pseudonimização.","https://notebook.google.com/notebook/359c98b3-6fb3-4c73-ae5a-435c5454c1e7","LEG","h"],
        ["56 - Marco Civil da Internet (Lei nº 12.965/2014): principios de neutralidade de rede, proteção de dados e guarda de registros de conexão e de acesso.","https://notebook.google.com/notebook/86b80c6f-32ad-48f2-97ec-7f019b716b3e","LEG","m"],
        ["57 - Contratação de soluções de tecnologia da informação e comunicação (Lei nº 14.133/2021 aplicada às contratações de TIC). Requisitos de segurança da informação em contratações de soluções de TIC. Certificação digital e sua aplicação em sistemas informatizados.","https://notebook.google.com/notebook/d3ad40c3-d7c3-48d1-9177-f05b7f98ff1c","LEG","h"],
        ["58 - Governo digital e transformação digital no setor público. Lei nº 14.129/2021 (Lei do Governo Digital)","https://notebook.google.com/notebook/9736efd2-97dd-4de0-947f-a1a91e7c8dab","LEG","h"],
        ["59 - Estratégia Nacional do Governo Digital - ENGD 2024-2027, instituída pelo Decreto nº 12.069/2024, consideradas suas recomendações e atualizações vigentes.","https://notebook.google.com/notebook/ec6db2dd-dc6d-46cc-b04b-d49ed9f079ab","LEG","h"],
        ["60 - Lei Complementar estadual nº 205, de 19 de maio de 2025.","https://notebook.google.com/notebook/c626eb85-515e-44b3-a68e-1dc00646dfaa","LEG","m"],
        ["61 - Normativos e instrumentos institucionais do TCE-GO(ESTUDAR AO FINAL)","https://notebook.google.com/notebook/6f762b03-8d12-4bab-8ccf-433994e21f00","LEG","h"],
        ["62 - Governança de Tecnologia da Informação. Governança de TI: estratégia e alinhamento com os objetivos institucionais.","https://notebook.google.com/notebook/7c9eddc0-1bb0-4d7b-93fd-d9865a30d670","GOV","m"],
        ["63 - Gestão de projetos: fundamentos do PMBOK 8ª edição e de métodos ágeis aplicados a projetos de TI.","https://notebook.google.com/notebook/bd64c583-2864-4f0d-9210-2001d19515d1","GOV","h"],
        ["64 - Gestão de serviços de TI: catálogo de serviços, gerenciamento de incidentes, problemas, mudanças e configuração. Gestão de portfólio e de ativos de TI: continuidade de serviços. ITIL V4.","https://notebook.google.com/notebook/66ec3660-840e-4e6d-ac67-d3459f6512a5","GOV","h"],
        ["65 - Boas práticas e modelos de referência: COBIT 2019.","https://notebook.google.com/notebook/4de13435-382d-43a0-8b64-ae230ceb8d77","GOV","h"],
        ["66 - ISO/IEC 38500:2024.","https://notebook.google.com/notebook/8a17e3e6-5a51-4f65-a1a1-084e482c0237","GOV","l"],
        ["67 - Modelagem de sistemas e processos com BPMN","https://notebook.google.com/notebook/98cd1038-0591-4f33-b042-0d12e18cb722","GOV","m"],
        ["68 - Governança de dados","https://notebook.google.com/notebook/4e2631bf-8d93-402d-a3e3-c241146187ff","BD","h"],
        ["69 - Banco de Dados. Transações e propriedades ACID.","https://notebook.google.com/notebook/128f284e-c147-42b8-827b-c0050966a651","BD","h"],
        ["70 - Modelagem de dados, modelo entidade-relacionamento.","https://notebook.google.com/notebook/cc056f8a-1ce3-4c4f-b7c3-6315f9c70670","BD","m"],
        ["71 - Bancos relacionais","https://notebook.google.com/notebook/a4a87150-a7cb-470b-b3cb-f7f88fd072a2","BD","m"],
        ["72 - Normalização de desnormalização","https://notebook.google.com/notebook/076265bb-2da4-449a-9d2d-b69e1a63b89b","BD","m"],
        ["73 - Álgebra relacional","https://notebook.google.com/notebook/4628d1c9-baef-446d-969b-d8640ab5b236","BD","m"],
        ["74 - Linguagem SQL","https://notebook.google.com/notebook/07e57369-56ad-47cd-92ee-2b2b165e040e","BD","h"],
        ["75 - SQL Avançado - Procedures, triggers e views.","https://notebook.google.com/notebook/6453b078-8f09-40cf-8c20-b90f35dfcee7","BD","h"],
        ["76 - Índices e otimização de consultas.","https://notebook.google.com/notebook/b2b7f9b1-7483-402e-8c5c-823ab789728e","BD","m"],
        ["77 - Segurança de dados","https://notebook.google.com/notebook/5d0593ea-5985-4dc5-8e4f-0685dbb810ff","BD","h"],
        ["78 - Administração e otimização de Oracle Database. Replicação, backup e recuperação. Alta disponibilidade.","https://notebook.google.com/notebook/f35acc59-3a25-4cea-ac8f-d95a3e05e449","BD","h"],
        ["80 - Fundamentos de Big Data e características de volume, velocidade e variedade de dados.","https://notebook.google.com/notebook/18ac8c72-741a-45a8-8473-5b1c850f9005","BD","h"],
        ["81 - Processamento distribuído.","https://notebook.google.com/notebook/8fb294af-d97a-49f1-a38d-eb11ce2a24e1","BD","m"],
        ["82 - Fundamentos de ciência de dados: coleta, preparação, limpeza, transformação.","https://notebook.google.com/notebook/e2eef5f7-5308-4307-a83d-33f8d2d1e382","BD","m"],
        ["83 - Fundamentos de inteligência artificial. Inteligência artifical generativa: conceitos e aplicações. Agentes inteligentes e modelos multimodais. Engenharia de prompts e de contexto: recuperação aumentada por geração (RAG). Aplicações práticas de IA em sistemas de informação e automação de processos. Ética em IA, IA responsável, explicabilidade e governança de IA: Estratégia Brasileira de Inteligência Artificial","https://notebook.google.com/notebook/05da257c-3c61-4f21-a12b-3245f369bcad","BD","l"],
        ["84 - Banco de dados NoSQL: modelos orientados a documentos , chave-valor, famílias de colunas (wide-column) e grafos: características, casos de uso e conceitos gerais: tecnologias com MongoDB e Redis.","https://notebook.google.com/notebook/f5bbbdc6-7be3-4ed8-89f0-f4326cabeb5a","BD","h"],
        ["85 - Aprendizado de máquina: aprendizado supervisionado, não supervisionado e por reforço. Avaliação de modelos.","https://notebook.google.com/notebook/f9eeebad-a872-4e35-8352-10ccd41a8714","BD","h"],
        ["86 - Redes neurais artificias e noções de deep learning","https://notebook.google.com/notebook/3434e300-c635-49d8-9f4e-a1703a0f0674","BD","m"],
        ["87 - Processamento de linguagem natural","https://notebook.google.com/notebook/d506e58b-f281-4ffd-b523-8184aa1731bb","BD","h"],
        ["88 - LGPD aplicada à IA.","https://notebook.google.com/notebook/4db106ee-7052-48be-8a4f-85952ff88f76","BD","h"],
        ["89 - Exploração e análise de dados.","https://notebook.google.com/notebook/bb700ab4-57d8-4900-bb55-f3bc88ddc9eb","BD","l"],
        ["90 - Apresentação de Dados.","https://notebook.google.com/notebook/d9350be6-b593-46eb-a605-1c220751498d","BD","m"],
        ["91 - Médias","https://notebook.google.com/notebook/8e5ecfa6-8db3-49f8-82e9-b08a5cec99f8","BD","l"],
        ["92 - Médias separatrizes ou Quantis","https://notebook.google.com/notebook/0fa06ca5-fe59-497e-8091-8013a98bf997","BD","l"],
        ["93 - Moda","https://notebook.google.com/notebook/ca70e7c5-2eac-4870-af83-a7225bb27ee3","BD","l"],
        ["94 - Medidas de Variabilidade ou Dispersão","https://notebook.google.com/notebook/65ff276c-6760-4a7a-945b-dc915ee2d2d9","BD","m"],
        ["95 - Análise Combinatória","https://notebook.google.com/notebook/91d761f4-d523-4cb1-8499-894a81175c08","BD","l"],
        ["96 - Probabilidade","https://notebook.google.com/notebook/7517cfc3-f043-4271-b3f7-732e1771c39d","BD","m"],
      ];
      const MISSION_CATEGORIES = { ES: 'Engenharia de Software', REDE: 'Rede de computadores', DEV: 'Desenvolvimento de Software', SO: 'Sistemas Operacionais', LEG: 'Legislação de TI', GOV: 'Governança de TI', BD: 'Banco de dados' };
      const MISSION_IMPORTANCE = { l: 'low', m: 'medium', h: 'high' };
      const REWARD_ICONS = ['🎬', '☕', '🎮', '🍰', '📚', '🎧', '🌿', '⭐', '🍕', '🧋'];
      const $ = (selector, root = document) => root.querySelector(selector);
      const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
      const safeText = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
      const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      const defaultState = () => ({ version: 1, profile: { name: 'Felipe' }, xp: 0, coins: 0, tasks: [], rewards: [], redemptions: [], createdAt: new Date().toISOString() });
      let state = loadState();
      let statusFilter = 'pending';
      let currentView = 'tasks';
      let editTaskId = null;
      let contextTaskId = null;
      let activeUndo = null;
      let toastTimers = new Set();

      function loadState() {
        try {
          const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
          if (!parsed || typeof parsed !== 'object') return defaultState();
          const fresh = defaultState();
          return {
            ...fresh,
            ...parsed,
            profile: { ...fresh.profile, ...(parsed.profile || {}) },
            tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
            rewards: Array.isArray(parsed.rewards) ? parsed.rewards : [],
            redemptions: Array.isArray(parsed.redemptions) ? parsed.redemptions : [],
            xp: nonNegativeNumber(parsed.xp), coins: nonNegativeNumber(parsed.coins)
          };
        } catch (error) {
          console.warn('Não foi possível ler os dados salvos do Aura Tracker.', error);
          return defaultState();
        }
      }
      function nonNegativeNumber(value) { const n = Number(value); return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0; }
      function saveState() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          return true;
        } catch (error) {
          console.error('Falha ao salvar no navegador:', error);
          toast('Armazenamento indisponível', 'Não foi possível salvar. Exporte um backup e verifique o espaço do navegador.', 'neutral');
          return false;
        }
      }
      function taskPoints(task) { return IMPORTANCE[task.importance] || IMPORTANCE.medium; }
      function completedTasks() { return state.tasks.filter(task => task.done); }
      function getRankIndex(xp = state.xp) {
        let idx = 0;
        RANKS.forEach((rank, i) => { if (xp >= rank.min) idx = i; });
        return idx;
      }
      function rankForXp(xp = state.xp) { return RANKS[getRankIndex(xp)]; }
      function nextRank(xp = state.xp) { return RANKS[getRankIndex(xp) + 1] || null; }
      function escapeAttr(value) { return safeText(value).replace(/`/g, '&#96;'); }
      function iconSvg(name) {
        const paths = {
          calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
          external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
          check: '<path d="m5 12 4.5 4.5L19 7"/>',
          copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
          edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
          trash: '<path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 14h11l1-14M9 7V4h6v3"/>',
          book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22Z"/><path d="M4 5v14a3 3 0 0 1 3-3h13M8 7h7"/>',
          star: '<path d="m12 2 2.7 6.1 6.6.6-5 4.3 1.5 6.5-5.8-3.5-5.8 3.5 1.5-6.5-5-4.3 6.6-.6L12 2Z"/>',
          bag: '<path d="M4 8h16l-1.2 12H5.2L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
          plus: '<path d="M12 5v14M5 12h14"/>',
          link: '<path d="M10 13a5 5 0 0 0 7.1 0l2-2A5 5 0 0 0 12 3.9l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"/>'
        };
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.star}</svg>`;
      }
      function normalizeUrl(raw) {
        const value = String(raw || '').trim();
        if (!value) return '';
        const url = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(value) ? value : `https://${value}`;
        try {
          const parsed = new URL(url);
          if (!['http:', 'https:'].includes(parsed.protocol)) return '';
          return parsed.href;
        } catch (_) { return ''; }
      }
      function prettyDate(value) {
        if (!value) return 'Sem prazo definido';
        const d = new Date(`${value}T12:00:00`);
        if (Number.isNaN(d.getTime())) return 'Prazo inválido';
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
      }
      function daysUntil(value) {
        if (!value) return null;
        const due = new Date(`${value}T00:00:00`); const today = new Date(); today.setHours(0,0,0,0);
        return Math.round((due - today) / 86400000);
      }
      function dueLabel(value) {
        if (!value) return 'Sem prazo';
        const diff = daysUntil(value);
        if (diff < 0) return `Atrasada há ${Math.abs(diff)} dia(s)`;
        if (diff === 0) return 'Vence hoje';
        if (diff === 1) return 'Vence amanhã';
        return prettyDate(value);
      }
      function toast(title, detail = '', type = 'success', undoCallback = null) {
        const stack = $('#toastStack');
        // Apenas a ação mais recente mantém o botão de desfazer, evitando estornos fora de ordem.
        $$('.toast', stack).forEach(existing => { if ($('.toast-undo', existing)) existing.remove(); });
        const node = document.createElement('div');
        node.className = `toast ${type === 'neutral' ? 'toast-neutral' : ''}`;
        const id = makeId();
        node.dataset.toastId = id;
        node.innerHTML = `<div class="toast-row"><div><div class="toast-title">${safeText(title)}</div><div class="toast-detail">${safeText(detail)}</div></div>${undoCallback ? '<button class="toast-undo" type="button">Desfazer</button>' : ''}</div>${undoCallback ? '<div class="toast-timer"></div>' : ''}`;
        if (undoCallback) {
          $('.toast-undo', node).addEventListener('click', () => {
            clearTimeout(timer);
            toastTimers.delete(timer);
            try { undoCallback(); } finally { node.remove(); }
          });
          activeUndo = id;
        }
        stack.appendChild(node);
        const timer = setTimeout(() => { node.remove(); toastTimers.delete(timer); if (activeUndo === id) activeUndo = null; }, undoCallback ? 5000 : 3600);
        toastTimers.add(timer);
      }
      function openModal(id) { $('#' + id).classList.add('open'); document.body.style.overflow = 'hidden'; }
      function closeModal(id) {
        const modal = $('#' + id); if (!modal) return;
        modal.classList.remove('open');
        if (!$('.overlay.open')) document.body.style.overflow = '';
      }
      function showTaskForm(task = null) {
        editTaskId = task?.id || null;
        $('#taskModalTitle').textContent = task ? 'Editar missão' : 'Nova missão';
        $('#saveTaskButton').textContent = task ? 'Salvar alterações' : 'Salvar missão';
        $('#taskTitle').value = task?.title || '';
        $('#taskSubject').value = task?.subject || '';
        $('#taskCycle').value = String(task?.cycle || $('#progressCycle').value === 'all' ? (task?.cycle || 1) : $('#progressCycle').value);
        $('#taskImportance').value = task?.importance || 'medium';
        $('#taskDeadline').value = task?.deadline || '';
        $('#taskLink').value = task?.link || '';
        openModal('taskModal');
        setTimeout(() => $('#taskTitle').focus(), 50);
      }
      function renderProfile() {
        const name = (state.profile.name || 'Estudante').trim() || 'Estudante';
        $('#profileName').textContent = name;
        $('#avatarText').textContent = [...name][0].toUpperCase();
        $('#profileRank').textContent = rankForXp().name;
        $('#coinBalance').textContent = state.coins.toLocaleString('pt-BR');
        $('#coinsStat').textContent = state.coins.toLocaleString('pt-BR');
        $('#shopCoinBalance').textContent = state.coins.toLocaleString('pt-BR');
        $('#xpTotal').innerHTML = `${state.xp.toLocaleString('pt-BR')} <span style="font-size:12px;color:var(--muted);font-weight:650">XP</span>`;
        const n = nextRank();
        if (n) {
          $('#nextRankValue').textContent = n.name;
          $('#nextRankFoot').textContent = `${Math.max(0, n.min - state.xp)} XP para evoluir`;
          $('#xpFoot').textContent = `${Math.max(0, n.min - state.xp)} XP até ${n.name}`;
        } else {
          $('#nextRankValue').textContent = 'Marechal';
          $('#nextRankFoot').textContent = 'Patente máxima alcançada';
          $('#xpFoot').textContent = 'Patente máxima alcançada';
        }
        renderRanks();
      }
      function renderProgress() {
        const cycle = $('#progressCycle').value;
        const tasks = cycle === 'all' ? state.tasks : state.tasks.filter(t => String(t.cycle) === cycle);
        const done = tasks.filter(t => t.done).length;
        const total = tasks.length;
        const pct = total ? Math.round(done / total * 100) : 0;
        $('#progressCopy').textContent = `${done} de ${total} missões concluídas`;
        $('#progressPercent').textContent = `${pct}%`;
        $('#progressFill').style.width = `${pct}%`;
        $('#ringPercent').textContent = `${pct}%`;
        $('#progressRing').style.setProperty('--p', `${pct}%`);
        $('#pendingPill').textContent = `${total - done} pendentes`;
        const activeCycles = new Set(state.tasks.map(t => String(t.cycle))).size;
        $('#cycleCountPill').textContent = `${activeCycles} ciclo(s) com missões`;
        $('#duePill').textContent = `${tasks.filter(t => t.deadline).length} com prazo definido`;
        $('#ringSubtext').textContent = total ? `${total - done} para concluir` : 'Vamos começar';
        $('#completedTotal').textContent = completedTasks().length.toLocaleString('pt-BR');
        $('#completedFoot').textContent = `de ${state.tasks.length.toLocaleString('pt-BR')} missões cadastradas`;
      }
      function taskCard(task) {
        const pts = taskPoints(task);
        const due = dueLabel(task.deadline);
        const url = normalizeUrl(task.link);
        const dueColor = task.deadline && daysUntil(task.deadline) < 0 && !task.done ? ' style="color:var(--red)"' : '';
        return `<article class="task-card ${task.done ? 'completed' : ''}" data-task-id="${escapeAttr(task.id)}">
          <div class="task-topline"><div class="tag-row"><span class="tag ${pts.cls}">${pts.label} relevância</span><span class="tag tag-cycle">${CYCLE_NAMES[task.cycle] || '1º Ciclo'}</span></div><button class="task-menu" type="button" data-task-menu="${escapeAttr(task.id)}" aria-label="Opções da missão" title="Opções">···</button></div>
          <h3 class="task-title">${safeText(task.title || 'Missão sem título')}</h3><div class="task-subject">${safeText(task.subject || 'Disciplina não informada')}</div>
          <div class="task-meta"><span${dueColor}>${iconSvg('calendar')}${safeText(due)}</span></div>
          ${url ? `<a class="task-link" href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${iconSvg('book')} Abrir Gemini Notebook ${iconSvg('external')}</a>` : '<span class="task-link" style="color:var(--faint)">'+iconSvg('link')+' Nenhum caderno vinculado</span>'}
          <div class="task-footer"><span class="task-award">Recompensa: <strong>+${pts.xp} XP</strong> · <strong style="color:var(--yellow)">+${pts.coins} ◉</strong></span><button class="complete-btn" type="button" data-toggle-task="${escapeAttr(task.id)}">${task.done ? iconSvg('check') + ' Concluída' : iconSvg('check') + ' Concluir'}</button></div>
        </article>`;
      }
      function filteredTasks() {
        const q = $('#searchInput').value.trim().toLocaleLowerCase('pt-BR');
        let list = state.tasks.filter(t => statusFilter === 'all' || (statusFilter === 'pending' ? !t.done : t.done));
        if (q) list = list.filter(t => `${t.title} ${t.subject} ${CYCLE_NAMES[t.cycle]}`.toLocaleLowerCase('pt-BR').includes(q));
        const sort = $('#sortSelect').value;
        list.sort((a, b) => {
          if (sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          if (sort === 'deadline') return (a.deadline || '9999-12-31').localeCompare(b.deadline || '9999-12-31') || a.title.localeCompare(b.title, 'pt-BR');
          if (sort === 'importance') return taskPoints(b).rank - taskPoints(a).rank || a.title.localeCompare(b.title, 'pt-BR');
          return String(a.title || '').localeCompare(String(b.title || ''), 'pt-BR', { sensitivity: 'base' });
        });
        return list;
      }
      function renderTasks() {
        const list = filteredTasks();
        $('#visibleTaskCount').textContent = list.length;
        if (!list.length) {
          const hasTasks = state.tasks.length > 0;
          const title = hasTasks ? 'Nenhuma missão encontrada' : 'Seu próximo nível começa aqui';
          const copy = hasTasks ? 'Tente alterar o filtro de status ou o termo da busca.' : 'Adicione seu primeiro item do edital ou importe uma planilha CSV para montar seu plano de estudos.';
          $('#taskGrid').innerHTML = `<div class="empty-state"><div class="empty-icon">${iconSvg(hasTasks ? 'book' : 'plus')}</div><h3>${title}</h3><p>${copy}</p><button class="btn btn-primary" type="button" id="emptyAddButton">${hasTasks ? 'Limpar busca e mostrar todas' : 'Criar primeira missão'}</button></div>`;
          $('#emptyAddButton').addEventListener('click', () => { if (hasTasks) { $('#searchInput').value = ''; setStatusFilter('all'); renderTasks(); } else showTaskForm(); });
        } else {
          $('#taskGrid').innerHTML = list.map(taskCard).join('');
        }
      }
      function renderShop() {
        $('#rewardCount').textContent = `${state.rewards.length} itens`;
        if (!state.rewards.length) {
          $('#shopGrid').innerHTML = '<div class="empty-state" style="min-height:210px"><div class="empty-icon">🎁</div><h3>Sua loja está esperando</h3><p>Crie uma recompensa ao lado, defina o preço em moedas e tenha algo legal para buscar ao cumprir suas metas.</p></div>';
        } else {
          $('#shopGrid').innerHTML = state.rewards.map((reward, index) => {
            const affordable = state.coins >= reward.cost;
            return `<article class="shop-card" data-reward-id="${escapeAttr(reward.id)}"><div class="shop-card-head"><div class="shop-symbol">${safeText(reward.icon || REWARD_ICONS[index % REWARD_ICONS.length])}</div><div class="shop-cost">◉ ${Number(reward.cost).toLocaleString('pt-BR')}</div></div><h3>${safeText(reward.name)}</h3><p>${safeText(reward.description || 'Uma recompensa pela sua dedicação.')}</p><div class="shop-card-bottom"><span class="owned-tag">${affordable ? 'Disponível para resgate' : `Faltam ${(reward.cost - state.coins).toLocaleString('pt-BR')} moedas`}</span><div style="display:flex;gap:5px"><button class="icon-btn" type="button" data-edit-reward="${escapeAttr(reward.id)}" aria-label="Editar recompensa" title="Editar" style="width:30px;height:30px">${iconSvg('edit')}</button><button class="icon-btn" type="button" data-delete-reward="${escapeAttr(reward.id)}" aria-label="Excluir recompensa" title="Excluir" style="width:30px;height:30px">${iconSvg('trash')}</button><button class="btn btn-small ${affordable ? 'btn-primary' : ''}" type="button" data-buy-reward="${escapeAttr(reward.id)}" ${affordable ? '' : 'disabled'}>Resgatar</button></div></div></article>`;
          }).join('');
        }
        if (!state.redemptions.length) {
          $('#redemptionHistory').innerHTML = '<p style="color:var(--muted);font-size:11px;margin:0">Nenhuma recompensa resgatada ainda.</p>';
        } else {
          $('#redemptionHistory').innerHTML = `<div style="display:grid;gap:8px">${state.redemptions.slice(0,8).map(item => `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--border)"><div><strong style="display:block;font-size:11px">${safeText(item.name)}</strong><span style="color:var(--muted);font-size:10px">${new Date(item.date).toLocaleDateString('pt-BR')}</span></div><span style="color:var(--yellow);font-size:10px;font-weight:800">−${Number(item.cost).toLocaleString('pt-BR')} ◉</span></div>`).join('')}</div>`;
        }
      }
      function renderRanks() {
        const current = getRankIndex();
        $('#rankList').innerHTML = RANKS.map((rank, idx) => {
          const maxLabel = rank.max === Infinity ? '16.001+ XP' : `${rank.min.toLocaleString('pt-BR')}–${rank.max.toLocaleString('pt-BR')} XP`;
          return `<div class="rank-row ${idx === current ? 'current' : ''}"><div class="rank-insignia">${iconSvg('star')}</div><div class="rank-copy"><div class="rank-name">${safeText(rank.name)}</div><div class="rank-xp">${maxLabel}</div></div>${idx === current ? '<span class="rank-status">PATENTE ATUAL</span>' : idx < current ? '<span class="rank-status">CONQUISTADA</span>' : ''}</div>`;
        }).join('');
      }
      function renderAll() { renderProfile(); renderProgress(); renderTasks(); renderShop(); }
      function seedInitialMissions() {
        const seedKey = 'TCE_GO_Analise_FCC_Espacado_v1';
        const seededSets = Array.isArray(state.seededMissionSets) ? state.seededMissionSets : [];
        if (seededSets.includes(seedKey)) return;
        const existingKeys = new Set(state.tasks.map(task => String(task.title || '').trim() + '|||' + normalizeUrl(task.link || '')));
        const now = new Date().toISOString();
        const newTasks = [];
        INITIAL_MISSION_ROWS.forEach(row => {
          const key = row[0] + '|||' + normalizeUrl(row[1]);
          if (existingKeys.has(key)) return;
          existingKeys.add(key);
          newTasks.push({
            id: makeId(), title: row[0], link: normalizeUrl(row[1]), subject: MISSION_CATEGORIES[row[2]] || row[2],
            deadline: '', cycle: 1, importance: MISSION_IMPORTANCE[row[3]] || 'medium', done: false,
            createdAt: now, updatedAt: now
          });
        });
        state.seededMissionSets = seededSets.concat(seedKey);
        if (newTasks.length) state.tasks.push(...newTasks);
        saveState();
        if (newTasks.length) toast(newTasks.length + ' missão(ões) adicionada(s)', 'TCE-GO: títulos, links, disciplinas e relevância FCC importados para o 1º Ciclo.');
      }
      function setStatusFilter(filter) {
        statusFilter = filter;
        $$('[data-status]').forEach(btn => btn.classList.toggle('active', btn.dataset.status === filter));
      }
      function setView(view) {
        currentView = view;
        $('#tasksView').classList.toggle('hidden', view !== 'tasks');
        $('#shopView').classList.toggle('hidden', view !== 'shop');
        $('#taskDock').classList.toggle('hidden', view !== 'tasks');
        $$('.nav-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.view === view));
      }
      function addOrUpdateTask(event) {
        event.preventDefault();
        const title = $('#taskTitle').value.trim();
        if (!title) { $('#taskTitle').focus(); return; }
        const rawLink = $('#taskLink').value.trim();
        const link = rawLink ? normalizeUrl(rawLink) : '';
        if (rawLink && !link) { toast('Link inválido', 'Use um endereço começando por http:// ou https://, ou um domínio válido.', 'neutral'); return; }
        const existing = editTaskId ? state.tasks.find(t => t.id === editTaskId) : null;
        const task = {
          id: existing?.id || makeId(), title,
          subject: $('#taskSubject').value.trim(), link,
          deadline: $('#taskDeadline').value || '', cycle: Number($('#taskCycle').value) || 1,
          importance: $('#taskImportance').value, done: existing?.done || false,
          createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString()
        };
        if (existing) state.tasks = state.tasks.map(t => t.id === existing.id ? task : t);
        else state.tasks.push(task);
        saveState(); closeModal('taskModal'); renderAll();
        toast(existing ? 'Missão atualizada' : 'Missão criada', existing ? 'As alterações foram salvas.' : 'Sua nova missão já está no quadro.');
      }
      function setTaskDone(id, done) {
        const task = state.tasks.find(t => t.id === id); if (!task || task.done === done) return;
        const pts = taskPoints(task);
        const before = { xp: state.xp, coins: state.coins, done: task.done };
        task.done = done; task.updatedAt = new Date().toISOString();
        const sign = done ? 1 : -1;
        state.xp = Math.max(0, state.xp + sign * pts.xp);
        state.coins = Math.max(0, state.coins + sign * pts.coins);
        saveState(); renderAll();
        if (done) {
          toast('Missão concluída! +' + pts.xp + ' XP', `Você ganhou ${pts.coins} moedas. Continue assim!`, 'success', () => {
            const current = state.tasks.find(t => t.id === id);
            if (current) { current.done = before.done; current.updatedAt = new Date().toISOString(); }
            state.xp = before.xp; state.coins = before.coins; saveState(); renderAll();
            toast('Conclusão desfeita', 'Os pontos foram estornados.', 'neutral');
          });
        } else {
          toast('Missão reaberta', `−${pts.xp} XP e −${pts.coins} moedas.`, 'neutral', () => {
            const current = state.tasks.find(t => t.id === id);
            if (current) { current.done = before.done; current.updatedAt = new Date().toISOString(); }
            state.xp = before.xp; state.coins = before.coins; saveState(); renderAll();
            toast('Alteração desfeita', 'A missão voltou ao estado anterior.', 'neutral');
          });
        }
      }
      function duplicateTask(id) {
        const original = state.tasks.find(t => t.id === id); if (!original) return;
        const clone = { ...original, id: makeId(), title: original.title, done: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        state.tasks.push(clone); saveState(); renderAll(); toast('Missão duplicada', 'A cópia foi criada como pendente.');
      }
      function deleteTask(id) {
        const task = state.tasks.find(t => t.id === id); if (!task) return;
        if (!confirm(`Excluir a missão "${task.title}"?${task.done ? '\nOs pontos já conquistados permanecerão no seu perfil.' : ''}`)) return;
        state.tasks = state.tasks.filter(t => t.id !== id); saveState(); renderAll(); toast('Missão excluída', 'O item foi removido do quadro.', 'neutral');
      }
      function openTaskContext(id, button) {
        contextTaskId = id;
        const menu = $('#taskContextMenu');
        menu.innerHTML = `<button class="context-item" data-action="edit">${iconSvg('edit')} Editar missão</button><button class="context-item" data-action="duplicate">${iconSvg('copy')} Duplicar missão</button><button class="context-item ${state.tasks.find(t=>t.id===id)?.done ? '' : 'danger'}" data-action="delete">${iconSvg('trash')} Excluir missão</button>`;
        const rect = button.getBoundingClientRect();
        menu.style.left = `${Math.max(8, Math.min(window.innerWidth - 170, rect.right - 155))}px`;
        menu.style.top = `${Math.min(window.innerHeight - 145, rect.bottom + 5)}px`;
        menu.classList.remove('hidden');
      }
      function closeTaskContext() { $('#taskContextMenu').classList.add('hidden'); }
      function duplicateCycle(event) {
        event.preventDefault();
        const from = Number($('#cycleFrom').value), to = Number($('#cycleTo').value), days = Number($('#cycleOffset').value) || 0;
        if (from === to) { toast('Selecione ciclos diferentes', 'A origem e o destino precisam ser distintos.', 'neutral'); return; }
        const sources = state.tasks.filter(t => Number(t.cycle) === from);
        if (!sources.length) { toast('Nenhuma missão para copiar', `${CYCLE_NAMES[from]} não possui itens cadastrados.`, 'neutral'); return; }
        const copies = sources.map(t => {
          let deadline = t.deadline || '';
          if (deadline) { const d = new Date(`${deadline}T12:00:00`); d.setDate(d.getDate() + days); deadline = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
          return { ...t, id: makeId(), cycle: to, deadline, done: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        });
        state.tasks.push(...copies); saveState(); renderAll(); closeModal('cycleModal');
        toast(`${copies.length} missão(ões) duplicada(s)`, `De ${CYCLE_NAMES[from]} para ${CYCLE_NAMES[to]}, com ${days >= 0 ? '+' : ''}${days} dia(s) nos prazos.`);
      }
      function deleteCycle(event) {
        event.preventDefault();
        const cycle = Number($('#cycleDelete').value);
        const count = state.tasks.filter(t => Number(t.cycle) === cycle).length;
        if (!count) { toast('Ciclo vazio', `${CYCLE_NAMES[cycle]} não possui missões.`, 'neutral'); return; }
        if (!confirm(`Excluir permanentemente as ${count} missão(ões) do ${CYCLE_NAMES[cycle]}?\n\nOs XP e moedas já ganhos serão mantidos.`)) return;
        state.tasks = state.tasks.filter(t => Number(t.cycle) !== cycle); saveState(); renderAll(); closeModal('cycleModal');
        toast('Ciclo excluído', `${count} missão(ões) removida(s).`, 'neutral');
      }
      function addReward(event) {
        event.preventDefault();
        const name = $('#rewardName').value.trim(); const cost = Number($('#rewardCost').value);
        if (!name || !Number.isInteger(cost) || cost < 1) { toast('Confira os dados', 'Informe o nome e um preço inteiro maior que zero.', 'neutral'); return; }
        state.rewards.push({ id: makeId(), name, description: $('#rewardDescription').value.trim(), cost, icon: REWARD_ICONS[state.rewards.length % REWARD_ICONS.length], createdAt: new Date().toISOString() });
        saveState(); $('#rewardForm').reset(); renderShop(); toast('Recompensa criada', 'Seu novo prêmio já está disponível na loja.');
      }
      function buyReward(id) {
        const reward = state.rewards.find(r => r.id === id); if (!reward) return;
        if (state.coins < reward.cost) { toast('Moedas insuficientes', 'Conclua mais missões para juntar moedas.', 'neutral'); return; }
        if (!confirm(`Resgatar "${reward.name}" por ${reward.cost} moedas?`)) return;
        state.coins -= reward.cost;
        state.redemptions.unshift({ id: makeId(), rewardId: reward.id, name: reward.name, cost: reward.cost, date: new Date().toISOString() });
        saveState(); renderAll(); toast('Recompensa resgatada!', `${reward.name} — aproveite seu prêmio.`);
      }
      function editReward(id) {
        const reward = state.rewards.find(r => r.id === id); if (!reward) return;
        $('#editRewardId').value = id; $('#editRewardName').value = reward.name; $('#editRewardDescription').value = reward.description || ''; $('#editRewardCost').value = reward.cost; openModal('editRewardModal');
      }
      function saveEditedReward(event) {
        event.preventDefault();
        const id = $('#editRewardId').value; const reward = state.rewards.find(r => r.id === id); if (!reward) return;
        const cost = Number($('#editRewardCost').value);
        if (!Number.isInteger(cost) || cost < 1) { toast('Preço inválido', 'Use um número inteiro maior que zero.', 'neutral'); return; }
        reward.name = $('#editRewardName').value.trim(); reward.description = $('#editRewardDescription').value.trim(); reward.cost = cost;
        saveState(); closeModal('editRewardModal'); renderShop(); toast('Recompensa atualizada', 'As alterações foram salvas.');
      }
      function deleteReward(id) {
        const reward = state.rewards.find(r => r.id === id); if (!reward) return;
        if (!confirm(`Excluir a recompensa "${reward.name}"? O histórico de resgates será mantido.`)) return;
        state.rewards = state.rewards.filter(r => r.id !== id); saveState(); renderShop(); toast('Recompensa excluída', 'O item foi removido da loja.', 'neutral');
      }
      function parseCsv(text) {
        const input = text.replace(/^\uFEFF/, '');
        // Planilhas brasileiras normalmente usam ponto e vírgula; outros CSVs usam vírgula.
        // Detecta o separador na primeira linha, ignorando separadores dentro de aspas.
        let commas = 0, semicolons = 0, quotedHeader = false;
        for (let i = 0; i < input.length && input[i] !== '\n' && input[i] !== '\r'; i++) {
          if (input[i] === '"') {
            if (quotedHeader && input[i + 1] === '"') i++;
            else quotedHeader = !quotedHeader;
          } else if (!quotedHeader && input[i] === ',') commas++;
          else if (!quotedHeader && input[i] === ';') semicolons++;
        }
        const delimiter = semicolons > commas ? ';' : ',';
        const rows = []; let row = []; let cell = ''; let quoted = false;
        for (let i = 0; i < input.length; i++) {
          const ch = input[i];
          if (ch === '"') {
            if (quoted && input[i + 1] === '"') { cell += '"'; i++; }
            else quoted = !quoted;
          } else if (ch === delimiter && !quoted) { row.push(cell); cell = ''; }
          else if ((ch === '\n' || ch === '\r') && !quoted) {
            if (ch === '\r' && input[i + 1] === '\n') i++;
            row.push(cell); if (row.some(v => v.trim() !== '')) rows.push(row); row = []; cell = '';
          } else cell += ch;
        }
        row.push(cell); if (row.some(v => v.trim() !== '')) rows.push(row);
        return rows;
      }
      function importCsvFile(file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const rows = parseCsv(String(reader.result || ''));
            if (!rows.length) { toast('CSV vazio', 'O arquivo não contém linhas para importar.', 'neutral'); return; }
            const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
            const headerWords = rows[0].map(norm);
            const hasHeader = headerWords.some(v => /item do edital|titulo|title|link do notebook|disciplina|materia|relevancia|importancia/.test(v));
            const headers = hasHeader ? headerWords : [];
            const findCol = regexes => headers.findIndex(h => regexes.some(re => re.test(h)));
            const titleCol = hasHeader ? findCol([/item do edital/, /^titulo$/, /^title$/]) : 0;
            const linkCol = hasHeader ? findCol([/link do notebook/, /^link$/, /notebook/, /url/]) : 1;
            const subjectCol = hasHeader ? findCol([/^disciplina$/, /^materia$/, /subject/]) : 2;
            const importanceCol = hasHeader ? findCol([/relevancia/, /importancia/, /importance/]) : 3;
            const dataRows = hasHeader ? rows.slice(1) : rows;
            const imported = [];
            dataRows.forEach(cols => {
              const title = String(cols[titleCol >= 0 ? titleCol : 0] || '').trim();
              if (!title) return;
              const linkRaw = linkCol >= 0 ? String(cols[linkCol] || '').trim() : '';
              const normalizedImportance = norm(importanceCol >= 0 ? cols[importanceCol] : 'medio');
              let importance = 'medium';
              if (/alta|high/.test(normalizedImportance)) importance = 'high';
              else if (/baixa|low/.test(normalizedImportance)) importance = 'low';
              const subject = subjectCol >= 0 ? String(cols[subjectCol] || '').trim() : '';
              imported.push({ id: makeId(), title, link: linkRaw ? normalizeUrl(linkRaw) : '', subject, deadline: '', cycle: 1, importance, done: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
            });
            if (!imported.length) { toast('Nenhuma missão importada', 'Confira o cabeçalho e a primeira coluna do CSV.', 'neutral'); return; }
            const rejectedLinks = imported.filter(t => t.link === '' && t.title && dataRows.some(r => String(r[linkCol] || '').trim() && String(r[titleCol >= 0 ? titleCol : 0] || '').trim() === t.title)).length;
            state.tasks.push(...imported); saveState(); renderAll();
            toast(`${imported.length} missão(ões) importada(s)`, `Itens adicionados ao 1º Ciclo.${rejectedLinks ? ` ${rejectedLinks} link(s) inválido(s) foram ignorados.` : ''}`);
          } catch (error) { console.error(error); toast('Erro ao importar CSV', 'Confira se o arquivo está no formato CSV.', 'neutral'); }
          $('#csvFileInput').value = '';
        };
        reader.onerror = () => { toast('Falha na leitura', 'Não foi possível abrir este arquivo.', 'neutral'); $('#csvFileInput').value = ''; };
        reader.readAsText(file, 'UTF-8');
      }
      function downloadBlob(content, filename, type) {
        const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      function exportCsv() {
        const headers = ['Item do Edital','Link do Notebook','Disciplina','Importância / Relevância','Ciclo','Prazo','Concluída'];
        const quote = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
        const lines = [headers, ...state.tasks.map(t => [t.title, t.link, t.subject, IMPORTANCE[t.importance]?.label || 'Média', CYCLE_NAMES[t.cycle] || '1º Ciclo', t.deadline, t.done ? 'Sim' : 'Não'])].map(row => row.map(quote).join(';')).join('\r\n');
        downloadBlob('\uFEFF' + lines, `aura-tracker-missoes-${new Date().toISOString().slice(0,10)}.csv`, 'text/csv;charset=utf-8;');
        toast('CSV exportado', 'O arquivo foi preparado para download.');
      }
      function backupData() {
        const payload = { ...state, exportedAt: new Date().toISOString(), app: 'Aura Tracker' };
        downloadBlob(JSON.stringify(payload, null, 2), `aura-tracker-backup-${new Date().toISOString().slice(0,10)}.json`, 'application/json;charset=utf-8;');
        toast('Backup criado', 'Guarde o arquivo JSON em um local seguro.');
      }
      function restoreBackup(file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result || ''));
            if (!parsed || !Array.isArray(parsed.tasks) || !Array.isArray(parsed.rewards) || !Number.isFinite(Number(parsed.xp)) || !Number.isFinite(Number(parsed.coins))) throw new Error('Estrutura inválida');
            if (!confirm(`Restaurar este backup?\n\nMissões: ${parsed.tasks.length}\nRecompensas: ${parsed.rewards.length}\n\nOs dados atuais deste navegador serão substituídos.`)) return;
            state = { ...defaultState(), ...parsed, profile: { name: String(parsed.profile?.name || 'Estudante') }, tasks: parsed.tasks.map(t => ({ ...t, id: String(t.id || makeId()), cycle: [1,2,3,4].includes(Number(t.cycle)) ? Number(t.cycle) : 1, importance: IMPORTANCE[t.importance] ? t.importance : 'medium', done: Boolean(t.done) })), rewards: parsed.rewards.map(r => ({ ...r, id: String(r.id || makeId()), cost: Math.max(1, Math.floor(Number(r.cost) || 1)) })), redemptions: Array.isArray(parsed.redemptions) ? parsed.redemptions : [], xp: nonNegativeNumber(parsed.xp), coins: nonNegativeNumber(parsed.coins) };
            saveState(); renderAll(); toast('Backup restaurado', 'Seus dados foram carregados neste navegador.');
          } catch (error) { console.error(error); toast('Backup inválido', 'Selecione um arquivo JSON de backup do Aura Tracker.', 'neutral'); }
          $('#backupFileInput').value = '';
        };
        reader.onerror = () => { toast('Falha ao ler backup', 'Tente selecionar o arquivo novamente.', 'neutral'); $('#backupFileInput').value = ''; };
        reader.readAsText(file, 'UTF-8');
      }

      // Navegação e ações principais
      $$('.nav-tab').forEach(tab => tab.addEventListener('click', () => setView(tab.dataset.view)));
      $('#profileButton').addEventListener('click', () => openModal('rankModal'));
      $('#settingsButton').addEventListener('click', () => openModal('cycleModal'));
      $('#heroAddButton').addEventListener('click', () => showTaskForm());
      $('#dockAddButton').addEventListener('click', () => showTaskForm());
      $('#taskForm').addEventListener('submit', addOrUpdateTask);
      $('#progressCycle').addEventListener('change', renderProgress);
      $('#searchInput').addEventListener('input', renderTasks);
      $('#sortSelect').addEventListener('change', renderTasks);
      $$('[data-status]').forEach(button => button.addEventListener('click', () => { setStatusFilter(button.dataset.status); renderTasks(); }));
      $('#importButton').addEventListener('click', () => $('#csvFileInput').click());
      $('#csvFileInput').addEventListener('change', event => { const file = event.target.files?.[0]; if (file) importCsvFile(file); });
      $('#exportCsvButton').addEventListener('click', exportCsv);
      $('#backupButton').addEventListener('click', backupData);
      $('#cycleBackupButton').addEventListener('click', backupData);
      $('#cycleRestoreButton').addEventListener('click', () => $('#backupFileInput').click());
      $('#backupFileInput').addEventListener('change', event => { const file = event.target.files?.[0]; if (file) restoreBackup(file); });
      $('#duplicateCycleForm').addEventListener('submit', duplicateCycle);
      $('#deleteCycleForm').addEventListener('submit', deleteCycle);
      $('#rewardForm').addEventListener('submit', addReward);
      $('#editRewardForm').addEventListener('submit', saveEditedReward);
      $('#taskGrid').addEventListener('click', event => {
        const toggle = event.target.closest('[data-toggle-task]');
        const menu = event.target.closest('[data-task-menu]');
        if (toggle) { setTaskDone(toggle.dataset.toggleTask, !state.tasks.find(t => t.id === toggle.dataset.toggleTask)?.done); return; }
        if (menu) { event.stopPropagation(); openTaskContext(menu.dataset.taskMenu, menu); }
      });
      $('#taskContextMenu').addEventListener('click', event => {
        const button = event.target.closest('[data-action]'); if (!button || !contextTaskId) return;
        const id = contextTaskId, action = button.dataset.action; closeTaskContext();
        if (action === 'edit') { const task = state.tasks.find(t => t.id === id); if (task) showTaskForm(task); }
        else if (action === 'duplicate') duplicateTask(id);
        else if (action === 'delete') deleteTask(id);
      });
      $('#shopGrid').addEventListener('click', event => {
        const buy = event.target.closest('[data-buy-reward]'); const edit = event.target.closest('[data-edit-reward]'); const del = event.target.closest('[data-delete-reward]');
        if (buy) buyReward(buy.dataset.buyReward);
        else if (edit) editReward(edit.dataset.editReward);
        else if (del) deleteReward(del.dataset.deleteReward);
      });
      $$('[data-close]').forEach(button => button.addEventListener('click', () => closeModal(button.dataset.close)));
      $$('.overlay').forEach(overlay => overlay.addEventListener('click', event => { if (event.target === overlay) closeModal(overlay.id); }));
      document.addEventListener('keydown', event => { if (event.key === 'Escape') { $$('.overlay.open').forEach(modal => closeModal(modal.id)); closeTaskContext(); } });
      document.addEventListener('click', event => { if (!event.target.closest('#taskContextMenu') && !event.target.closest('[data-task-menu]')) closeTaskContext(); });
      window.addEventListener('resize', closeTaskContext);
      window.addEventListener('storage', event => {
        if (event.key === STORAGE_KEY && event.newValue) { state = loadState(); renderAll(); toast('Dados atualizados', 'Outro separador deste navegador alterou seu progresso.', 'neutral'); }
      });

      // Inicialização: acrescenta as missões do CSV uma única vez, preservando tarefas existentes.
      seedInitialMissions();
      renderAll();
    })();
  </script>
</body>
</html>
