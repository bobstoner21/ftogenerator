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
            <option value="DS">DS</option>
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

function allItems() {
  return groups.flatMap(group => group.items);
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
  const name = clean(document.getElementById("traineeName").value);
  const date = dateForReport(document.getElementById("patrolDate").value);
  const marking = clean(document.getElementById("marking").value);
  const time = clean(document.getElementById("patrolTime").value);

  const liked = bb(document.getElementById("liked").value);
  const disliked = bb(document.getElementById("disliked").value);
  const phase = bb(document.getElementById("phase").value);
  const situations = bb(document.getElementById("situations").value);
  const oocQuality = bb(document.getElementById("oocQuality").value);
  const oocBehavior = bb(document.getElementById("oocBehavior").value);
  const oocComments = bb(document.getElementById("oocComments").value);

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
  document.getElementById("output").value = code;
  return code;
}

async function copyOutput() {
  const output = document.getElementById("output");
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
  status.textContent = "BBCode скопирован в буфер обмена.";
  setTimeout(() => status.textContent = "", 2500);
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function preview() {
  generate();

  const preview = document.getElementById("preview");
  const content = document.getElementById("previewContent");

  const name = clean(document.getElementById("traineeName").value);
  const date = dateForReport(document.getElementById("patrolDate").value);
  const marking = clean(document.getElementById("marking").value);
  const time = clean(document.getElementById("patrolTime").value);

  const liked = clean(document.getElementById("liked").value);
  const disliked = clean(document.getElementById("disliked").value);
  const phase = clean(document.getElementById("phase").value);
  const situations = clean(document.getElementById("situations").value);
  const oocQuality = clean(document.getElementById("oocQuality").value);
  const oocBehavior = clean(document.getElementById("oocBehavior").value);
  const oocComments = clean(document.getElementById("oocComments").value);

  let ratingRows = `
    <tr>
      <th>КАТЕГОРИИ</th>
      <th>N/O</th><th>N/I</th><th>C</th><th>S</th><th>NRT</th><th>DS</th>
    </tr>`;

  let index = 0;
  groups.forEach(group => {
    ratingRows += `<tr class="rp-category"><td colspan="7">${escapeHtml(group.name)}</td></tr>`;
    group.items.forEach(item => {
      const selected = selectedRating(index);
      const ds = selectedDs(index);
      ratingRows += `<tr>
        <td>${escapeHtml(item)}</td>
        <td class="rp-mark">${selected === "N/O" ? "X" : ""}</td>
        <td class="rp-mark">${selected === "N/I" ? "X" : ""}</td>
        <td class="rp-mark">${selected === "C" ? "X" : ""}</td>
        <td class="rp-mark">${selected === "S" ? "X" : ""}</td>
        <td class="rp-mark">${selected === "NRT" ? "X" : ""}</td>
        <td class="rp-mark">${ds ? "DS" : ""}</td>
      </tr>`;
      index++;
    });
  });

  const q = value => escapeHtml(value);

  content.innerHTML = `
    <div class="report-preview">
      <div class="rp-center">
        <div class="rp-main-title">RAMPART COMMUNITY POLICE STATION</div>
        <div class="rp-sub-title">DAILY OBSERVATION REPORT</div>
      </div>

      <div class="rp-right rp-dept">
        LOS SANTOS POLICE DEPARTMENT<br>
        RAMPART PATROL DIVISION
      </div>

      <hr class="rp-rule">

      <div class="rp-section">I. GENERAL INFORMATION</div>
      <table class="rp-info">
        <tr>
          <td><b>ПОЛНОЕ ИМЯ СТАЖЁРА:</b> ${q(name)}</td>
          <td><b>ДАТА ПАТРУЛИРОВАНИЯ:</b> ${q(date)}</td>
        </tr>
        <tr>
          <td><b>МАРКИРОВКА:</b> ${q(marking)}</td>
          <td><b>НАЧАЛО И КОНЕЦ ПАТРУЛЯ:</b> ${q(time)}</td>
        </tr>
      </table>

      <hr class="rp-rule">

      <div class="rp-section">II. RATING BY CATEGORY</div>
      <table class="rp-rating">${ratingRows}</table>

      <hr class="rp-rule">

      <div class="rp-section">III. NARRATIVE EVALUATION</div>

      <div class="rp-question">ЧТО ВАМ БОЛЬШЕ ВСЕГО ПОНРАВИЛОСЬ В СТАЖЕРЕ ЗА ДЕНЬ?</div>
      <div class="rp-quote">${q(liked)}</div>

      <div class="rp-question">ЧТО ВАМ БОЛЬШЕ ВСЕГО НЕ ПОНРАВИЛОСЬ В СТАЖЕРЕ ЗА ДЕНЬ?</div>
      <div class="rp-quote">${q(disliked)}</div>

      <div class="rp-question">ВАШИ РЕКОМЕНДАЦИИ ПО ПЕРЕХОДУ СТАЖЕРА В СЛЕДУЮЩУЮ ФАЗУ</div>
      <div class="rp-quote">${q(phase)}</div>

      <hr class="rp-rule">

      <div class="rp-section">IV. DOCUMENTED SITUATIONS (DS)</div>
      <div class="rp-question">ЗАДОКУМЕНТИРОВАННЫЕ СИТУАЦИИ</div>
      <div class="rp-quote">${q(situations)}</div>

      <hr class="rp-rule">

      <div class="rp-section">(( OOC. УРОВЕНЬ ИГРЫ ))</div>

      <div class="rp-question">КАЧЕСТВО И УРОВЕНЬ ИГРЫ, СООТВЕТСТВИЕ РОЛИ</div>
      <div class="rp-quote">${q(oocQuality)}</div>

      <div class="rp-question">ПОВЕДЕНИЕ ИГРОКА В ООС</div>
      <div class="rp-quote">${q(oocBehavior)}</div>

      <div class="rp-question">ВАШИ ЛИЧНЫЕ РЕКОМЕНДАЦИИ/КОММЕНТАРИИ И ЗАМЕЧАНИЯ</div>
      <div class="rp-quote">${q(oocComments)}</div>
    </div>`;

  preview.classList.remove("hidden");
}

document.getElementById("reportForm").addEventListener("submit", event => {
  event.preventDefault();
  generate();
});

document.getElementById("copyBtn").addEventListener("click", copyOutput);
document.getElementById("previewBtn").addEventListener("click", preview);

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("Очистить все заполненные поля и оценки?")) return;
  document.getElementById("reportForm").reset();
  document.getElementById("output").value = "";
  document.getElementById("preview").classList.add("hidden");
  document.getElementById("copyStatus").textContent = "";
});

renderRatings();
