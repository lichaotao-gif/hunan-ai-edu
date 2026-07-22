/* =====================================================================
 * 教育局数据统计大屏 · 交互与渲染
 * 依赖：js/bigscreen-data.js（BigScreenData）
 * ===================================================================== */
(function () {
  "use strict";
  const D = window.BigScreenData;
  const SVGNS = "http://www.w3.org/2000/svg";
  const $ = (id) => document.getElementById(id);

  // 城市在大屏"地图"上的相对坐标（0~1），用于抽象地理分布
  const CITY_XY = {
    "长沙市": [0.62, 0.36], "株洲市": [0.74, 0.60], "湘潭市": [0.48, 0.62],
    "衡阳市": [0.55, 0.84], "岳阳市": [0.58, 0.13], "常德市": [0.28, 0.34],
  };

  // ---------- 筛选状态 ----------
  const scope = { province: D.PROVINCE, city: "", district: "", school: "", range: "all" };

  // ---------- 工具 ----------
  const fmt = (n) => n.toLocaleString("zh-CN");
  const el = (tag, attrs, children) => {
    const node = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (children) [].concat(children).forEach((c) => c && node.appendChild(c));
    return node;
  };
  const tooltip = $("bs-tooltip");
  function showTip(html, x, y) { tooltip.innerHTML = html; tooltip.hidden = false; tooltip.style.left = x + "px"; tooltip.style.top = y + "px"; }
  function hideTip() { tooltip.hidden = true; }

  // 数字滚动动画
  function countUp(node, target, decimals) {
    const start = performance.now(), dur = 1100;
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const v = target * e;
      node.textContent = decimals ? v.toFixed(decimals) : fmt(Math.round(v));
      if (p < 1) requestAnimationFrame(step);
      else node.textContent = decimals ? target.toFixed(decimals) : fmt(target);
    }
    requestAnimationFrame(step);
  }

  const KPI_ICONS = {
    school: '<path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>',
    check: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    gauge: '<path d="M12 14l4-4"/><path d="M4 20a8 8 0 1 1 16 0"/>',
  };
  const KPI_COLORS = {
    cyan: ["#33E1FF", "#22B8E8"], blue: ["#3B82F6", "#60A5FA"], violet: ["#A78BFA", "#C084FC"],
    teal: ["#2DD4BF", "#34D399"], sky: ["#38BDF8", "#0EA5E9"], green: ["#34D399", "#10B981"], amber: ["#FBBF24", "#F59E0B"],
  };

  // ---------- KPI 卡 ----------
  function renderKpis(data) {
    const box = $("bs-kpis"); box.innerHTML = "";
    data.kpis.forEach((k, i) => {
      const [c1, c2] = KPI_COLORS[k.color] || KPI_COLORS.blue;
      const grad = `linear-gradient(135deg, ${c1}, ${c2})`;
      const isRate = k.unit === "%";
      const card = document.createElement("div");
      card.className = "bs-kpi";
      card.style.cssText = `--k-color:${c1};--k-grad:${grad};--k-glow:${c1}66;--k-tint:${c1}22;animation-delay:${i * 60}ms`;
      card.innerHTML =
        `<div class="bs-kpi-top"><span class="bs-kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${KPI_ICONS[k.icon] || ""}</svg></span><span class="bs-kpi-label">${k.label}</span></div>` +
        `<div class="bs-kpi-val"><span class="bs-kpi-num" style="--k-grad:${grad}">0</span><span class="bs-kpi-unit">${k.unit}</span></div>` +
        `<div class="bs-kpi-trend ${k.trend < 0 ? "down" : ""}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="${k.trend < 0 ? "23 18 13.5 8.5 8.5 13.5 1 6" : "23 6 13.5 15.5 8.5 10.5 1 18"}"/><polyline points="${k.trend < 0 ? "17 18 23 18 23 12" : "17 6 23 6 23 12"}"/></svg>环比 ${k.trend > 0 ? "+" : ""}${k.trend}%</div>`;
      box.appendChild(card);
      countUp(card.querySelector(".bs-kpi-num"), k.value, isRate ? 1 : 0);
    });
  }

  // ---------- 折线（开课增长）：渐变面积 + 描边动画 + tooltip ----------
  function renderAreaLine(elId, series, color1, color2, tipLabel) {
    const host = $(elId); host.innerHTML = "";
    const W = host.clientWidth || 520, H = host.clientHeight || 220;
    const padL = 34, padR = 12, padT = 14, padB = 24;
    const iw = W - padL - padR, ih = H - padT - padB;
    const max = Math.max(...series.map((d) => d.value)) * 1.15 || 1;
    const x = (i) => padL + (series.length === 1 ? iw / 2 : (i / (series.length - 1)) * iw);
    const y = (v) => padT + ih - (v / max) * ih;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none" });
    const gid = elId + "-g", aid = elId + "-a";
    const defs = el("defs");
    const lg = el("linearGradient", { id: gid, x1: "0", y1: "0", x2: "1", y2: "0" });
    lg.appendChild(el("stop", { offset: "0", "stop-color": color1 }));
    lg.appendChild(el("stop", { offset: "1", "stop-color": color2 }));
    const ag = el("linearGradient", { id: aid, x1: "0", y1: "0", x2: "0", y2: "1" });
    ag.appendChild(el("stop", { offset: "0", "stop-color": color2, "stop-opacity": ".42" }));
    ag.appendChild(el("stop", { offset: "1", "stop-color": color2, "stop-opacity": "0" }));
    defs.appendChild(lg); defs.appendChild(ag); svg.appendChild(defs);
    // 网格
    for (let g = 0; g <= 4; g++) {
      const gy = padT + (g / 4) * ih;
      svg.appendChild(el("line", { class: "bs-grid-line", x1: padL, y1: gy, x2: W - padR, y2: gy }));
      svg.appendChild(el("text", { class: "bs-axis-label", x: 6, y: gy + 4 }, [txt(Math.round(max * (1 - g / 4)))]));
    }
    // 路径
    let line = "", area = "";
    series.forEach((d, i) => { const px = x(i), py = y(d.value); line += (i ? "L" : "M") + px + " " + py + " "; });
    area = line + `L${x(series.length - 1)} ${padT + ih} L${x(0)} ${padT + ih} Z`;
    svg.appendChild(el("path", { d: area, fill: `url(#${aid})`, class: "bs-area-rise" }));
    const path = el("path", { d: line, class: "bs-line-path bs-draw", stroke: `url(#${gid})`, "stroke-width": 3 });
    svg.appendChild(path);
    // x 轴标签（隔一个）
    series.forEach((d, i) => { if (i % 2 === 0) svg.appendChild(el("text", { class: "bs-axis-label", x: x(i), y: H - 6, "text-anchor": "middle" }, [txt(d.label)])); });
    // 点 + 交互
    series.forEach((d, i) => {
      const px = x(i), py = y(d.value);
      const dot = el("circle", { class: "bs-dot", cx: px, cy: py, r: 3.4, fill: "#08152f", stroke: color1, "stroke-width": 2 });
      dot.addEventListener("mouseenter", (e) => { dot.setAttribute("r", 5.5); const rc = host.getBoundingClientRect(); showTip(`${d.label}<div class="bs-tt-row"><span class="bs-tt-dot" style="background:${color1}"></span>${tipLabel} <b>${fmt(d.value)}</b></div>`, rc.left + px, rc.top + py); });
      dot.addEventListener("mouseleave", () => { dot.setAttribute("r", 3.4); hideTip(); });
      svg.appendChild(dot);
    });
    host.appendChild(svg);
    const len = path.getTotalLength ? path.getTotalLength() : 1000; path.style.setProperty("--len", len);
  }

  // ---------- 班级增长：新增柱 + 累计折线 ----------
  function renderClassGrowth(elId, series) {
    const host = $(elId); host.innerHTML = "";
    const W = host.clientWidth || 520, H = host.clientHeight || 220;
    const padL = 40, padR = 44, padT = 14, padB = 24;
    const iw = W - padL - padR, ih = H - padT - padB;
    const maxAdd = Math.max(...series.map((d) => d.add)) * 1.25 || 1;
    const maxTot = Math.max(...series.map((d) => d.total)) * 1.1 || 1;
    const bw = Math.min(20, (iw / series.length) * 0.5);
    const x = (i) => padL + (i + 0.5) * (iw / series.length);
    const yA = (v) => padT + ih - (v / maxAdd) * ih;
    const yT = (v) => padT + ih - (v / maxTot) * ih;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none" });
    const bid = elId + "-bar", lid = elId + "-line";
    const defs = el("defs");
    const bg = el("linearGradient", { id: bid, x1: "0", y1: "0", x2: "0", y2: "1" });
    bg.appendChild(el("stop", { offset: "0", "stop-color": "#8B5CF6" }));
    bg.appendChild(el("stop", { offset: "1", "stop-color": "#3B82F6", "stop-opacity": ".55" }));
    const lg = el("linearGradient", { id: lid, x1: "0", y1: "0", x2: "1", y2: "0" });
    lg.appendChild(el("stop", { offset: "0", "stop-color": "#2DD4BF" }));
    lg.appendChild(el("stop", { offset: "1", "stop-color": "#33E1FF" }));
    defs.appendChild(bg); defs.appendChild(lg); svg.appendChild(defs);
    for (let g = 0; g <= 4; g++) {
      const gy = padT + (g / 4) * ih;
      svg.appendChild(el("line", { class: "bs-grid-line", x1: padL, y1: gy, x2: W - padR, y2: gy }));
      svg.appendChild(el("text", { class: "bs-axis-label", x: 6, y: gy + 4 }, [txt(Math.round(maxAdd * (1 - g / 4)))]));
      svg.appendChild(el("text", { class: "bs-axis-label", x: W - padR + 6, y: gy + 4 }, [txt(Math.round(maxTot * (1 - g / 4)))]));
    }
    // 柱
    series.forEach((d, i) => {
      const px = x(i) - bw / 2, py = yA(d.add), h = padT + ih - py;
      const rect = el("rect", { x: px, y: py, width: bw, height: Math.max(0, h), rx: 4, fill: `url(#${bid})`, class: "bs-bar-grow" });
      rect.style.animationDelay = i * 40 + "ms";
      rect.addEventListener("mouseenter", () => { const rc = host.getBoundingClientRect(); showTip(`${d.label}<div class="bs-tt-row"><span class="bs-tt-dot" style="background:#8B5CF6"></span>新增班级 <b>${fmt(d.add)}</b></div><div class="bs-tt-row"><span class="bs-tt-dot" style="background:#33E1FF"></span>累计使用 <b>${fmt(d.total)}</b></div>`, rc.left + x(i), rc.top + Math.min(py, yT(d.total))); });
      rect.addEventListener("mouseleave", hideTip);
      svg.appendChild(rect);
    });
    // 累计折线
    let line = "";
    series.forEach((d, i) => { line += (i ? "L" : "M") + x(i) + " " + yT(d.total) + " "; });
    const path = el("path", { d: line, class: "bs-line-path bs-draw", stroke: `url(#${lid})`, "stroke-width": 2.6 });
    svg.appendChild(path);
    series.forEach((d, i) => { if (i % 2 === 0) svg.appendChild(el("text", { class: "bs-axis-label", x: x(i), y: H - 6, "text-anchor": "middle" }, [txt(d.label)])); });
    series.forEach((d, i) => svg.appendChild(el("circle", { cx: x(i), cy: yT(d.total), r: 2.6, fill: "#08152f", stroke: "#33E1FF", "stroke-width": 1.6 })));
    host.appendChild(svg);
    const len = path.getTotalLength ? path.getTotalLength() : 1000; path.style.setProperty("--len", len);
  }

  // ---------- 仪表环（课时完成率） ----------
  function renderGauge(data) {
    const c = data.completion;
    const host = $("chart-gauge"); host.innerHTML = "";
    const ring = document.createElement("div"); ring.className = "bs-gauge-ring";
    const R = 42, CIRC = 2 * Math.PI * R, off = CIRC * (1 - c.rate / 100);
    ring.innerHTML =
      `<svg viewBox="0 0 100 100"><defs><linearGradient id="gaugeG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#33E1FF"/><stop offset="0.5" stop-color="#3B82F6"/><stop offset="1" stop-color="#A78BFA"/></linearGradient></defs>` +
      `<circle cx="50" cy="50" r="${R}" fill="none" stroke="rgba(96,165,250,.16)" stroke-width="9"/>` +
      `<circle cx="50" cy="50" r="${R}" fill="none" stroke="url(#gaugeG)" stroke-width="9" stroke-linecap="round" transform="rotate(-90 50 50)" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}" style="transition:stroke-dashoffset 1.3s cubic-bezier(.2,.8,.2,1)"/></svg>` +
      `<div class="bs-gauge-center"><div class="bs-gauge-pct">0<small>%</small></div><div class="bs-gauge-cap">课时完成率</div></div>`;
    host.appendChild(ring);
    const stats = document.createElement("div"); stats.className = "bs-gauge-stats";
    stats.innerHTML =
      `<div class="bs-gauge-stat total"><span>总课时</span><b data-n="${c.total}">0</b></div>` +
      `<div class="bs-gauge-stat done"><span>已完成课时</span><b data-n="${c.done}">0</b></div>`;
    host.appendChild(stats);
    requestAnimationFrame(() => { ring.querySelector("circle:last-of-type").style.strokeDashoffset = off; });
    countUp(ring.querySelector(".bs-gauge-pct"), c.rate, 1);
    // pct 里有 <small>%</small>，用自定义写法
    const pct = ring.querySelector(".bs-gauge-pct");
    const t0 = performance.now();
    (function anim(now) { const p = Math.min(1, (now - t0) / 1100); const e = 1 - Math.pow(1 - p, 3); pct.innerHTML = (c.rate * e).toFixed(1) + "<small>%</small>"; if (p < 1) requestAnimationFrame(anim); else pct.innerHTML = c.rate.toFixed(1) + "<small>%</small>"; })(t0);
    stats.querySelectorAll("b").forEach((b) => countUp(b, +b.dataset.n, 0));
  }

  // ---------- 区域完成率排行（横向条） ----------
  function renderRegionRank(data) {
    const host = $("chart-region-rank"); host.innerHTML = "";
    const max = Math.max(...data.regionRanking.map((d) => d.rate)) || 100;
    data.regionRanking.slice(0, 6).forEach((d) => {
      const row = document.createElement("div"); row.className = "bs-bar-row";
      row.innerHTML = `<span class="bs-bar-name">${d.name}</span><div class="bs-bar-track"><i class="bs-bar-fill" style="--w:${(d.rate / max) * 100}%"></i></div><span class="bs-bar-val">${d.rate}%</span>`;
      host.appendChild(row);
    });
  }

  // ---------- 学校活跃度排行 ----------
  function renderSchoolRank(data) {
    const host = $("chart-school-rank"); host.innerHTML = "";
    const max = Math.max(...data.schoolActivity.map((d) => d.score)) || 1;
    data.schoolActivity.forEach((d, i) => {
      const item = document.createElement("div");
      item.className = "bs-rank-item" + (i < 3 ? " top" + (i + 1) : "");
      item.innerHTML =
        `<span class="bs-rank-no">${i + 1}</span>` +
        `<div class="bs-rank-info"><b>${d.name}</b><small>${d.city}</small></div>` +
        `<div class="bs-rank-score"><b>${fmt(d.score)}</b><span class="bs-rank-mini"><i style="width:${(d.score / max) * 100}%"></i></span></div>`;
      host.appendChild(item);
    });
  }

  // ---------- 区域分布"地图"（抽象节点热力） ----------
  function renderMap(data) {
    const host = $("chart-map"); host.innerHTML = "";
    const W = host.clientWidth || 480, H = host.clientHeight || 360;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}` });
    const defs = el("defs");
    const rg = el("radialGradient", { id: "mapNode" });
    rg.appendChild(el("stop", { offset: "0", "stop-color": "#33E1FF" }));
    rg.appendChild(el("stop", { offset: "1", "stop-color": "#3B82F6" }));
    defs.appendChild(rg); svg.appendChild(defs);
    // 背景轮廓（抽象省域）
    svg.appendChild(el("ellipse", { cx: W * 0.52, cy: H * 0.5, rx: W * 0.4, ry: H * 0.42, fill: "rgba(51,130,255,.05)", stroke: "rgba(96,165,250,.22)", "stroke-width": 1.5, "stroke-dasharray": "4 5" }));
    const max = Math.max(...data.regionDist.map((d) => d.value)) || 1;
    const pts = data.regionDist.map((d) => {
      const xy = CITY_XY[d.name] || [Math.random(), Math.random()];
      return { name: d.name, value: d.value, heat: d.heat, x: 40 + xy[0] * (W - 80), y: 30 + xy[1] * (H - 70) };
    });
    // 连线（构成网络感）
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dist = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (dist < W * 0.34) svg.appendChild(el("line", { x1: pts[i].x, y1: pts[i].y, x2: pts[j].x, y2: pts[j].y, stroke: "rgba(51,225,255,.14)", "stroke-width": 1 }));
      }
    }
    // 节点
    pts.forEach((p, i) => {
      const rad = 6 + (p.value / max) * 12;
      const g = el("g", { class: "bs-map-node" });
      const halo = el("circle", { cx: p.x, cy: p.y, r: rad + 8, fill: "#33E1FF", opacity: ".18", class: "bs-map-halo", style: `--r0:${rad + 8}px;animation-delay:${i * 300}ms` });
      const core = el("circle", { cx: p.x, cy: p.y, r: rad, fill: "url(#mapNode)", opacity: (0.55 + p.heat * 0.4).toFixed(2) });
      const dot = el("circle", { cx: p.x, cy: p.y, r: 2.5, fill: "#EAF6FF" });
      g.appendChild(halo); g.appendChild(core); g.appendChild(dot);
      g.appendChild(el("text", { class: "bs-map-label", x: p.x, y: p.y - rad - 6, "text-anchor": "middle" }, [txt(p.name)]));
      g.appendChild(el("text", { class: "bs-map-val", x: p.x, y: p.y + rad + 15, "text-anchor": "middle" }, [txt(p.value + " 班")]));
      g.addEventListener("mouseenter", () => { const rc = host.getBoundingClientRect(); showTip(`${p.name}<div class="bs-tt-row"><span class="bs-tt-dot" style="background:#33E1FF"></span>开课 <b>${fmt(p.value)}</b> 班</div>`, rc.left + p.x, rc.top + p.y); });
      g.addEventListener("mouseleave", hideTip);
      svg.appendChild(g);
    });
    host.appendChild(svg);
  }

  function txt(s) { return document.createTextNode(String(s)); }

  // ---------- 整体渲染 ----------
  function renderAll() {
    const data = D.buildMetrics(scope);
    renderKpis(data);
    renderAreaLine("chart-open-growth", data.openGrowth, "#33E1FF", "#3B82F6", "开课班级");
    renderClassGrowth("chart-class-growth", data.classGrowth);
    renderGauge(data);
    renderRegionRank(data);
    renderSchoolRank(data);
    renderMap(data);
    // 更新时间 + 副标题
    const t = data.updatedAt;
    $("bs-updated").textContent = `${t.getFullYear()}-${p2(t.getMonth() + 1)}-${p2(t.getDate())} ${p2(t.getHours())}:${p2(t.getMinutes())}`;
    $("bs-subtitle").textContent = scopeLabel();
    $("map-tag").textContent = (scope.city ? scope.city : "全省") + " · 热力分布";
  }
  const p2 = (n) => String(n).padStart(2, "0");
  function scopeLabel() {
    const parts = [scope.province];
    if (scope.city) parts.push(scope.city);
    if (scope.district) parts.push(scope.district);
    let s = parts.join(" / ");
    s += scope.school ? " · " + scope.school : (scope.city || scope.district ? " · 全部学校" : " · 全省汇总");
    const rangeMap = { all: "全部数据", term: "本学期", month: "本月", custom: "自定义区间" };
    return s + " · " + (rangeMap[scope.range] || "全部数据");
  }

  // ---------- 筛选交互 ----------
  const fProvince = $("f-province"), fCity = $("f-city"), fDistrict = $("f-district");
  const fSchoolInput = $("f-school-input"), fSchoolMenu = $("f-school-menu");

  function fillSelect(sel, items, placeholder) {
    sel.innerHTML = `<option value="">${placeholder}</option>` + items.map((it) => `<option value="${it}">${it}</option>`).join("");
  }
  function refreshCity() { fillSelect(fCity, D.REGION_TREE.map((c) => c.name), "全部市"); }
  function refreshDistrict() {
    const city = D.REGION_TREE.find((c) => c.name === scope.city);
    fillSelect(fDistrict, city ? city.districts.map((d) => d.name) : [], "全部区/县");
  }
  function schoolList() {
    return D.allSchoolsUnder(scope.province, scope.city, scope.district);
  }
  function renderSchoolMenu(keyword) {
    const kw = (keyword || "").trim();
    let list = schoolList();
    if (kw) list = list.filter((s) => s.school.includes(kw));
    if (!list.length) { fSchoolMenu.innerHTML = '<div class="bs-school-empty">未找到匹配的学校</div>'; return; }
    const head = `<div class="bs-school-opt${!scope.school ? " active" : ""}" data-school=""><span>全部学校</span><small>${schoolList().length} 所</small></div>`;
    fSchoolMenu.innerHTML = head + list.slice(0, 40).map((s) =>
      `<div class="bs-school-opt${scope.school === s.school ? " active" : ""}" data-school="${s.school}"><span>${s.school}</span><small>${s.city}·${s.district}</small></div>`).join("");
  }

  fProvince.innerHTML = `<option value="${D.PROVINCE}">${D.PROVINCE}</option>`; // 仅一个省，锁定
  refreshCity(); refreshDistrict();

  fCity.addEventListener("change", () => { scope.city = fCity.value; scope.district = ""; scope.school = ""; fSchoolInput.value = ""; refreshDistrict(); renderAll(); });
  fDistrict.addEventListener("change", () => { scope.district = fDistrict.value; scope.school = ""; fSchoolInput.value = ""; renderAll(); });

  fSchoolInput.addEventListener("focus", () => { renderSchoolMenu(fSchoolInput.value); fSchoolMenu.hidden = false; });
  fSchoolInput.addEventListener("input", () => { renderSchoolMenu(fSchoolInput.value); fSchoolMenu.hidden = false; });
  fSchoolMenu.addEventListener("click", (e) => {
    const opt = e.target.closest("[data-school]"); if (!opt) return;
    scope.school = opt.dataset.school;
    fSchoolInput.value = scope.school || "";
    fSchoolMenu.hidden = true; renderAll();
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".bs-school-picker")) fSchoolMenu.hidden = true; });

  // 时间范围
  $("f-range").addEventListener("click", (e) => {
    const btn = e.target.closest(".bs-range-btn"); if (!btn) return;
    $("f-range").querySelectorAll(".bs-range-btn").forEach((b) => b.classList.toggle("active", b === btn));
    scope.range = btn.dataset.range;
    const custom = scope.range === "custom";
    ["f-date-start", "f-date-end"].forEach((id) => $(id).hidden = !custom);
    document.querySelector(".bs-date-sep").hidden = !custom;
    renderAll();
  });
  ["f-date-start", "f-date-end"].forEach((id) => $(id).addEventListener("change", renderAll));

  // 重置
  $("f-reset").addEventListener("click", () => {
    scope.city = ""; scope.district = ""; scope.school = ""; scope.range = "all";
    fCity.value = ""; refreshDistrict(); fSchoolInput.value = "";
    $("f-range").querySelectorAll(".bs-range-btn").forEach((b) => b.classList.toggle("active", b.dataset.range === "all"));
    ["f-date-start", "f-date-end"].forEach((id) => $(id).hidden = true);
    document.querySelector(".bs-date-sep").hidden = true;
    renderAll();
  });

  // 刷新
  $("bs-refresh").addEventListener("click", () => {
    const btn = $("bs-refresh"); btn.classList.add("spin");
    setTimeout(() => btn.classList.remove("spin"), 800);
    renderAll();
  });

  // 窗口尺寸变化重绘图表（防抖）
  let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(renderAll, 220); });

  // 首次渲染
  renderAll();
})();
