(function () {
  const tabs = document.querySelectorAll(".login-tabs .tab");
  const tabBar = document.querySelector(".login-tabs");
  const panels = {
    code: document.getElementById("panel-code"),
    pwd: document.getElementById("panel-pwd"),
    reset: document.getElementById("panel-reset"),
  };

  // 切换面板；reset 为无 tab 的独立面板
  function showPanel(name) {
    Object.values(panels).forEach((p) => p.classList.remove("active"));
    panels[name].classList.add("active");
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
    // 重置密码页隐藏顶部 Tab 切换
    tabBar.style.display = name === "reset" ? "none" : "";
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => showPanel(tab.dataset.tab));
  });

  document.getElementById("to-reset").addEventListener("click", () => showPanel("reset"));
  document.getElementById("back-login").addEventListener("click", () => showPanel("pwd"));

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 2000);
  }

  const phoneInput = document.getElementById("phone-input");

  // 验证码倒计时（可复用于登录与重置密码）
  function bindCodeButton(btn, phoneEl) {
    let countdown = 0;
    btn.addEventListener("click", () => {
      if (!/^1\d{10}$/.test(phoneEl.value.trim())) {
        showToast("请输入正确的手机号");
        return;
      }
      if (countdown > 0) return;
      countdown = 60;
      btn.disabled = true;
      showToast("验证码已发送（演示：123456）");
      const timer = setInterval(() => {
        countdown -= 1;
        btn.textContent = `${countdown}秒后重新获取`;
        if (countdown <= 0) {
          clearInterval(timer);
          btn.disabled = false;
          btn.textContent = "获取验证码";
        }
      }, 1000);
    });
  }
  bindCodeButton(document.getElementById("code-btn"), phoneInput);
  bindCodeButton(document.getElementById("reset-code-btn"), document.getElementById("reset-phone"));

  function goHome() {
    showToast("登录成功");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
  }

  function requireAgreement(checkbox) {
    if (checkbox.checked) return true;
    showToast("请先阅读并同意用户协议与隐私政策");
    return false;
  }

  document.getElementById("panel-code").addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = phoneInput.value.trim();
    const codeVal = document.getElementById("code-input").value.trim();
    if (!/^1\d{10}$/.test(phone)) {
      showToast("请输入正确的手机号");
      return;
    }
    if (codeVal.length !== 6) {
      showToast("请输入6位验证码");
      return;
    }
    if (!requireAgreement(document.getElementById("code-agreement"))) return;
    localStorage.setItem("hndj_user", JSON.stringify({ name: "陈老师", account: phone }));
    goHome();
  });

  document.getElementById("panel-pwd").addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = e.target.querySelectorAll("input");
    const account = inputs[0].value.trim();
    const pwd = inputs[1].value.trim();
    if (!account || !pwd) {
      showToast("请输入账号和密码");
      return;
    }
    if (!requireAgreement(document.getElementById("pwd-agreement"))) return;
    localStorage.setItem("hndj_user", JSON.stringify({ name: "陈老师", account }));
    goHome();
  });

  // 重置密码
  document.getElementById("panel-reset").addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = document.getElementById("reset-phone").value.trim();
    const code = document.getElementById("reset-code").value.trim();
    const pwd = document.getElementById("reset-pwd").value.trim();
    if (!/^1\d{10}$/.test(phone)) {
      showToast("请输入正确的手机号");
      return;
    }
    if (code.length !== 6) {
      showToast("请输入6位验证码");
      return;
    }
    if (pwd.length < 6 || pwd.length > 20) {
      showToast("新密码需为6-20位");
      return;
    }
    showToast("密码重置成功，请重新登录");
    setTimeout(() => {
      document.getElementById("acc-input").value = phone;
      document.getElementById("pwd-input").value = pwd;
      showPanel("pwd");
    }, 800);
  });
})();
