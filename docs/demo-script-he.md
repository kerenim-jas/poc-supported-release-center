# Trusted + Supported Release Center — תסריט הדגמה

> **קהל יעד:** בעלי עניין פנימיים ב-JFrog (Release Managers, Product Security, Dev Owners, AppTrust + Xray + JAS PMs)
> **משך:** כ-8 דקות דיבור
> **מטרה:** לקבל הסכמה שזה הכיוון הנכון של המוצר לפני שנשקיע יותר.
> **כתובת הדגמה:** https://kerenim-jas.github.io/poc-supported-release-center/ — סיסמה: `supported-releases-2026`

---

## 0. פתיחה (45 שניות)

**פתחו ב:** מסך הסיסמה / Dashboard.

> "היום אני מציגה אב-טיפוס שנקרא **Trusted + Supported Release Center**. הבעיה שאנחנו פותרים פשוטה להגדרה, מכאיבה לחיות איתה: היום אף אחד ב-JFrog לא יכול לענות, במקום אחד, על השאלה **'אילו רליזים של אילו אפליקציות נתמכים, רצים בפרודקשן, ויש להם חוב אבטחה שאני חייב לטפל בו השבוע?'** צוותים עונים על זה עם אקסלים ושרשורי סלאק. האב-טיפוס הזה הוא גרסה מוצרית ודעתנית של מה ש-Barak ו-Ambarish בנו פנימית — כדי שכל צוות יוכל לקבל 'Barak משלו' בלי לגייס באמת אחד."

> "זה תצוגה שמתמקדת באפליקציה, עם בעל הפיתוח, מדיניות ה-SLA, ה-commit, וחמישה ממדי finding — vulnerabilities, secrets, exposures, SAST, ו-contextual analysis — הכל במקום אחד. תנו לי להראות לכם."

---

## 1. Dashboard — המבט של הבוקר (90 שניות)

**נווטו ל:** `/` (ה-Dashboard, עמוד הנחיתה).

**הצביעו על:** הווידג'ט "Newly Detected Critical Findings on Supported Applications".

> "זה מה ש-Release Manager פותח ב-9 בבוקר. הווידג'ט העליון הוא מה ש-Asaf קרא לו 'ווידג'ט החלום' — כל דבר קריטי שזה עתה נחת על רליז שאנחנו עדיין תומכים בו. אפליקציה, ממד הממצא, ספירה, מתי זה זוהה. סריקה אחת, החלטה אחת: האם זה על השולחן שלי היום?"

**הצביעו על:** הווידג'ט **Fix Lifecycle Bottlenecks** (שורות ה-stepper).

> "מתחת לזה, מבט הצווארי-בקבוק. כל שורה היא תיקון שנתקע איפשהו במסע שלו מ-code → build → release → rollout. הנקודה האדומה אומרת לכם איפה הוא תקוע וכמה זמן. בלי טקסט שוטף, בלי JQL. מבט אחד מספיק כדי להבין שצינור ה-build הוא הצוואר-בקבוק, ולא צוות הפיתוח."

**הצביעו על:** הכרטיסיית ה-KPI של supported-applications בראש.

> "ולגמרי למעלה, המספרים המסוכמים — supported applications, supported releases, integrity violations בפרודקשן, tenants מושפעים. מספר ה-'אז מה?'."

---

## 2. רשימת אפליקציות — משטח העבודה היומי (2 דקות)

**נווטו ל:** `/releases/` (הכותרת: **Supported Applications**).

> "כשה-Dashboard אומר לי שיש לי עבודה, כאן אני עושה אותה. כל שורה היא **אפליקציה** אחת — זאת היחידה ש-Release Manager באמת מחזיק. Image-וגרסה באים שניים; זה drill-in."

**הצביעו על** שורה אחת, למשל **JFrog Artifactory**:

> "בשורה אחת אני רואה: שם האפליקציה, בעל הפיתוח — שם, אימייל, צוות — ואת **מדיניות ה-SLA** שמפעילה אותה, שמגיעה מ-AppTrust. ה-chip הקטן הזה לחיץ; הוא אומר לי *למה* האפליקציה הזאת ב-scope ו*מה* בכלל המשמעות של 'supported' עבורה."

**הצביעו על** 5 האייקונים הקטנים של ממדי ה-findings בשורה.

> "ואז חמשת ממדי ה-finding — vulnerabilities, secrets, exposures, SAST, contextual analysis — כל אחד עם ספירה מודעת-חומרה. כאן חיה עכשיו המטריצה של Ambarish: כל ממד שחשוב לבעל הפיתוח, מסוכם לפי אפליקציה."

**הצביעו על** מחוון מצב ה-runtime ועמודת ה-tenants.

> "וצד ה-runtime: האם זה באמת רץ? כמה tenants על זה? כי CVE קריטי על רליז שאף אחד לא מריץ — זאת שיחה אחרת מאשר אחד עם 200 tenants חשופים."

**הצביעו על** ה-**filter toolbar** למעלה.

> "פילטרים בראש — chips סטנדרטיים של JFrog Platform: severity, finding type, runtime status, stage. כלום מיוחד, כלום שמכסה את הטבלה. הנתונים הם הסיפור של העמוד."

---

