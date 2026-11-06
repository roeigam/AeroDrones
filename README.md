# AeroDrones

A one-page showcase site for custom FPV drones: builds, repairs and upgrades.
Hebrew is the default language at `/`; English is at `/en/`.
Built with [Astro](https://astro.build) as a fully static site.

```bash
npm install
npm run dev       # local dev server → http://localhost:4321
npm run build     # static build → dist/
npm run preview   # preview the production build
npm run check     # type-check
```

- **All site text** (both languages) lives in `src/content/site.ts`.
- **All design tokens** (colors, fonts, spacing, motion) live in `src/styles/tokens.css`. Change `--accent` to re-theme the whole site.
- **Before delivery**, see `TODO.md`. Image credits are in `CREDITS.md`.

---

<div dir="rtl" lang="he">

## איך מוסיפים בנייה חדשה

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
order: 7
---
```

- **`name`**: שם הבנייה בכל שפה. מותר שיהיה זהה בשתיהן.
- **`image`**: נתיב לתמונה, יחסית לקובץ. תמיד מתחיל ב-`../../assets/builds/`.
- **`specs`**: רשימת מפרט קצרה, משותפת לשתי השפות. בכרטיס מוצגים שלושה פריטים ראשונים, ובתצוגה המוגדלת מוצגים כולם.
- **`description`**: לא חובה. אם משמיטים אותו, פשוט לא מוצג תיאור.
- **`order`**: קובע את הסדר בגלריה, ממספר נמוך לגבוה.

4. מריצים `npm run dev` ובודקים. אם חסר שדה או שהנתיב לתמונה שגוי, תופיע הודעת שגיאה ברורה.

**כדי להסיר בנייה** מוחקים את קובץ ה-`.md` שלה, ואם רוצים גם את התמונה.

</div>

## How to add a new build

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
order: 7
---
```

- **`name`**: the build name per language. It may be the same in both.
- **`image`**: the path to the photo, relative to the `.md` file. It always starts with `../../assets/builds/`.
- **`specs`**: short technical strings shared by both languages. The card shows the first three; the lightbox shows all of them.
- **`description`**: optional. If you leave it out, no description is shown.
- **`order`**: the position in the gallery, ascending.

4. Run `npm run dev` and check the result. A missing field or a wrong image path shows a clear error.

**To remove a build**, delete its `.md` file, and its photo if you like.
