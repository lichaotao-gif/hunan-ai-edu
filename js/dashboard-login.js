(function () {
  "use strict";
  const form = document.getElementById("dashboard-login-form");
  const account = document.getElementById("dashboard-account");
  const password = document.getElementById("dashboard-password");
  const error = document.getElementById("dashboard-login-error");

  if (sessionStorage.getItem("ai_dashboard_authenticated") === "1") {
    location.replace("dashboard.html");
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    if (!account.value.trim()) {
      error.textContent = "请输入管理员账号";
      account.focus();
      return;
    }
    if (!password.value) {
      error.textContent = "请输入登录密码";
      password.focus();
      return;
    }
    if (account.value.trim() !== "admin" || password.value !== "123456") {
      error.textContent = "账号或密码错误，请检查后重试";
      password.focus();
      return;
    }
    sessionStorage.setItem("ai_dashboard_authenticated", "1");
    location.replace("dashboard.html");
  });
})();
