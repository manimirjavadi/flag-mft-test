const themeTogglerEl = document.querySelector("#theme-toggle");
const gridEl = document.querySelector("#countries-grid");
const searchInputEl = document.querySelector("#search");
const statusEl = document.querySelector("#region-selector");

const state = {
  countryList: [],
  search: "",
  region: "",
};

function applyTheme() {
  const theme = localStorage.getItem("theme");
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

function debounce(fn, delay = 300) {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
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

const API_ALL =
  "https://restcountries.com/v3.1/all?fields=name,cca3,capital,region,population,flags";

function filteredCountries() {
  return state.countryList.filter((country) => {
    const matchRegion = state.region === "" || country.region === state.region;

    return (
      (country.name.common.toLowerCase().includes(state.search) ||
        country.capital[0]?.toLowerCase().includes(state.search) ||
        country.cca3.toLowerCase().includes(state.search)) &&
      matchRegion
    );
  });
}

async function loadCountries() {
  try {
    const res = await fetch(API_ALL);

    if (!res.ok) throw new Error("Failed to fetch from API");

    const countries = await res.json();

    const sortedCountries = countries.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );

    return sortedCountries;
  } catch (e) {
    console.error(e);
  }
}

function render() {
  gridEl.innerHTML = "";

  filteredCountries().map((country) => {
    gridEl.innerHTML += `
        <a class="card" href="./country.html?code=${country.cca3}">
          <img
            src="${country.flags?.png}"
            alt="${country.flags?.alt}"
            class="card-flag"
          />
          <div class="card-body">
            <h2 class="card-title">${country.name?.common}</h2>
            <p><strong>Population:</strong> ${country.population}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Capital:</strong> ${country.capital?.[0]}</p>
          </div>
        </a>
        `;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  applyTheme();
  loadCountries().then((countries) => {
    state.countryList.push(...countries);
    render();
  });
});

searchInputEl.addEventListener(
  "input",
  debounce(function (e) {
    state.search = e.target.value.toLowerCase();
    render();
  })
);

statusEl.addEventListener("input", function (e) {
  state.region = e.target.value;
  render();
});
