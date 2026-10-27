/* ==========================================================================
   站点交互脚本 —— 原生 JS，无任何依赖
   功能：主题切换 / 移动端菜单 / 阅读进度 / 导航高亮 / 滚动入场 / 回到顶部
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ------------------------------------------------------------------
     1. 深浅色主题
     规则：用户手动选过就记住（localStorage），没选过就跟随系统。
     ------------------------------------------------------------------ */
  var THEME_KEY = "site-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme"); // 交给 prefers-color-scheme
    }
  }

  function currentTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 隐私模式忽略 */ }
      applyTheme(next);
    });
  }

  /* ------------------------------------------------------------------
     2. 移动端菜单
     ------------------------------------------------------------------ */
  var menuToggle = document.getElementById("menuToggle");
  var navMenu = document.getElementById("navMenu");

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove("is-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // 点菜单项后自动收起
    navMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    // 点空白处收起；按 Esc 也收起
    document.addEventListener("click", function (e) {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ------------------------------------------------------------------
     3. 滚动相关：进度条、导航阴影、回到顶部、区块高亮
     ------------------------------------------------------------------ */
  var nav = document.getElementById("nav");
  var progressBar = document.getElementById("progressBar");
  var toTop = document.getElementById("toTop");
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var docH = document.documentElement.scrollHeight - window.innerHeight;

    // 阅读进度
    if (progressBar) {
      progressBar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";
    }

    // 导航栏描边
    if (nav) nav.classList.toggle("is-scrolled", y > 8);

    // 回到顶部按钮
    if (toTop) toTop.classList.toggle("is-visible", y > 600);

    // 当前所在区块 → 高亮对应导航项
    var activeId = sections.length ? sections[0].id : "";
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop - 120 <= y) activeId = sections[i].id;
    }
    navLinks.forEach(function (link) {
      var target = link.getAttribute("href");
      link.classList.toggle("is-active", target === "#" + activeId);
    });

    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  window.addEventListener("resize", onScroll, { passive: true });

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------
     4. 滚动入场动画（IntersectionObserver）
     不支持的浏览器直接显示内容，保证不会白屏。
     ------------------------------------------------------------------ */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    reveals.forEach(function (el, i) {
      // 同一屏内依次出现，最多错开 240ms，避免太拖沓
      el.style.setProperty("--delay", Math.min(i % 4, 3) * 70 + "ms");
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ------------------------------------------------------------------
     5. 我的文件：读取 files/files.js 里的清单，生成下载卡片
     清单格式：window.MY_FILES = [{ name, file, desc, tag }, ...]
     ------------------------------------------------------------------ */
  var fileList = document.getElementById("fileList");

  if (fileList) {
    var myFiles = window.MY_FILES || [];

    // 没填 tag 时，用文件后缀当徽章文字
    function badgeOf(item) {
      if (item.tag) return String(item.tag).toUpperCase().slice(0, 4);
      var path = String(item.file || "");
      var dot = path.lastIndexOf(".");
      return dot > -1 ? path.slice(dot + 1).toUpperCase().slice(0, 4) : "FILE";
    }

    if (!myFiles.length) {
      var empty = document.createElement("li");
      empty.className = "files__empty";
      empty.textContent = "还没有文件。把文件放进 files/ 文件夹，再在 files/files.js 里加一行。";
      fileList.appendChild(empty);
    } else {
      myFiles.forEach(function (item) {
        var li = document.createElement("li");
        li.className = "file-card";

        var badge = document.createElement("span");
        badge.className = "file-card__badge";
        badge.textContent = badgeOf(item);

        var body = document.createElement("div");
        body.className = "file-card__body";

        var name = document.createElement("span");
        name.className = "file-card__name";
        name.textContent = item.name || "未命名文件";
        body.appendChild(name);

        if (item.desc) {
          var desc = document.createElement("span");
          desc.className = "file-card__desc";
          desc.textContent = item.desc;
          body.appendChild(desc);
        }

        var link = document.createElement("a");
        link.className = "file-card__dl";
        link.href = encodeURI(item.file);
        link.setAttribute("download", "");
        link.textContent = "下载";

        li.appendChild(badge);
        li.appendChild(body);
        // file 为空时（比如单文件预览版）不渲染下载按钮，避免点了跳空链接
        if (item.file) li.appendChild(link);
        fileList.appendChild(li);
      });
    }
  }

  /* ------------------------------------------------------------------
     6. 页脚年份自动更新
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // 首屏先跑一次
  onScroll();
})();
