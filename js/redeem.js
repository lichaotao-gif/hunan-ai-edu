(function () {
  "use strict";

  const entry = document.getElementById("redeem-entry");
  if (!entry) return;
  const modal = document.getElementById("redeem-modal");
  const schoolModal = document.getElementById("redeem-school-modal");
  const choiceModal = document.getElementById("redeem-school-choice-modal");
  const content = document.getElementById("redeem-content");
  const schoolSearch = document.getElementById("redeem-school-search");
  const suggestions = document.getElementById("redeem-suggestions");
  const schoolError = document.getElementById("redeem-school-error");
  const schoolPicked = document.getElementById("redeem-school-picked");
  const choiceError = document.getElementById("redeem-school-choice-error");
  const citySelect = document.getElementById("redeem-city");
  const districtSelect = document.getElementById("redeem-district");
  const schoolConfirm = document.getElementById("redeem-school-confirm");
  const choiceConfirm = document.getElementById("redeem-school-choice-confirm");
  const region = window.BigScreenData;
  const isLocalPreview = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
  const previewCourses = [
    { title: "一年级 AI 基础课程", cover: "assets/img/ai-course-autumn-redesign.png" },
    { title: "二年级 AI 探索课程", cover: "assets/img/course-robot-world.png" },
    { title: "三年级 AI 实践课程", cover: "assets/img/course-computer-vision.png" },
    { title: "四年级 AI 创造课程", cover: "assets/img/ai-book-grade-4.png" },
    { title: "五年级 AI 综合课程", cover: "assets/img/ai-book-grade-5.png" }
  ];
  const codes = {
    "BINGO-2026-01": { courses: [previewCourses[0]], maxUses: 1, start: "2026-10-01", end: "2026-12-31" },
    "BINGO-2026-05": { courses: previewCourses, maxUses: 5, start: "2026-10-01", end: "2026-12-31" }
  };
  let currentCode = "";
  let currentOffer = null;
  let selectedSchool = "";
  let candidateSchool = "";
  let candidateDistrict = "";
  let lastFocused = null;
  let schoolSource = "redeem";

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function teacherName() {
    if (localStorage.getItem("hndj_guest_mode") === "1") return "设备用户";
    try { return JSON.parse(localStorage.getItem("hndj_user") || "{}").name || "当前老师"; }
    catch (error) { return "当前老师"; }
  }
  function schoolStorageKeys() {
    const deviceId = localStorage.getItem("hndj_device_id");
    return localStorage.getItem("hndj_guest_mode") === "1" && deviceId
      ? { school: `hndj_device_school_${deviceId}`, region: `hndj_device_school_region_${deviceId}` }
      : { school: "hndj_school", region: "hndj_school_region" };
  }
  function boundSchool() { return localStorage.getItem(schoolStorageKeys().school) || ""; }
  function setStep(step) {
    [1, 2, 3].forEach((n) => document.querySelector(`#redeem-step-${n}`)?.classList.toggle("active", n === step));
    document.querySelector(".redeem-progress span:first-child").classList.toggle("active", step === 1);
    document.getElementById("redeem-title").textContent = ["", "输入卡片上的兑换码", "确认本次兑换的课程", "课程兑换"][step];
    document.getElementById("redeem-description").textContent = ["", "查看课程内容，确认后即可加入我的课程。", "核对课程、激活规则和有效期。", "兑换流程已完成。"][step];
  }
  function showModal(target) {
    modal.hidden = target !== modal;
    schoolModal.hidden = target !== schoolModal;
    choiceModal.hidden = target !== choiceModal;
    document.body.classList.add("modal-open");
    const focusable = target.querySelector("input:not([disabled]), select:not([disabled]), button:not([disabled])");
    requestAnimationFrame(() => focusable?.focus());
  }
  function closeAll() {
    modal.hidden = true;
    schoolModal.hidden = true;
    choiceModal.hidden = true;
    document.body.classList.remove("modal-open");
    const focusTarget = lastFocused && lastFocused.offsetParent !== null ? lastFocused : document.getElementById("topbar-avatar");
    focusTarget?.focus();
  }
  function renderInput(message) {
    currentOffer = null;
    setStep(1);
    content.innerHTML = `<label class="redeem-label" for="redeem-code">课程兑换码</label>
      <div class="redeem-code-row"><input class="redeem-input" id="redeem-code" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="40" placeholder="请输入卡片上的兑换码" value="${escapeHtml(currentCode)}"><button class="redeem-primary" id="redeem-lookup" type="button">查看课程</button></div>
      <p class="redeem-code-hint">兑换前可先查看该码包含的课程，不会立即消耗兑换次数。</p>
      ${isLocalPreview ? '<p class="redeem-preview-code">本地预览可用：<code>BINGO-2026-01</code>、<code>BINGO-2026-05</code><small>仅供界面体验，正式环境不提供这些示例码。</small></p>' : ""}
      <p class="redeem-inline-error" id="redeem-code-error" role="alert" ${message ? "" : "hidden"}>${escapeHtml(message || "")}</p>`;
    const codeInput = document.getElementById("redeem-code");
    codeInput.addEventListener("input", () => { currentCode = codeInput.value.toUpperCase().trim(); document.getElementById("redeem-code-error").hidden = true; });
    codeInput.addEventListener("keydown", (event) => { if (event.key === "Enter") lookup(); });
    document.getElementById("redeem-lookup").addEventListener("click", lookup);
  }
  function lookup() {
    const code = currentCode.toUpperCase().trim();
    if (!code) { renderInput("请输入兑换码。"); document.getElementById("redeem-code").focus(); return; }
    const offer = codes[code];
    if (!offer) { renderInput("兑换码无效，请核对后重新输入。"); return; }
    const today = new Date().toISOString().slice(0, 10);
    if (today < offer.start || today > offer.end) { renderInput("兑换码不在有效期内，请核对使用期限。"); return; }
    currentOffer = offer;
    renderPreview();
  }
  function renderPreview() {
    setStep(2);
    const school = boundSchool();
    content.innerHTML = `<div class="redeem-preview-heading"><span>可兑换课程</span><em>共 ${currentOffer.courses.length} 门</em></div>
      <div class="redeem-course-list">${currentOffer.courses.map((course) => `<div class="redeem-course"><img class="redeem-course-cover" src="${escapeHtml(course.cover || "assets/img/ai-course-autumn-redesign.png")}" alt=""><span><b>${escapeHtml(course.title)}</b><small>教师课堂授课资源</small></span></div>`).join("")}</div>
      <div class="redeem-summary"><div>兑换码 <strong>${escapeHtml(currentCode)}</strong></div><div>激活规则 <strong>${currentOffer.maxUses === 1 ? "单次激活，仅一位老师使用" : `最多激活 ${currentOffer.maxUses} 次`}</strong></div><div>兑换期限 <strong>${currentOffer.start} 至 ${currentOffer.end}</strong></div></div>
      ${school ? `<div class="redeem-bind-alert"><span><b>已绑定学校</b>${escapeHtml(school)}</span></div>` : `<div class="redeem-bind-alert"><span aria-hidden="true">ⓘ</span><span><b>兑换前请先绑定学校</b>用于统计学校老师的使用情况，学校绑定和课程兑换分别完成。</span></div>`}
      <div class="redeem-actions"><button class="redeem-primary" id="redeem-confirm" type="button">${school ? "确认兑换" : "去绑定学校"}</button></div>`;
    document.getElementById("redeem-confirm").addEventListener("click", () => { if (!boundSchool()) openSchool("redeem"); else renderSuccess(); });
  }
  function renderSuccess() {
    setStep(3);
    content.innerHTML = `<div class="redeem-success"><span class="redeem-success-icon" aria-hidden="true">✓</span><h3>兑换成功</h3><p>${escapeHtml(teacherName())} · ${escapeHtml(boundSchool())}</p><p>课程已加入“我的课程”。</p></div><div class="redeem-actions"><button class="redeem-primary" id="redeem-finish" type="button">完成</button></div>`;
    document.getElementById("redeem-finish").addEventListener("click", closeAll);
  }
  function fillSelect(select, options, placeholder) {
    select.innerHTML = `<option value="">${placeholder}</option>` + options.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
  }
  function openSchool(source) {
    schoolSource = source;
    lastFocused = source === "redeem" ? entry : document.activeElement;
    selectedSchool = "";
    candidateSchool = "";
    candidateDistrict = "";
    const currentSchool = boundSchool();
    let savedRegion = {};
    try { savedRegion = JSON.parse(localStorage.getItem(schoolStorageKeys().region) || "{}"); } catch (error) { /* ignore */ }
    const knownSchool = region?.allSchoolsUnder(region.PROVINCE, "", "").find((item) => item.school === currentSchool);
    const city = knownSchool?.city || savedRegion.city || "";
    const district = knownSchool?.district || savedRegion.district || "";
    schoolSearch.value = source === "profile" ? currentSchool : "";
    schoolError.hidden = true;
    schoolPicked.hidden = true;
    document.getElementById("redeem-school-title").textContent = source === "profile"
      ? (currentSchool ? "修改任教学校" : "绑定任教学校") : "先绑定任教学校";
    document.getElementById("redeem-school-cancel").textContent = source === "profile" ? "取消" : "上一步";
    document.getElementById("redeem-teacher-name").textContent = teacherName();
    document.getElementById("redeem-teacher-avatar").textContent = teacherName().charAt(0);
    fillSelect(citySelect, region ? region.REGION_TREE.map((city) => city.name) : [], "请选择城市");
    citySelect.value = city;
    const selectedCity = region?.REGION_TREE.find((item) => item.name === city);
    fillSelect(districtSelect, selectedCity ? selectedCity.districts.map((item) => item.name) : [], "请选择区 / 县");
    districtSelect.value = district;
    schoolConfirm.disabled = true;
    showModal(schoolModal);
    citySelect.focus();
  }
  window.openBingoSchoolBinding = () => openSchool("profile");
  function normalizeName(value) {
    const districts = region?.REGION_TREE.find((item) => item.name === citySelect.value)?.districts.map((item) => item.name) || [];
    const areaNames = [region?.PROVINCE, citySelect.value, ...districts].filter(Boolean);
    let name = String(value).replace(/[\s·•（）()\-]/g, "");
    areaNames.forEach((area) => { name = name.replaceAll(area, ""); });
    return name.replace(/学校$/, "");
  }
  function editSimilarity(left, right) {
    const row = Array.from({ length: right.length + 1 }, (_, index) => index);
    for (let i = 1; i <= left.length; i++) {
      let previous = row[0];
      row[0] = i;
      for (let j = 1; j <= right.length; j++) {
        const old = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (left[i - 1] === right[j - 1] ? 0 : 1));
        previous = old;
      }
    }
    return 1 - row[right.length] / Math.max(left.length, right.length, 1);
  }
  function schoolScore(query, school) {
    const left = normalizeName(query);
    const right = normalizeName(school);
    if (left === right) return 1;
    const editScore = editSimilarity(left, right);
    const includesScore = left.length >= 2 && right.includes(left) ? 0.78 + 0.2 * left.length / right.length : 0;
    return Math.max(editScore, includesScore);
  }
  function resetSchoolMatch() {
    selectedSchool = "";
    schoolConfirm.disabled = true;
    schoolPicked.hidden = true;
    schoolError.hidden = true;
  }
  function identifySchool() {
    const city = citySelect.value;
    const district = districtSelect.value;
    const query = schoolSearch.value.trim();
    if (!city || !district) {
      schoolError.textContent = "请先选择所在的市和区 / 县。";
      schoolError.hidden = false;
      (!city ? citySelect : districtSelect).focus();
      return;
    }
    if (query.length < 3) {
      schoolError.textContent = "请至少输入 3 个字，以便辨别学校。";
      schoolError.hidden = false;
      schoolSearch.focus();
      return;
    }
    schoolError.hidden = true;
    const all = region ? region.allSchoolsUnder(region.PROVINCE, city, "") : [];
    const ranked = all.map((item) => ({ ...item, score: schoolScore(query, item.school) + (item.district === district ? 0.02 : 0) })).sort((a, b) => b.score - a.score);
    const topScore = ranked[0]?.score || 0;
    const found = ranked.filter((item) => item.score >= 0.48 && item.score >= topScore - 0.24).slice(0, 5);
    candidateSchool = "";
    candidateDistrict = "";
    choiceConfirm.disabled = true;
    choiceError.hidden = true;
    document.getElementById("redeem-school-query").textContent = `您输入：${query}　·　${region?.PROVINCE || "湖南省"} ${city} ${district}`;
    suggestions.innerHTML = found.length
      ? '<span class="redeem-suggestions-title">请核对学校全称与区县，可选择其中一所</span>' + found.map((item) => `<label class="redeem-suggestion"><input type="radio" name="redeem-school-candidate" value="${escapeHtml(item.school)}" data-district="${escapeHtml(item.district)}"><span><b>${escapeHtml(item.school)}</b><small>${escapeHtml(city)} · ${escapeHtml(item.district)}</small></span></label>`).join("")
      : '<div class="redeem-no-match">没有找到可靠的学校候选项。请返回核对区域或补充学校全称，暂不能确认绑定。</div>';
    showModal(choiceModal);
  }
  citySelect.addEventListener("change", () => {
    const city = region?.REGION_TREE.find((item) => item.name === citySelect.value);
    fillSelect(districtSelect, city ? city.districts.map((item) => item.name) : [], "请选择区 / 县");
    resetSchoolMatch();
  });
  districtSelect.addEventListener("change", resetSchoolMatch);
  schoolSearch.addEventListener("input", resetSchoolMatch);
  schoolSearch.addEventListener("keydown", (event) => { if (event.key === "Enter") identifySchool(); });
  document.getElementById("redeem-school-identify").addEventListener("click", identifySchool);
  suggestions.addEventListener("change", (event) => {
    if (event.target.name !== "redeem-school-candidate") return;
    candidateSchool = event.target.value;
    candidateDistrict = event.target.dataset.district;
    choiceConfirm.disabled = false;
    choiceError.hidden = true;
  });
  choiceConfirm.addEventListener("click", () => {
    if (!candidateSchool) {
      choiceError.textContent = "请先选择一所学校。";
      choiceError.hidden = false;
      return;
    }
    selectedSchool = candidateSchool;
    districtSelect.value = candidateDistrict;
    schoolPicked.innerHTML = `已确认学校<b>${escapeHtml(selectedSchool)}</b>${escapeHtml(citySelect.value)} · ${escapeHtml(candidateDistrict)}`;
    schoolPicked.hidden = false;
    schoolConfirm.disabled = false;
    showModal(schoolModal);
    schoolConfirm.focus();
  });
  schoolConfirm.addEventListener("click", () => {
    if (!selectedSchool) { schoolError.textContent = "请从候选项中选择学校。"; schoolError.hidden = false; return; }
    const keys = schoolStorageKeys();
    localStorage.setItem(keys.school, selectedSchool);
    localStorage.setItem(keys.region, JSON.stringify({ province: region?.PROVINCE || "湖南省", city: citySelect.value, district: districtSelect.value }));
    window.dispatchEvent(new CustomEvent("hndj:school-bound", { detail: { school: selectedSchool, city: citySelect.value, district: districtSelect.value } }));
    if (schoolSource === "profile") closeAll();
    else { showModal(modal); renderPreview(); }
  });
  entry.addEventListener("click", () => { lastFocused = entry; currentCode = ""; renderInput(); showModal(modal); document.getElementById("redeem-code").focus(); });
  document.getElementById("redeem-close").addEventListener("click", closeAll);
  function leaveSchool() { if (schoolSource === "profile") closeAll(); else showModal(modal); }
  document.getElementById("redeem-school-close").addEventListener("click", leaveSchool);
  document.getElementById("redeem-school-cancel").addEventListener("click", leaveSchool);
  document.getElementById("redeem-school-choice-close").addEventListener("click", () => showModal(schoolModal));
  document.getElementById("redeem-school-choice-back").addEventListener("click", () => showModal(schoolModal));
  [modal, schoolModal].forEach((overlay) => overlay.addEventListener("click", (event) => { if (event.target === overlay) closeAll(); }));
  choiceModal.addEventListener("click", (event) => { if (event.target === choiceModal) showModal(schoolModal); });
  document.addEventListener("keydown", (event) => {
    const active = !choiceModal.hidden ? choiceModal : !schoolModal.hidden ? schoolModal : !modal.hidden ? modal : null;
    if (!active) return;
    if (event.key === "Escape") { event.preventDefault(); if (active === choiceModal) showModal(schoolModal); else closeAll(); }
    if (event.key !== "Tab") return;
    const controls = [...active.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled])")].filter((item) => item.offsetParent !== null);
    if (!controls.length) return;
    if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls[controls.length - 1].focus(); }
    else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) { event.preventDefault(); controls[0].focus(); }
  });
})();
