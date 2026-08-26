# CV-Bot-v2: Поточний стан проєкту (Оновлено)

## 1. Авторизація та Доступи (OAuth 2.0 Desktop App Flow)
* Ми відмовились від Service Accounts через політику блокувань Google Cloud.
* Бот використовує OAuth 2.0 (файл `client_secret.json`) та згенерований токен (`token.json`).
* Токен автоматично оновлюється через Google API (refresh token).
* Необхідні Scopes:
  - `https://www.googleapis.com/auth/drive.file`
  - `https://www.googleapis.com/auth/spreadsheets`
* **Критично:** В Google Cloud Console для вашого проєкту мають бути ввімкнені **Google Drive API** та **Google Sheets API**.

## 2. Аналітика (Google Sheets)
* **ID Таблиці:** `19bWeJ6shG84NWnp8E9sS0ODHRGh7doiDJ2qumODr1-8`
* Формат запису в таблицю (Columns A-E): `[№ з/п, Компанія, Посилання на вакансію, Дата, Супровідний лист, ...]`
* При натисканні кнопки "Подався ✅" в Telegram бот автоматично додає новий рядок у Google Sheets, зчитуючи дані з поточної сесії.

## 3. Google Drive та Rclone
* **Цільова папка (Drive ID):** `1hR8JjuJmSMkYr5eu5aK4iOWERAt3gc77`
* Rclone налаштований на сервері Oracle (через `/home/ubuntu/.config/rclone/rclone.conf`) і використовує той самий `client_id`, `client_secret` та згенерований `token.json` що й бот.

### Автомонтування (Systemd)
* Сервіс: `rclone-gdrive.service` (працює під `root` з прапорцем `--allow-other`).
* Шлях монтування на хості: `/home/ubuntu/chromium_config/Downloads/CVs`.
* Оскільки `/home/ubuntu/chromium_config` вже прокинутий в Chromium-контейнер як `/config`, усі файли з Google Drive миттєво доступні в локальному браузері за адресою `/config/Downloads/CVs`.

**Команди для керування:**
\`\`\`bash
# Перевірити статус монтування
sudo systemctl status rclone-gdrive.service

# Перезапустити монтування
sudo systemctl restart rclone-gdrive.service

# Подивитися логи rclone
sudo journalctl -u rclone-gdrive.service -f
\`\`\`

## 4. Стек та Архітектура (Нове)
* Бот завантажує згенеровані PDF у Google Drive (модуль `src/google/drive.js`).
* Бот передає лінки в Telegram (користувачу) у текстовому повідомленні з кнопкою "Подався ✅".
* Бот пише в Sheets (модуль `src/google/sheets.js`).
* **Оновлення коду на Oracle:** `rsync` з виключенням `node_modules`, після чого `ssh ... pm2 restart cv-bot`.

## 5. Останні зміни та Рефакторинг
* Створено інтеграцію з Google Sheets (`src/google/sheets.js`) та Google Drive (`src/google/drive.js`).
* Оновлено обробники повідомлень та кнопок (`src/bot/handlers/message.js`, `src/bot/handlers/callback.js`) для роботи з новими модулями Google.
* **Безпека:** Додано `client_secret.json`, `token.json` та `.DS_Store` в `.gitignore` щоб уникнути витоку конфіденційних даних у публічний репозиторій.
* **Структура проєкту:** Всі допоміжні скрипти для налаштування авторизації, тестування та інтеграції (такі як `generate_auth.js`, `get_token.js`, `setup_rclone.js`, `test_integration.js`) переміщено в директорію `scripts/` для підтримання порядку в кореневій папці проєкту.
