# AeroDrones

A one-page showcase site for custom FPV drones: builds, repairs and upgrades.
Hebrew is the default language at `/`; English is at `/en/`.
Built with [Astro](https://astro.build) as a fully static site.

**[עברית](#עברית) · [English](#english)**

---

<div dir="rtl" lang="he">

## עברית

### מה יש בחבילה
- **`Open AeroDrones.html`**: לחיצה כפולה פותחת את האתר.
- **`AeroDrones-offline/`**: האתר עצמו, עובד בלי אינטרנט ובלי שרת.
- **`Source code/`**: קוד המקור המלא לעריכה (התיקייה הזאת).

### פתיחת הגרסה הלא־מקוונת
1. מחלצים את קובץ ה־ZIP לתיקייה כלשהי, למשל לשולחן העבודה.
2. לוחצים פעמיים על **`Open AeroDrones.html`**, או על `index.html` שבתוך `AeroDrones-offline`.
3. האתר נפתח בעברית בדפדפן הרגיל. הדגלים למעלה מחליפים לאנגלית ובחזרה.
- התמונות, הגלריה, התפריט והחלפת השפה עובדים בלי אינטרנט. רק כפתורי הוואטסאפ והרשתות החברתיות צריכים חיבור.
- **טופס יצירת הקשר לא שולח מייל מהגרסה הלא־מקוונת.** כשלוחצים "שליחה" מופיע כפתור שמעביר את ההודעה לוואטסאפ, עם הטקסט כבר מוכן.
- לא מזיזים קבצים מתוך `AeroDrones-offline`: הקובץ `Open AeroDrones.html` מצפה למצוא את התיקייה לידו.

### הפעלה ראשונה של קוד המקור
1. מתקינים [Node.js](https://nodejs.org) בגרסה 24 (LTS).
2. פותחים טרמינל בתוך התיקייה `Source code`.
3. מריצים `npm install` (פעם אחת בלבד).
4. מריצים `npm run dev` ופותחים את http://localhost:4321. כל שינוי בקבצים מופיע מיד בדפדפן.

| פקודה | מה היא עושה |
|---|---|
| `npm run dev` | שרת פיתוח מקומי לעריכה |
| `npm run build` | בניית האתר לפרסום ברשת, לתיקייה `dist/` |
| `npm run build:offline` | בניית הגרסה הלא־מקוונת, לתיקייה `AeroDrones-offline/` |
| `npm run preview` | תצוגה מקדימה של הבנייה לרשת |
| `npm run check` | בדיקת שגיאות בקוד |

### טופס יצירת הקשר: מפתח Web3Forms משלכם
הטופס שולח את ההודעות דרך [Web3Forms](https://web3forms.com), שירות חינמי. **כדי שההודעות יגיעו למייל שלכם צריך מפתח משלכם.** החבילה לא כוללת מפתח.
1. נכנסים ל־https://web3forms.com, מזינים את כתובת המייל שאליה יגיעו ההודעות, ומקבלים **Access Key** במייל.
2. בתיקייה `Source code` מעתיקים את הקובץ `.env.example` לקובץ חדש בשם **`.env`**.
3. בקובץ `.env` ממלאים את השורה: `PUBLIC_WEB3FORMS_KEY=המפתח-שקיבלתם`
4. **באתר ב־Netlify** הקובץ `.env` לא עולה. מוסיפים את אותו משתנה ב־Site configuration ← Environment variables, ואז ב־Deploys ← Trigger deploy. הפרטים המלאים ב־`DEPLOY.md`.
- בלי מפתח, הטופס מציג הודעת שגיאה ומפנה לוואטסאפ.
- אין לשתף את הקובץ `.env` או להעלות אותו ל־GitHub.

### עריכת טקסטים והגדרות
כל הטקסטים בשתי השפות נמצאים בקובץ **`src/content/site.ts`**: עברית תחת `he` ואנגלית תחת `en`. באותו קובץ, תחת `shared`, נמצאים גם:
- `whatsappNumber`: מספר הוואטסאפ, בפורמט בינלאומי ובספרות בלבד (למשל `972501234567`);
- `social`: הקישורים לרשתות החברתיות;
- `seo.noindex`: האם להסתיר את האתר מגוגל (`true` = מוסתר).

אם חסר טקסט באחת השפות, `npm run check` יציג שגיאה.

### איך מוסיפים בנייה חדשה

1. **מוסיפים תמונה** לתיקייה `src/assets/builds/`, למשל `hawk-5.jpg`.
   - עדיף תמונה רוחבית ביחס 4:3, ברוחב של 1600 פיקסלים לפחות. האתר ממיר אותה אוטומטית ל-AVIF ו-WebP ומקטין לפי הצורך.
2. **יוצרים קובץ** `src/content/builds/hawk-5.md`. שם הקובץ הוא המזהה של הבנייה, באותיות לטיניות ומקפים בלבד.
3. **מעתיקים את התבנית הזאת** ומעדכנים:

```yaml
---
name:
  he: 'Hawk 5"'
  en: 'Hawk 5"'
image: ../../assets/builds/hawk-5.jpg
specs:
  - 5" freestyle
  - 2207 1950KV
  - 6S 1300mAh
description:
  he: תיאור קצר בעברית שמופיע בתצוגה המוגדלת.
  en: A short English description shown in the lightbox.
order: 6
---
```

- **`name`**: שם הבנייה בכל שפה. מותר שיהיה זהה בשתיהן.
- **`image`**: נתיב לתמונה, יחסית לקובץ. תמיד מתחיל ב-`../../assets/builds/`.
- **`specs`**: רשימת מפרט קצרה, משותפת לשתי השפות. בכרטיס מוצגים שלושה פריטים ראשונים, ובתצוגה המוגדלת מוצגים כולם.
- **`description`**: לא חובה. אם משמיטים אותו, פשוט לא מוצג תיאור.
- **`order`**: קובע את הסדר בגלריה, ממספר נמוך לגבוה.

4. מריצים `npm run dev` ובודקים. אם חסר שדה או שהנתיב לתמונה שגוי, תופיע הודעת שגיאה ברורה.

**כדי להסיר בנייה** מוחקים את קובץ ה-`.md` שלה, ואם רוצים גם את התמונה.

### בנייה מחדש של הגרסה הלא־מקוונת
אחרי כל שינוי (טקסט, בנייה חדשה, תמונה):
1. בתיקייה `Source code` מריצים `npm run build:offline`.
2. נוצרת תיקייה חדשה `AeroDrones-offline` בתוך `Source code`. הבנייה מוחקת ויוצרת אותה מחדש בכל פעם.
3. מחליפים בה את התיקייה `AeroDrones-offline` הישנה שליד `Open AeroDrones.html`.

### פרסום ברשת
האתר מוכן לפרסום חינמי ב־Netlify. כל ההוראות נמצאות ב־**`DEPLOY.md`**. קרדיטים לתמונות נמצאים ב־`CREDITS.md`.

</div>

---

## English

### What's in the package
- **`Open AeroDrones.html`**: double-click to open the site.
- **`AeroDrones-offline/`**: the website itself. It works with no internet and no server.
- **`Source code/`**: the full editable project (this folder).

### Opening the offline version
1. Unzip the ZIP file anywhere, for example to the Desktop.
2. Double-click **`Open AeroDrones.html`**, or `index.html` inside `AeroDrones-offline`.
3. The site opens in Hebrew in your usual browser. The flags at the top switch to English and back.
- Photos, the gallery, the menu and the language switch all work offline. Only the WhatsApp and social buttons need a connection.
- **The contact form can't send email from the offline version.** When the visitor presses "Send", a button appears that hands the message over to WhatsApp, already filled in.
- Keep the folders together: `Open AeroDrones.html` expects `AeroDrones-offline` right next to it.

### First run of the source code
1. Install [Node.js](https://nodejs.org) version 24 (LTS).
2. Open a terminal in the `Source code` folder.
3. Run `npm install` (once).
4. Run `npm run dev` and open http://localhost:4321. Changes to the files appear in the browser right away.

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server for editing |
| `npm run build` | Web build for publishing online → `dist/` |
| `npm run build:offline` | Offline copy → `AeroDrones-offline/` |
| `npm run preview` | Preview the web build |
| `npm run check` | Check the code for errors |

### Contact form: your own Web3Forms key
The form sends messages through [Web3Forms](https://web3forms.com), a free service. **For messages to reach your email you need your own key.** The package does not include one.
1. Go to https://web3forms.com, enter the email address that should receive messages, and you'll get an **Access Key** by email.
2. In the `Source code` folder, copy `.env.example` to a new file named **`.env`**.
3. In `.env`, fill in the line: `PUBLIC_WEB3FORMS_KEY=your-key-here`
4. **On Netlify**, the `.env` file is not uploaded. Add the same variable under Site configuration → Environment variables, then Deploys → Trigger deploy. Full details are in `DEPLOY.md`.
- Without a key, the form shows an error and points visitors to WhatsApp.
- Never share `.env` or upload it to GitHub.

### Editing text and settings
All text in both languages lives in **`src/content/site.ts`**: Hebrew under `he`, English under `en`. The same file has these settings under `shared`:
- `whatsappNumber`: the WhatsApp number, in international format, digits only (e.g. `972501234567`);
- `social`: the social profile links;
- `seo.noindex`: whether to hide the site from Google (`true` = hidden).

If a text is missing in one language, `npm run check` reports an error.

### How to add a new build

1. **Add the photo** to `src/assets/builds/`, for example `hawk-5.jpg`.
   - Landscape 4:3 works best, at least 1600px wide. The site converts it to AVIF and WebP and resizes it automatically.
2. **Create** `src/content/builds/hawk-5.md`. The file name is the build's id: use Latin letters and dashes only.
3. **Paste this template** and edit it:

```yaml
---
name:
  he: 'Hawk 5"'
  en: 'Hawk 5"'
image: ../../assets/builds/hawk-5.jpg
specs:
  - 5" freestyle
  - 2207 1950KV
  - 6S 1300mAh
description:
  he: תיאור קצר בעברית שמופיע בתצוגה המוגדלת.
  en: A short English description shown in the lightbox.
order: 6
---
```

- **`name`**: the build name per language. It may be the same in both.
- **`image`**: the path to the photo, relative to the `.md` file. It always starts with `../../assets/builds/`.
- **`specs`**: short technical strings shared by both languages. The card shows the first three; the lightbox shows all of them.
- **`description`**: optional. If you leave it out, no description is shown.
- **`order`**: the position in the gallery, ascending.

4. Run `npm run dev` and check the result. A missing field or a wrong image path shows a clear error.

**To remove a build**, delete its `.md` file, and its photo if you like.

### Rebuilding the offline copy
After any change (text, a new build, a photo):
1. In the `Source code` folder, run `npm run build:offline`.
2. A fresh `AeroDrones-offline` folder appears inside `Source code`. It is deleted and rebuilt from scratch each time.
3. Use it to replace the old `AeroDrones-offline` folder next to `Open AeroDrones.html`.

### Publishing online
The site is ready for free hosting on Netlify. Step-by-step instructions are in **`DEPLOY.md`**. Photo credits are in `CREDITS.md`.

---

**For developers:** design tokens (colors, fonts, spacing, motion) live in `src/styles/tokens.css`; change `--accent` to re-theme the whole site. Styles use CSS logical properties only, so one stylesheet serves both RTL and LTR.
