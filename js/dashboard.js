(function () {
  "use strict";

  const REGIONS = ["示范片区一", "示范片区二", "示范片区三"];
  const SCHOOLS = [
    { name: "未来实验学校", region: REGIONS[0], students: 1260, classes: 32, course: [960, 742], lab: [380, 298], quiz: [250, 184] },
    { name: "启明中心小学", region: REGIONS[0], students: 980, classes: 24, course: [720, 536], lab: [294, 218], quiz: [196, 151] },
    { name: "新知中学", region: REGIONS[1], students: 1520, classes: 36, course: [1080, 851], lab: [462, 372], quiz: [308, 239] },
    { name: "星河学校", region: REGIONS[1], students: 870, classes: 21, course: [630, 443], lab: [261, 183], quiz: [174, 126] },
    { name: "博雅实验学校", region: REGIONS[2], students: 1180, classes: 28, course: [840, 681], lab: [354, 288], quiz: [236, 191] },
    { name: "育新九年一贯制学校", region: REGIONS[2], students: 1430, classes: 34, course: [1020, 796], lab: [429, 337], quiz: [286, 218] },
  ];
  const COURSE_TREND = [18, 23, 21, 30, 37, 34, 46, 58, 54, 71, 82, 78, 96, 112];
  const LAB_TREND = [12, 15, 20, 19, 26, 32, 36, 43, 49, 56, 63, 72, 79, 91];
  const QUIZ_TREND = [8, 10, 13, 17, 18, 23, 28, 31, 38, 42, 48, 55, 62, 70];
  const GRADES = ["三年级", "四年级", "五年级", "六年级", "七年级", "八年级"];
  const TEACHERS = ["李老师", "王老师", "张老师", "刘老师", "陈老师", "周老师"];

  const $ = (id) => document.getElementById(id);
  const format = (value) => Math.round(value).toLocaleString("zh-CN");
  const percent = (done, total) => total ? Math.round(done / total * 100) : 0;
  const state = { region: "all", term: "all", school: "all" };

  function availableSchools() {
    return SCHOOLS.filter((school) => state.region === "all" || school.region === state.region);
  }

  function selectedSchools() {
    const schools = availableSchools();
    return state.school === "all" ? schools : schools.filter((school) => school.name === state.school);
  }

  function termFactor() {
    return state.term === "current" ? 0.58 : state.term === "previous" ? 0.42 : 1;
  }

  function buildClassDetails(schools) {
    return schools.flatMap((school) => {
      const schoolIndex = Math.max(0, SCHOOLS.findIndex((item) => item.name === school.name));
      return Array.from({ length: school.classes }, (_, index) => {
        const used = (index * 7 + schoolIndex * 3) % 10 < 8;
        const totalPeriods = 20;
        const donePeriods = used ? 4 + (index * 3 + schoolIndex) % 17 : 0;
        const day = 10 + (index * 3 + schoolIndex) % 18;
        return {
          school: school.name,
          grade: GRADES[index % GRADES.length],
          name: `${GRADES[index % GRADES.length]}（${Math.floor(index / GRADES.length) + 1}）班`,
          teacher: TEACHERS[(index + schoolIndex) % TEACHERS.length],
          students: 32 + (index * 5 + schoolIndex) % 17,
          used,
          progress: used ? `${donePeriods}/${totalPeriods} 课时` : "尚未开课",
          lastActive: used ? `09-${String(day).padStart(2, "0")} ${8 + index % 9}:30` : "—",
        };
      });
    });
  }

  function aggregate() {
    const factor = termFactor();
    const schools = selectedSchools().map((school) => ({
      ...school,
      course: school.course.map((value) => value * factor),
      lab: school.lab.map((value) => value * factor),
      quiz: school.quiz.map((value) => value * factor),
    }));
    const sum = (getter) => schools.reduce((total, school) => total + getter(school), 0);
    const courseTotal = sum((s) => s.course[0]);
    const courseDone = sum((s) => s.course[1]);
    const labTotal = sum((s) => s.lab[0]);
    const labDone = sum((s) => s.lab[1]);
    const quizTotal = sum((s) => s.quiz[0]);
    const quizDone = sum((s) => s.quiz[1]);
    const classDetails = buildClassDetails(schools);
    return {
      schools, schoolCount: schools.length, classes: classDetails.length, students: sum((s) => s.students), classDetails,
      usedClasses: classDetails.filter((item) => item.used).length,
      unusedClasses: classDetails.filter((item) => !item.used).length,
      courseTotal, courseDone, labTotal, labDone, quizTotal, quizDone,
    };
  }

  function renderOverview(data) {
    const metrics = [
      ["开通学校数量", data.schoolCount, "所", "var(--db-blue)"],
      ["使用班级数量", data.classes, "个", "var(--db-violet)"],
      ["学生数量", data.students, "人", "var(--db-green)"],
    ];
    $("db-overview").innerHTML = metrics.map(([label, value, unit, color]) =>
      `<div class="db-metric" style="--metric-color:${color}"><span>${label}</span><strong>${format(value)}<small>${unit}</small></strong></div>`
    ).join("");
  }

  function renderSummary(data) {
    const courseRate = percent(data.courseDone, data.courseTotal);
    const courseStats = [
      ["总课时数", data.courseTotal, "课时", "var(--db-yellow)"],
      ["已完成课时数", data.courseDone, "课时", "#69e2ca"],
      ["完成率", courseRate, "%", "#f4b5e3"],
    ].map(([label, value, unit, color]) => `<div class="db-course-stat" style="--stat-color:${color}"><span>${label}</span><strong>${format(value)}<small>${unit}</small></strong></div>`).join("");
    const canViewClassDetails = state.school !== "all";
    const classDetail = (status, label, value, color) => canViewClassDetails
      ? `<button class="db-class-detail" type="button" data-class-status="${status}" style="--detail-color:${color}"><span>${label}</span><strong>${value}</strong><small>查看详情 →</small></button>`
      : `<div class="db-class-detail is-static" style="--detail-color:${color}"><span>${label}</span><strong>${value}</strong><small>选择具体学校后查看</small></div>`;
    $("db-course-stats").innerHTML = `<div class="db-course-primary">${courseStats}</div><div class="db-class-breakdown">
      ${classDetail("used", "使用班级", data.usedClasses, "#69e2ca")}
      ${classDetail("unused", "未使用班级", data.unusedClasses, "var(--db-yellow)")}
    </div>`;

    const labStats = [
      ["总实验数", data.labTotal, "var(--db-blue)"], ["已完成实验数", data.labDone, "#69e2ca"], ["实验完成率", percent(data.labDone, data.labTotal) + "%", "var(--db-violet)"],
      ["测验数", data.quizTotal, "var(--db-yellow)"], ["测验完成数", data.quizDone, "var(--db-yellow)"], ["测验完成率", percent(data.quizDone, data.quizTotal) + "%", "var(--db-violet)"],
    ];
    $("db-lab-stats").innerHTML = labStats.map(([label, value, color]) => `<div class="db-lab-stat" style="--stat-color:${color}"><span>${label}</span><strong>${typeof value === "number" ? format(value) : value}</strong></div>`).join("");
  }

  function lineChart(hostId, series, colors, factor) {
    const host = $(hostId);
    const width = 640, height = 220, left = 38, right = 14, top = 18, bottom = 28;
    const innerW = width - left - right, innerH = height - top - bottom;
    const values = series.flatMap((line) => line).map((v) => Math.max(0, Math.round(v * factor)));
    const max = Math.max(10, ...values) * 1.12;
    const x = (index) => left + index / 13 * innerW;
    const y = (value) => top + innerH - value / max * innerH;
    let svg = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><defs>`;
    colors.forEach((color, index) => { svg += `<linearGradient id="area-${hostId}-${index}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient>`; });
    svg += `</defs>`;
    for (let row = 0; row <= 4; row += 1) {
      const gridY = top + row / 4 * innerH;
      svg += `<line class="chart-grid-line" x1="${left}" y1="${gridY}" x2="${width - right}" y2="${gridY}"/><text class="chart-label" x="2" y="${gridY + 4}">${Math.round(max * (1 - row / 4))}</text>`;
    }
    for (let day = 0; day < 14; day += 1) svg += `<text class="chart-label" x="${x(day)}" y="${height - 7}" text-anchor="middle">${day + 1}</text>`;
    series.forEach((line, lineIndex) => {
      const scaled = line.map((value) => Math.round(value * factor));
      const points = scaled.map((value, index) => `${x(index)},${y(value)}`).join(" ");
      const area = `${x(0)},${top + innerH} ${points} ${x(13)},${top + innerH}`;
      svg += `<polygon class="chart-area" points="${area}" fill="url(#area-${hostId}-${lineIndex})"/><polyline class="chart-line" points="${points}" stroke="${colors[lineIndex]}"/>`;
      scaled.forEach((value, index) => { svg += `<circle class="chart-dot" cx="${x(index)}" cy="${y(value)}" r="3.5" stroke="${colors[lineIndex]}"><title>第${index + 1}天：${value}</title></circle>`; });
    });
    host.innerHTML = svg + "</svg>";
  }

  function renderSchools(data) {
    $("school-result-count").textContent = `共 ${data.schools.length} 所学校`;
    $("db-school-grid").innerHTML = data.schools.map((school) => {
      const groups = [["开课课时（班）", school.course], ["实验（学生）", school.lab], ["测验（学生）", school.quiz]];
      return `<article class="db-school-card"><div class="db-school-head"><h3>${school.name}</h3><span>${format(school.students)} 人 · ${school.classes} 个班</span></div><div class="db-school-metrics">${groups.map(([label, values]) => {
        const rate = percent(values[1], values[0]);
        return `<div class="db-school-group"><span>${label}</span><div class="db-progress"><i style="width:${rate}%"></i></div><div class="db-school-values"><span>总 <b>${format(values[0])}</b></span><span>已完 <b>${format(values[1])}</b></span><span><b>${rate}%</b></span></div></div>`;
      }).join("")}</div></article>`;
    }).join("");
  }

  function refreshSchoolOptions() {
    const schoolSelect = $("filter-school");
    const currentValid = availableSchools().some((school) => school.name === state.school);
    if (!currentValid) state.school = "all";
    schoolSelect.innerHTML = `<option value="all">全部学校</option>${availableSchools().map((school) => `<option value="${school.name}">${school.name}</option>`).join("")}`;
    schoolSelect.value = state.school;
  }

  function render() {
    const data = aggregate();
    const chartFactor = termFactor() * Math.max(.28, data.schoolCount / SCHOOLS.length);
    renderOverview(data);
    renderSummary(data);
    lineChart("course-chart", [COURSE_TREND], ["#ff5474"], chartFactor);
    lineChart("student-chart", [LAB_TREND, QUIZ_TREND], ["#438df2", "#ff8b2c"], chartFactor);
    renderSchools(data);
  }

  function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    $("db-date").textContent = `${year}年${month}月${day}日`;
    $("db-date").dateTime = `${year}-${month}-${day}`;
    $("db-time").textContent = now.toLocaleTimeString("zh-CN", { hour12: false });
    $("db-time").dateTime = now.toISOString();
  }

  const classModal = $("class-modal");
  const classModalClose = $("class-modal-close");
  const classGradeFilter = $("class-grade-filter");
  let classModalTrigger = null;
  let classModalStatus = "used";
  let classModalRows = [];

  function renderClassModalRows() {
    const used = classModalStatus === "used";
    const rows = classGradeFilter.value === "all"
      ? classModalRows
      : classModalRows.filter((item) => item.grade === classGradeFilter.value);
    const school = state.school === "all" ? "当前范围" : state.school;
    $("class-modal-subtitle").textContent = `${school} · ${classGradeFilter.value === "all" ? "全部年级" : classGradeFilter.value} · 共 ${rows.length} 个${used ? "已使用" : "未使用"}班级`;
    $("class-modal-body").innerHTML = rows.map((item) => `<tr>
      <td>${item.school}</td><td>${item.name}</td><td>${item.teacher}</td><td>${item.students} 人</td><td>${item.progress}</td><td>${item.lastActive}</td>
      <td><span class="db-class-status ${used ? "" : "unused"}">${used ? "使用中" : "未使用"}</span></td>
    </tr>`).join("");
  }

  function openClassModal(status, trigger) {
    if (state.school === "all") return;
    const used = status === "used";
    classModalStatus = status;
    classModalRows = aggregate().classDetails.filter((item) => item.used === used);
    classModalTrigger = trigger;
    $("class-modal-title").textContent = used ? "使用班级详情" : "未使用班级详情";
    const grades = GRADES.filter((grade) => classModalRows.some((item) => item.grade === grade));
    classGradeFilter.innerHTML = `<option value="all">全部年级</option>${grades.map((grade) => `<option value="${grade}">${grade}</option>`).join("")}`;
    classGradeFilter.value = "all";
    renderClassModalRows();
    classModal.hidden = false;
    document.body.classList.add("db-modal-open");
    classModalClose.focus();
  }

  function closeClassModal() {
    if (classModal.hidden) return;
    classModal.hidden = true;
    document.body.classList.remove("db-modal-open");
    if (classModalTrigger) classModalTrigger.focus();
    classModalTrigger = null;
  }

  const regionSelect = $("filter-region");
  regionSelect.innerHTML += REGIONS.map((region) => `<option value="${region}">${region}</option>`).join("");
  regionSelect.addEventListener("change", () => { state.region = regionSelect.value; refreshSchoolOptions(); render(); });
  $("filter-term").addEventListener("change", (event) => { state.term = event.target.value; render(); });
  $("filter-school").addEventListener("change", (event) => { state.school = event.target.value; render(); });
  $("filter-reset").addEventListener("click", () => {
    state.region = state.term = state.school = "all";
    regionSelect.value = "all";
    $("filter-term").value = "all";
    refreshSchoolOptions();
    render();
  });
  $("db-course-stats").addEventListener("click", (event) => {
    const button = event.target.closest("[data-class-status]");
    if (button) openClassModal(button.dataset.classStatus, button);
  });
  classModalClose.addEventListener("click", closeClassModal);
  classGradeFilter.addEventListener("change", renderClassModalRows);
  classModal.addEventListener("click", (event) => { if (event.target === classModal) closeClassModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeClassModal(); });
  $("db-logout").addEventListener("click", () => {
    sessionStorage.removeItem("ai_dashboard_authenticated");
    location.replace("dashboard-login.html");
  });

  refreshSchoolOptions();
  render();
  updateClock();
  window.setInterval(updateClock, 1000);
})();
