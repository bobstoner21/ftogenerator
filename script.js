const groups = [
  {
    name: "ЛИЧНЫЕ КАЧЕСТВА",
    items: [
      "1. ОТНОШЕНИЕ К КРИТИКЕ/КУРАТОРУ/ПРОГРАММЕ",
      "2. ОТНОШЕНИЕ К ПОЛИЦЕЙСКОЙ РАБОТЕ",
      "3. ЭТИКА И ДОБРОСОВЕСТНОСТЬ",
      "4. УМЕНИЕ ВЛИЯТЬ НА ОКРУЖАЮЩИХ"
    ]
  },
  {
    name: "ВЗАИМООТНОШЕНИЯ",
    items: [
      "5. С ГРАЖДАНАМИ/ОБЩЕСТВОМ",
      "6. С ДРУГИМИ ОФИЦЕРАМИ ДЕПАРТАМЕНТА"
    ]
  },
  {
    name: "НАВЫКИ",
    items: [
      "7. НАВЫКИ ВОЖДЕНИЯ",
      "8. ЗНАНИЕ ГОРОДА, ОРИЕНТАЦИЯ",
      "9. НАВЫКИ КООРДИНАЦИИ",
      "10. ПОЛЕВЫЕ ПОКАЗАТЕЛИ: НОРМАЛЬНЫЕ УСЛОВИЯ",
      "11. ПОЛЕВЫЕ ПОКАЗАТЕЛИ: СТРЕССОВЫЕ УСЛОВИЯ",
      "12. ИНИЦИАТИВНОСТЬ В ВЫБОРЕ СИТУАЦИЙ",
      "13. БЕЗОПАСНОСТЬ ОФИЦЕРА",
      "14. ИСПОЛЬЗОВАНИЕ РАЦИИ"
    ]
  },
  {
    name: "ЗНАНИЯ",
    items: [
      "15. ЗНАНИЕ ПОЛИТИК И ПРОЦЕДУР ДЕПАРТАМЕНТА"
    ]
  }
];

const ratingKeys = ["N/O", "N/I", "C", "S", "NRT"];

