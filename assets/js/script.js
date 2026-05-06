(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const initialTheme = localStorage.getItem("site-theme") || "dark";
  root.setAttribute("data-theme", initialTheme);

  function updateThemeUi(theme) {
    if (!themeToggle || !themeLabel) return;
    const isLight = theme === "light";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeLabel.textContent = isLight ? "Светлая тема" : "Тёмная тема";
  }

  updateThemeUi(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", nextTheme);
      localStorage.setItem("site-theme", nextTheme);
      updateThemeUi(nextTheme);
    });
  }

  const navToggle = document.querySelector("[data-nav-toggle]");
  const siteNav = document.querySelector("[data-nav]");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll(".faq-item").forEach(function (item) {
    const trigger = item.querySelector(".faq-trigger");
    const content = item.querySelector(".faq-content");
    if (!trigger || !content) return;
    trigger.addEventListener("click", function () {
      const isOpen = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
      content.style.maxHeight = isOpen ? content.scrollHeight + "px" : "0px";
    });
  });

  function buildWhatsAppMessage(data) {
    return [
      "Здравствуйте! Интересует червячный редуктор " + (data.model || "IRWD 063") + ".",
      "Мощность двигателя: " + (data.power || "-"),
      "Передаточное число: " + (data.ratio || "-"),
      "Тип нагрузки: " + (data.load || "-"),
      "Город: " + (data.city || "-"),
      "Компания: " + (data.company || "-")
    ].join("\n");
  }

  document.querySelectorAll("[data-wa-link]").forEach(function (link) {
    link.addEventListener("click", function () {
      const phone = link.getAttribute("data-phone") || "77717428804";
      const context = document.querySelector(link.getAttribute("data-source")) || document;
      const data = {
        model: context.querySelector("[name='model']")?.value || link.getAttribute("data-model") || "IRWD 063",
        power: context.querySelector("[name='power']")?.value || "",
        ratio: context.querySelector("[name='ratio']")?.value || "",
        load: context.querySelector("[name='load']")?.value || "",
        city: context.querySelector("[name='city']")?.value || "",
        company: context.querySelector("[name='company']")?.value || ""
      };
      link.href = "https://wa.me/" + phone + "?text=" + encodeURIComponent(buildWhatsAppMessage(data));
    });
  });

  const calcForm = document.querySelector("[data-calc-form]");
  const calcResult = document.querySelector("[data-calc-result]");
  if (calcForm && calcResult) {
    calcForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const power = Number(calcForm.power.value || 0);
      const rpm = Number(calcForm.rpm.value || 0);
      const ratio = Number(calcForm.ratio.value || 0);
      const load = calcForm.load.value;
      const duty = calcForm.duty.value;
      let model = "IRWD 063";
      let note = "Подходит для компактных линий, конвейеров и приводов средней нагрузки.";

      if (power > 1.5 || ratio > 60 || load === "high" || duty === "24x7") {
        model = "IRWD 075";
        note = "Рекомендуем переход на более мощный типоразмер из-за нагрузки, длительного режима или высокого передаточного числа.";
      } else if (rpm > 1400 && ratio < 20) {
        model = "NMRV 063";
        note = "Для стандартного подключения и быстрого подбора можно рассмотреть NMRV 063 как близкий аналог.";
      }

      calcResult.innerHTML =
        "<strong>Предварительная рекомендация: " + model + "</strong><p>" + note + "</p>";
      calcResult.dataset.model = model;
    });
  }

  document.querySelectorAll("[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      form.querySelectorAll(".error-text").forEach(function (node) {
        node.remove();
      });
      let valid = true;
      ["name", "city", "company", "phone"].forEach(function (fieldName) {
        const field = form.querySelector("[name='" + fieldName + "']");
        if (!field || field.value.trim()) return;
        valid = false;
        const error = document.createElement("div");
        error.className = "error-text";
        error.textContent = "Заполните поле";
        field.insertAdjacentElement("afterend", error);
      });
      if (!valid) return;

      const wa = form.querySelector("[data-wa-link]");
      if (wa) {
        const phone = wa.getAttribute("data-phone") || "77717428804";
        const data = {
          model: form.querySelector("[name='model']")?.value || wa.getAttribute("data-model") || "IRWD 063",
          power: form.querySelector("[name='power']")?.value || "",
          ratio: form.querySelector("[name='ratio']")?.value || "",
          load: form.querySelector("[name='load']")?.value || "",
          city: form.querySelector("[name='city']")?.value || "",
          company: form.querySelector("[name='company']")?.value || ""
        };
        const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(buildWhatsAppMessage(data));
        window.open(url, "_blank", "noopener");
      }
    });
  });
})();
