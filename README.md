# vashishtkumar99.github.io

A hand-built personal site. No frameworks, no build step.

## Run it locally
Open `index.html` in a browser, or for correct routing:
```
python3 -m http.server 8000
```
then visit http://localhost:8000

## Make it live (easiest path, ~10 minutes, free)
1. Create a GitHub repo named exactly `vashishtkumar99.github.io`
2. Upload everything in this folder to it (drag and drop works on github.com)
3. Done. The site is live at **https://vashishtkumar99.github.io** within a minute or two.
   All the links and SEO tags in this project already point there.

### Want a custom domain later? (optional, ~$10/year)
1. Buy `vashishtkumar.com` (or similar) on Cloudflare or Namecheap
2. In the repo: Settings > Pages > Custom domain, enter it and follow the DNS steps
3. Find-and-replace `vashishtkumar99.github.io` with your new domain in the
   HTML files, `sitemap.xml`, and `robots.txt`

Alternative: drag the folder into app.netlify.com (also free, serves 404.html automatically).

## How to update things
| What | Where |
|---|---|
| Blog posts | Add an entry to `POSTS` in `js/app.js`, then copy any file in `/writing` and edit the text |
| Now page | `index.html`, the `#now` section |
| Career | `index.html`, the `#career` section |
| Projects | `vibe-coding.html` |
| DJ page / mixes | `dj.html` (un-hide `#mixEmbed` and paste your SoundCloud URL); full curriculum lives in `dj-plan.html` |
| Colors & fonts | CSS variables at the top of `styles/main.css` |
| Résumé | Replace `assets/Vashisht_Kumar_Resume.pdf` |
| Social links | `index.html`, the `#contact` section (update the placeholder usernames) |

## Contact form
It currently opens the visitor's email app (works with zero setup).
To receive messages silently instead, create a free Formspree form and
point the form's submit handler in `js/app.js` at your endpoint.

## Structure
```
index.html          home (about, career, interests, now, writing preview, contact)
vibe-coding.html    projects
dj.html             DJ journey
writing.html        blog index (search + categories)
writing/            individual posts
404.html            not-found page
styles/             main.css (tokens + components), animations.css, responsive.css
js/                 app.js (behavior + post data), animations.js (scroll effects)
assets/             resume PDF, favicon, images you add
```