## 3. פירוט אפליקציה — מ-runtime לבעלים בקליק אחד (90 שניות)

**לחצו על** השורה **JFrog Artifactory** ← `/applications/app-artifactory/`.

> "נכנסים פנימה. בצד שמאל, כרטיס האפליקציה: בעל הפיתוח עם אימייל, מדיניות ה-SLA כ-chip לחיץ, business criticality, האם פונה ללקוח, מודל ה-deployment. הכרטיס הזה הוא התשובה לשאלה שלצוות ה-runtime יש כל שבוע — *'מי הבעלים של הדבר הזה, ולמי אני מתקשר?'*. כפתור ה-'Notify owner' הוא **המסלול מ-runtime לבעלים** בקליק אחד."

**הצביעו על** הטאב **Releases** מצד ימין.

> "מצד ימין, הרליזים של האפליקציה הזאת. כל שורה היא image-וגרסה עם ה-commit SHA שלה — וזה פיסת ה-traceability שהצוות אמר לנו במפורש שאין להם היום. מכאן יורדים רמה אחת עמוק יותר לרליז ספציפי."

---

## 4. פירוט רליז — image, commit, חמישה ממדים (2 דקות)

**לחצו על** כל שורת רליז ← `/releases/<release-id>/`.

> "זה העלה — image אחד בגרסה אחת. בסגנון AppTrust: timeline של קידום שלבים, evidence, risk. אבל שלושה דברים שהם בכוונה לא AppTrust:"

**הצביעו על** בלוק ה-**Source** בכרטיס השמאלי.

> "אחד — ה-commit. short SHA, message, author, branch, קישור לרפו. קליק והולכים ישר למקור. Traceability שגם מבקר ה-SOX וגם בעל הפיתוח רוצים."

**הצביעו על** מצב ה-**runtime** + tenants בכרטיס השמאלי.

> "שתיים — קונטקסט runtime. האם זה deployed? באילו clusters? כמה tenants?"

**הצביעו על** חמשת ה-**טאבים**: Vulnerabilities / Secrets / Exposures / SAST / Contextual Analysis.

> "שלוש — וזה השינוי הכי גדול מאב-הטיפוס v0 — חמישה ממדי finding, לא אחד. המשוב מהמבקרים היה ברור מאוד: CVE זה רק עדשה אחת. Secrets, exposures, SAST, ו-contextual analysis חשובים לא פחות. לכל טאב יש טבלה משלו עם severity, מידע על תיקון, קישור ל-Jira, lifecycle. אותו chrome, אותם אייקונים — אייקוני ה-severity האמיתיים של JFrog מהדיזיין של Xray — בכל טאב."

---

## 5. צלילה אופציונלית של 30 שניות — מדיניות SLA (דלגו אם נגמר זמן)

**נווטו ל:** `/policy/`.

> "ומדיניות ה-SLA עצמה ניתנת לעריכה. Critical 5 ימים, High 30 ימים וכו'. לפי support tier. לפי severity. זה מה שמפעיל את השאלה 'האם זה supported' על כל רליז בכל המוצר."

---

## 6. סיום — מה זה, מה הלאה (דקה)

**חזרו אחורה ל:** `/` (Dashboard).

> "לסיכום — זאת אותה עבודה ש-Barak ו-Ambarish עושים היום באקסלים וב-shell scripts, אבל כמוצר JFrog Platform native. ממוקד אפליקציה, מודע לבעל הפיתוח, עוקב commit, חמישה ממדי finding. בנוי על מדיניות SLA של AppTrust. חושף runtime דרך אות אחד קליל: האם זה רץ, האם יש integrity violation, האם זה idle."

> "מה שאני רוצה מהפגישה הזאת: שלושה דברים. **אחת**, האם המסגרת ממוקדת-האפליקציה תואמת לאיך ש*אתם* חושבים על העבודה שלכם? **שתיים**, האם חמשת ממדי ה-finding הם החמישה הנכונים, או שאני מפספסת אחד? **שלוש**, מי חסר בתמונה הזאת — לאיזה פרסונה כדאי שאציג את זה הלאה?"

> "כתובת ההדגמה בצ'אט. הסיסמה היא `supported-releases-2026`. אשמח לצלול לכל מסך."

---

## נקודות גיבוי לדיון (אם ישאלו)

- **"איך זה קשור ל-AppTrust?"** ← מדיניות ה-SLA *היא* artifact של AppTrust. אנחנו לא מחליפים את AppTrust — אנחנו צורכים את המדיניות שלו ומיישמים אותה על מחזור החיים של supported-release.
- **"איך זה קשור ל-Wiz?"** ← נתוני runtime יכולים להגיע מ-Wiz או מ-JFrog Runtime — המוצר אגנוסטי למקור. למוצר אכפת מ*האות* (running / integrity-violated / not-running), לא ממי שמספק אותו.
- **"מה productized לעומת fixture data?"** ← היום: 100% fixture data. מודל הנתונים ולוגיקת הערכת ה-SLA מתוכננים להתמפות ישירות לשדות Jira + release bundles של AppTrust + ממצאי Xray + אותי runtime.
- **"מה הגרסה הכי קטנה ש-ships?"** ← Applications list + Application detail + עורך SLA Policy + ממד finding אחד (vulnerabilities). השאר הוא incremental.
