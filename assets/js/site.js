(() => {
  const root = document.documentElement;
  const dict = window.I18N || {};
  const KEY = "lang";

  const pick = (key, lang) => {
    const entry = dict[key];
    if (!entry) return null;
    return lang === "id" ? entry[1] : entry[0];
  };

  const apply = (lang) => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = pick(el.dataset.i18n, lang);
      if (value !== null) el.textContent = value;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split("|");
        const value = pick(key, lang);
        if (value !== null) el.setAttribute(attr, value);
      });
    });
    root.lang = lang;
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });
  };

  const save = (lang) => {
    try {
      localStorage.setItem(KEY, lang);
    } catch (error) {
      return;
    }
  };

  const load = () => {
    try {
      return localStorage.getItem(KEY);
    } catch (error) {
      return null;
    }
  };

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      apply(lang);
      save(lang);
    });
  });

  if (load() === "id") apply("id");

  document.querySelectorAll(".yt").forEach((box) => {
    const link = box.querySelector(".yt-link");
    if (!link) return;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${box.dataset.yt}?autoplay=1&rel=0`;
      frame.title = pick("ui.ytTitle", root.lang) || "YouTube video";
      frame.setAttribute("data-i18n-attr", "title|ui.ytTitle");
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      link.replaceWith(frame);
      frame.focus();
    });
  });
})();
