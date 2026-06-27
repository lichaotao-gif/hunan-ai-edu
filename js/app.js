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
      title: "人工智能 · 春季",
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
      title: "人工智能 · 秋季",
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
  const demoClasses = [
    { id: "c1", name: "四年级(1)班", students: 42 },
    { id: "c2", name: "五年级(2)班", students: 39 },
    { id: "c3", name: "七年级(3)班", students: 45 },
  ];
  let activeCourseKey = "spring";
  let activeLessonName = "";
  let selectedClassId = demoClasses[0] && demoClasses[0].id;

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
    if (demoClasses.length === 0) {
      classListEl.innerHTML = "";
      classListEl.hidden = true;
      classActionsEl.hidden = true;
      classEmptyEl.hidden = false;
    } else {
      classListEl.hidden = false;
      classActionsEl.hidden = false;
      classEmptyEl.hidden = true;
      classListEl.innerHTML = demoClasses.map((item) => `
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
  document.getElementById("package-create-class").addEventListener("click", openClassModal);
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
    const selected = demoClasses.find((item) => item.id === selectedClassId);
    showToast(selected ? `已添加到${selected.name}` : "请选择班级");
    if (selected) closeClassModal();
  });
  document.getElementById("create-class-btn").addEventListener("click", () => {
    showToast("创建班级功能开发中");
  });
  document.getElementById("create-class-empty").addEventListener("click", () => {
    showToast("创建班级功能开发中");
  });

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

  // ===== 我的课程：课程包板块 =====
  const myPackages = [
    { cover: IMG + "ai-course-spring-redesign.png", names: ["人工智能（一上）"], status: "未开始", klass: "一年级(2)班" },
    { cover: IMG + "ai-course-autumn-redesign.png", names: ["人工智能（二上）"], status: "未开始", klass: "二年级(1)班" },
    { cover: IMG + "robotics-kit.jpg", names: ["人工智能（三上）"], status: "未开始", klass: "三年级(4)班" },
    { cover: IMG + "computer-vision-experiment.jpg", names: ["人工智能（七下）"], status: "未开始", klass: "七年级(3)班" },
    { cover: IMG + "machine-learning-classroom.jpg", names: ["人工智能（八下）"], status: "未开始", klass: "八年级(2)班" },
  ];

  const pkgListEl = document.getElementById("my-pkg-list");
  if (pkgListEl) {
    pkgListEl.innerHTML = myPackages.map((p, i) => `
      <article class="pkg-card">
        <div class="pkg-cover">
          <img src="${p.cover}" alt="${p.names[0]}">
          <span class="pkg-status">${p.status}</span>
        </div>
        <div class="pkg-info">
          <div class="pkg-title-row">
            <div class="pkg-names">${p.names.map((n) => `<span class="pkg-name">${n}</span>`).join("")}</div>
            <div class="pkg-more">
              <button class="pkg-more-btn" data-more="${i}" aria-label="更多操作">
                <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
              </button>
              <div class="pkg-menu" data-menu="${i}">
                <button data-act="edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                  编辑
                </button>
                <button data-act="delete" class="danger">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  删除
                </button>
              </div>
            </div>
          </div>
          <div class="pkg-meta"><span class="k">上课班级：</span><span class="klass">${p.klass}</span></div>
          <div class="pkg-meta"><span class="k">计划授课：</span>暂无计划</div>
        </div>
      </article>`).join("");

    function closeAllPkgMenus() {
      pkgListEl.querySelectorAll(".pkg-menu.open").forEach((m) => m.classList.remove("open"));
    }
    pkgListEl.addEventListener("click", (e) => {
      const moreBtn = e.target.closest(".pkg-more-btn");
      if (moreBtn) {
        const menu = pkgListEl.querySelector(`.pkg-menu[data-menu="${moreBtn.dataset.more}"]`);
        const isOpen = menu.classList.contains("open");
        closeAllPkgMenus();
        if (!isOpen) menu.classList.add("open");
        return;
      }
      const actBtn = e.target.closest(".pkg-menu button");
      if (actBtn) {
        showToast(actBtn.dataset.act === "edit" ? "编辑课程包（开发中）" : "删除课程包（开发中）");
        closeAllPkgMenus();
        return;
      }
      const plan = e.target.closest("[data-plan]");
      if (plan) { e.preventDefault(); showToast("授课计划（开发中）"); }
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".pkg-more")) closeAllPkgMenus();
    });
  }

  // ===== 我的AI实验：实验包列表 =====
  const myExpPackages = [
    { cover: IMG + "computer-vision-experiment.jpg", names: ["人工智能（八下）实验包"], status: "未开始", klass: "八年级(2)班", count: "8 个实验 · 线上 / 线下" },
    { cover: IMG + "robotics-kit.jpg", names: ["人工智能（三上）实验包"], status: "未开始", klass: "三年级(4)班", count: "6 个实验 · 线上 / 线下" },
    { cover: IMG + "online-lab-interface.jpg", names: ["人工智能（七下）实验包"], status: "未开始", klass: "七年级(3)班", count: "8 个实验 · 线上 / 线下" },
  ];

  const expListEl = document.getElementById("my-exp-list");
  if (expListEl) {
    expListEl.innerHTML = myExpPackages.map((p, i) => `
      <article class="pkg-card">
        <div class="pkg-cover">
          <img src="${p.cover}" alt="${p.names[0]}">
          <span class="pkg-status">${p.status}</span>
        </div>
        <div class="pkg-info">
          <div class="pkg-title-row">
            <div class="pkg-names">${p.names.map((n) => `<span class="pkg-name">${n}</span>`).join("")}</div>
            <div class="pkg-more">
              <button class="pkg-more-btn" data-more="${i}" aria-label="更多操作">
                <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
              </button>
              <div class="pkg-menu" data-menu="${i}">
                <button data-act="edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                  编辑
                </button>
                <button data-act="delete" class="danger">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  删除
                </button>
              </div>
            </div>
          </div>
          <div class="pkg-meta"><span class="k">上课班级：</span><span class="klass">${p.klass}</span></div>
          <div class="pkg-meta"><span class="k">实验数量：</span>${p.count}</div>
        </div>
      </article>`).join("");

    function closeAllExpMenus() {
      expListEl.querySelectorAll(".pkg-menu.open").forEach((m) => m.classList.remove("open"));
    }
    expListEl.addEventListener("click", (e) => {
      const moreBtn = e.target.closest(".pkg-more-btn");
      if (moreBtn) {
        const menu = expListEl.querySelector(`.pkg-menu[data-menu="${moreBtn.dataset.more}"]`);
        const isOpen = menu.classList.contains("open");
        closeAllExpMenus();
        if (!isOpen) menu.classList.add("open");
        return;
      }
      const actBtn = e.target.closest(".pkg-menu button");
      if (actBtn) {
        showToast(actBtn.dataset.act === "edit" ? "编辑实验包（开发中）" : "删除实验包（开发中）");
        closeAllExpMenus();
      }
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#my-exp-list .pkg-more")) closeAllExpMenus();
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
      id: "ai-autumn", title: "人工智能 · 秋季", cover: IMG + "ai-course-autumn-redesign.png",
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

  // ===== 数字资源：教学资源云盘 =====
  const driveRoot = {
    name: "全部资源",
    children: [
      { type: "folder", name: "一年级教案", children: [
        { type: "file", name: "认识人工智能-教学设计.docx", ext: "docx", size: "1.8 MB", date: "2024-06-18" },
        { type: "file", name: "第一课课件.pptx", ext: "pptx", size: "5.2 MB", date: "2024-06-18" },
      ] },
      { type: "folder", name: "课件素材", children: [
        { type: "file", name: "机器人插图.png", ext: "png", size: "820 KB", date: "2024-06-15" },
        { type: "file", name: "课堂演示动画.mp4", ext: "mp4", size: "48 MB", date: "2024-06-12" },
      ] },
      { type: "folder", name: "试题与作业", children: [
        { type: "file", name: "单元测试卷.pdf", ext: "pdf", size: "640 KB", date: "2024-06-10" },
        { type: "file", name: "成绩统计.xlsx", ext: "xlsx", size: "210 KB", date: "2024-06-10" },
      ] },
      { type: "file", name: "认识人工智能.pptx", ext: "pptx", size: "6.4 MB", date: "2024-06-20" },
      { type: "file", name: "图像识别教学设计.docx", ext: "docx", size: "2.1 MB", date: "2024-06-19" },
      { type: "file", name: "班级成绩统计表.xlsx", ext: "xlsx", size: "186 KB", date: "2024-06-19" },
      { type: "file", name: "AI伦理讨论资料.pdf", ext: "pdf", size: "1.1 MB", date: "2024-06-17" },
      { type: "file", name: "课堂实录.mp4", ext: "mp4", size: "126 MB", date: "2024-06-16" },
      { type: "file", name: "机器人课堂照片.jpg", ext: "jpg", size: "2.4 MB", date: "2024-06-14" },
      { type: "file", name: "教具清单.txt", ext: "txt", size: "3 KB", date: "2024-06-13" },
    ],
  };

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

    breadcrumbEl.innerHTML = drivePath.map((f, i) => {
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

  if (driveListEl) {
    renderDrive();
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
    document.getElementById("new-folder-btn").addEventListener("click", () => showToast("新建文件夹（开发中）"));
    document.getElementById("upload-btn").addEventListener("click", () => showToast("上传文件（开发中）"));
  }

  const dualBanner = document.getElementById("dual-banner");
  if (dualBanner) dualBanner.addEventListener("click", () => showToast("进入双师AI课堂（开发中）"));
  const calBtn = document.getElementById("course-calendar-btn");
  if (calBtn) calBtn.addEventListener("click", () => showToast("课程日历（开发中）"));
  const moreBtn = document.getElementById("course-more-btn");
  if (moreBtn) moreBtn.addEventListener("click", () => showToast("查看更多课表（开发中）"));

  // 顶部按钮
  document.getElementById("refresh-btn").addEventListener("click", () => {
    showToast("已刷新");
  });
  document.getElementById("settings-btn").addEventListener("click", () => {
    showToast("设置功能开发中");
  });
  document.getElementById("topbar-avatar").addEventListener("click", () => {
    if (confirm("是否退出登录？")) {
      localStorage.removeItem("hndj_user");
      window.location.href = "login.html";
    }
  });
})();
