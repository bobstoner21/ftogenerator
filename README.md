# Daily Observation Report — XenForo BBCode Generator

Готовый статический генератор для GitHub Pages.

## Как запустить

1. Создай GitHub repository, например `daily-observation-generator`.
2. Загрузи в него:
   - `index.html`
   - `style.css`
   - `script.js`
3. Открой **Settings → Pages**.
4. В **Build and deployment** выбери:
   - Source: **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
5. Сохрани настройки.
6. GitHub выдаст адрес страницы.

Сервер не нужен: вся генерация происходит прямо в браузере.

## Как работает

- Заполняются общие данные.
- Для каждого из 15 критериев выбирается одна оценка: `N/O`, `N/I`, `C`, `S` или `NRT`.
- В колонке `DS` можно выбрать `DS`.
- Заполняются развернутые текстовые ответы.
- **Generate BBCode** создаёт готовый XenForo BBCode.
- **Копировать** помещает результат в буфер обмена.

Если поле оставить пустым, генератор подставит `N/A`.
