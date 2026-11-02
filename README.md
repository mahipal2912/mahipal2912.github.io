# Mahipal Singh — personal website

Static profile site aligned with your ATS resume and Naukri copy. No build step.

Live URL after GitHub Pages: **https://mahipal2912.github.io/**

## What is already in the site

- About, skills, experience, projects, education, certifications, contact
- LinkedIn, GitHub, email, phone, WhatsApp
- Resume download (`assets/Mahipal_Singh_Android_Developer_ATS.docx`)
- Production projects listed without fake Play Store / GitHub links

## 1. Preview on your PC

1. Open `c:\Users\Mahipal Singh\Downloads\MyResume\portfolio\index.html` in Chrome.
2. Check About, Projects, Contact, and **Download resume**.
3. If a project later gets a Play Store or GitHub link, add it in `index.html`.

## 2. Publish for free (GitHub Pages)

This gives you a public URL you can paste on Naukri, LinkedIn, and the resume.

1. Sign in to GitHub as **mahipal2912**.
2. Create a **new repository** named exactly `mahipal2912.github.io` (public).
3. Upload every file from this `portfolio` folder into the **root** of that repo:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `favicon.svg`
   - `robots.txt`
   - `sitemap.xml`
   - `404.html`
   - `.nojekyll`
   - `assets/` (resume file)
4. GitHub → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` (or `master`) / `/ (root)`
   - Save
5. Wait 1–2 minutes, then open **https://mahipal2912.github.io/**

Optional from this folder in Git:

```powershell
cd "c:\Users\Mahipal Singh\Downloads\MyResume\portfolio"
git init
git add .
git commit -m "Add personal Android developer website"
git branch -M main
git remote add origin https://github.com/mahipal2912/mahipal2912.github.io.git
git push -u origin main
```

## 3. Add the URL everywhere (same link)

Use this exact URL: `https://mahipal2912.github.io/`

### Naukri

1. Profile → **Resume headline / Profile summary** area, or **Personal details**.
2. Find **Online presence / Website / Blog / Portfolio**.
3. Paste `https://mahipal2912.github.io/`
4. Save.
5. Also mention it once in the **profile summary**, last line:
   `Portfolio: https://mahipal2912.github.io/`

### LinkedIn

1. Profile → **Contact info** (pencil).
2. **Website** → Website → `https://mahipal2912.github.io/`
3. Label: **Portfolio**
4. Save.
5. Optional: pin the URL in Featured.

### Resume

After the site is live, add it next to LinkedIn in the contact line:

`Gurugram, India  |  +91 6260849771  |  smahipal778@gmail.com  |  linkedin.com/in/mahipalsinghad  |  mahipal2912.github.io`

Then re-upload the DOCX to Naukri.

## 4. Later upgrades (optional)

- Custom domain such as `mahipalsingh.dev` → GitHub Pages → Custom domain
- Project screenshots in `assets/`
- Play Store / GitHub links when a project is public
- Photo in the sidebar if you want a face on the site (keep the resume ATS file text-only)