function renderRatings() {
  const body = document.getElementById("ratingBody");
  if (!body) return;
  let html = "";
  let index = 0;

  groups.forEach(group => {
    html += `<tr class="category-row">
      <td>${escapeHtml(group.name)}</td>
      <td></td><td></td><td></td><td></td><td></td><td></td>
    </tr>`;

    group.items.forEach(item => {
      const id = `rating-${index}`;
      html += `<tr>
        <td>${escapeHtml(item)}</td>
        ${ratingKeys.map(key => `
          <td class="rating-cell">
            <input type="radio" name="${id}" value="${key}" aria-label="${key} для ${escapeHtml(item)}">
          </td>
        `).join("")}
        <td>
          <select class="ds-select" data-rating-index="${index}" aria-label="DS для ${escapeHtml(item)}">
            <option value="">-</option>
            ${Array.from({length: 10}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
          </select>
        </td>
      </tr>`;
      index++;
    });
  });

  body.innerHTML = html;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clean(value, fallback = "N/A") {
  const result = String(value ?? "").trim();
  return result || fallback;
}

function bb(value) {
  return clean(value).replace(/\r?\n/g, "\n");
}

function dateForReport(value) {
  if (!value) return "N/A";
  const parts = value.split("-");
  return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : value;
}

function selectedRating(index) {
  const selected = document.querySelector(`input[name="rating-${index}"]:checked`);
  return selected ? selected.value : "";
}

function selectedDs(index) {
  return document.querySelector(`select[data-rating-index="${index}"]`)?.value || "";
}

function cell(value) {
  return `[CENTER]${value || " "}[/CENTER]`;
}

function makeRatingTable() {
  const rows = [];
  rows.push(
`[TR]
[TD][CENTER][B]КАТЕГОРИИ[/B][/CENTER][/TD]
[TD][CENTER][B]N/O[/B][/CENTER][/TD]
[TD][CENTER][B]N/I[/B][/CENTER][/TD]
[TD][CENTER][B]C[/B][/CENTER][/TD]
[TD][CENTER][B]S[/B][/CENTER][/TD]
[TD][CENTER][B]NRT[/B][/CENTER][/TD]
[TD][CENTER][B]DS[/B][/CENTER][/TD]
[/TR]`
  );

  let index = 0;
  groups.forEach(group => {
    rows.push(
`[TR]
[TD][B][U]${group.name}[/U][/B][/TD]
[TD][/TD][TD][/TD][TD][/TD][TD][/TD][TD][/TD][TD][/TD]
[/TR]`
    );

    group.items.forEach(item => {
      const rating = selectedRating(index);
      const ds = selectedDs(index);
      rows.push(
`[TR]
[TD]${item}[/TD]
[TD]${cell(rating === "N/O" ? "X" : "")}[/TD]
[TD]${cell(rating === "N/I" ? "X" : "")}[/TD]
[TD]${cell(rating === "C" ? "X" : "")}[/TD]
[TD]${cell(rating === "S" ? "X" : "")}[/TD]
[TD]${cell(rating === "NRT" ? "X" : "")}[/TD]
[TD]${cell(ds)}[/TD]
[/TR]`
      );
      index++;
    });
  });

  return `[TABLE]\n${rows.join("\n")}\n[/TABLE]`;
}

function makeBbCode() {
  const name = clean(document.getElementById("traineeName")?.value);
  const date = dateForReport(document.getElementById("patrolDate")?.value);
  const marking = clean(document.getElementById("marking")?.value);
  const time = clean(document.getElementById("patrolTime")?.value);

  const liked = bb(document.getElementById("liked")?.value);
  const disliked = bb(document.getElementById("disliked")?.value);
  const phase = bb(document.getElementById("phase")?.value);
  const situations = bb(document.getElementById("situations")?.value);
  const oocQuality = bb(document.getElementById("oocQuality")?.value);
  const oocBehavior = bb(document.getElementById("oocBehavior")?.value);
  const oocComments = bb(document.getElementById("oocComments")?.value);

  return `[CENTER][B][SIZE=5]RAMPART COMMUNITY POLICE STATION[/SIZE][/B]
[SIZE=4][B]DAILY OBSERVATION REPORT[/B][/SIZE][/CENTER]
[RIGHT][SIZE=2]LOS SANTOS POLICE DEPARTMENT
RAMPART PATROL DIVISION[/SIZE][/RIGHT]

[HR][/HR]

[SIZE=4][B]I. GENERAL INFORMATION[/B][/SIZE]

[TABLE]
[TR]
[TD][B]ПОЛНОЕ ИМЯ СТАЖЁРА:[/B] ${name}[/TD]
[TD][B]ДАТА ПАТРУЛИРОВАНИЯ:[/B] ${date}[/TD]
[/TR]
[TR]
[TD][B]МАРКИРОВКА:[/B] ${marking}[/TD]
[TD][B]НАЧАЛО И КОНЕЦ ПАТРУЛЯ:[/B] ${time}[/TD]
[/TR]
[/TABLE]

[HR][/HR]

[SIZE=4][B]II. RATING BY CATEGORY[/B][/SIZE]

${makeRatingTable()}

[HR][/HR]

[SIZE=4][B]III. NARRATIVE EVALUATION[/B][/SIZE]

[B]ЧТО ВАМ БОЛЬШЕ ВСЕГО ПОНРАВИЛОСЬ В СТАЖЕРЕ ЗА ДЕНЬ?[/B]
[QUOTE]${liked}[/QUOTE]

[B]ЧТО ВАМ БОЛЬШЕ ВСЕГО НЕ ПОНРАВИЛОСЬ В СТАЖЕРЕ ЗА ДЕНЬ?[/B]
[QUOTE]${disliked}[/QUOTE]

[B]ВАШИ РЕКОМЕНДАЦИИ ПО ПЕРЕХОДУ СТАЖЕРА В СЛЕДУЮЩУЮ ФАЗУ[/B]
[QUOTE]${phase}[/QUOTE]

[HR][/HR]

[SIZE=4][B]IV. DOCUMENTED SITUATIONS (DS)[/B][/SIZE]

[B]ЗАДОКУМЕНТИРОВАННЫЕ СИТУАЦИИ[/B]
[QUOTE]${situations}[/QUOTE]

[HR][/HR]

[SIZE=4][B](( OOC. УРОВЕНЬ ИГРЫ ))[/B][/SIZE]

[B]КАЧЕСТВО И УРОВЕНЬ ИГРЫ, СООТВЕТСТВИЕ РОЛИ[/B]
[QUOTE]${oocQuality}[/QUOTE]

[B]ПОВЕДЕНИЕ ИГРОКА В ООС[/B]
[QUOTE]${oocBehavior}[/QUOTE]

[B]ВАШИ ЛИЧНЫЕ РЕКОМЕНДАЦИИ/КОММЕНТАРИИ И ЗАМЕЧАНИЯ[/B]
[QUOTE]${oocComments}[/QUOTE]`;
}

function generate() {
  const code = makeBbCode();
  const outputEl = document.getElementById("output");
  if (outputEl) outputEl.value = code;
  return code;
}

async function copyOutput() {
  const output = document.getElementById("output");
  if (!output) return;
  if (!output.value) generate();

  try {
    await navigator.clipboard.writeText(output.value);
  } catch {
    output.focus();
    output.select();
    document.execCommand("copy");
    output.setSelectionRange(0, 0);
  }

  const status = document.getElementById("copyStatus");
  if (status) {
    status.textContent = "BBCode скопирован в буфер обмена.";
    setTimeout(() => status.textContent = "", 2500);
  }
}

// Автоматическое расширение textarea под объем текста
document.addEventListener("input", function (e) {
  if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === "textarea") {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderRatings();

  // Авто-высота для уже существующих textarea при загрузке
  document.querySelectorAll("textarea").forEach(ta => {
    ta.style.resize = "none";
    ta.style.overflow = "hidden";
    ta.style.minHeight = "90px";
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  });

  const form = document.getElementById("reportForm");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      generate();
    });
  }

  const copyBtn = document.getElementById("copyBtn");
  if (copyBtn) copyBtn.addEventListener("click", copyOutput);

  const previewBtn = document.getElementById("previewBtn");
  if (previewBtn) {
    previewBtn.style.display = "none"; // Скрываем кнопку предпросмотра, если она есть
  }

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!confirm("Очистить все заполненные поля и оценки?")) return;
      if (form) form.reset();
      const output = document.getElementById("output");
      if (output) output.value = "";
      const status = document.getElementById("copyStatus");
      if (status) status.textContent = "";
      
      // Сбрасываем высоту полей
      document.querySelectorAll("textarea").forEach(ta => {
        ta.style.height = "auto";
      });
    });
  }
});
