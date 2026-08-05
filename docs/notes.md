# Adonis Notes

## Stuff I Like

- [x] NextJS app 
- [x] PostgreSQL in docker

## Things to change

- [ ] Project is a mail system, not a Contact Management System (CMS). It makes physical mail feel like email.
- [ ] Put `.next` into `.gitignore` and delete the `.next` folder. No reason to store compiled files.
- [ ] Need a useful README.md that explains the purpose of the project, tech stack and design philosophy, and how to run locally, run tests (if they exist), and how to deploy. 
- [ ] The tradition is to name it `README.md`, not `Readme.md`
- [ ] Switch to `pnpm` to `npm` to save space. `pnpm` caches `node_modules` between projects, saving gigabytes of space if you work on multiple React projects.
- [ ] Not sure why there's a specific `login.module.css` instead of common styles. We should be us
- [ ] Use tailwind for styles (eg `className=""`), **not** css directly, and **no** `style={{}}` inline code.
- [ ] use tailwind-merge for complex/branching css.
- [ ] Please derive components from [HeroUI](https://heroui.com) base components. Try not to create new components from scratch. If there's a HeroUI component available to use as a starting place, use that.
- [ ] Components should be modular, including typography. Use something like a `<BodyText>` (derived from a HeroUI component if possible) instead of a raw `<p>`.
- [ ]  Make sure this project has a static front-and and an API back-end. This will let you deploy the frond-end on CloudFlare Pages or GitHub Pages for free, and the API on some VPS.
- [ ] In the API/front-end: Use two JWTs at log-in. One for auth, one for refresh. Store the JWT in localStorage. If the auth expires, the front-end can retry the `/api/auth/refresh` api to refresh the auth token using the refresh token if it expires, then continue using the site. If the user logs out, clear the JWT from both the database and from localStorage. You can send the JWT through the `Authorization: Bearer <auth-jwt>` HTTP header.
- [ ] Install a linter and link it as as script in `package.json`. `eslint` is great.
- [ ] Install a formatter and link it as as script in `package.json`. `prettier` is great.
- [ ] 3 npm modules have severe security vulnerabilities. Run `npm audit fix` for details.
- [ ] Forms: buttons should disabled until the forms are filled in properly
- [ ] Forms: use HeroUI components as a base instead of raw `<input>`.
- [ ] Create two layouts. One for non-logged in pages (public layout), and one for logged-in pages (dashboard layout).
- [ ] Your `/admin` route doesn't export a component so it's not a usable page.

## Questions and Comments

- [ ] You said you were hand-coding this project, but I see claude and agent skills. It's not a problem, but I think you should be honest about how you are working.
- [ ] `/admin/posts` endpoint doesnt' make any sense. Why is this here?

