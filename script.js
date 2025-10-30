const themeTogglerEl = document.querySelector("#theme-toggle");

function applyTheme() {
  const theme = localStorage.getItem("theme");
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

function toggleTheme() {
  const currentTheme = localStorage.getItem("theme") ?? "light";

  const nextTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", nextTheme);
  themeTogglerEl.textContent =
    nextTheme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode";

  localStorage.setItem("theme", nextTheme);
}

themeTogglerEl.addEventListener("click", toggleTheme);

document.addEventListener("DOMContentLoaded", function () {
  applyTheme();
});
