# Requirements: Fill the portfolio with real CV content and photo

**Task id:** portfolio-real-content  
**Status:** approved

## Goal
Replace the placeholder content of the existing site in `portfolio/` (built in task `personal-portfolio`) with Abdallah Mohamed's real CV data and photo. The site should then present him as a Flutter mobile developer to recruiters and clients, in English and Arabic.

## In scope
- **Sources:**
  - CV PDF: `C:\Users\Evision\Downloads\Abdallah_Mohamed_Resume.pdf`
  - Photo: `C:\Users\Evision\AppData\Local\Temp\claude\90f88ed705b58eaa\9dfeb9e8-f53e-4d1e-9128-b04e649da823\images\1.jpg` (400×400 JPG)
- **Photo:** copy it into `portfolio/assets/` (e.g. `avatar.jpg`) and use it in place of the placeholder avatar. Write real alt text in EN and AR.
- **CV download:** replace `portfolio/assets/cv.pdf` with the real resume PDF.
- **Hero/About:** name "Abdallah Mohamed", role "Mobile Developer" (Flutter), location Cairo, and the CV's profile paragraph (5 years of Flutter experience).
- **Projects:** show all 12 CV projects, newest first. Each project has:
  - name, period and role;
  - technology (Flutter);
  - description;
  - key contributions;
  - key challenge, where the CV has one;
  - a Google Play link and an App Store link.

  The 12 projects are:
  1. Alriyadh App
  2. Waste Transportation Request
  3. Taher
  4. Home Experience
  5. Fix Infinity
  6. Alwsata Real Estate Employees
  7. Alwsata Real Estate Co
  8. Al7feaz
  9. DoctorCrypto
  10. ChkChk
  11. Messayel
  12. Bedayat
- **Experience:** 4 jobs:
  - E.VISION for Information Technology, 12/2023 – present, Cairo
  - Alwsata, 08/2022 – present, Saudi Arabia
  - Csskw, 01/2022 – 07/2022, Kuwait
  - Rizme, 05/2021 – 12/2021, Egypt

  Each job lists the apps built there, and the company names link to the company sites from the PDF.
- **Skills:** the 12 CV skills, each with its short description: Flutter, Dart, State Management, API Integration, Firebase, Local Database, Version Control, CI/CD, Testing, Responsive Design, Performance Optimization, Debugging & Profiling.
- **New content inside the Skills & Experience section:**
  - Education: Computer Science, Faculty of Computers and Information, 09/2014 – 09/2018.
  - Certificates: 6 Udemy certificates, each linked to its certificate URL from the PDF.
  - Languages: Arabic, English.
- **Contact:** email `Dev.Fluttery@gmail.com`, phone `01147234230` (`tel:` link, shown as +20 114 723 4230), GitHub, LinkedIn and Stack Overflow, all with the URLs from the PDF.
- **Full Arabic translation** of all the content. App, company and technology names stay in Latin script.
- Fix the obvious spelling mistakes from the CV ("Freamwork", "Handel", "Employes", "infinty", "recevice" and so on). The meaning stays the same.
- Update the check script, `tests/portfolio/check-content.js`, and `portfolio/README.md` wherever the content structure changes.

## Out of scope
- Redesigning the layout or theme. Only the markup and styles needed for the new fields and sub-sections may be added.
- Project screenshots. Project images stay as generic placeholder or app-icon-style SVGs.
- Resolving the short store URLs. They are used as given.
- Deployment.

## Constraints
- Every existing Definition of Done item from `docs/personal-portfolio/01-requirements.md` must still hold:
  - EN/AR toggle with RTL;
  - theme toggle;
  - responsive layout with no horizontal scroll at 360, 768 and 1280px;
  - fade-in that respects reduced motion;
  - keyboard access and alt text;
  - all text comes from `content.js`;
  - text is inserted with `textContent` only, never `innerHTML`.
- No frameworks and no build step; the site still works over `file://`.
- With 12 projects the Projects section must stay readable on mobile. A grid of compact cards is fine.

## Inputs / outputs
- **Inputs:** the CV PDF (text plus hyperlink annotations) and the photo above.
- **Outputs (updated or new):**
  - `portfolio/content.js`, `index.html`, `styles.css`, `script.js` (only where new fields or sub-sections need it)
  - `portfolio/assets/avatar.jpg`, `portfolio/assets/cv.pdf`, and project SVGs as needed
  - `portfolio/README.md`
  - `tests/portfolio/check-content.js`

## Assumptions
- **Links taken from the PDF annotations:**

  | Link | URL |
  |---|---|
  | GitHub | https://github.com/AbdallahMohamed220 |
  | LinkedIn | https://www.linkedin.com/in/abdallah-mohamed-%F0%9F%87%B5%F0%9F%87%B8-0b4270183/ |
  | Stack Overflow | https://shorturl.at/QYQxr (the only short link not used by a project) |
  | E.VISION | http://www.evision-corp.com/ |
  | Alwsata | https://alwsata.com.sa/ |
  | Csskw | https://csskw.net/ |
  | Rizme | https://www.linkedin.com/company/rizme/ |

  The old portfolio link (`dev-fluttery.getportify.com`) is not shown, because this site replaces it.
- **Certificate links:** the 6 Udemy URLs are matched to certificate titles by their order or position in the PDF. If the matching is uncertain, the developer reports it and doesn't guess.
- **Phone number:** shown in international format (+20) because the site is public.
- **Arabic copy:** the agents write it, and the user reviews it.

## Definition of done
- [ ] The hero shows the real photo (`assets/avatar.jpg`) with EN/AR alt text, the name "Abdallah Mohamed" and the role "Mobile Developer". No placeholder text is left anywhere on the page in either language.
- [ ] The About section shows the CV profile paragraph in EN and in AR.
- [ ] The Projects section shows all 12 CV projects, newest first. Each card has: period, description, key contributions, key challenge where the CV has one, and working Google Play and App Store links with the exact URLs from the CV.
- [ ] Experience shows the 4 jobs with correct dates, locations and company links.
- [ ] Skills shows the 12 skills. Education, the 6 certificates (each linking to its Udemy URL) and Languages are shown.
- [ ] Contact has working `mailto:`, `tel:`, GitHub, LinkedIn and Stack Overflow links with the URLs above.
- [ ] "Download CV" serves the real resume PDF, byte-identical to the source file.
- [ ] Every item in the original portfolio's Definition of Done still passes in both languages: toggles persist, RTL, no horizontal scroll at 360, 768 and 1280px, keyboard access, reduced motion, and a clean console.
- [ ] `node tests/portfolio/check-content.js` passes and covers the new fields.
- [ ] `portfolio/README.md` matches the new `content.js` structure.

## Q&A log
| Question | Answer |
|----------|--------|
| Show all projects or a selection? | All of them (the question said 11; the CV actually has 12) |
| Add Education / Certificates / Languages? | Yes, add them |
| Arabic version and contact details? | Translate everything and add the phone number |
