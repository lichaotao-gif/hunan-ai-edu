(function () {
  // 未登录则跳转回登录页
  const userRaw = localStorage.getItem("hndj_user");
  if (!userRaw) {
    window.location.href = "login.html";
    return;
  }
  try {
    const user = JSON.parse(userRaw);
    if (user && user.name) {
      const initial = user.name.charAt(0);
      const h = new Date().getHours();
      const greeting = h < 6 ? "凌晨好" : h < 12 ? "早上好" : h < 14 ? "中午好" : h < 18 ? "下午好" : "晚上好";
      document.getElementById("sidebar-greet").textContent = `${greeting}，${user.name}`;
      document.getElementById("sidebar-avatar").textContent = initial;
      document.getElementById("topbar-av").textContent = initial;
      document.getElementById("topbar-name").textContent = user.name;
    }
  } catch (e) { /* ignore */ }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  const sidebar = document.getElementById("sidebar");
  const sidebarMask = document.getElementById("sidebar-mask");

  function setSidebarOpen(isOpen) {
    sidebar.classList.toggle("open", isOpen);
    if (sidebarMask) sidebarMask.classList.toggle("show", isOpen);
  }

  if (sidebarMask) sidebarMask.addEventListener("click", () => setSidebarOpen(false));

  // 菜单切换
  const menuItems = document.querySelectorAll(".menu-item[data-target]");
  const sections = document.querySelectorAll(".content-section");

  function activate(target) {
    sections.forEach((s) => s.classList.remove("active"));
    const sec = document.getElementById("sec-" + target);
    if (sec) sec.classList.add("active");
    menuItems.forEach((m) => m.classList.remove("active"));
    const item = document.querySelector(`.menu-item[data-target="${target}"]`);
    if (item) item.classList.add("active");
  }

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      activate(item.dataset.target);
      // 切换菜单时回到各自的一级列表
      showDtList();
      showLabList();
      if (typeof showResearchList === "function") showResearchList();
      if (typeof showMcHome === "function") showMcHome();
      if (typeof showMyexpList === "function") showMyexpList();
      if (typeof showGuideList === "function") showGuideList();
      if (item.dataset.target === "my-data" && typeof renderDataSection === "function") renderDataSection();
      setSidebarOpen(false);
    });
  });

  // ===== 双师AI课：科目 -> 科目详情 下钻 =====
  const IMG = "assets/img/";
  // 读本（教材封面，按年级），各科目通用
  const books = [
    { label: "四年级 上册", img: IMG + "ai-book-grade-4.png", accent: "#22C55E", isbn: "978-7-5727-1881-6", cip: "2025BQ9246" },
    { label: "五年级 上册", img: IMG + "ai-book-grade-5.png", accent: "#06B6D4", isbn: "978-7-5727-1882-3", cip: "2025BQ9247" },
    { label: "六年级 上册", img: IMG + "ai-book-grade-6.png", accent: "#F97316", isbn: "978-7-5727-1883-0", cip: "2025BQ9248" },
    { label: "七年级 上册", img: IMG + "ai-book-grade-7.png", accent: "#8B5CF6", isbn: "978-7-5727-1884-7", cip: "2025BQ9249" },
    { label: "八年级 上册", img: IMG + "ai-book-grade-8.png", accent: "#EC4899", isbn: "978-7-5727-1885-4", cip: "2025BQ9250" },
    { label: "九年级 上册", img: IMG + "ai-book-grade-9.png", accent: "#F59E0B", isbn: "978-7-5727-1886-1", cip: "2025BQ9251" },
  ];
  const introText =
    "<p>本套丛书依据《教育部办公厅关于加强中小学人工智能教育的通知》，围绕“感知、表征与推理、机器学习、自然交互、人工智能与社会”五个大概念，循序渐进地开展教学活动。同时，配备丰富的实验资源和教学活动，提升学生对人工智能课程的兴趣。</p>" +
    "<p>本套丛书深入剖析人工智能的核心理论与方法，并将其巧妙转化为适合教育场景的内容。特别针对低年龄段的学习者，设计了“不插电”的人工智能课程，通过直观、趣味的方式引导学生理解人工智能的基本概念，真正做到让复杂的人工智能知识变得通俗易懂。</p>";

  const courses = {
    spring: {
      title: "人工智能 · 下册",
      desc: introText,
      coverImg: IMG + "ai-course-spring-redesign.png",
      lessons: [
        { name: "人工智能（四下）", periods: "10课时", validity: "2026.02.24-2031.03.24", desc: "面向四年级学生，从生活中的传感器和智能现象出发，建立对人工智能感知能力的初步理解。", img: IMG + "ai-book-grade-4.png" },
        { name: "人工智能（五下）", periods: "10课时", validity: "2026.02.24-2031.03.24", desc: "围绕图像识别与分类任务展开，帮助学生理解机器如何通过样本观察世界。", img: IMG + "ai-book-grade-5.png" },
        { name: "人工智能（六下）", periods: "10课时", validity: "2026.02.24-2031.03.24", desc: "通过机器人项目和程序流程，让学生体验算法、传感器与执行机构的协同。", img: IMG + "ai-book-grade-6.png" },
        { name: "人工智能（七下）", periods: "12课时", validity: "2026.02.24-2031.03.24", desc: "以数据分类和模型训练为主线，理解机器学习的基本过程与评价方法。", img: IMG + "ai-book-grade-7.png" },
        { name: "人工智能（八下）", periods: "12课时", validity: "2026.02.24-2031.03.24", desc: "体验自然语言交互与生成式 AI，学习提示设计、表达边界与内容判断。", img: IMG + "ai-book-grade-8.png" },
        { name: "人工智能（九下）", periods: "12课时", validity: "2026.02.24-2031.03.24", desc: "聚焦人工智能应用、伦理与社会责任，引导学生完成综合实践项目。", img: IMG + "ai-book-grade-9.png" },
      ],
    },
    autumn: {
      title: "人工智能 · 上册",
      desc: introText,
      coverImg: IMG + "ai-course-autumn-redesign.png",
      lessons: [
        { name: "人工智能（四上）", periods: "10课时", validity: "2026.09.01-2031.03.24", desc: "认识校园和生活中的人工智能，学习用观察、分类和表达描述智能系统。", img: IMG + "ai-book-grade-4.png" },
        { name: "人工智能（五上）", periods: "10课时", validity: "2026.09.01-2031.03.24", desc: "从图像、声音和简单数据入手，体验机器识别任务的完整流程。", img: IMG + "ai-book-grade-5.png" },
        { name: "人工智能（六上）", periods: "10课时", validity: "2026.09.01-2031.03.24", desc: "围绕机器人与自动控制开展实践，学习把问题拆解为可执行步骤。", img: IMG + "ai-book-grade-6.png" },
        { name: "人工智能（七上）", periods: "12课时", validity: "2026.09.01-2031.03.24", desc: "理解数据、特征和模型之间的关系，完成一个入门级机器学习实验。", img: IMG + "ai-book-grade-7.png" },
        { name: "人工智能（八上）", periods: "12课时", validity: "2026.09.01-2031.03.24", desc: "探索人机对话、语音识别和生成式内容，建立负责任使用 AI 的意识。", img: IMG + "ai-book-grade-8.png" },
        { name: "人工智能（九上）", periods: "12课时", validity: "2026.09.01-2031.03.24", desc: "结合真实应用场景分析 AI 的价值、风险与治理，形成综合项目方案。", img: IMG + "ai-book-grade-9.png" },
      ],
    },
  };

  const dtList = document.getElementById("dt-list");
  const dtDetail = document.getElementById("dt-detail");
  const dtLessonDetail = document.getElementById("dt-lesson-detail");
  const dtBooks = document.getElementById("dt-books");
  const dtLessons = document.getElementById("dt-lessons");
  const bookModal = document.getElementById("book-modal");
  const bookModalClose = document.getElementById("book-modal-close");
  const classModal = document.getElementById("class-modal");
  const classModalClose = document.getElementById("class-modal-close");
  const classListEl = document.getElementById("class-list");
  const classEmptyEl = document.getElementById("class-empty");
  const classActionsEl = document.getElementById("class-modal-actions");
  // ===== 班级 & 学校：本地存储数据层 =====
  const SCHOOL_KEY = "hndj_school";
  const CLASS_KEY = "hndj_classes";

  // 当前登录老师姓名（用作新班级的默认管理教师）
  let currentTeacher = "老师";
  try {
    const u = JSON.parse(localStorage.getItem("hndj_user") || "{}");
    if (u && u.name) currentTeacher = u.name;
  } catch (e) { /* ignore */ }

  // 可选学校列表（演示数据，可搜索）
  const SCHOOLS = [
    "长沙市第一中学", "长沙市雅礼中学", "长沙市长郡中学", "湖南师范大学附属中学",
    "长沙市明德中学", "长沙市周南中学", "长沙市第十一中学", "长沙市实验小学",
    "长沙市砂子塘小学", "长沙市枫树山小学", "长沙市育英小学", "长沙市清水塘小学",
    "株洲市第二中学", "湘潭市第一中学", "岳阳市第一中学", "常德市第一中学",
  ];

  function loadSchool() { return localStorage.getItem(SCHOOL_KEY) || ""; }
  function saveSchool(name) { localStorage.setItem(SCHOOL_KEY, name); }

  function loadClasses() {
    try {
      const raw = localStorage.getItem(CLASS_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        arr.forEach((c) => { // 兼容旧数据
          if (!Array.isArray(c.courses)) c.courses = [];
          c.courses.forEach((co) => {
            if (!co.plan || typeof co.plan !== "object") co.plan = { on: false, days: [] };
            if (!Array.isArray(co.plan.days)) co.plan.days = [];
          });
        });
        return arr;
      }
    } catch (e) { /* ignore */ }
    // 首次种子数据
    const seed = [
      { id: "cls-1", name: "四年级(6)班", type: "行政班", teacher: currentTeacher, students: 0, intro: "", createdAt: new Date("2023-03-07T14:28:00").getTime(), courses: [
        { id: "co-1", package: "人工智能（四下）", plan: { on: true, days: ["每周二"] } },
        { id: "co-2", package: "人工智能（五下）", plan: { on: true, days: ["每周四"] } },
        { id: "co-3", package: "体验课", plan: { on: false, days: [] } },
      ] },
      { id: "cls-2", name: "萃雅·7班", type: "兴趣班", teacher: currentTeacher, students: 3, intro: "校级人工智能兴趣社团，面向四至六年级招募。", createdAt: new Date("2022-03-25T10:37:00").getTime(), courses: [
        { id: "co-4", package: "人工智能（八下）", plan: { on: true, days: ["每周三"] } },
      ] },
    ];
    localStorage.setItem(CLASS_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveClasses() { localStorage.setItem(CLASS_KEY, JSON.stringify(classStore)); }

  let classStore = loadClasses();
  let activeCourseKey = "autumn";
  let activeLessonName = "";
  let selectedClassId = classStore[0] && classStore[0].id;

  function showDtList() {
    dtDetail.classList.remove("active");
    dtLessonDetail.classList.remove("active");
    dtList.classList.add("active");
  }

  function showDtDetail() {
    dtList.classList.remove("active");
    dtLessonDetail.classList.remove("active");
    dtDetail.classList.add("active");
    document.querySelector(".content").scrollTop = 0;
  }

  function getGrade(label) {
    const match = label.match(/[四五六七八九]年级|[四五六七八九]/);
    if (!match) return "四年级";
    return match[0].includes("年级") ? match[0] : `${match[0]}年级`;
  }

  function getOutlineForLesson(lesson) {
    const grade = getGrade(lesson.name);
    const base = [
      ["什么是人工智能？", `能从家庭、学校、公共场合中列举至少3个常见 AI 应用，理解人工智能帮助机器完成感知、判断与行动的基本方式。`],
      ["AI 如何感知世界", `通过图像、声音、传感器等案例，认识数据采集与特征观察，知道机器需要清晰、有效的信息输入。`],
      ["把任务拆成步骤", `理解复杂任务需要拆解为有顺序的小步骤，能用流程图或自然语言描述一个 AI 任务。`],
      ["训练一个小模型", `体验样本、特征、分类和反馈的关系，理解模型表现会受到数据质量和数量影响。`],
      ["让 AI 完成项目", `围绕 ${grade} 学习主题完成一个小型 AI 应用设计，说明使用场景、操作流程与改进方向。`],
      ["负责任地使用 AI", `讨论 AI 在学习和生活中的价值与边界，形成安全、真实、尊重隐私的使用意识。`],
    ];

    if (lesson.name.includes("八")) {
      base[3] = ["和 AI 对话", "体验自然语言交互与提示表达，理解清晰的问题、背景和约束能帮助 AI 生成更合适的结果。"];
    }
    if (lesson.name.includes("九")) {
      base[4] = ["AI 应用与社会", "围绕医疗、交通、环境或教育场景分析 AI 的价值、风险与治理，形成综合实践方案。"];
    }
    return base;
  }

  const outlineImages = [
    IMG + "ai-classroom-students.jpg",
    IMG + "online-lab-interface.jpg",
    IMG + "robotics-kit.jpg",
    IMG + "computer-vision-experiment.jpg",
    IMG + "machine-learning-classroom.jpg",
    IMG + "teacher-training.jpg",
  ];

  function openLesson(index) {
    const course = courses[activeCourseKey];
    const lesson = course && course.lessons[index];
    if (!lesson) return;

    document.getElementById("lesson-hero-cover").innerHTML = `<img src="${lesson.img}" alt="${lesson.name}">`;
    document.getElementById("lesson-hero-title").textContent = lesson.name;
    document.getElementById("lesson-hero-name").textContent = lesson.name;
    document.getElementById("lesson-hero-periods").textContent = lesson.periods;
    document.getElementById("lesson-hero-grade").textContent = getGrade(lesson.name);

    document.getElementById("lesson-outline").innerHTML = getOutlineForLesson(lesson).map((item, idx) => {
      const [title, goal] = item;
      const image = outlineImages[idx] || lesson.img;
      const action = '<div class="outline-actions"><button>去上课</button><button>备课</button></div>';
      return `<article class="outline-item">
        <div class="outline-thumb"><img src="${image}" alt="${title}"></div>
        <div class="outline-main">
          <h3>第${["一", "二", "三", "四", "五", "六"][idx]}课《${title}》</h3>
          <p><b>知识目标：</b><br>${idx + 1}. ${goal}<br>${idx + 2}. 能结合课堂活动完成观察、表达、记录或展示任务。</p>
        </div>
        ${action}
      </article>`;
    }).join("");

    dtList.classList.remove("active");
    dtDetail.classList.remove("active");
    dtLessonDetail.classList.add("active");
    document.querySelector(".content").scrollTop = 0;
    activeLessonName = lesson.name;
  }

  function openClassModal() {
    document.getElementById("class-modal-course").textContent =
      activeLessonName ? `将 ${activeLessonName} 添加到班级` : "请选择要添加到的班级";
    if (classStore.length === 0) {
      classListEl.innerHTML = "";
      classListEl.hidden = true;
      classActionsEl.hidden = true;
      classEmptyEl.hidden = false;
    } else {
      classListEl.hidden = false;
      classActionsEl.hidden = false;
      classEmptyEl.hidden = true;
      classListEl.innerHTML = classStore.map((item) => `
        <label class="class-option">
          <input type="radio" name="target-class" value="${item.id}" ${item.id === selectedClassId ? "checked" : ""}>
          <span class="class-option-main">
            <b>${item.name}</b>
            <small>${item.students}名学生</small>
          </span>
        </label>`).join("");
    }
    classModal.hidden = false;
    document.body.classList.add("modal-open");
    classModalClose.focus();
  }

  function closeClassModal() {
    classModal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function openBookInfo(index) {
    const book = books[index];
    if (!book) return;
    document.getElementById("book-modal-cover").innerHTML = `
      <div class="modal-book-art" style="--book-accent:${book.accent}">
        <img src="${book.img}" alt="人工智能 ${book.label}">
        <div class="book-cover-text">
          <span class="bk-name">人工智能</span>
          <span class="bk-sub">${book.label}</span>
        </div>
      </div>`;
    document.getElementById("book-modal-grade").textContent = book.label;
    document.getElementById("book-modal-publisher").textContent = "四川科学技术出版社";
    document.getElementById("book-modal-issuer").textContent = "新华文轩出版传媒股份有限公司";
    document.getElementById("book-modal-isbn").textContent = book.isbn;
    document.getElementById("book-modal-cip").textContent = book.cip;
    bookModal.hidden = false;
    document.body.classList.add("modal-open");
    bookModalClose.focus();
  }

  function closeBookInfo() {
    bookModal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function openCourse(key) {
    const c = courses[key];
    if (!c) return;
    activeCourseKey = key;
    document.getElementById("dt-title").textContent = c.title;
    document.getElementById("dt-desc").innerHTML = c.desc;
    document.getElementById("dt-cover").innerHTML =
      `<img src="${c.coverImg}" alt="${c.title}">`;

    dtBooks.innerHTML = books.map((b, idx) => `
      <div class="book-item" data-book-index="${idx}" role="button" tabindex="0" aria-label="查看${b.label}图书信息">
        <div class="book-cover book-cover-art" style="--book-accent:${b.accent}">
          <img src="${b.img}" alt="人工智能 ${b.label}">
          <div class="book-cover-text">
            <span class="bk-name">人工智能</span>
            <span class="bk-sub">${b.label}</span>
          </div>
        </div>
        <span class="book-label">${b.label}</span>
      </div>`).join("");

    dtLessons.innerHTML = c.lessons.map((l, idx) => {
      const validity = l.validity === "off"
        ? '有效期：<span class="off">未开通</span>'
        : `有效期：<b>${l.validity}</b>`;
      return `<article class="lesson-card" data-lesson-index="${idx}" role="button" tabindex="0" aria-label="进入${l.name}课程包详情">
        <div class="lesson-cover">
          <img src="${l.img}" alt="${l.name}">
          <div class="lesson-periods">${l.periods}</div>
        </div>
        <div class="lesson-info">
          <h4>${l.name}</h4>
          <div class="lesson-validity">${validity}</div>
          <div class="desc">${l.desc}</div>
        </div>
      </article>`;
    }).join("");

    dtList.classList.remove("active");
    dtLessonDetail.classList.remove("active");
    dtDetail.classList.add("active");
    document.querySelector(".content").scrollTop = 0;
  }

  document.querySelectorAll(".course-card").forEach((card) => {
    card.addEventListener("click", () => openCourse(card.dataset.course));
  });
  document.getElementById("dt-back").addEventListener("click", showDtList);
  document.getElementById("lesson-back").addEventListener("click", showDtDetail);
  dtLessons.addEventListener("click", (event) => {
    const card = event.target.closest(".lesson-card");
    if (!card) return;
    openLesson(Number(card.dataset.lessonIndex));
  });
  dtLessons.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".lesson-card");
    if (!card) return;
    event.preventDefault();
    openLesson(Number(card.dataset.lessonIndex));
  });
  dtBooks.addEventListener("click", (event) => {
    const item = event.target.closest(".book-item");
    if (!item) return;
    openBookInfo(Number(item.dataset.bookIndex));
  });
  dtBooks.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const item = event.target.closest(".book-item");
    if (!item) return;
    event.preventDefault();
    openBookInfo(Number(item.dataset.bookIndex));
  });
  bookModalClose.addEventListener("click", closeBookInfo);
  bookModal.addEventListener("click", (event) => {
    if (event.target === bookModal) closeBookInfo();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !bookModal.hidden) closeBookInfo();
    if (event.key === "Escape" && !classModal.hidden) closeClassModal();
  });
  classListEl.addEventListener("change", (event) => {
    if (event.target.name === "target-class") selectedClassId = event.target.value;
  });
  classModalClose.addEventListener("click", closeClassModal);
  classModal.addEventListener("click", (event) => {
    if (event.target === classModal) closeClassModal();
  });
  document.getElementById("confirm-add-course").addEventListener("click", () => {
    const selected = classStore.find((item) => item.id === selectedClassId);
    if (!selected) { showToast("请选择班级"); return; }
    if (!Array.isArray(selected.courses)) selected.courses = [];
    if (activeLessonName && !selected.courses.some((co) => co.package === activeLessonName)) {
      selected.courses.push({ id: "co-" + Date.now(), package: activeLessonName, plan: { on: false, days: [] } });
      saveClasses();
      renderClassTable();
      if (typeof refreshMcClasses === "function") refreshMcClasses();
      if (typeof renderOnboard === "function") renderOnboard();
    }
    showToast(`已添加到${selected.name}`);
    closeClassModal();
  });
  document.getElementById("create-class-btn").addEventListener("click", () => {
    closeClassModal();
    openClassForm();
  });
  document.getElementById("create-class-empty").addEventListener("click", () => {
    closeClassModal();
    openClassForm();
  });

  // ===== 班级管理：学校绑定 + 班级列表 =====
  const schoolBanner = document.getElementById("school-banner");
  const classTableBody = document.getElementById("class-table-body");
  const classTableEmpty = document.getElementById("class-table-empty");

  const ICON_SCHOOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V8l7-4 7 4v13"/><path d="M9 21v-6h6v6"/></svg>';
  const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>';
  const ICON_PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  const ICON_QR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><line x1="14" y1="14.5" x2="14" y2="21"/><line x1="17.5" y1="14" x2="17.5" y2="17.5"/><line x1="21" y1="14" x2="21" y2="21"/><line x1="17.5" y1="21" x2="21" y2="21"/></svg>';
  const ICON_USERS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  const ICON_BOOK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function fmtDate(ts) {
    const d = new Date(ts);
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  function renderSchoolBanner() {
    const school = loadSchool();
    if (school) {
      schoolBanner.className = "school-banner bound";
      schoolBanner.innerHTML =
        `<div class="sb-icon">${ICON_SCHOOL}</div>` +
        `<div class="sb-text"><span class="sb-name">${esc(school)}</span>` +
        `<span class="sb-badge">${ICON_CHECK}已绑定</span></div>` +
        `<div class="sb-action"><button class="ghost-btn" id="change-school-btn" type="button">修改学校</button></div>`;
      document.getElementById("change-school-btn").addEventListener("click", openSchoolModal);
    } else {
      schoolBanner.className = "school-banner unbound";
      schoolBanner.innerHTML =
        `<div class="sb-icon">${ICON_SCHOOL}</div>` +
        `<div class="sb-text"><span class="sb-name">尚未绑定学校</span>` +
        `<span class="sb-sub">绑定学校后才能创建班级</span></div>` +
        `<div class="sb-action"><button class="solid-btn" id="bind-school-btn" type="button">${ICON_PLUS}绑定学校</button></div>`;
      document.getElementById("bind-school-btn").addEventListener("click", openSchoolModal);
    }
  }

  function renderClassTable() {
    if (classStore.length === 0) {
      classTableBody.innerHTML = "";
      classTableEmpty.hidden = false;
      return;
    }
    classTableEmpty.hidden = true;
    classTableBody.innerHTML = classStore.map((c) => {
      const typeClass = c.type === "兴趣班" ? "type-tag fun" : "type-tag";
      const stu = c.students > 0
        ? `<div class="stu-cell"><span class="stu-count">${c.students}人</span><a class="link act" data-import="${c.id}">导入学生</a></div>`
        : `<div class="stu-cell"><a class="link act" data-import="${c.id}">导入学生</a></div>`;
      const courses = c.courses || [];
      const courseCell = `<div class="course-cell-actions"><a class="link" data-courses="${c.id}">共 ${courses.length} 门课 ›</a><button class="course-add-btn" data-addcourse="${c.id}" type="button">${ICON_PLUS}添加</button></div>`;
      return `<tr>
        <td><span class="cell-name">${esc(c.name)}<button class="qr-btn" data-qr="${c.id}" title="班级二维码" aria-label="班级二维码">${ICON_QR}</button></span></td>
        <td><span class="${typeClass}">${esc(c.type)}</span></td>
        <td>${stu}</td>
        <td>${courseCell}</td>
        <td><a class="link" data-intro="${c.id}">介绍</a></td>
        <td>${fmtDate(c.createdAt)}</td>
        <td><div class="row-actions"><a class="link act" data-edit="${c.id}">编辑班级</a><a class="act del" data-del="${c.id}">删除班级</a></div></td>
      </tr>`;
    }).join("");
  }

  classTableBody.addEventListener("click", (e) => {
    const t = e.target.closest("[data-edit],[data-del],[data-intro],[data-import],[data-qr],[data-courses],[data-addcourse]");
    if (!t) return;
    if (t.dataset.edit) openClassForm(t.dataset.edit);
    else if (t.dataset.del) deleteClass(t.dataset.del);
    else if (t.dataset.intro) openInfoModal(t.dataset.intro);
    else if (t.dataset.courses) openCourseModal(t.dataset.courses);
    else if (t.dataset.addcourse) openCourseModal(t.dataset.addcourse);
    else if (t.dataset.import) openImportModal(t.dataset.import);
    else if (t.dataset.qr) openQrModal(t.dataset.qr);
  });

  document.getElementById("create-class-trigger").addEventListener("click", () => openClassForm());

  // --- 绑定学校弹窗 ---
  const schoolModal = document.getElementById("school-modal");
  const schoolSearchInput = document.getElementById("school-search-input");
  const schoolListEl = document.getElementById("school-list");
  const schoolCountEl = document.getElementById("school-count");
  const spProvince = document.getElementById("school-province");
  const spCity = document.getElementById("school-city");
  const spDistrict = document.getElementById("school-district");
  let schoolSelection = "";
  // 区域筛选状态：空字符串代表"全部"
  const schoolScope = { city: "", district: "" };

  // 区域树与大屏共用 js/bigscreen-data.js；未加载时降级为平铺学校列表
  const REGION_DATA = window.BigScreenData || null;
  const REGION_PROVINCE = REGION_DATA ? REGION_DATA.PROVINCE : "湖南省";

  // 按当前区域返回 [{school, city, district}]
  function schoolsInScope() {
    if (REGION_DATA) return REGION_DATA.allSchoolsUnder(REGION_PROVINCE, schoolScope.city, schoolScope.district);
    return SCHOOLS.map((s) => ({ school: s, city: "", district: "" }));
  }

  function fillSelect(sel, items, allLabel, value) {
    sel.innerHTML = `<option value="">${allLabel}</option>` +
      items.map((n) => `<option value="${esc(n)}">${esc(n)}</option>`).join("");
    sel.value = value || "";
  }

  function renderSchoolRegionSelects() {
    if (!REGION_DATA) { spProvince.closest(".school-region").hidden = true; return; }
    fillSelect(spProvince, [REGION_PROVINCE], "全部省份", REGION_PROVINCE);
    fillSelect(spCity, REGION_DATA.REGION_TREE.map((c) => c.name), "全部市", schoolScope.city);
    const city = REGION_DATA.REGION_TREE.find((c) => c.name === schoolScope.city);
    fillSelect(spDistrict, city ? city.districts.map((d) => d.name) : [], "全部区/县", schoolScope.district);
    spDistrict.disabled = !city;
  }

  function renderSchoolOptions(filter) {
    const kw = (filter || "").trim();
    let list = schoolsInScope();
    if (kw) list = list.filter((s) => s.school.includes(kw));
    schoolCountEl.textContent = list.length
      ? `共 ${list.length} 所学校${kw ? "（已按关键词过滤）" : ""}`
      : "";
    if (list.length === 0) {
      schoolListEl.innerHTML = '<div class="school-empty">该区域下未找到匹配的学校，请调整区域或关键词</div>';
      return;
    }
    schoolListEl.innerHTML = list.map((s) => {
      const area = s.city ? `${esc(s.city)} · ${esc(s.district)}` : "";
      return `<label class="school-option"><input type="radio" name="school-pick" value="${esc(s.school)}" ${s.school === schoolSelection ? "checked" : ""}>` +
        `<span class="school-option-text"><b>${esc(s.school)}</b>${area ? `<i>${area}</i>` : ""}</span></label>`;
    }).join("");
  }

  // 已绑定学校时，回填其所属市/区，便于用户就近调整
  function scopeFromSchool(name) {
    if (!REGION_DATA || !name) return { city: "", district: "" };
    const hit = REGION_DATA.allSchoolsUnder(REGION_PROVINCE, "", "").find((s) => s.school === name);
    return hit ? { city: hit.city, district: hit.district } : { city: "", district: "" };
  }

  function openSchoolModal() {
    schoolSelection = loadSchool();
    const from = scopeFromSchool(schoolSelection);
    schoolScope.city = from.city;
    schoolScope.district = from.district;
    schoolSearchInput.value = "";
    renderSchoolRegionSelects();
    renderSchoolOptions("");
    schoolModal.hidden = false;
    document.body.classList.add("modal-open");
    schoolSearchInput.focus();
  }
  function closeSchoolModal() {
    schoolModal.hidden = true;
    document.body.classList.remove("modal-open");
  }
  schoolSearchInput.addEventListener("input", () => renderSchoolOptions(schoolSearchInput.value));
  spCity.addEventListener("change", () => {
    schoolScope.city = spCity.value;
    schoolScope.district = "";       // 切换市后重置区/县
    renderSchoolRegionSelects();
    renderSchoolOptions(schoolSearchInput.value);
  });
  spDistrict.addEventListener("change", () => {
    schoolScope.district = spDistrict.value;
    renderSchoolOptions(schoolSearchInput.value);
  });
  schoolListEl.addEventListener("change", (e) => {
    if (e.target.name === "school-pick") schoolSelection = e.target.value;
  });
  document.getElementById("school-modal-close").addEventListener("click", closeSchoolModal);
  document.getElementById("school-cancel").addEventListener("click", closeSchoolModal);
  schoolModal.addEventListener("click", (e) => { if (e.target === schoolModal) closeSchoolModal(); });
  document.getElementById("school-confirm").addEventListener("click", () => {
    if (!schoolSelection) { showToast("请选择学校"); return; }
    saveSchool(schoolSelection);
    renderSchoolBanner();
    renderProfileSchool();
    if (typeof refreshMcClasses === "function") refreshMcClasses();
    if (typeof renderOnboard === "function") renderOnboard();
    closeSchoolModal();
    showToast("已绑定 " + schoolSelection);
  });

  // --- 创建 / 编辑班级弹窗 ---
  const classFormModal = document.getElementById("class-form-modal");
  const cfName = document.getElementById("cf-name");
  const cfType = document.getElementById("cf-type");
  const cfIntro = document.getElementById("cf-intro");
  const cfTitle = document.getElementById("class-form-title");
  const cfSchool = document.getElementById("class-form-school");
  const cfConfirm = document.getElementById("class-form-confirm");
  const cfGrade = document.getElementById("cf-grade");
  const cfClassNo = document.getElementById("cf-classno");
  const cfGradeField = document.getElementById("cf-grade-field");
  const cfClassNoField = document.getElementById("cf-classno-field");
  const cfNameField = document.getElementById("cf-name-field");
  let editingClassId = null;

  // 年级选项：1-6 年级（2025↓）、7-9 年级（2025↓），值为年级名、显示带入学年份
  const GRADES = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "七年级", "八年级", "九年级"];
  cfGrade.innerHTML = '<option value="">请选择</option>' + GRADES.map((g, i) => {
    const year = i < 6 ? 2025 - i : 2025 - (i - 6);
    return `<option value="${g}">${g}${year}</option>`;
  }).join("");
  cfClassNo.innerHTML = '<option value="">请选择</option>' + Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}">${i + 1}班</option>`).join("");

  // 按类型切换字段：行政班=年级+班级，兴趣班=自定义名称
  function applyTypeFields() {
    const isAdmin = cfType.value === "行政班";
    cfGradeField.hidden = !isAdmin;
    cfClassNoField.hidden = !isAdmin;
    cfNameField.hidden = isAdmin;
  }
  cfType.addEventListener("change", applyTypeFields);

  function openClassForm(id) {
    const school = loadSchool();
    if (!school) {
      showToast("请先绑定学校");
      openSchoolModal();
      return;
    }
    editingClassId = id || null;
    cfSchool.textContent = "所属学校：" + school;
    cfGrade.value = "";
    cfClassNo.value = "";
    cfName.value = "";
    if (editingClassId) {
      const c = classStore.find((x) => x.id === editingClassId);
      if (!c) return;
      cfTitle.textContent = "编辑班级";
      cfConfirm.textContent = "保存修改";
      cfType.value = c.type;
      cfIntro.value = c.intro || "";
      if (c.type === "行政班") {
        const m = c.name.match(/^(.+?年级)[（(](\d+)[)）]班$/);
        if (m) { cfGrade.value = m[1]; cfClassNo.value = m[2]; }
      } else {
        cfName.value = c.name;
      }
    } else {
      cfTitle.textContent = "创建班级";
      cfConfirm.textContent = "确认创建";
      cfType.value = "行政班";
      cfIntro.value = "";
    }
    applyTypeFields();
    classFormModal.hidden = false;
    document.body.classList.add("modal-open");
  }
  function closeClassForm() {
    classFormModal.hidden = true;
    document.body.classList.remove("modal-open");
  }
  cfConfirm.addEventListener("click", () => {
    const type = cfType.value;
    let name;
    if (type === "行政班") {
      if (!cfGrade.value) { showToast("请选择年级"); return; }
      if (!cfClassNo.value) { showToast("请选择班级"); return; }
      name = `${cfGrade.value}(${cfClassNo.value})班`;
    } else {
      name = cfName.value.trim();
      if (!name) { showToast("请输入班级名称"); cfName.focus(); return; }
    }
    if (editingClassId) {
      const c = classStore.find((x) => x.id === editingClassId);
      if (c) { c.name = name; c.type = type; c.intro = cfIntro.value.trim(); }
      saveClasses();
      renderClassTable();
      closeClassForm();
      showToast("已保存");
      return;
    }
    // 创建班级
    const newId = "cls-" + Date.now();
    classStore.unshift({
      id: newId,
      name, type: cfType.value, teacher: currentTeacher,
      students: 0, intro: cfIntro.value.trim(), createdAt: Date.now(), courses: [],
    });
    if (!selectedClassId) selectedClassId = newId;
    saveClasses();
    renderClassTable();
    if (typeof refreshMcClasses === "function") refreshMcClasses();
    if (typeof renderOnboard === "function") renderOnboard();
    closeClassForm();
    showToast("班级已创建，请为班级添加课程");
    // 引导：创建后直接打开该班级的课程弹窗去选课程
    openCourseModal(newId);
  });
  document.getElementById("class-form-close").addEventListener("click", closeClassForm);
  document.getElementById("class-form-cancel").addEventListener("click", closeClassForm);
  classFormModal.addEventListener("click", (e) => { if (e.target === classFormModal) closeClassForm(); });

  function deleteClass(id) {
    const c = classStore.find((x) => x.id === id);
    if (!c) return;
    openConfirm(`确定删除班级「${c.name}」吗？删除后该班级的课程与学生数据将一并移除，且不可恢复。`, () => {
      classStore = classStore.filter((x) => x.id !== id);
      if (selectedClassId === id) selectedClassId = classStore[0] && classStore[0].id;
      saveClasses();
      renderClassTable();
      if (typeof refreshMcClasses === "function") refreshMcClasses();
      showToast("已删除班级");
    }, "确定删除");
  }

  // --- 班级介绍查看弹窗 ---
  const infoModal = document.getElementById("info-modal");
  function openInfoModal(id) {
    const c = classStore.find((x) => x.id === id);
    if (!c) return;
    document.getElementById("info-modal-title").textContent = c.name + " · 班级介绍";
    document.getElementById("info-modal-body").textContent =
      c.intro && c.intro.trim() ? c.intro : "暂无班级介绍。";
    infoModal.hidden = false;
    document.body.classList.add("modal-open");
  }
  function closeInfoModal() {
    infoModal.hidden = true;
    document.body.classList.remove("modal-open");
  }
  document.getElementById("info-modal-close").addEventListener("click", closeInfoModal);
  infoModal.addEventListener("click", (e) => { if (e.target === infoModal) closeInfoModal(); });

  // --- 班级课程弹窗 ---
  const courseModal = document.getElementById("course-modal");
  const courseMgmtList = document.getElementById("course-mgmt-list");
  const courseModalSub = document.getElementById("course-modal-sub");
  const msSelect = document.getElementById("ms-select");
  const msTrigger = document.getElementById("ms-trigger");
  const msMenu = document.getElementById("ms-menu");
  const msLabel = document.getElementById("ms-label");
  let activeCourseClassId = null;
  let editingPlanCourseId = null;
  let msSelection = new Set(); // 待添加的课程包名（多选）

  // 系统内全部课程包名称（去重，运行时从课程与实验室数据汇总）
  function getAllPackages() {
    const set = new Set();
    Object.values(courses).forEach((cs) => cs.lessons.forEach((l) => set.add(l.name)));
    if (typeof labPackages !== "undefined") labPackages.forEach((p) => set.add(p.title));
    return [...set];
  }

  const WEEKDAYS = ["每周一", "每周二", "每周三", "每周四", "每周五"];

  function getActiveClass() { return classStore.find((x) => x.id === activeCourseClassId); }

  // 授课计划展示文案：未开启→null；开启无日期→“已开启”；否则→“每周一、每周三”
  function formatPlan(plan) {
    if (!plan || !plan.on) return null;
    if (!plan.days || plan.days.length === 0) return "已开启（未选择日期）";
    return plan.days.join("、");
  }

  function renderCourseModal() {
    const c = getActiveClass();
    if (!c) return;
    document.getElementById("course-modal-title").textContent = c.name;
    courseModalSub.textContent = `班级课程 · 共 ${c.courses.length} 门`;
    if (c.courses.length === 0) {
      courseMgmtList.innerHTML = '<div class="course-mgmt-empty">暂无已添加课程，请在上方添加。</div>';
      return;
    }
    courseMgmtList.innerHTML = c.courses.map((co) => {
      const editing = editingPlanCourseId === co.id;
      let planView;
      if (editing) {
        const on = !!(co.plan && co.plan.on);
        const days = (co.plan && co.plan.days) || [];
        const dayBoxes = WEEKDAYS.map((d) =>
          `<label class="plan-day"><input type="checkbox" value="${d}" ${days.includes(d) ? "checked" : ""}><span>${d}</span></label>`
        ).join("");
        planView = `<div class="plan-edit">
          <label class="plan-toggle"><span>计划授课</span><span class="switch"><input type="checkbox" class="plan-on" ${on ? "checked" : ""}><span class="slider"></span></span></label>
          <div class="plan-days" ${on ? "" : "hidden"}>${dayBoxes}</div>
          <div class="plan-edit-actions"><button class="primary-action sm" data-save-plan="${co.id}" type="button">保存</button><button class="secondary-action sm" data-cancel-plan="1" type="button">取消</button></div>
        </div>`;
      } else {
        const txt = formatPlan(co.plan);
        planView = `<span class="course-mgmt-plan">授课计划：${txt ? esc(txt) : '<span class="muted">未设置</span>'}</span>`;
      }
      const actions = editing
        ? ""
        : `<div class="course-mgmt-actions"><a class="link" data-edit-plan="${co.id}">编辑授课计划</a><a class="act del" data-del-course="${co.id}">删除</a></div>`;
      return `<div class="course-mgmt-item"><div class="course-mgmt-main"><span class="course-mgmt-pkg">${esc(co.package)}</span>${planView}</div>${actions}</div>`;
    }).join("");
  }

  function renderMsMenu() {
    const c = getActiveClass();
    if (!c) return;
    const existing = new Set(c.courses.map((co) => co.package));
    const all = getAllPackages();
    const html = all.map((name) => {
      if (existing.has(name)) {
        return `<div class="ms-option added"><span>${esc(name)}</span><span class="ms-added-tag">已添加</span></div>`;
      }
      const checked = msSelection.has(name) ? "checked" : "";
      return `<label class="ms-option"><input type="checkbox" value="${esc(name)}" ${checked}><span>${esc(name)}</span></label>`;
    }).join("");
    msMenu.innerHTML = html || '<div class="ms-menu-empty">暂无可选课程包</div>';
  }

  function updateMsLabel() {
    if (msSelection.size === 0) {
      msLabel.textContent = "选择课程包";
      msLabel.classList.add("ms-placeholder");
    } else {
      msLabel.textContent = `已选 ${msSelection.size} 个课程包`;
      msLabel.classList.remove("ms-placeholder");
    }
  }

  function setMsOpen(open) {
    msSelect.classList.toggle("open", open);
    msMenu.hidden = !open;
    msTrigger.setAttribute("aria-expanded", String(open));
  }

  function resetMsSelect() {
    msSelection = new Set();
    updateMsLabel();
    renderMsMenu();
    setMsOpen(false);
  }

  function openCourseModal(classId) {
    activeCourseClassId = classId;
    editingPlanCourseId = null;
    resetMsSelect();
    renderCourseModal();
    courseModal.hidden = false;
    document.body.classList.add("modal-open");
  }
  function closeCourseModal() {
    courseModal.hidden = true;
    if (!classroomPage || classroomPage.hidden) document.body.classList.remove("modal-open");
    editingPlanCourseId = null;
    setMsOpen(false);
  }

  msTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    setMsOpen(msMenu.hidden);
  });
  msMenu.addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    if (e.target.checked) msSelection.add(e.target.value);
    else msSelection.delete(e.target.value);
    updateMsLabel();
  });
  // 点击下拉外部时收起菜单（不关闭整个弹窗）
  courseModal.addEventListener("click", (e) => {
    if (!msMenu.hidden && !msSelect.contains(e.target)) setMsOpen(false);
  });

  courseMgmtList.addEventListener("click", (e) => {
    const t = e.target.closest("[data-edit-plan],[data-del-course],[data-save-plan],[data-cancel-plan]");
    if (!t) return;
    const c = getActiveClass();
    if (!c) return;
    if (t.dataset.editPlan) {
      editingPlanCourseId = t.dataset.editPlan;
      renderCourseModal();
      const inp = courseMgmtList.querySelector(".plan-input");
      if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    } else if (t.dataset.cancelPlan) {
      editingPlanCourseId = null;
      renderCourseModal();
    } else if (t.dataset.savePlan) {
      const wrap = t.closest(".plan-edit");
      const co = c.courses.find((x) => x.id === t.dataset.savePlan);
      if (co && wrap) {
        const on = wrap.querySelector(".plan-on").checked;
        const days = on ? [...wrap.querySelectorAll(".plan-day input:checked")].map((i) => i.value) : [];
        co.plan = { on, days };
      }
      editingPlanCourseId = null;
      saveClasses();
      renderCourseModal();
      showToast("授课计划已保存");
    } else if (t.dataset.delCourse) {
      const co = c.courses.find((x) => x.id === t.dataset.delCourse);
      if (!co) return;
      const cid = t.dataset.delCourse;
      openConfirm(`确定从「${c.name}」移除课程「${co.package}」吗？`, () => {
        c.courses = c.courses.filter((x) => x.id !== cid);
        saveClasses();
        renderCourseModal();
        renderClassTable();
        if (typeof rebuildMyPackages === "function") rebuildMyPackages();
        if (typeof refreshMcClasses === "function") refreshMcClasses();
        if (classroomPage && !classroomPage.hidden) renderClassroom();
        showToast("已删除课程");
      }, "确定移除");
    }
  });

  // 计划授课开关：切换时显示/隐藏周几选项
  courseMgmtList.addEventListener("change", (e) => {
    if (!e.target.classList.contains("plan-on")) return;
    const wrap = e.target.closest(".plan-edit");
    const daysEl = wrap && wrap.querySelector(".plan-days");
    if (daysEl) daysEl.hidden = !e.target.checked;
  });

  document.getElementById("ca-add").addEventListener("click", () => {
    const c = getActiveClass();
    if (!c) return;
    if (msSelection.size === 0) { showToast("请选择课程包"); setMsOpen(true); return; }
    const existing = new Set(c.courses.map((co) => co.package));
    let added = 0;
    msSelection.forEach((name) => {
      if (existing.has(name)) return;
      c.courses.push({ id: "co-" + Date.now() + "-" + added, package: name, plan: { on: false, days: [] } });
      added += 1;
    });
    resetMsSelect();
    saveClasses();
    renderCourseModal();
    renderClassTable();
    if (added > 0 && typeof rebuildMyPackages === "function") rebuildMyPackages();
    if (added > 0 && typeof refreshMcClasses === "function") refreshMcClasses();
    if (classroomPage && !classroomPage.hidden) renderClassroom();
    showToast(added > 0 ? `已添加 ${added} 门课程` : "所选课程已存在");
  });

  document.getElementById("course-modal-close").addEventListener("click", closeCourseModal);
  courseModal.addEventListener("click", (e) => { if (e.target === courseModal) closeCourseModal(); });

  // --- 通用二次确认弹窗 ---
  const confirmModal = document.getElementById("confirm-modal");
  let confirmCallback = null;
  function openConfirm(msg, onOk, okText) {
    document.getElementById("confirm-msg").textContent = msg;
    document.getElementById("confirm-ok").textContent = okText || "确定删除";
    confirmCallback = onOk;
    confirmModal.hidden = false;
    document.body.classList.add("modal-open");
  }
  function closeConfirm() {
    confirmModal.hidden = true;
    confirmCallback = null;
    // 若仍有上层弹窗（如课程弹窗）打开，保持滚动锁定
    if (courseModal.hidden) document.body.classList.remove("modal-open");
  }
  document.getElementById("confirm-cancel").addEventListener("click", closeConfirm);
  confirmModal.addEventListener("click", (e) => { if (e.target === confirmModal) closeConfirm(); });
  document.getElementById("confirm-ok").addEventListener("click", () => {
    const cb = confirmCallback;
    closeConfirm();
    if (cb) cb();
  });

  // --- 班级二维码弹窗 ---
  const qrModal = document.getElementById("qr-modal");
  const qrImg = document.getElementById("qr-img");
  const qrFallback = document.getElementById("qr-fallback");
  let qrShareUrl = "";
  function classJoinUrl(c) {
    return `https://bingoclass.edu/join?c=${encodeURIComponent(c.id)}`;
  }
  function openQrModal(classId) {
    const c = classStore.find((x) => x.id === classId);
    if (!c) return;
    qrShareUrl = classJoinUrl(c);
    document.getElementById("qr-modal-class").textContent = c.name;
    qrFallback.hidden = true;
    qrImg.hidden = false;
    qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=" + encodeURIComponent(qrShareUrl);
    qrModal.hidden = false;
    document.body.classList.add("modal-open");
  }
  function closeQrModal() {
    qrModal.hidden = true;
    document.body.classList.remove("modal-open");
  }
  qrImg.addEventListener("error", () => { qrImg.hidden = true; qrFallback.hidden = false; });
  document.getElementById("qr-modal-close").addEventListener("click", closeQrModal);
  qrModal.addEventListener("click", (e) => { if (e.target === qrModal) closeQrModal(); });
  document.getElementById("qr-copy").addEventListener("click", () => {
    const done = () => showToast("邀请链接已复制");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(qrShareUrl).then(done).catch(() => showToast(qrShareUrl));
    } else {
      showToast(qrShareUrl);
    }
  });
  document.getElementById("qr-share").addEventListener("click", () => {
    const cls = document.getElementById("qr-modal-class").textContent;
    if (navigator.share) {
      navigator.share({ title: "加入班级", text: `邀请你加入「${cls}」`, url: qrShareUrl }).catch(() => {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(qrShareUrl).then(() => showToast("当前环境不支持直接分享，已复制链接"));
    } else {
      showToast("请复制链接后发送给学生");
    }
  });

  // --- 导入学生名单弹窗 ---
  const importModal = document.getElementById("import-modal");
  const importFileInput = document.getElementById("import-file");
  const importDrop = document.getElementById("import-drop");
  const importFileName = document.getElementById("import-file-name");
  const importConfirmBtn = document.getElementById("import-confirm");
  let importClassId = null;
  let importPickedFile = null;

  function openImportModal(classId) {
    const c = classStore.find((x) => x.id === classId);
    if (!c) return;
    importClassId = classId;
    importPickedFile = null;
    importFileInput.value = "";
    importFileName.textContent = "点击选择本地表格文件（.csv / .xlsx）";
    importDrop.classList.remove("has-file");
    importConfirmBtn.disabled = true;
    document.getElementById("import-modal-class").textContent = c.name;
    importModal.hidden = false;
    document.body.classList.add("modal-open");
  }
  function closeImportModal() {
    importModal.hidden = true;
    document.body.classList.remove("modal-open");
  }
  document.getElementById("import-modal-close").addEventListener("click", closeImportModal);
  document.getElementById("import-cancel").addEventListener("click", closeImportModal);
  importModal.addEventListener("click", (e) => { if (e.target === importModal) closeImportModal(); });

  document.getElementById("import-tpl").addEventListener("click", () => {
    const rows = [
      ["姓名", "学号", "性别", "备注"],
      ["张三", "20240101", "男", "示例行，可删除"],
      ["李四", "20240102", "女", "示例行，可删除"],
    ];
    const csv = "﻿" + rows.map((r) => r.join(",")).join("\r\n"); // BOM 保证 Excel 中文不乱码
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "学生名单导入模板.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    showToast("模板已下载");
  });

  importFileInput.addEventListener("change", () => {
    const f = importFileInput.files && importFileInput.files[0];
    importPickedFile = f || null;
    if (f) {
      importFileName.textContent = f.name;
      importDrop.classList.add("has-file");
      importConfirmBtn.disabled = false;
    } else {
      importFileName.textContent = "点击选择本地表格文件（.csv / .xlsx）";
      importDrop.classList.remove("has-file");
      importConfirmBtn.disabled = true;
    }
  });

  function countCsvStudents(text) {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && l.replace(/,/g, ""));
    if (lines.length === 0) return 0;
    // 跳过表头（含“姓名”视为表头）
    const start = lines[0].includes("姓名") ? 1 : 0;
    let n = 0;
    for (let i = start; i < lines.length; i++) {
      const name = lines[i].split(",")[0].trim();
      if (name) n += 1;
    }
    return n;
  }

  importConfirmBtn.addEventListener("click", () => {
    const c = classStore.find((x) => x.id === importClassId);
    if (!c || !importPickedFile) return;
    const name = importPickedFile.name.toLowerCase();
    if (name.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = () => {
        const count = countCsvStudents(String(reader.result || ""));
        if (count === 0) { showToast("未识别到学生数据，请检查模板格式"); return; }
        c.students = count;
        saveClasses();
        renderClassTable();
        closeImportModal();
        showToast(`成功导入 ${count} 名学生`);
      };
      reader.onerror = () => showToast("文件读取失败");
      reader.readAsText(importPickedFile, "utf-8");
    } else {
      // xlsx 解析需后端/库支持，演示阶段提示使用 CSV 模板
      showToast("当前演示仅支持 CSV 模板，请下载模板填写后上传");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!schoolModal.hidden) closeSchoolModal();
    if (!classFormModal.hidden) closeClassForm();
    if (!infoModal.hidden) closeInfoModal();
    if (!courseModal.hidden) closeCourseModal();
    if (!qrModal.hidden) closeQrModal();
    if (!importModal.hidden) closeImportModal();
    if (!confirmModal.hidden) closeConfirm();
  });

  renderSchoolBanner();
  renderClassTable();

  // ===== AI实验室：课程包 -> 实验列表 =====
  const labPackages = [
    { id: "g8x", title: "人工智能（八下）", cover: IMG + "computer-vision-experiment.jpg" },
    { id: "g7x", title: "人工智能（七下）", cover: IMG + "course-robot-world.png" },
    { id: "g6x", title: "人工智能（六下）", cover: IMG + "ai-app-modules.jpg" },
    { id: "g5x", title: "人工智能（五下）", cover: IMG + "online-lab-interface.jpg" },
    { id: "g4x", title: "人工智能（四下）", cover: IMG + "realistic-ai-ocean-lab.jpg" },
    { id: "g3x", title: "人工智能（三下）", cover: IMG + "robotics-kit.jpg" },
    { id: "g2s", title: "人工智能（二上）", cover: IMG + "realistic-ai-gallery-course.jpg" },
    { id: "g3s", title: "人工智能（三上）", cover: IMG + "machine-learning-classroom.jpg" },
    { id: "trial", title: "体验课", cover: IMG + "banner.jpg" },
  ];

  // 实验数据（线上无标签 / 线下打“线下实验”标签）
  const expPhotos = [
    IMG + "pbl-teaching.jpg", IMG + "ai-classroom-students.jpg", IMG + "teacher-training.jpg",
    IMG + "machine-learning-classroom.jpg", IMG + "computer-vision-experiment.jpg",
    IMG + "python-coding.jpg", IMG + "robotics-kit.jpg", IMG + "online-lab-interface.jpg",
  ];
  const experiments = [
    { title: "第一课-实践体验-班级零食偏好调查", offline: true, desc: "通过实践操作，使学生掌握数据收集与整理的方法，熟悉图表绘制技巧，提升数据分析与交流能力，强化团队协作意识。" },
    { title: "第一课-巩固提高-图表辨析实操", offline: true, desc: "围绕不同图表的适用特点展开巩固实践，结合学校社团人数真实数据，引导学生动手绘制柱状图与饼图简易草图，加深理解。" },
    { title: "第一课-互动游戏-数据可视化猜谜游戏", offline: false, desc: "根据一周喝水量的折线图来闯关。每组轮流上台描述图表变化，只能说升降趋势、线条走向，台下小伙伴根据描述一起讨论猜数据。" },
    { title: "第二课-实践体验-校园植物统计", offline: true, desc: "让参与者亲身体验数据收集、整理全过程，掌握基础数据筛选技能，提升小组协作能力。" },
    { title: "第二课-巩固提高-周末活动调查问卷设计实践", offline: true, desc: "引导学生围绕周末活动安排，自主设计包含五道题目的调查问卷，在设计过程中学习科学提问、合理设置选项。" },
    { title: "第二课-互动游戏-数据整理协作赛", offline: false, desc: "围绕水果原始数据展开，同学们根据任务卡要求，完成数据分类汇总、销量排序整理，填写统计表并交叉核验。" },
    { title: "第三课-实践体验-解读与绘制考试成绩可视化图表", offline: true, desc: "以运动会某单项成绩表为实践载体，引导学生解读数据并绘制可视化图表，提升数据表达能力。" },
    { title: "第三课-巩固提高-独立绘制", offline: true, desc: "本环节为课堂巩固实操任务，同学们结合校园真实场景独立完成图表绘制，检验学习成果。" },
  ];

  const labList = document.getElementById("lab-list");
  const labDetail = document.getElementById("lab-detail");
  const labPackagesEl = document.getElementById("lab-packages");
  const labExperimentsEl = document.getElementById("lab-experiments");

  labPackagesEl.innerHTML = labPackages.map((p) => `
    <article class="course-card" data-pkg="${p.id}">
      <div class="course-cover"><img src="${p.cover}" alt="${p.title}"></div>
      <h3 class="course-title">${p.title}</h3>
    </article>`).join("");

  function showLabList() {
    labDetail.classList.remove("active");
    labList.classList.add("active");
  }

  function openPackage(id) {
    const pkg = labPackages.find((p) => p.id === id);
    if (!pkg) return;
    document.getElementById("lab-title").textContent = pkg.title;
    document.getElementById("lab-sub").textContent = `共 ${experiments.length} 个实验 · 线上 / 线下`;
    labExperimentsEl.innerHTML = experiments.map((e, i) => `
      <article class="exp-card">
        <div class="exp-cover">
          <img src="${expPhotos[i % expPhotos.length]}" alt="${e.title}">
          ${e.offline ? '<span class="exp-tag">线下实验</span>' : ""}
        </div>
        <div class="exp-body">
          <h4>${e.title}</h4>
          <div class="desc">${e.desc}</div>
        </div>
      </article>`).join("");
    labList.classList.remove("active");
    labDetail.classList.add("active");
    document.querySelector(".content").scrollTop = 0;
  }

  labPackagesEl.addEventListener("click", (e) => {
    const card = e.target.closest(".course-card");
    if (card) openPackage(card.dataset.pkg);
  });
  document.getElementById("lab-back").addEventListener("click", showLabList);

  // ===== 我的课程：课程包数据（由「班级管理」的真实班级/课程派生） =====
  function coverForPackage(name) {
    const all = [...courses.autumn.lessons, ...courses.spring.lessons];
    const found = all.find((l) => l.name === name);
    return found ? found.img : IMG + "ai-classroom-students.jpg";
  }
  function periodsForPackage(name) {
    const all = [...courses.autumn.lessons, ...courses.spring.lessons];
    const found = all.find((l) => l.name === name);
    return found ? found.periods : "10课时";
  }

  const myPackages = [];
  // 从 classStore 重建「我的课程」课程包（新增/删除课程后调用以保持同步）
  function rebuildMyPackages() {
    myPackages.length = 0;
    classStore.forEach((cls) => {
      (cls.courses || []).forEach((co) => {
        myPackages.push({
          cover: coverForPackage(co.package),
          names: [co.package],
          status: "未开始",
          klass: cls.name,
          classId: cls.id,
          periods: periodsForPackage(co.package),
        });
      });
    });
  }
  rebuildMyPackages();

  // ===== 我的AI实验：实验包与课程一一对应，无编辑/删除，可进入实验列表 =====
  // 由「我的课程」(myPackages) 派生：课程有什么，配套实验包就有什么
  const myExpPackages = myPackages.map((p) => ({
    cover: p.cover,
    course: p.names[0],
    name: p.names[0] + " 实验包",
  }));

  const expListEl = document.getElementById("my-exp-list");
  const myexpList = document.getElementById("myexp-list");
  const myexpDetail = document.getElementById("myexp-detail");
  const myexpExperimentsEl = document.getElementById("myexp-experiments");

  function showMyexpList() {
    if (myexpDetail) myexpDetail.classList.remove("active");
    if (myexpList) myexpList.classList.add("active");
  }
  // 实验类型筛选：all / online / offline
  let myexpFilter = "all";
  const myexpFilterEl = document.getElementById("myexp-filter");

  function renderMyexpExperiments() {
    const list = experiments
      .map((e, i) => ({ ...e, photo: expPhotos[i % expPhotos.length] }))
      .filter((e) => myexpFilter === "all" || (myexpFilter === "offline" ? e.offline : !e.offline));
    if (!list.length) {
      myexpExperimentsEl.innerHTML = '<div class="mc-empty">暂无该类型的实验</div>';
      return;
    }
    myexpExperimentsEl.innerHTML = list.map((e) => `
      <article class="exp-card">
        <div class="exp-cover">
          <img src="${e.photo}" alt="${e.title}">
          ${e.offline ? '<span class="exp-tag">线下实验</span>' : ""}
        </div>
        <div class="exp-body">
          <h4>${e.title}</h4>
          <div class="desc">${e.desc}</div>
        </div>
      </article>`).join("");
  }

  function openMyexpDetail(idx) {
    const p = myExpPackages[idx];
    if (!p) return;
    document.getElementById("myexp-title").textContent = p.name;
    document.getElementById("myexp-sub").textContent = `共 ${experiments.length} 个实验 · 线上 / 线下`;
    myexpFilter = "all";
    if (myexpFilterEl) {
      myexpFilterEl.querySelectorAll("[data-filter]").forEach((b) =>
        b.classList.toggle("active", b.dataset.filter === "all"));
    }
    renderMyexpExperiments();
    myexpList.classList.remove("active");
    myexpDetail.classList.add("active");
    document.querySelector(".content").scrollTop = 0;
  }

  if (myexpFilterEl) {
    myexpFilterEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      myexpFilter = btn.dataset.filter;
      myexpFilterEl.querySelectorAll("[data-filter]").forEach((b) =>
        b.classList.toggle("active", b === btn));
      renderMyexpExperiments();
    });
  }

  if (expListEl) {
    expListEl.innerHTML = myExpPackages.map((p, i) => `
      <article class="pkg-card pkg-clickable" data-exp="${i}">
        <div class="pkg-cover">
          <img src="${p.cover}" alt="${p.name}">
        </div>
        <div class="pkg-info">
          <div class="pkg-title-row">
            <div class="pkg-names"><span class="pkg-name">${p.name}</span></div>
          </div>
          <div class="pkg-meta"><span class="k">配套课程：</span><span class="klass">${p.course}</span></div>
        </div>
      </article>`).join("");

    expListEl.addEventListener("click", (e) => {
      const card = e.target.closest("[data-exp]");
      if (card) openMyexpDetail(parseInt(card.dataset.exp, 10));
    });
  }
  const myexpBack = document.getElementById("myexp-back");
  if (myexpBack) myexpBack.addEventListener("click", showMyexpList);

  // ===== 我的数据：按数据范围（省/市/校只读 + 班级可选/汇总）查看 =====
  const dataStrip = document.getElementById("data-stat-strip");
  const dataTableEl = document.getElementById("data-table");
  const dsRegion = document.getElementById("ds-region");
  const dcSelect = document.getElementById("data-class-select");
  const dcTrigger = document.getElementById("dc-trigger");
  const dcMenu = document.getElementById("dc-menu");
  const dcLabel = document.getElementById("dc-label");
  const dataSubtabs = document.getElementById("data-subtabs");
  const dataFilter = document.getElementById("data-filter");
  const dataMonthInput = document.getElementById("data-month");
  const DATA_LESSON_POOL = ["认识人工智能", "数据与表格", "图像识别初探", "让机器听懂你", "智能体验课", "算法初步", "机器学习入门", "综合实践"];
  const ALL_SCOPE = "__all__";
  let dataScope = ALL_SCOPE; // 班级 id 或 全部班级
  let dataTab = "lessons";
  let dataMonth = ""; // YYYY-MM，空=全部
  let currentData = null;

  const ymd = (d) => `${d.getFullYear()}/${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}`;
  const ymKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;

  // 教师视角：省固定演示为湖南省，市由学校名前缀推断
  function regionOf(school) {
    const province = "湖南省";
    let city = "长沙市";
    const m = school && school.match(/^(.+?市)/);
    if (m) city = m[1];
    return { province, city };
  }

  function buildClassData(cls) {
    const courses = cls.courses || [];
    const PER = 8; // 每课程包总课时（演示）
    const records = [];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (courses.length) {
      const n = Math.min(8, Math.max(courses.length, 4));
      for (let i = 0; i < n; i++) {
        const co = courses[i % courses.length];
        const d = new Date(today); d.setDate(today.getDate() - i * 6);
        records.push({ date: d, lesson: DATA_LESSON_POOL[i % DATA_LESSON_POOL.length], pkg: co.package, teacher: cls.teacher, status: "已完成" });
      }
    }
    const total = courses.length * PER;
    const done = records.length;
    const courseDetail = courses.map((co) => {
      const cdDone = records.filter((r) => r.pkg === co.package).length;
      return { pkg: co.package, total: PER, done: cdDone, rate: Math.round(cdDone / PER * 100) };
    });
    const first = records.length ? records[records.length - 1].date : null;
    return { records, courseDetail, stats: { courseCount: courses.length, total, done, rate: total ? Math.round(done / total * 100) : 0, first } };
  }

  function buildAllData() {
    let firstAll = null;
    const rows = classStore.map((c) => {
      const d = buildClassData(c);
      if (d.stats.first && (!firstAll || d.stats.first < firstAll)) firstAll = d.stats.first;
      return { id: c.id, name: c.name, courseCount: d.stats.courseCount, total: d.stats.total, done: d.stats.done, rate: d.stats.rate };
    });
    rows.sort((a, b) => b.rate - a.rate || b.done - a.done); // 按上课率排名
    const agg = rows.reduce((s, r) => ({ courseCount: s.courseCount + r.courseCount, total: s.total + r.total, done: s.done + r.done }), { courseCount: 0, total: 0, done: 0 });
    agg.rate = agg.total ? Math.round(agg.done / agg.total * 100) : 0;
    return { rows, classCount: rows.length, agg, first: firstAll };
  }

  function renderStrip(items) {
    dataStrip.innerHTML = items.map(([l, v]) => `<div class="stat-item"><div class="v">${v}</div><div class="l">${l}</div></div>`).join("");
  }

  function renderLessonTable() {
    if (dataTab === "lessons") {
      dataFilter.hidden = false;
      let recs = currentData.records;
      if (dataMonth) recs = recs.filter((r) => ymKey(r.date) === dataMonth);
      if (!recs.length) { dataTableEl.innerHTML = '<div class="data-empty">该时间段暂无上课记录</div>'; return; }
      dataTableEl.innerHTML = `<table><thead><tr><th>上课时间</th><th>课时名称</th><th>所属课程包</th><th>主讲教师</th><th>课程状态</th></tr></thead><tbody>${
        recs.map((r) => `<tr><td>${ymd(r.date)}</td><td>${esc(r.lesson)}</td><td>${esc(r.pkg)}</td><td>${esc(r.teacher)}</td><td><span class="data-status">${r.status}</span></td></tr>`).join("")
      }</tbody></table>`;
    } else {
      dataFilter.hidden = true;
      if (!currentData.courseDetail.length) { dataTableEl.innerHTML = '<div class="data-empty">该班级暂无课程</div>'; return; }
      dataTableEl.innerHTML = `<table><thead><tr><th>课程包</th><th>总课时</th><th>已上课时</th><th>上课率</th></tr></thead><tbody>${
        currentData.courseDetail.map((c) => `<tr><td>${esc(c.pkg)}</td><td>${c.total}</td><td>${c.done}</td><td>${c.rate}%</td></tr>`).join("")
      }</tbody></table>`;
    }
  }

  function renderRankingTable(rows) {
    if (!rows.length) { dataTableEl.innerHTML = '<div class="data-empty">暂无班级数据</div>'; return; }
    dataTableEl.innerHTML = `<table><thead><tr><th>班级</th><th>课程数</th><th>总课时</th><th>已上课时</th><th>上课率</th></tr></thead><tbody>${
      rows.map((r) => `<tr class="rank-row" data-rankcls="${r.id}"><td><span class="rank-name">${esc(r.name)}</span><span class="rank-go">›</span></td><td>${r.courseCount}</td><td>${r.total}</td><td>${r.done}</td><td>${r.rate}%</td></tr>`).join("")
    }</tbody></table>`;
  }

  function renderScopeChips() {
    const school = loadSchool();
    if (!school) { dsRegion.innerHTML = '<span class="ds-chip">未绑定学校</span>'; return; }
    const r = regionOf(school);
    dsRegion.innerHTML = `<span class="ds-chip">${esc(r.province)}</span><span class="ds-chip">${esc(r.city)}</span><span class="ds-chip">${esc(school)}</span>`;
  }

  function renderDcMenu() {
    const opts = [`<button class="dc-option${dataScope === ALL_SCOPE ? " active" : ""}" data-cls="${ALL_SCOPE}" type="button">全部班级</button>`]
      .concat(classStore.map((c) =>
        `<button class="dc-option${c.id === dataScope ? " active" : ""}" data-cls="${c.id}" type="button">${esc(c.name)}</button>`));
    dcMenu.innerHTML = opts.join("");
  }

  function renderDataSection() {
    renderScopeChips();
    if (!classStore.length) {
      dcLabel.textContent = "暂无班级";
      dataStrip.innerHTML = "";
      dataSubtabs.hidden = true;
      dataFilter.hidden = true;
      dataTableEl.innerHTML = '<div class="data-empty">请先在「班级管理」创建班级</div>';
      renderDcMenu();
      return;
    }
    if (dataScope !== ALL_SCOPE && !classStore.find((c) => c.id === dataScope)) dataScope = ALL_SCOPE;
    renderDcMenu();
    if (dataScope === ALL_SCOPE) {
      dcLabel.textContent = "全部班级";
      const all = buildAllData();
      renderStrip([
        ["班级数量", all.classCount],
        ["课程总数", all.agg.courseCount],
        ["总课时数", all.agg.total],
        ["已上课时数", all.agg.done],
        ["平均上课率", all.agg.rate + "%"],
      ]);
      dataSubtabs.hidden = true;
      dataFilter.hidden = true;
      renderRankingTable(all.rows);
    } else {
      const cls = classStore.find((c) => c.id === dataScope);
      dcLabel.textContent = cls.name;
      currentData = buildClassData(cls);
      renderStrip([
        ["课程数量", currentData.stats.courseCount],
        ["总课时数", currentData.stats.total],
        ["已上课时数", currentData.stats.done],
        ["上课率", currentData.stats.rate + "%"],
        ["首次上课时间", currentData.stats.first ? ymd(currentData.stats.first) : "—"],
      ]);
      dataSubtabs.hidden = false;
      renderLessonTable();
    }
  }

  if (dcTrigger) {
    dcTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = dcMenu.hidden;
      dcMenu.hidden = !open;
      dcSelect.classList.toggle("open", open);
      dcTrigger.setAttribute("aria-expanded", String(open));
    });
    dcMenu.addEventListener("click", (e) => {
      const opt = e.target.closest(".dc-option");
      if (!opt) return;
      dataScope = opt.dataset.cls;
      dataTab = "lessons";
      document.querySelectorAll(".data-subtab").forEach((x) => x.classList.toggle("active", x.dataset.dt === "lessons"));
      dcMenu.hidden = true;
      dcSelect.classList.remove("open");
      renderDataSection();
    });
    document.addEventListener("click", (e) => {
      if (!dcSelect.contains(e.target)) { dcMenu.hidden = true; dcSelect.classList.remove("open"); }
    });
    // 汇总排名行点击 -> 下钻到该班级
    dataTableEl.addEventListener("click", (e) => {
      const row = e.target.closest("[data-rankcls]");
      if (!row) return;
      dataScope = row.dataset.rankcls;
      dataTab = "lessons";
      document.querySelectorAll(".data-subtab").forEach((x) => x.classList.toggle("active", x.dataset.dt === "lessons"));
      renderDataSection();
    });
    document.querySelectorAll(".data-subtab").forEach((t) => t.addEventListener("click", () => {
      document.querySelectorAll(".data-subtab").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      dataTab = t.dataset.dt;
      renderLessonTable();
    }));
    dataMonthInput.addEventListener("change", () => { dataMonth = dataMonthInput.value; renderLessonTable(); });
    document.getElementById("data-thismonth").addEventListener("click", () => {
      const now = new Date();
      dataMonth = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
      dataMonthInput.value = dataMonth;
      renderLessonTable();
    });
    document.getElementById("data-allmonth").addEventListener("click", () => {
      dataMonth = ""; dataMonthInput.value = "";
      renderLessonTable();
    });
  }

  // ===== 学科教研 / 数字资源：视频内容 =====
  const playIcon = '<div class="video-play"><span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></div>';
  const eyeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';

  function renderVideos(elId, videos) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = videos.map((v) => `
      <article class="video-card">
        <div class="video-cover">
          <img src="${v.cover}" alt="${v.title}">
          ${playIcon}
          <span class="video-dur">${v.dur}</span>
        </div>
        <div class="video-info">
          <h4>${v.title}</h4>
          <div class="video-meta">
            <span class="tag">${v.tag}</span>
            <span class="views">${eyeIcon}${v.views}</span>
          </div>
        </div>
      </article>`).join("");
    if (!el.dataset.bound) {
      el.dataset.bound = "1";
      el.addEventListener("click", (e) => {
        if (e.target.closest(".video-card")) showToast("播放视频（开发中）");
      });
    }
  }

  // ===== 学科教研：科目 -> 视频板块（示范课 / 教师培训） =====
  const researchSubjects = [
    {
      id: "ai-spring", title: "小学人工智能", cover: IMG + "ai-course-spring-redesign.png",
      demo: [
        { cover: IMG + "pbl-teaching.jpg", title: "项目式学习在AI通识课中的应用示范", dur: "41:25", tag: "示范课", views: "512" },
        { cover: IMG + "machine-learning-classroom.jpg", title: "名师课堂：机器学习概念的可视化教学", dur: "38:47", tag: "示范课", views: "734" },
        { cover: IMG + "computer-vision-experiment.jpg", title: "图像识别单元的探究式教学实录", dur: "29:36", tag: "课例", views: "351" },
      ],
      train: [
        { cover: IMG + "teacher-training.jpg", title: "AI通识课程教学法专题培训", dur: "52:10", tag: "教师培训", views: "286" },
        { cover: IMG + "ai-classroom-students.jpg", title: "新教师入门：如何上好第一节AI课", dur: "45:02", tag: "教师培训", views: "468" },
      ],
    },
    {
      id: "ai-autumn", title: "人工智能 · 上册", cover: IMG + "ai-course-autumn-redesign.png",
      demo: [
        { cover: IMG + "robotics-kit.jpg", title: "机器人编程跨学科融合示范课", dur: "44:18", tag: "示范课", views: "297" },
        { cover: IMG + "online-lab-interface.jpg", title: "生成式AI创作课堂教学实录", dur: "36:09", tag: "示范课", views: "613" },
      ],
      train: [
        { cover: IMG + "teacher-training.jpg", title: "AI实验教学组织与安全培训", dur: "48:33", tag: "教师培训", views: "204" },
      ],
    },
  ];

  const researchList = document.getElementById("research-list");
  const researchDetail = document.getElementById("research-detail");

  document.getElementById("research-subjects").innerHTML = researchSubjects.map((s) => `
    <article class="course-card" data-subject="${s.id}">
      <div class="course-cover"><img src="${s.cover}" alt="${s.title}"></div>
      <h3 class="course-title">${s.title}</h3>
    </article>`).join("");

  function showResearchList() {
    researchDetail.classList.remove("active");
    researchList.classList.add("active");
  }

  function openResearch(id) {
    const s = researchSubjects.find((x) => x.id === id);
    if (!s) return;
    document.getElementById("research-title").textContent = s.title;
    renderVideos("research-demo", s.demo);
    renderVideos("research-train", s.train);
    researchList.classList.remove("active");
    researchDetail.classList.add("active");
    document.querySelector(".content").scrollTop = 0;
  }

  document.getElementById("research-subjects").addEventListener("click", (e) => {
    const card = e.target.closest(".course-card");
    if (card) openResearch(card.dataset.subject);
  });
  document.getElementById("research-back").addEventListener("click", showResearchList);

  // ===== 课时资源（原数字资源云盘，移入课时内；内容由运营后台配置，仅浏览） =====
  function buildLessonResources(no, name) {
    return {
      name: "全部资源",
      children: [
        { type: "folder", name: "课件", children: [
          { type: "file", name: `${name}-授课课件.pptx`, ext: "pptx", size: "5.2 MB", date: "2024-06-18" },
          { type: "file", name: "互动演示动画.mp4", ext: "mp4", size: "48 MB", date: "2024-06-12" },
        ] },
        { type: "folder", name: "教案与学案", children: [
          { type: "file", name: `${name}-教学设计.docx`, ext: "docx", size: "1.8 MB", date: "2024-06-18" },
          { type: "file", name: "学生活动学案.pdf", ext: "pdf", size: "860 KB", date: "2024-06-16" },
        ] },
        { type: "folder", name: "素材与练习", children: [
          { type: "file", name: "配图素材.png", ext: "png", size: "820 KB", date: "2024-06-15" },
          { type: "file", name: "随堂练习.pdf", ext: "pdf", size: "640 KB", date: "2024-06-10" },
          { type: "file", name: "拓展阅读资料.docx", ext: "docx", size: "1.2 MB", date: "2024-06-09" },
        ] },
        { type: "file", name: `${name}-课堂实录.mp4`, ext: "mp4", size: "126 MB", date: "2024-06-16" },
        { type: "file", name: "教具清单.txt", ext: "txt", size: "3 KB", date: "2024-06-13" },
      ],
    };
  }
  let driveRoot = buildLessonResources(1, "认识人工智能");

  const fileIcons = {
    folder: { cls: "folder", svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"/></svg>' },
    doc: { cls: "doc", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></svg>' },
    ppt: { cls: "ppt", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><rect x="8" y="12" width="6" height="5" rx="1"/></svg>' },
    xls: { cls: "xls", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13l6 5M15 13l-6 5"/></svg>' },
    pdf: { cls: "pdf", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
    img: { cls: "img", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>' },
    video: { cls: "video", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>' },
    other: { cls: "other", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  };
  const extMap = {
    doc: "doc", docx: "doc", ppt: "ppt", pptx: "ppt", xls: "xls", xlsx: "xls",
    pdf: "pdf", png: "img", jpg: "img", jpeg: "img", gif: "img", mp4: "video", mov: "video",
  };
  const previewable = new Set(["doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf", "png", "jpg", "jpeg", "gif", "mp4", "mov"]);

  const driveListEl = document.getElementById("drive-list");
  const breadcrumbEl = document.getElementById("drive-breadcrumb");
  let drivePath = [driveRoot]; // 文件夹栈

  function renderDrive() {
    const current = drivePath[drivePath.length - 1];

    // 根目录不显示面包屑，进入子文件夹后才出现（根节点为「全部资源」）
    breadcrumbEl.innerHTML = drivePath.length === 1 ? "" : drivePath.map((f, i) => {
      const isLast = i === drivePath.length - 1;
      const cls = isLast ? "crumb current" : "crumb link";
      const node = `<span class="${cls}" data-depth="${i}">${f.name}</span>`;
      return i === 0 ? node : `<span class="sep">/</span>${node}`;
    }).join("");

    const items = [...current.children].sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return 0;
    });

    if (!items.length) {
      driveListEl.innerHTML = '<div class="drive-empty">此文件夹为空</div>';
      return;
    }

    driveListEl.innerHTML = items.map((it, idx) => {
      if (it.type === "folder") {
        const ic = fileIcons.folder;
        return `<div class="file-row is-folder" data-folder="${idx}">
          <span class="col-name"><span class="file-icon ${ic.cls}">${ic.svg}</span><span class="file-name">${it.name}</span></span>
          <span class="col-size">${it.children.length} 项</span>
          <span class="col-date">—</span>
          <span class="col-act"><button class="muted" data-act="open" data-folder="${idx}">打开</button></span>
        </div>`;
      }
      const ic = fileIcons[extMap[it.ext] || "other"];
      const canPreview = previewable.has(it.ext);
      return `<div class="file-row">
        <span class="col-name"><span class="file-icon ${ic.cls}">${ic.svg}</span><span class="file-name">${it.name}</span></span>
        <span class="col-size">${it.size}</span>
        <span class="col-date">${it.date}</span>
        <span class="col-act">
          <button data-act="preview" ${canPreview ? "" : "disabled"}>预览</button>
          <button data-act="download">下载</button>
        </span>
      </div>`;
    }).join("");
  }

  const resourcePage = document.getElementById("resource-page");

  function openLessonRes(no, name) {
    driveRoot = buildLessonResources(no, name);
    drivePath = [driveRoot];
    document.getElementById("resource-page-title").textContent = `第${no}课时 · ${name}`;
    document.getElementById("resource-page-sub").textContent = "";
    renderDrive();
    resourcePage.hidden = false;
    resourcePage.scrollTop = 0;
    document.body.classList.add("modal-open");
  }
  function closeLessonRes() {
    resourcePage.hidden = true;
    if (lessonPage && lessonPage.hidden) document.body.classList.remove("modal-open");
  }

  if (driveListEl) {
    driveListEl.addEventListener("click", (e) => {
      const folderRow = e.target.closest("[data-folder]");
      const actBtn = e.target.closest("[data-act]");
      const current = drivePath[drivePath.length - 1];
      if (actBtn && actBtn.dataset.act === "preview") { showToast("在线预览（开发中）"); return; }
      if (actBtn && actBtn.dataset.act === "download") { showToast("开始下载（开发中）"); return; }
      if (folderRow) {
        const idx = Number(folderRow.dataset.folder);
        const sorted = [...current.children].sort((a, b) => (a.type !== b.type ? (a.type === "folder" ? -1 : 1) : 0));
        const target = sorted[idx];
        if (target && target.type === "folder") { drivePath.push(target); renderDrive(); }
      }
    });
    breadcrumbEl.addEventListener("click", (e) => {
      const crumb = e.target.closest(".crumb.link");
      if (crumb) { drivePath = drivePath.slice(0, Number(crumb.dataset.depth) + 1); renderDrive(); }
    });
    document.getElementById("resource-page-back").addEventListener("click", closeLessonRes);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !resourcePage.hidden) closeLessonRes(); });
  }

  // ===== 帮助指南 =====
  const guideIcons = {
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/></svg>',
    teacher: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/><path d="M1 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31"/><path d="M14 9.3V2"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M10.5 13.5l3 3M15 12l-4.5 4.5L9 17l.5-1.5z"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  };

  const guides = [
    {
      id: "prepare", icon: "rocket", num: "第一步 · 准备",
      title: "快速上手：绑定学校 · 创建班级 · 添加课程",
      summary: "首次使用按此三步完成基础设置，即可开始授课。",
      intro: "首次使用请依次完成「绑定学校 → 创建班级 → 添加课程」。「我的课程」会根据你的进度自动提示下一步，也可在此按引导逐步完成。",
      steps: [
        { h: "绑定学校", p: "首次进入 <span class=\"path\">我的课程</span> 或 <span class=\"path\">班级管理</span>，点击「绑定学校」，搜索并选择所在学校。" },
        { h: "创建班级", p: "绑定学校后点击「创建班级」，选择行政班（年级 + 班级）或兴趣班（自定义名称），保存后班级即出现在列表中。" },
        { h: "添加课程", p: "为班级添加课程包（如人工智能·四下）：可在 <span class=\"path\">我的课程</span> 空状态点「添加课程」，或在 <span class=\"path\">班级管理</span> 对应班级点「添加」。" },
        { h: "排课（可选）", p: "在课程的「编辑授课计划」中开启并选择每周上课日，今日课表与课程日历会自动显示对应安排。" },
      ],
      tip: "「我的课程」会依据是否已绑定学校 / 是否有班级 / 班级是否有课程，自动给出下一步引导。",
    },
    {
      id: "my-courses", icon: "book", num: "教学主页",
      title: "认识「我的课程」首页",
      summary: "集中查看班级、课程、今日课表与课程日历。",
      intro: "「我的课程」是日常教学的主页，左侧按班级切换课程，右侧汇总今日课表与课程日历。",
      steps: [
        { h: "切换班级", p: "顶部班级 Tab 可在不同班级间切换，分别查看各班已添加的课程包；点末尾「＋ 创建班级」可新建班级。" },
        { h: "进入课程", p: "点击课程卡片的「进入课程」，打开该课程的课时列表（按单元分组）。" },
        { h: "今日课表", p: "右侧「今日课表」显示当天排课，点「进入」可直达对应课堂。" },
        { h: "课程日历", p: "右侧「课程日历」用红点标出有课的日期，点击某天可查看该周课表。" },
      ],
      tip: "顶部「双师AI课堂」横幅可一键进入沉浸式课堂。",
    },
    {
      id: "dual-class", icon: "teacher", num: "上课",
      title: "开启一堂双师AI课",
      summary: "进入沉浸式课堂、切换AI虚拟老师与授课班级。",
      intro: "双师AI课堂由 AI 虚拟老师在线主讲、本校老师线下辅导。以下是开课的常用操作。",
      steps: [
        { h: "进入课堂", p: "在 <span class=\"path\">我的课程</span> 顶部点击「双师AI课堂」横幅，即可打开全屏沉浸式课堂。" },
        { h: "选择授课班级", p: "课堂左上角点击「切换班级」，选择本节课要上课的班级。" },
        { h: "切换AI老师", p: "点击虚拟老师下方的名字（如「智雅」），可切换不同形象与风格的 AI 虚拟老师。" },
        { h: "选择课程开始", p: "右侧课程列表显示各课程学习进度，点击对应课程封面即可开始本节课。" },
      ],
      tip: "退出课堂点击左上角返回按钮即可，学习进度会自动保存。",
    },
    {
      id: "prepare-lesson", icon: "edit", num: "备课",
      title: "课前备课",
      summary: "查看每个课时的教学目标、重难点与各环节安排。",
      intro: "每个课时都提供备课资料，帮助你在上课前熟悉教学目标、重难点与课堂各环节。",
      steps: [
        { h: "打开备课页", p: "在 <span class=\"path\">我的课程</span> 进入课程后，在课时卡片上点击「备课」。" },
        { h: "按环节查看", p: "左侧可在「课程简介 / 指导手册 / 材料准备 / 新知讲解 / 互动体验 / 巩固练习 / 课程回顾」之间切换。" },
        { h: "切换课时", p: "顶部标题处可下拉切换到其他课时，或用「上一课时 / 下一课时」按钮翻页。" },
      ],
      tip: "「课程简介」含教学目标与教学重难点，建议课前先浏览一遍。",
    },
    {
      id: "resource", icon: "cloud", num: "资源",
      title: "查看课时教学资源",
      summary: "每个课时配套课件、教案、素材等，可在线预览与下载。",
      intro: "每个课时都配有平台统一配置的教学资源（课件、教案、素材、练习等），在课时列表中即可查看。",
      steps: [
        { h: "打开课时列表", p: "在 <span class=\"path\">我的课程</span> 点击课程「进入课程」，打开课时列表。" },
        { h: "查看课时资源", p: "在课时卡片上点击「资源」按钮，即可浏览该课时的全部资源，支持多级文件夹。" },
        { h: "预览与下载", p: "文档、PDF、图片、视频可点「预览」在线查看；任意文件均可「下载」到本地。" },
      ],
      tip: "课时资源由平台统一配置与更新，无需自行上传。",
    },
    {
      id: "experiment", icon: "flask", num: "实验",
      title: "开展 AI 实验（线上 / 线下）",
      summary: "在 AI 实验室与我的AI实验中查看并组织实验。",
      intro: "实验分为线上实验与线下实验：线下实验带「线下实验」标签，需配合教具在课堂完成；线上实验可直接在平台体验。",
      steps: [
        { h: "浏览实验包", p: "进入 <span class=\"path\">AI实验室</span>，按课程包（如人工智能八下）查看其包含的全部实验。" },
        { h: "区分实验类型", p: "封面带「线下实验」标签的为线下实践活动；无标签的为线上互动实验。" },
        { h: "在我的AI实验中查看", p: "已加入班级的课程会自动生成配套实验包，出现在 <span class=\"path\">我的AI实验</span>，可进入查看线上 / 线下实验。" },
      ],
      tip: "线下实验建议提前准备好对应教具与材料，确保课堂顺利开展。",
    },
    {
      id: "research", icon: "video", num: "教研",
      title: "学科教研：示范课与教师培训",
      summary: "按科目观看优秀课堂实录与教师培训视频。",
      intro: "学科教研提供各科目的示范课与教师培训视频，供备课参考与专业提升。",
      steps: [
        { h: "选择科目", p: "进入 <span class=\"path\">学科教研</span>，点击科目卡片（如小学人工智能）进入。" },
        { h: "观看示范课", p: "「示范课 / 课例」板块为优秀课堂教学实录，可用于观摩学习。" },
        { h: "参加教师培训", p: "「教师培训」板块为教学法、实验安全等专题培训视频。" },
      ],
      tip: "每个视频都标有时长与观看量，可按需选择学习。",
    },
    {
      id: "class", icon: "users", num: "班级",
      title: "班级与学生管理",
      summary: "维护学校、班级、学生名单与班级课程。",
      intro: "在 <span class=\"path\">班级管理</span> 可维护所有任教班级：绑定学校、增删班级、管理学生名单并为班级配置课程。",
      steps: [
        { h: "绑定 / 修改学校", p: "顶部点「绑定学校」完成绑定；已绑定后可点「修改学校」更换。" },
        { h: "创建 / 编辑班级", p: "点「创建班级」新增，或在班级行点「编辑班级」修改信息，「删除班级」移除。" },
        { h: "导入学生", p: "在班级行点「导入学生」维护名单；点班级名旁的二维码可生成班级码供学生加入。" },
        { h: "添加课程与排课", p: "在班级行点「添加」加入课程包；在课程的「编辑授课计划」中设置每周上课日。" },
      ],
      tip: "一个班级可添加多个不同年级的课程包，按实际教学安排灵活配置。",
    },
    {
      id: "data", icon: "chart", num: "数据",
      title: "查看教学数据",
      summary: "按班级或全部班级掌握课程与上课进度。",
      intro: "「我的数据」汇总各班级的课程与上课进度，便于掌握整体教学情况。",
      steps: [
        { h: "选择范围", p: "进入 <span class=\"path\">我的数据</span>，顶部可在「全部班级」与某个具体班级之间切换。" },
        { h: "查看总览", p: "「全部班级」下展示班级数量、课程总数、总 / 已上课时、平均上课率与班级排名。" },
        { h: "查看班级明细", p: "选择某个班级后，可查看该班课程数量、上课率、首次上课时间与逐课时进度。" },
      ],
      tip: "数据会随上课与排课进度自动更新。",
    },
    {
      id: "account", icon: "lock", num: "账号",
      title: "账号与个人中心",
      summary: "登录方式、找回密码与个人信息管理。",
      intro: "平台支持验证码与密码两种登录方式，无需注册；登录后可在个人中心管理账号信息。",
      steps: [
        { h: "登录", p: "输入手机号获取并填写 6 位验证码登录，未注册手机号将自动创建账号；也可切「密码登录」。" },
        { h: "忘记密码", p: "在密码登录页点击「忘记密码？」，通过手机号验证后设置新密码。" },
        { h: "个人中心", p: "点击右上角头像打开个人中心，可修改姓名、头像、手机号、密码，或切换所属学校。" },
        { h: "退出登录", p: "在个人中心底部点击「退出登录」即可安全退出。" },
      ],
      tip: "若无法接收验证码或忘记账号，请联系学校管理员或平台客服协助。",
    },
  ];

  const guideListEl = document.getElementById("guide-list");
  const guideDetailEl = document.getElementById("guide-detail");
  const guideCardsEl = document.getElementById("guide-cards");

  if (guideCardsEl) {
    guideCardsEl.innerHTML = guides.map((g) => `
      <button class="guide-card" data-guide="${g.id}">
        <span class="g-icon">${guideIcons[g.icon]}</span>
        <span class="g-body">
          <span class="g-num">${g.num}</span>
          <h3>${g.title}</h3>
          <p>${g.summary}</p>
        </span>
      </button>`).join("");
  }

  function showGuideList() {
    if (!guideDetailEl) return;
    guideDetailEl.classList.remove("active");
    guideListEl.classList.add("active");
  }

  function openGuide(id) {
    const g = guides.find((x) => x.id === id);
    if (!g) return;
    document.getElementById("guide-title").textContent = g.title;
    document.getElementById("guide-intro").textContent = g.intro;
    document.getElementById("guide-steps").innerHTML = g.steps.map((s) => `
      <li><h4>${s.h}</h4><p>${s.p}</p></li>`).join("");
    document.getElementById("guide-tip").innerHTML = g.tip || "";
    guideListEl.classList.remove("active");
    guideDetailEl.classList.add("active");
    document.querySelector(".content").scrollTop = 0;
  }

  if (guideCardsEl) {
    guideCardsEl.addEventListener("click", (e) => {
      const card = e.target.closest(".guide-card");
      if (card) openGuide(card.dataset.guide);
    });
    document.getElementById("guide-back").addEventListener("click", showGuideList);
  }

  const dualBanner = document.getElementById("dual-banner");
  if (dualBanner) dualBanner.addEventListener("click", () => openClassroom());

  // ===== 今日课表 + 课程日历 =====
  // 每周固定排课示例（周一=1 … 周五=5）
  const weekSchedule = {
    1: [{ course: "人工智能（四下）", klass: "四年级(6)班" }],
    2: [{ course: "人工智能（五下）", klass: "五年级(2)班" }],
    3: [{ course: "人工智能（八下）", klass: "八年级(2)班" }, { course: "人工智能（七下）", klass: "七年级(3)班" }],
    4: [{ course: "人工智能（六下）", klass: "六年级(1)班" }],
    5: [{ course: "体验课", klass: "三年级(4)班" }],
  };
  const WEEK_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const pad2 = (n) => String(n).padStart(2, "0");
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  // 本周一（offset 为周偏移：-1 上周，0 本周，1 下周）
  function mondayOf(offsetWeeks) {
    const d = new Date();
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1 - day) + offsetWeeks * 7;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // 是否已有可排课的数据（有班级且班级下有课程）
  function hasScheduleData() {
    return classStore.some((c) => Array.isArray(c.courses) && c.courses.length > 0);
  }

  // 今日课表：取今天的排课，周末则用周一示例兜底
  function renderTodaySchedule() {
    const listEl = document.getElementById("today-list");
    if (!listEl) return;
    if (!hasScheduleData()) {
      listEl.innerHTML = '<div class="today-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><p>今日暂无排课</p></div>';
      return;
    }
    const now = new Date();
    const wd = now.getDay();
    const items = weekSchedule[wd] || weekSchedule[1]; // 周末用周一示例
    const dateStr = `${pad2(now.getMonth() + 1)}/${pad2(now.getDate())}`;
    listEl.innerHTML = items.map((it) => `
      <div class="today-item">
        <div class="ti-date"><b>${dateStr}</b><span>${WEEK_LABELS[wd]}</span></div>
        <div class="ti-main"><b>${it.course}</b><span>${it.klass} · 双师AI课堂</span></div>
        <button class="ghost-btn ti-go" type="button">进入</button>
      </div>`).join("");
    listEl.querySelectorAll(".ti-go").forEach((b) => b.addEventListener("click", () => showToast("进入课堂（开发中）")));
  }

  // 课程日历：渲染某一周
  let calWeekOffset = 0;
  function renderCalWeek(offset) {
    const weekEl = document.getElementById("cal-week");
    const rangeEl = document.getElementById("cal-range");
    if (!weekEl) return;
    const monday = mondayOf(offset);
    const today = new Date();
    const last = new Date(monday); last.setDate(monday.getDate() + 4);
    rangeEl.textContent = `${monday.getFullYear()}/${pad2(monday.getMonth() + 1)}/${pad2(monday.getDate())} - ${pad2(last.getMonth() + 1)}/${pad2(last.getDate())}`;
    let html = "";
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday); date.setDate(monday.getDate() + i);
      const isToday = sameDay(date, today);
      const items = hasScheduleData() ? (weekSchedule[i + 1] || []) : [];
      const body = items.length
        ? items.map((it) => `<div class="cal-class"><b>${it.course}</b><span class="cc-klass">${it.klass}</span></div>`).join("")
        : '<div class="cal-empty">无课</div>';
      html += `<div class="cal-day${isToday ? " today" : ""}">
        <div class="cal-day-head"><span class="cd-week">${WEEK_LABELS[i + 1]}</span><span class="cd-date">${pad2(date.getMonth() + 1)}/${pad2(date.getDate())}</span>${isToday ? '<span class="cd-today">今天</span>' : ""}</div>
        <div class="cal-day-body">${body}</div>
      </div>`;
    }
    weekEl.innerHTML = html;
  }

  const mcHome = document.getElementById("mc-home");
  const mcCalendar = document.getElementById("mc-calendar");
  function mcShow(view) {
    [mcHome, mcCalendar].forEach((el) => el && el.classList.remove("active"));
    if (view) view.classList.add("active");
  }
  function showMcHome() { mcShow(mcHome); }
  function showMcCalendar() { mcShow(mcCalendar); renderCalWeek(calWeekOffset); }

  // ===== 我的课程首页：班级筛选 + 课程列表 + 迷你月历 =====
  const mcClassTabsEl = document.getElementById("mc-class-tabs");
  const mcCourseListEl = document.getElementById("mc-course-list");
  const mcCourseCountEl = document.getElementById("mc-course-count");
  let mcActiveClassId = classStore.length ? classStore[0].id : null;

  function renderMcClassTabs() {
    if (!mcClassTabsEl) return;
    // 没有班级时隐藏班级筛选行，由课程区的引导卡片负责绑定学校 / 创建班级
    if (classStore.length === 0) {
      mcClassTabsEl.hidden = true;
      mcClassTabsEl.innerHTML = "";
      return;
    }
    mcClassTabsEl.hidden = false;
    mcClassTabsEl.innerHTML = classStore.map((cls) =>
      `<button class="class-tab${cls.id === mcActiveClassId ? " active" : ""}" data-class-id="${cls.id}" type="button">${esc(cls.name)}</button>`
    ).join("") +
      `<button class="class-tab class-tab-add" id="mc-create-class" type="button" title="创建班级">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>创建班级
      </button>`;
  }

  // 引导空状态卡片：图标 + 标题 + 说明 + 主按钮
  function mcGuideHTML(o) {
    return `<div class="mc-empty"><div class="mc-guide">
      <div class="empty-icon">${o.icon}</div>
      <h3>${o.title}</h3>
      <p>${o.desc}</p>
      <button class="primary-action" data-mc-guide="${o.action}" type="button">${ICON_PLUS}${o.btnText}</button>
    </div></div>`;
  }

  // 供创建/删除班级后同步「我的课程」的班级 Tab 与课程列表
  function refreshMcClasses() {
    if (!classStore.find((c) => c.id === mcActiveClassId)) {
      mcActiveClassId = classStore.length ? classStore[0].id : null;
    }
    renderMcClassTabs();
    renderMcCourseList();
    if (typeof renderTodaySchedule === "function") renderTodaySchedule();
    if (typeof renderMiniCal === "function") renderMiniCal();
    if (typeof renderCalWeek === "function") renderCalWeek(calWeekOffset);
  }

  function renderMcCourseList() {
    if (!mcCourseListEl) return;
    // 场景一：没有任何班级 → 引导绑定学校 / 创建班级
    if (classStore.length === 0) {
      if (mcCourseCountEl) mcCourseCountEl.textContent = "";
      const school = loadSchool();
      if (!school) {
        mcCourseListEl.innerHTML = mcGuideHTML({
          icon: ICON_SCHOOL, action: "bind", btnText: "绑定学校",
          title: "先绑定所在学校",
          desc: "绑定学校后即可创建班级、为班级添加课程，开始排课与上课。",
        });
      } else {
        mcCourseListEl.innerHTML = mcGuideHTML({
          icon: ICON_USERS, action: "create", btnText: "创建班级",
          title: "创建你的第一个班级",
          desc: `已绑定「${esc(school)}」，现在创建班级并为它添加课程。`,
        });
      }
      return;
    }
    const list = myPackages.filter((p) => p.classId === mcActiveClassId);
    if (mcCourseCountEl) mcCourseCountEl.textContent = `当前班级共 ${list.length} 门课程`;
    // 场景二：班级无课程 → 引导为该班级添加课程
    if (!list.length) {
      const cls = classStore.find((c) => c.id === mcActiveClassId);
      mcCourseListEl.innerHTML = mcGuideHTML({
        icon: ICON_BOOK, action: "addcourse", btnText: "添加课程",
        title: "该班级还没有课程",
        desc: `为「${esc(cls ? cls.name : "该班级")}」添加课程包，即可开始排课与上课。`,
      });
      return;
    }
    mcCourseListEl.innerHTML = list.map((p) => {
      const idx = myPackages.indexOf(p);
      return `<article class="mcc" data-pkg-idx="${idx}">
        <div class="mcc-cover"><img src="${p.cover}" alt="${esc(p.names[0])}"></div>
        <div class="mcc-body">
          <h4>${esc(p.names[0])}</h4>
          <div class="mcc-tags"><span>AI互动课程</span><span>共 ${esc(p.periods)}</span></div>
        </div>
        <button class="mcc-enter" type="button">进入课程</button>
      </article>`;
    }).join("");
  }

  function selectMcClass(classId) {
    mcActiveClassId = classId;
    renderMcClassTabs();
    renderMcCourseList();
  }

  if (mcClassTabsEl) {
    renderMcClassTabs();
    renderMcCourseList();
    mcClassTabsEl.addEventListener("click", (e) => {
      if (e.target.closest("#mc-create-class")) { openClassForm(); return; }
      const tab = e.target.closest("[data-class-id]");
      if (tab) selectMcClass(tab.dataset.classId);
    });
  }
  if (mcCourseListEl) {
    mcCourseListEl.addEventListener("click", (e) => {
      const guide = e.target.closest("[data-mc-guide]");
      if (guide) {
        const act = guide.dataset.mcGuide;
        if (act === "bind") openSchoolModal();
        else if (act === "create") openClassForm();
        else if (act === "addcourse" && mcActiveClassId) openCourseModal(mcActiveClassId);
        return;
      }
      const card = e.target.closest("[data-pkg-idx]");
      if (card) openMcLessons(myPackages[parseInt(card.dataset.pkgIdx, 10)]);
    });
  }


  // 右侧迷你月历：标红当天有课的日期，点击某天跳转到对应周的课程日历
  function renderMiniCal() {
    const el = document.getElementById("mini-cal");
    const monthLabel = document.getElementById("mini-cal-month");
    if (!el) return;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    if (monthLabel) monthLabel.textContent = `${year}年${month + 1}月`;
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (firstDay.getDay() + 6) % 7; // 0=周一
    let html = '<div class="mini-cal-weekdays">' + ["一", "二", "三", "四", "五", "六", "日"].map((w) => `<span>${w}</span>`).join("") + '</div><div class="mini-cal-days">';
    for (let i = 0; i < firstWeekday; i++) html += '<span class="mini-cal-day empty"></span>';
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const wd = date.getDay();
      const hasClass = hasScheduleData() && !!weekSchedule[wd];
      const isToday = d === now.getDate();
      const cls = ["mini-cal-day", isToday ? "today" : "", (hasClass && !isToday) ? "has-class" : ""].filter(Boolean).join(" ");
      html += `<button type="button" class="${cls}" data-date="${year}-${pad2(month + 1)}-${pad2(d)}">${d}</button>`;
    }
    el.innerHTML = html + "</div>";
    el.querySelectorAll("[data-date]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const clicked = new Date(btn.dataset.date);
        const day = clicked.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        const clickedMonday = new Date(clicked);
        clickedMonday.setDate(clicked.getDate() + diff);
        clickedMonday.setHours(0, 0, 0, 0);
        const thisMonday = mondayOf(0);
        calWeekOffset = Math.round((clickedMonday - thisMonday) / (7 * 24 * 3600 * 1000));
        showMcCalendar();
      });
    });
  }

  // 课时列表：全屏页面（覆盖菜单与顶栏，原页面不关闭）
  const lessonPage = document.getElementById("lesson-page");
  const lessonRail = document.getElementById("mc-lessons-rail");
  const lessonPkgSwitch = document.getElementById("lesson-pkg-switch");
  const lessonPkgMenu = document.getElementById("lesson-pkg-menu");
  const MC_LESSON_POOL = ["认识人工智能", "数据的奥秘", "图像识别初体验", "让机器听懂你", "智能小管家", "算法闯关", "机器学习入门", "人脸识别探秘", "语音助手小达人", "综合创作项目", "神经网络初探", "智能出行", "AI与艺术创作", "聊天机器人工坊", "智慧农场", "无人驾驶体验", "AI伦理小课堂", "期末成果展示"];
  // 课时封面：每课时一张，避免整片重复
  const MC_LESSON_COVERS = [
    "assets/img/ai-classroom-students.jpg",
    "assets/img/ai-app-modules.jpg",
    "assets/img/computer-vision-experiment.jpg",
    "assets/img/online-lab-interface.jpg",
    "assets/img/robotics-kit.jpg",
    "assets/img/python-coding.jpg",
    "assets/img/machine-learning-classroom.jpg",
    "assets/img/realistic-ai-gallery-course.jpg",
    "assets/img/pbl-teaching.jpg",
    "assets/img/realistic-ai-ocean-lab.jpg",
  ];
  const ICON_UP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="18 15 12 9 6 15"/></svg>';
  let mcCurrentPkg = null;

  function openMcLessons(pkg) {
    if (!pkg) return;
    mcCurrentPkg = pkg;
    document.getElementById("lesson-page-title").textContent = pkg.names[0];
    document.getElementById("lesson-page-sub").textContent = `共 ${MC_LESSON_POOL.length} 课时 · ${pkg.klass}`;
    // 课程包切换菜单
    lessonPkgMenu.innerHTML = myPackages.map((p, i) =>
      `<button class="fp-switch-opt${p === pkg ? " active" : ""}" data-pkgopt="${i}" type="button">${esc(p.names[0])}</button>`
    ).join("");
    const taughtUpTo = 1; // 演示：已上到第 1 课时
    // 单元分组：标题 + 覆盖的课时范围
    const MC_UNITS = [
      { title: "第1-2单元 · 走进人工智能", from: 1, to: 3 },
      { title: "第3-4单元 · 感知与识别", from: 4, to: 7 },
      { title: "第5-6单元 · 智能应用与创作", from: 8, to: 10 },
      { title: "第7-8单元 · 机器如何思考", from: 11, to: 13 },
      { title: "第9-10单元 · AI与生活", from: 14, to: 16 },
      { title: "第11-12单元 · 伦理与展望", from: 17, to: 18 },
    ];
    function lessonCard(name, no) {
      const progress = no === taughtUpTo ? `<div class="lrc-progress">${ICON_UP}上到这里</div>` : '<div class="lrc-progress"></div>';
      return `<div class="lesson-rail-card">
        <div class="lrc-cover"><img src="${MC_LESSON_COVERS[(no - 1) % MC_LESSON_COVERS.length]}" alt="${esc(name)}"><span class="lrc-num">${no}</span></div>
        <h4 class="lrc-name">${esc(name)}</h4>
        <div class="lrc-actions"><button class="lrc-res" data-res="${no}" type="button">资源</button><button class="lrc-prep" data-prep="${no}" type="button">备课</button><button class="lrc-teach" data-teach="${no}" type="button">上课</button></div>
        ${progress}
      </div>`;
    }
    lessonRail.innerHTML = MC_UNITS.map((u) => {
      const cards = MC_LESSON_POOL.slice(u.from - 1, u.to)
        .map((name, i) => lessonCard(name, u.from + i)).join("");
      return `<div class="lesson-unit">
        <div class="lesson-unit-head"><span class="lu-title">${u.title}</span><span class="lu-range">第${u.from}-${u.to}课时</span></div>
        <div class="lesson-unit-grid">${cards}</div>
      </div>`;
    }).join("");
    lessonPage.hidden = false;
    lessonPage.scrollTop = 0;
    document.body.classList.add("modal-open");
  }
  function closeMcLessons() {
    lessonPage.hidden = true;
    document.body.classList.remove("modal-open");
  }

  if (lessonRail) {
    lessonRail.addEventListener("click", (e) => {
      const res = e.target.closest("[data-res]");
      const prep = e.target.closest("[data-prep]");
      const teach = e.target.closest("[data-teach]");
      if (res) {
        const no = parseInt(res.dataset.res, 10);
        openLessonRes(no, MC_LESSON_POOL[no - 1]);
      }
      else if (prep) openPrep(parseInt(prep.dataset.prep, 10));
      else if (teach) openTeach(parseInt(teach.dataset.teach, 10));
    });
    document.getElementById("lesson-page-back").addEventListener("click", closeMcLessons);
    // 课程包切换
    document.getElementById("lesson-pkg-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const open = lessonPkgMenu.hidden;
      lessonPkgMenu.hidden = !open;
      lessonPkgSwitch.classList.toggle("open", open);
    });
    lessonPkgMenu.addEventListener("click", (e) => {
      const opt = e.target.closest("[data-pkgopt]");
      if (!opt) return;
      lessonPkgMenu.hidden = true;
      lessonPkgSwitch.classList.remove("open");
      openMcLessons(myPackages[parseInt(opt.dataset.pkgopt, 10)]);
    });
    document.addEventListener("click", (e) => {
      if (!lessonPkgSwitch.contains(e.target)) { lessonPkgMenu.hidden = true; lessonPkgSwitch.classList.remove("open"); }
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lessonPage.hidden && document.getElementById("prep-page").hidden && document.getElementById("teach-page").hidden && resourcePage.hidden) closeMcLessons(); });
  }

  // 备课：全屏页面
  const prepPage = document.getElementById("prep-page");
  const prepSectionsEl = document.getElementById("prep-sections");
  const prepContentEl = document.getElementById("prep-content");
  const prepLessonSwitch = document.getElementById("prep-lesson-switch");
  const prepLessonMenu = document.getElementById("prep-lesson-menu");
  const PREP_SECTIONS = ["课程简介", "指导手册", "材料准备", "新知讲解", "互动体验", "巩固练习", "课程回顾"];
  let prepNo = 1;
  let prepSection = "课程简介";

  function lessonNameOf(no) { return MC_LESSON_POOL[(no - 1) % MC_LESSON_POOL.length]; }

  function renderPrep() {
    const name = lessonNameOf(prepNo);
    document.getElementById("prep-title").textContent = `第${prepNo}课时 ${name}`;
    prepLessonMenu.innerHTML = MC_LESSON_POOL.map((nm, i) =>
      `<button class="fp-switch-opt${(i + 1) === prepNo ? " active" : ""}" data-lessonopt="${i + 1}" type="button">第${i + 1}课时 ${esc(nm)}</button>`
    ).join("");
    prepSectionsEl.innerHTML = PREP_SECTIONS.map((s) =>
      `<button class="prep-sec${s === prepSection ? " active" : ""}" data-sec="${esc(s)}" type="button">${esc(s)}</button>`
    ).join("");
    if (prepSection === "课程简介") {
      prepContentEl.innerHTML =
        `<div class="pc-row"><span class="pc-key">课程名称：</span>${esc(name)}</div>` +
        `<div class="pc-row"><span class="pc-key">时长：</span>26分32秒</div>` +
        `<div class="pc-row"><span class="pc-key">课程流程：</span>课程导入 — 新知讲解 — 互动体验 — 巩固练习 — 课程回顾 — 课后成果</div>` +
        `<h3>教学目标</h3><ol><li>了解本课时的核心概念与背景</li><li>掌握关键知识点与操作方法</li><li>能在真实情境中迁移运用</li><li>感受人工智能与生活的联系</li></ol>` +
        `<h3>教学重难点</h3><ol><li>重点：核心概念的理解与应用</li><li>难点：从具体案例抽象出一般规律</li></ol>`;
    } else {
      prepContentEl.innerHTML = `<div class="pc-empty">「${esc(prepSection)}」环节内容开发中。</div>`;
    }
  }

  function openPrep(no) {
    prepNo = no;
    prepSection = "课程简介";
    renderPrep();
    prepPage.hidden = false;
    prepPage.scrollTop = 0;
    document.body.classList.add("modal-open");
  }
  function closePrep() {
    prepPage.hidden = true;
    if (lessonPage.hidden) document.body.classList.remove("modal-open");
  }

  if (prepPage) {
    document.getElementById("prep-back").addEventListener("click", closePrep);
    prepSectionsEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-sec]");
      if (!b) return;
      prepSection = b.dataset.sec;
      renderPrep();
    });
    document.getElementById("prep-prev").addEventListener("click", () => { if (prepNo > 1) { prepNo--; prepSection = "课程简介"; renderPrep(); } });
    document.getElementById("prep-next").addEventListener("click", () => { if (prepNo < MC_LESSON_POOL.length) { prepNo++; prepSection = "课程简介"; renderPrep(); } });
    document.getElementById("prep-lesson-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const open = prepLessonMenu.hidden;
      prepLessonMenu.hidden = !open;
      prepLessonSwitch.classList.toggle("open", open);
    });
    prepLessonMenu.addEventListener("click", (e) => {
      const opt = e.target.closest("[data-lessonopt]");
      if (!opt) return;
      prepLessonMenu.hidden = true;
      prepLessonSwitch.classList.remove("open");
      prepNo = parseInt(opt.dataset.lessonopt, 10);
      prepSection = "课程简介";
      renderPrep();
    });
    document.addEventListener("click", (e) => {
      if (!prepLessonSwitch.contains(e.target)) { prepLessonMenu.hidden = true; prepLessonSwitch.classList.remove("open"); }
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !prepPage.hidden) closePrep(); });
  }

  // ===== 片段式双师AI课：沉浸视频、互动与课堂报告 =====
  const teachPage = document.getElementById("teach-page");
  const teachContent = document.getElementById("teach-content");
  const teachSegmentsEl = document.getElementById("teach-segments");
  const teachBackdrop = document.getElementById("teach-backdrop");
  const teachPlayer = document.getElementById("teach-player");
  const teachTools = document.getElementById("teach-tools");
  const teachStepNav = document.querySelector(".teach-step-nav");
  const teachToolsMain = document.getElementById("teach-tools-main");
  const teachToolsMore = document.getElementById("teach-tools-more");
  const teachToolsToggle = document.getElementById("teach-tools-toggle");
  const TEACH_SEGMENTS = [
    { type: "video", title: "课程导入", detail: "人工智能就在身边", duration: 200, cover: "assets/img/ai-classroom-students.jpg" },
    { type: "quiz", title: "快速问答", detail: "判断生活中的人工智能", duration: 90 },
    { type: "image", title: "图片观察", detail: "发现智能感知线索", duration: 120 },
    { type: "video", title: "新知讲解", detail: "人工智能如何学习", duration: 320, cover: "assets/img/machine-learning-classroom.jpg" },
    { type: "game", title: "算法闯关", detail: "给机器人排好指令", duration: 150 },
    { type: "quiz", title: "巩固挑战", detail: "小组抢答", duration: 100 },
    { type: "report", title: "课堂报告", detail: "本节课学习总结", duration: 0 },
  ];
  const TEACH_ICON = {
    pk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h4v6H5zM15 14h4v6h-4z"/><path d="M9 7h3a4 4 0 0 1 4 4v3M15 17h-3a4 4 0 0 1-4-4v-3"/></svg>',
    ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="7" width="14" height="11" rx="4"/><path d="M12 3v4M8 12h.01M16 12h.01M9 15h6"/></svg>',
    group: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M15 15c3 0 5 1.5 5 4"/></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20z"/><path d="m14 7 3 3"/></svg>',
    cheer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 11V5a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v7-5a2 2 0 0 1 4 0v9c0 4-3 7-7 7h-1c-3 0-5-1-7-4l-2-3a2 2 0 0 1 3-2l2 2"/></svg>',
    timer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>',
    cast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3M7 9a5 5 0 0 1 5 5M7 12a2 2 0 0 1 2 2"/></svg>',
    ask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.5 2.5 0 0 1 4.8 1c0 1.8-2.5 2-2.5 3.7M12 17h.01"/></svg>',
  };
  const TEACH_TOOLS = [
    { key: "pk", label: "PK" }, { key: "ai", label: "AI教学" }, { key: "group", label: "分组PK" },
    { key: "pen", label: "画笔" }, { key: "cheer", label: "喝彩" },
    { key: "timer", label: "倒计时", more: true }, { key: "cast", label: "投屏", more: true }, { key: "ask", label: "抽问", more: true },
  ];
  let teachNo = 1;
  let teachIndex = 0;
  let teachCompleted = new Set();
  let teachChromeTimer = null;
  let teachPlayTimer = null;
  let teachSeconds = 0;
  let teachPlaying = false;
  let teachRankTab = "group";

  function toolButton(tool) {
    return `<button class="teach-tool" type="button" data-teach-tool="${tool.key}" title="${tool.label}">${TEACH_ICON[tool.key]}<span>${tool.label}</span></button>`;
  }
  if (teachToolsMain) {
    teachToolsMain.innerHTML = TEACH_TOOLS.filter((tool) => !tool.more).map(toolButton).join("");
    teachToolsMore.innerHTML = TEACH_TOOLS.filter((tool) => tool.more).map(toolButton).join("");
  }

  function formatTeachTime(seconds) {
    const value = Math.max(0, Math.floor(seconds));
    return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
  }

  function renderTeachSegments() {
    teachSegmentsEl.innerHTML = TEACH_SEGMENTS.map((segment, index) => {
      const classes = ["teach-segment", segment.type === "video" ? "video" : "interaction", teachCompleted.has(index) ? "learned" : "", index === teachIndex ? "current" : ""].filter(Boolean).join(" ");
      const state = teachCompleted.has(index) ? "已学" : "未学";
      return `<button class="${classes}" style="--segment-flex:${segment.type === "video" ? 1.45 : 1}" type="button" data-teach-segment="${index}" aria-label="${index + 1}. ${segment.title}，${state}" aria-current="${index === teachIndex ? "step" : "false"}" title="${segment.title} · ${state}"><span class="teach-segment-name">${segment.title}</span><span class="teach-segment-track" aria-hidden="true"></span></button>`;
    }).join("");
  }

  function coinIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#FFC83D"/><circle cx="12" cy="12" r="7" fill="none" stroke="#D99A16" stroke-width="1.5"/><path d="M12 7.5v9M9.4 10c0-1 1-1.7 2.6-1.7s2.6.7 2.6 1.7-.9 1.4-2.6 1.7-2.6.8-2.6 1.8 1 1.7 2.6 1.7 2.6-.7 2.6-1.7" fill="none" stroke="#D99A16" stroke-width="1.3" stroke-linecap="round"/></svg>';
  }

  function renderRankList(tab) {
    const data = {
      group: [["星河探索队", 1280], ["未来创造队", 1160], ["智慧先锋队", 980], ["数字梦想队", 860]],
      lesson: [["未来创造队", 460], ["星河探索队", 420], ["数字梦想队", 380], ["智慧先锋队", 340]],
      total: [["星河探索队", 9860], ["智慧先锋队", 9240], ["未来创造队", 8910], ["数字梦想队", 8350]],
    }[tab];
    const medalNames = ["金", "银", "铜"];
    const medalClasses = ["gold", "silver", "bronze"];
    return data.map((row, index) => `<div class="teach-rank-row${medalClasses[index] ? " r-" + medalClasses[index] : ""}"><span class="teach-medal ${medalClasses[index] || ""}">${medalNames[index] || index + 1}</span><span class="teach-rank-name">${row[0]}</span><span class="teach-rank-coins">${coinIcon()}${row[1]}</span></div>`).join("");
  }

  function renderTeachReport() {
    const stats = [
      { cls: "s-perf", label: "课堂表现", value: "优秀", icon: '<path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>' },
      { cls: "s-coin", label: "累计获得星芒币", value: "1,280", icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1 1.3-1.5 3-1.5s3 .6 3 1.7c0 2.3-6 1.3-6 3.6 0 1.1 1.3 1.7 3 1.7s3-.5 3-1.5"/>' },
      { cls: "s-count", label: "参与答题次数", value: "36 次", icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' },
      { cls: "s-acc", label: "平均答题正确率", value: "86%", icon: '<path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-3-3L7 14"/>' },
    ];
    const statHtml = stats.map((s) => `
      <div class="teach-report-stat ${s.cls}">
        <span class="trs-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${s.icon}</svg></span>
        <span class="trs-label">${s.label}</span>
        <strong>${s.value}</strong>
      </div>`).join("");
    const gains = [
      "能够识别生活中常见的人工智能应用，并说明它们解决的问题。",
      "理解人工智能通过数据学习规律，再完成识别与判断的基本过程。",
      "能用清晰、有序的指令完成一次简单的算法任务。",
    ];
    const gainHtml = gains.map((g, i) => `<div class="teach-gain g${i}"><i>${i + 1}</i><span>${g}</span></div>`).join("");
    return `<section class="teach-report">
      <div class="teach-report-head">
        <div class="trh-title">
          <span class="trh-trophy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></span>
          <div><h2>课堂总结报告</h2><p>第${teachNo}课时 · ${esc(lessonNameOf(teachNo))}</p></div>
        </div>
        <div class="teach-report-actions"><button type="button" data-report-back>返回课程</button><button class="primary" type="button" data-report-replay>再次学习</button></div>
      </div>
      <div class="teach-report-stats">${statHtml}</div>
      <div class="teach-report-grid">
        <article class="teach-report-card"><h3><span class="trc-dot d-gain"></span>本节课程收获</h3><div class="teach-gains">${gainHtml}</div></article>
        <article class="teach-report-card"><h3><span class="trc-dot d-rank"></span>课堂排行</h3><div class="teach-rank-tabs"><button class="teach-rank-tab${teachRankTab === "group" ? " active" : ""}" data-rank-tab="group" type="button">分组排行</button><button class="teach-rank-tab${teachRankTab === "lesson" ? " active" : ""}" data-rank-tab="lesson" type="button">本节排行</button><button class="teach-rank-tab${teachRankTab === "total" ? " active" : ""}" data-rank-tab="total" type="button">总排行</button></div><div class="teach-rank-list" id="teach-rank-list">${renderRankList(teachRankTab)}</div></article>
      </div>
    </section>`;
  }

  function renderTeachInteractive(segment) {
    if (segment.type === "quiz") {
      const isFinalQuiz = teachIndex > 4;
      const question = isFinalQuiz ? "要让机器人准确完成任务，哪一种指令更合适？" : "下面哪一项属于人工智能在生活中的应用？";
      const options = isFinalQuiz ? ["帮我整理一下", "把红色积木从左到右排成一行", "做得更好看", "随便放一放"] : ["自动识别人脸解锁", "普通纸质直尺", "没有电池的橡皮", "手动铅笔刀"];
      return `<section class="teach-interactive"><span class="teach-kicker">答题互动</span><h2>${question}</h2><p>请选择一个答案，教师端会同步显示班级作答结果。</p><div class="teach-quiz-options">${options.map((option, index) => `<button class="teach-answer" data-teach-answer="${index}" type="button"><span class="teach-answer-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join("")}</div><div class="teach-answer-feedback" id="teach-answer-feedback"></div></section>`;
    }
    if (segment.type === "image") {
      return `<section class="teach-interactive"><span class="teach-kicker">图片互动</span><h2>图中哪些信息能帮助机器识别课堂场景？</h2><p>点击右侧线索，和学生一起观察图像中的关键信息。</p><div class="teach-image-task"><img src="assets/img/computer-vision-experiment.jpg" alt="学生进行计算机视觉实验的课堂场景"><div class="teach-image-points"><button class="teach-image-point" type="button">人物与面部特征</button><button class="teach-image-point" type="button">桌面物品与设备</button><button class="teach-image-point" type="button">空间位置与动作</button></div></div></section>`;
    }
    return `<section class="teach-interactive"><span class="teach-kicker">游戏互动</span><h2>给机器人排出正确的执行顺序</h2><p>依次点击指令，完成“找到蓝色积木并放入收纳盒”的任务。</p><div class="teach-sort"><button class="teach-sort-item" type="button">识别蓝色积木</button><button class="teach-sort-item" type="button">移动到积木旁</button><button class="teach-sort-item" type="button">抓取积木</button><button class="teach-sort-item" type="button">放入收纳盒</button></div><div class="teach-game-result">已选择 0 / 4 步，按执行顺序点击即可。</div></section>`;
  }

  function stopTeachVideo() {
    teachPlaying = false;
    teachPage.classList.remove("is-playing");
    if (teachPlayTimer) { clearInterval(teachPlayTimer); teachPlayTimer = null; }
  }

  function updateTeachPlayer() {
    const segment = TEACH_SEGMENTS[teachIndex];
    document.getElementById("teach-time-now").textContent = formatTeachTime(teachSeconds);
    document.getElementById("teach-time-total").textContent = formatTeachTime(segment.duration);
    document.getElementById("teach-video-progress").style.width = `${segment.duration ? Math.min(100, teachSeconds / segment.duration * 100) : 0}%`;
  }

  function showTeachChrome() {
    if (!teachPage || teachPage.hidden) return;
    teachPage.classList.remove("chrome-hidden");
    if (teachChromeTimer) clearTimeout(teachChromeTimer);
    if (TEACH_SEGMENTS[teachIndex].type === "video") {
      teachChromeTimer = setTimeout(() => teachPage.classList.add("chrome-hidden"), 2400);
    }
  }

  function renderTeach() {
    const segment = TEACH_SEGMENTS[teachIndex];
    stopTeachVideo();
    teachSeconds = 0;
    document.getElementById("teach-step-count").textContent = `${teachIndex + 1} / ${TEACH_SEGMENTS.length}`;
    document.getElementById("teach-prev").disabled = teachIndex === 0;
    document.querySelector("#teach-next span").textContent = teachIndex === TEACH_SEGMENTS.length - 2 ? "查看报告" : "下一步";
    renderTeachSegments();
    teachContent.className = "teach-content";
    teachPlayer.hidden = segment.type !== "video";
    teachTools.hidden = segment.type === "report";
    teachStepNav.hidden = segment.type === "report";
    teachPage.classList.remove("chrome-hidden");
    teachPage.classList.toggle("teach-light", segment.type !== "video");

    if (segment.type === "video") {
      teachBackdrop.style.backgroundImage = `url("${segment.cover || MC_LESSON_COVERS[(teachNo - 1) % MC_LESSON_COVERS.length]}")`;
      teachBackdrop.style.filter = "none";
      teachContent.innerHTML = "";
      updateTeachPlayer();
      showTeachChrome();
    } else if (segment.type === "report") {
      teachCompleted = new Set(TEACH_SEGMENTS.slice(0, -1).map((_, index) => index));
      renderTeachSegments();
      teachBackdrop.style.backgroundImage = "none";
      teachContent.classList.add("is-report");
      teachContent.innerHTML = renderTeachReport();
      teachContent.scrollTop = 0;
    } else {
      teachBackdrop.style.backgroundImage = "none";
      teachContent.classList.add("is-interactive");
      teachContent.innerHTML = renderTeachInteractive(segment);
      teachContent.scrollTop = 0;
    }
    teachContent.focus({ preventScroll: true });
  }

  function moveTeachTo(index) {
    if (index < 0 || index >= TEACH_SEGMENTS.length || index === teachIndex) return;
    if (index > teachIndex) teachCompleted.add(teachIndex);
    teachIndex = index;
    renderTeach();
  }

  function openTeach(no) {
    teachNo = no || 1;
    teachIndex = 0;
    teachCompleted = new Set();
    teachRankTab = "group";
    teachPage.hidden = false;
    document.body.classList.add("modal-open");
    renderTeach();
  }

  function closeTeach() {
    stopTeachVideo();
    if (teachChromeTimer) clearTimeout(teachChromeTimer);
    teachPage.hidden = true;
    teachPage.classList.remove("chrome-hidden");
    if (lessonPage.hidden) document.body.classList.remove("modal-open");
  }

  if (teachPage) {
    document.getElementById("teach-back").addEventListener("click", closeTeach);
    document.getElementById("teach-prev").addEventListener("click", () => moveTeachTo(teachIndex - 1));
    document.getElementById("teach-next").addEventListener("click", () => moveTeachTo(teachIndex + 1));
    document.getElementById("teach-play").addEventListener("click", () => {
      if (teachPlaying) { stopTeachVideo(); return; }
      teachPlaying = true;
      teachPage.classList.add("is-playing");
      teachPlayTimer = setInterval(() => {
        const segment = TEACH_SEGMENTS[teachIndex];
        teachSeconds++;
        if (teachSeconds >= segment.duration) {
          teachSeconds = segment.duration;
          teachCompleted.add(teachIndex);
          renderTeachSegments();
          stopTeachVideo();
          showTeachChrome();
        }
        updateTeachPlayer();
      }, 1000);
      showTeachChrome();
    });
    document.getElementById("teach-sound").addEventListener("click", () => showToast("已切换课堂声音"));
    document.getElementById("teach-screen").addEventListener("click", () => {
      if (!document.fullscreenElement && teachPage.requestFullscreen) teachPage.requestFullscreen();
      else if (document.exitFullscreen) document.exitFullscreen();
    });
    teachSegmentsEl.addEventListener("click", (event) => {
      const button = event.target.closest("[data-teach-segment]");
      if (button) moveTeachTo(parseInt(button.dataset.teachSegment, 10));
    });
    teachToolsToggle.addEventListener("click", () => {
      const open = teachToolsMore.hidden;
      teachToolsMore.hidden = !open;
      teachToolsToggle.classList.toggle("open", open);
      teachToolsToggle.setAttribute("aria-expanded", String(open));
      teachToolsToggle.title = open ? "收起更多工具" : "展开更多工具";
      showTeachChrome();
    });
    teachTools.addEventListener("click", (event) => {
      const button = event.target.closest("[data-teach-tool]");
      if (!button) return;
      button.classList.toggle("active");
      const tool = TEACH_TOOLS.find((item) => item.key === button.dataset.teachTool);
      showToast(`${tool.label}${button.classList.contains("active") ? "已开启" : "已关闭"}`);
      showTeachChrome();
    });
    document.getElementById("teach-help").addEventListener("click", () => showToast("课堂帮助：移动鼠标显示控制，点击顶部片段可快速切换"));
    teachContent.addEventListener("click", (event) => {
      const answer = event.target.closest("[data-teach-answer]");
      if (answer) {
        teachContent.querySelectorAll(".teach-answer").forEach((button) => button.classList.remove("selected", "correct"));
        answer.classList.add("selected");
        const correctIndex = teachIndex > 4 ? 1 : 0;
        const isCorrect = parseInt(answer.dataset.teachAnswer, 10) === correctIndex;
        if (isCorrect) answer.classList.add("correct");
        document.getElementById("teach-answer-feedback").textContent = isCorrect ? "回答正确，星芒币 +20" : "再想一想：清晰、具体的信息更容易被机器理解。";
        if (isCorrect) teachCompleted.add(teachIndex);
        renderTeachSegments();
      }
      const point = event.target.closest(".teach-image-point");
      if (point) { point.classList.toggle("active"); teachCompleted.add(teachIndex); renderTeachSegments(); }
      const sortItem = event.target.closest(".teach-sort-item");
      if (sortItem && !sortItem.classList.contains("active")) {
        sortItem.classList.add("active");
        const count = teachContent.querySelectorAll(".teach-sort-item.active").length;
        teachContent.querySelector(".teach-game-result").textContent = count === 4 ? "挑战完成，指令顺序清晰，星芒币 +30" : `已选择 ${count} / 4 步，继续完成任务。`;
        if (count === 4) { teachCompleted.add(teachIndex); renderTeachSegments(); }
      }
      const rankTab = event.target.closest("[data-rank-tab]");
      if (rankTab) {
        teachRankTab = rankTab.dataset.rankTab;
        teachContent.querySelectorAll(".teach-rank-tab").forEach((button) => button.classList.toggle("active", button === rankTab));
        document.getElementById("teach-rank-list").innerHTML = renderRankList(teachRankTab);
      }
      if (event.target.closest("[data-report-back]")) closeTeach();
      if (event.target.closest("[data-report-replay]")) { teachIndex = 0; teachCompleted = new Set(); renderTeach(); }
    });
    ["mousemove", "pointerdown", "keydown"].forEach((eventName) => teachPage.addEventListener(eventName, showTeachChrome));
    document.addEventListener("keydown", (event) => {
      if (teachPage.hidden) return;
      if (event.key === "Escape" && !document.fullscreenElement) closeTeach();
      if (event.key === "ArrowLeft") moveTeachTo(teachIndex - 1);
      if (event.key === "ArrowRight") moveTeachTo(teachIndex + 1);
      if (event.key === " " && TEACH_SEGMENTS[teachIndex].type === "video") { event.preventDefault(); document.getElementById("teach-play").click(); }
    });
  }

  // ===== 双师AI课堂：沉浸式页面 =====
  const classroomPage = document.getElementById("classroom-page");
  const clsTeacherEl = document.getElementById("cls-teacher");
  const clsStageName = document.getElementById("cls-stage-name");
  const clsRolesEl = document.getElementById("cls-roles");
  const clsCourseListEl = document.getElementById("cls-course-list");
  const clsClassSwitch = document.getElementById("cls-class-switch");
  const clsClassMenu = document.getElementById("cls-class-menu");
  const CLS_ROLES = [
    {
      name: "智雅",
      actions: [
        IMG + "digital-human-action-1.gif",
        IMG + "digital-human-action-2.gif",
        IMG + "digital-human-action-3.gif",
        IMG + "digital-human-action-4.gif",
      ],
    },
  ];
  const CLS_COVERS = [
    IMG + "ai-course-spring-redesign.png", IMG + "ai-course-autumn-redesign.png",
    IMG + "robotics-kit.jpg", IMG + "computer-vision-experiment.jpg",
    IMG + "machine-learning-classroom.jpg", IMG + "online-lab-interface.jpg",
  ];
  const CARET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="6 9 12 15 18 9"/></svg>';
  let clsClassId = null;
  let clsRole = 0;
  let clsAction = 0;
  let clsActionTimer = null;

  function teacherAvatar(role, className) {
    const actions = role.actions || [];
    const src = actions[clsAction % Math.max(actions.length, 1)] || "";
    return `<img class="${className}" src="${src}" alt="${esc(role.name)}数字老师" loading="eager">`;
  }

  function renderClsTeacher() {
    const role = CLS_ROLES[clsRole];
    clsTeacherEl.innerHTML = teacherAvatar(role, "cls-teacher-img");
    clsStageName.innerHTML = esc(role.name) + CARET;
    clsRolesEl.innerHTML = CLS_ROLES.map((r, i) =>
      `<button class="cls-role${i === clsRole ? " active" : ""}" data-role="${i}" type="button" title="${esc(r.name)}">${teacherAvatar(r, "cls-role-img")}</button>`
    ).join("");
  }

  function startClsActionLoop() {
    if (clsActionTimer) clearInterval(clsActionTimer);
    clsActionTimer = setInterval(() => {
      const role = CLS_ROLES[clsRole];
      const actions = (role && role.actions) || [];
      if (actions.length < 2 || classroomPage.hidden) return;
      clsAction = (clsAction + 1) % actions.length;
      renderClsTeacher();
    }, 8000);
  }

  function renderClsCourses() {
    const cls = classStore.find((c) => c.id === clsClassId);
    const courses = (cls && cls.courses) || [];
    if (!courses.length) {
      clsCourseListEl.innerHTML = `<div class="cls-courses-empty">
        <p>该班级暂无课程，请先添加课程。</p>
        <button class="primary-action cls-add-course" data-cls-add-course type="button">添加课程</button>
      </div>`;
      return;
    }
    clsCourseListEl.innerHTML = courses.map((co, i) => {
      const total = 10;
      const done = [0, 3, 6, 1, 8, 0][i % 6];
      return `<div class="cls-course-card" data-clscourse="${i}">
        <div class="cls-cc-cover"><img src="${CLS_COVERS[i % CLS_COVERS.length]}" alt="${esc(co.package)}"><span class="cls-cc-badge">${done}/${total}</span></div>
        <div class="cls-cc-title">${esc(co.package)}</div>
      </div>`;
    }).join("");
  }

  function renderClsClassMenu() {
    clsClassMenu.innerHTML = classStore.map((c) =>
      `<button class="fp-switch-opt${c.id === clsClassId ? " active" : ""}" data-clsopt="${c.id}" type="button">${esc(c.name)}</button>`
    ).join("");
  }

  function renderClassroom() {
    const cls = classStore.find((c) => c.id === clsClassId);
    document.getElementById("cls-class-name").textContent = cls ? cls.name : "暂无班级";
    renderClsClassMenu();
    renderClsTeacher();
    renderClsCourses();
  }

  function openClassroom() {
    if (!classStore.length) { showToast("请先在班级管理创建班级"); return; }
    if (!classStore.find((c) => c.id === clsClassId)) clsClassId = classStore[0].id;
    clsAction = 0;
    renderClassroom();
    classroomPage.hidden = false;
    classroomPage.scrollTop = 0;
    document.body.classList.add("modal-open");
    startClsActionLoop();
  }
  function closeClassroom() {
    classroomPage.hidden = true;
    document.body.classList.remove("modal-open");
    if (clsActionTimer) {
      clearInterval(clsActionTimer);
      clsActionTimer = null;
    }
  }

  if (classroomPage) {
    document.getElementById("cls-exit").addEventListener("click", closeClassroom);
    clsRolesEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-role]");
      if (!b) return;
      clsRole = parseInt(b.dataset.role, 10);
      clsAction = 0;
      renderClsTeacher();
      startClsActionLoop();
    });
    clsCourseListEl.addEventListener("click", (e) => {
      const addBtn = e.target.closest("[data-cls-add-course]");
      if (addBtn) {
        openCourseModal(clsClassId);
        return;
      }
      const card = e.target.closest("[data-clscourse]");
      if (!card) return;
      const cls = classStore.find((c) => c.id === clsClassId);
      const co = cls.courses[parseInt(card.dataset.clscourse, 10)];
      if (!co) return;
      closeClassroom();
      openMcLessons({ names: [co.package], klass: cls.name, cover: CLS_COVERS[parseInt(card.dataset.clscourse, 10) % CLS_COVERS.length] });
    });
    document.getElementById("cls-class-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const open = clsClassMenu.hidden;
      clsClassMenu.hidden = !open;
      clsClassSwitch.classList.toggle("open", open);
    });
    clsClassMenu.addEventListener("click", (e) => {
      const opt = e.target.closest("[data-clsopt]");
      if (!opt) return;
      clsClassId = opt.dataset.clsopt;
      clsClassMenu.hidden = true;
      clsClassSwitch.classList.remove("open");
      renderClassroom();
    });
    document.addEventListener("click", (e) => {
      if (!clsClassSwitch.contains(e.target)) { clsClassMenu.hidden = true; clsClassSwitch.classList.remove("open"); }
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !classroomPage.hidden) closeClassroom(); });
  }

  renderTodaySchedule();
  renderMiniCal();

  const calBtn = document.getElementById("course-calendar-btn");
  if (calBtn) calBtn.addEventListener("click", showMcCalendar);
  const mcCalBack = document.getElementById("mc-cal-back");
  if (mcCalBack) mcCalBack.addEventListener("click", showMcHome);
  const calTabs = document.querySelectorAll(".cal-tab");
  calTabs.forEach((tab) => tab.addEventListener("click", () => {
    calTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    calWeekOffset = parseInt(tab.dataset.week, 10);
    renderCalWeek(calWeekOffset);
  }));

  // 顶部按钮
  document.getElementById("refresh-btn").addEventListener("click", () => {
    showToast("已刷新");
  });
  // ===== 设置下拉：演示数据状态切换 =====
  const settingsBtn = document.getElementById("settings-btn");
  const settingsPop = document.getElementById("settings-pop");
  if (settingsBtn && settingsPop) {
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = settingsPop.hidden;
      settingsPop.hidden = !open;
      settingsBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (!settingsPop.hidden && !settingsPop.contains(e.target) && e.target !== settingsBtn) {
        settingsPop.hidden = true; settingsBtn.setAttribute("aria-expanded", "false");
      }
    });
    // 体验新手状态：清空学校 + 班级（置空数组，避免重新播种）
    document.getElementById("settings-empty").addEventListener("click", () => {
      localStorage.removeItem(SCHOOL_KEY);
      localStorage.setItem(CLASS_KEY, "[]");
      showToast("已切换到新手无数据状态");
      setTimeout(() => location.reload(), 500);
    });
    // 恢复演示数据：清空学校 + 移除班级（下次加载自动播种示例）
    document.getElementById("settings-demo").addEventListener("click", () => {
      localStorage.removeItem(SCHOOL_KEY);
      localStorage.removeItem(CLASS_KEY);
      showToast("已恢复演示数据");
      setTimeout(() => location.reload(), 500);
    });
  }

  // ===== 新手引导弹窗（绑定学校 → 创建班级 → 添加课程） =====
  const onboardModal = document.getElementById("onboard-modal");
  const onboardBtn = document.getElementById("onboard-btn");
  const obStepsEl = document.getElementById("ob-steps");
  const obBar = document.getElementById("ob-bar");
  const obSub = document.getElementById("ob-sub");

  function onboardState() {
    const hasSchool = !!loadSchool();
    const hasClass = classStore.length > 0;
    const hasCourse = classStore.some((c) => Array.isArray(c.courses) && c.courses.length > 0);
    return [
      { key: "school", done: hasSchool, title: "绑定学校", desc: "按省市区选择所在学校，绑定后即可创建班级", btn: "去绑定", act: () => openSchoolModal() },
      { key: "class", done: hasClass, title: "创建班级", desc: "填写年级与班级名称，建立你的第一个班级", btn: "去创建", act: () => openClassForm(), locked: !hasSchool },
      { key: "course", done: hasCourse, title: "添加课程", desc: "为班级选择课程包，即可排课与上课", btn: "去添加", act: () => { const t = document.querySelector('.menu-item[data-target="class-management"]'); if (t) t.click(); }, locked: !hasClass },
    ];
  }
  function onboardDone() { return onboardState().every((s) => s.done); }
  // 仅在用户主动切换到「空数据」的新手场景时展示引导；
  // 演示数据即使未绑定学校，也不应打断正常浏览。
  function shouldShowOnboard() { return classStore.length === 0; }

  function fillOnboardSteps() {
    const steps = onboardState();
    const doneCount = steps.filter((s) => s.done).length;
    if (obBar) obBar.style.width = `${(doneCount / steps.length) * 100}%`;
    if (obSub) obSub.textContent = `已完成 ${doneCount} / ${steps.length} 步，完成后即可排课与上课`;
    if (obStepsEl) obStepsEl.innerHTML = steps.map((s, i) => {
      const num = s.done
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
        : (i + 1);
      const action = s.done
        ? '<span class="ob-done">已完成</span>'
        : `<button class="ob-go${s.locked ? " locked" : ""}" data-ob="${s.key}"${s.locked ? " disabled" : ""}>${s.btn}</button>`;
      return `<div class="ob-step${s.done ? " done" : ""}${s.locked ? " locked" : ""}">
        <span class="ob-num">${num}</span>
        <span class="ob-step-text"><b>${s.title}</b><i>${s.desc}</i></span>
        ${action}
      </div>`;
    }).join("");
  }

  function openOnboard() {
    if (!onboardModal) return;
    fillOnboardSteps();
    onboardModal.hidden = false;
    document.body.classList.add("modal-open");
  }
  function closeOnboard() {
    if (!onboardModal) return;
    onboardModal.hidden = true;
    if (!document.querySelector('.modal-backdrop:not([hidden]), .fullpage:not([hidden])')) {
      document.body.classList.remove("modal-open");
    }
  }
  // 仅空数据场景提供顶部入口，正常演示数据不显示也不自动弹出。
  function renderOnboard() {
    const shouldShow = shouldShowOnboard() && !onboardDone();
    if (onboardBtn) onboardBtn.hidden = !shouldShow;
    if (!shouldShow) { closeOnboard(); return; }
    if (onboardModal && !onboardModal.hidden) fillOnboardSteps();
  }

  if (onboardModal) {
    obStepsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-ob]");
      if (!btn) return;
      const step = onboardState().find((s) => s.key === btn.dataset.ob);
      if (step && !step.locked) { closeOnboard(); step.act(); }
    });
    document.getElementById("ob-close").addEventListener("click", closeOnboard);
    document.getElementById("ob-later").addEventListener("click", closeOnboard);
    onboardModal.addEventListener("click", (e) => { if (e.target === onboardModal) closeOnboard(); });
    if (onboardBtn) onboardBtn.addEventListener("click", openOnboard);
    // 仅在「体验新手状态」的空数据场景自动弹出。
    renderOnboard();
    if (shouldShowOnboard() && !onboardDone()) openOnboard();
  }
  // ===== 个人中心下拉面板 =====
  const profilePop = document.getElementById("profile-pop");
  const avatarBtn = document.getElementById("topbar-avatar");

  function applyUserToUI(name) {
    const initial = name.charAt(0) || "";
    const h = new Date().getHours();
    const greeting = h < 6 ? "凌晨好" : h < 12 ? "早上好" : h < 14 ? "中午好" : h < 18 ? "下午好" : "晚上好";
    document.getElementById("sidebar-greet").textContent = `${greeting}，${name}`;
    document.getElementById("sidebar-avatar").textContent = initial;
    document.getElementById("topbar-av").textContent = initial;
    document.getElementById("topbar-name").textContent = name;
    document.getElementById("pp-av").textContent = initial;
    document.getElementById("pp-name").textContent = name;
  }

  function renderProfileSchool() {
    const name = loadSchool();
    const el = document.getElementById("pp-school");
    if (el) el.textContent = name || "未绑定学校";
    const side = document.getElementById("sidebar-school");
    if (side) side.textContent = name || "未绑定学校";
  }

  // 初始化面板信息
  (function initProfile() {
    let u = {};
    try { u = JSON.parse(localStorage.getItem("hndj_user") || "{}"); } catch (e) { /* ignore */ }
    document.getElementById("pp-av").textContent = (u.name || "").charAt(0);
    document.getElementById("pp-name").textContent = u.name || "用户";
    document.getElementById("pp-phone").textContent = u.account || "未绑定手机号";
    renderProfileSchool();
  })();

  // 切换学校（复用班级管理里的绑定学校弹窗）
  function switchSchoolFromProfile() {
    toggleProfile(false);
    openSchoolModal();
  }
  document.getElementById("pp-swap").addEventListener("click", (e) => { e.stopPropagation(); switchSchoolFromProfile(); });
  document.getElementById("pp-school").addEventListener("click", (e) => { e.stopPropagation(); switchSchoolFromProfile(); });

  function toggleProfile(open) {
    const willOpen = open !== undefined ? open : profilePop.hidden;
    profilePop.hidden = !willOpen;
    avatarBtn.setAttribute("aria-expanded", String(willOpen));
  }

  avatarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleProfile();
  });
  document.addEventListener("click", (e) => {
    if (profilePop.hidden) return;
    if (!profilePop.contains(e.target) && !e.target.closest("#topbar-avatar")) toggleProfile(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !profilePop.hidden) toggleProfile(false);
  });

  // 退出登录
  document.getElementById("pp-logout").addEventListener("click", () => {
    if (confirm("是否退出登录？")) {
      localStorage.removeItem("hndj_user");
      window.location.href = "login.html";
    }
  });

  // 行内编辑姓名
  document.getElementById("pp-edit-name").addEventListener("click", () => {
    if (document.getElementById("pp-name-input")) return;
    const nameEl = document.getElementById("pp-name");
    const cur = nameEl.textContent;
    const input = document.createElement("input");
    input.id = "pp-name-input";
    input.className = "pp-name-input";
    input.value = cur;
    input.maxLength = 12;
    nameEl.replaceWith(input);
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    let committed = false;
    function commit() {
      if (committed) return;
      committed = true;
      const name = input.value.trim() || cur;
      const span = document.createElement("span");
      span.className = "pp-name";
      span.id = "pp-name";
      span.textContent = name;
      input.replaceWith(span);
      let u = {};
      try { u = JSON.parse(localStorage.getItem("hndj_user") || "{}"); } catch (e) { /* ignore */ }
      u.name = name;
      localStorage.setItem("hndj_user", JSON.stringify(u));
      applyUserToUI(name);
      if (name !== cur) showToast("姓名已更新");
    }
    input.addEventListener("keydown", (ev) => {
      ev.stopPropagation();
      if (ev.key === "Enter") input.blur();
      if (ev.key === "Escape") { input.value = cur; input.blur(); }
    });
    input.addEventListener("blur", commit, { once: true });
  });

  // 暂未接入后端的占位操作
  const placeholders = {
    "pp-photo": "更换头像功能开发中",
    "pp-edit-phone": "修改手机号功能开发中",
    "pp-edit-pwd": "修改密码功能开发中",
  };
  Object.keys(placeholders).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", (e) => { e.stopPropagation(); showToast(placeholders[id]); });
  });
})();
