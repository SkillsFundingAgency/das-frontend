# DAS Frontend

Shared frontend library for the **Apprenticeship Service**. It builds a set of CSS, JavaScript
and image assets from [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/) plus
DAS-specific components, and publishes them to a CDN so that the many Apprenticeship Service
micro‑services can consume a single, consistent look and feel.

Micro‑services almost never reference this CDN directly. Instead they pull the assets in through
the shared UI NuGet packages, which pin a CDN version and render the correct `<link>`/`<script>`
tags for you:

| Audience   | Shared UI package                                                                                                                                     |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Employer   | [SFA.DAS.Employer.Shared.UI](https://github.com/SkillsFundingAgency/das-shared-packages/tree/master/SFA.DAS.Employer.Shared.UI)                       |
| Provider   | [SFA.DAS.Provider.Shared.UI](https://github.com/SkillsFundingAgency/das-shared-packages/tree/master/SFA.DAS.Provider.Shared.UI)                       |
| Apprentice | [SFA.DAS.ApprenticePortal.SharedUi](https://github.com/SkillsFundingAgency/das-apprentice-portal-web/tree/main/src/SFA.DAS.ApprenticePortal.SharedUi) |

> This repo contains two asset sets: **DAS** (the Apprenticeship Service for Employers and Providers) and **Apprentice**
> (the apprentice‑facing portal). A third set, **FIU** (`www.apprenticeships.gov.uk`), is being
> retired and is intentionally left undocumented.

## CDN environments

The build publishes the contents of `dist/` to the root of a CDN endpoint per environment. All
asset paths below are relative to one of these base URLs:

| Environment   | Base URL                                  |
|---------------|-------------------------------------------|
| AT (dev/test) | `https://das-at-frnt-end.azureedge.net`   |
| TEST          | `https://das-test-frnt-end.azureedge.net` |
| PP            | `https://das-pp-frnt-end.azureedge.net`   |
| PRD           | `https://das-prd-frnt-end.azureedge.net`  |

For example, the DAS stylesheet in AT is:

```
https://das-at-frnt-end.azureedge.net/css/main.css
```

## Consuming the assets

### DAS (Apprenticeship Service)

| Asset                                        | CDN path                                     | Dependencies                         |
|----------------------------------------------|----------------------------------------------|--------------------------------------|
| Styles                                       | `/css/main.css`                              | –                                    |
| Components (vanilla)                         | `/js/das-all.min.js`                         | – (exposes the `DASFrontend` global) |
| Application JS (header, nav, cookies, forms) | `/js/app.min.js`                             | jQuery + GOV.UK Frontend             |
| Session timeout                              | `/js/sessionTimeout.js`                      | jQuery                               |
| GOV.UK Frontend JS                           | `/libs/govuk-frontend/govuk-frontend.min.js` | –                                    |
| Fonts & images                               | `/assets/**`, `/images/**`                   | –                                    |

Minimal include:

```html

<link rel="stylesheet" href="https://das-at-frnt-end.azureedge.net/css/main.css"/>

<script src="https://das-at-frnt-end.azureedge.net/libs/govuk-frontend/govuk-frontend.min.js"></script>
<script src="https://das-at-frnt-end.azureedge.net/js/das-all.min.js"></script>
<script>
    window.GOVUK.initAll && window.GOVUK.initAll();
    DASFrontend.initAll();
</script>
```

`das-all.min.js` is a self‑contained UMD bundle (no jQuery) that initialises the cookie banner,
cookie settings, GDS‑style radios and show/hide components via their `data-module` attributes.
`app.min.js` is the older jQuery‑based bundle for the site header, user navigation, back links,
forms and legacy cookie clean‑up — only include it (and jQuery) if you need those pieces.

### Apprentice (apprentice portal)

| Asset                                     | CDN path                | Dependencies             |
|-------------------------------------------|-------------------------|--------------------------|
| Styles                                    | `/css/apprentice.css`   | –                        |
| JS (step‑by‑step nav, service navigation) | `/js/apprentice.min.js` | jQuery + GOV.UK Frontend |

```html

<link rel="stylesheet" href="https://das-at-frnt-end.azureedge.net/css/apprentice.css"/>

<script src="https://das-at-frnt-end.azureedge.net/libs/jquery/jquery.min.js"></script>
<script src="https://das-at-frnt-end.azureedge.net/libs/govuk-frontend/govuk-frontend.min.js"></script>
<script src="https://das-at-frnt-end.azureedge.net/js/apprentice.min.js"></script>
```

## Optional includes

These libraries are bundled into the CDN but are **not** pulled in by the core CSS/JS above.
Add them only on pages that need them.

| Library                                                                        | Version    | JS                                                             | CSS                          |
|--------------------------------------------------------------------------------|------------|----------------------------------------------------------------|------------------------------|
| [jQuery](https://jquery.com/)                                                  | 3.7.1      | `/libs/jquery/jquery.min.js`                                   | –                            |
| [Select2](https://select2.org/)                                                | 4.1.0‑rc.0 | `/libs/select2/select2.min.js`                                 | `/libs/select2/style.css`    |
| [Accessible autocomplete](https://github.com/alphagov/accessible-autocomplete) | 3.0.1      | `/libs/accessible-autocomplete/accessible-autocomplete.min.js` | Bundled into `/css/main.css` |

Notes:

- **Select2** is a jQuery plugin — include `jquery.min.js` first, and its own `style.css`.
- **Accessible autocomplete** styles are already compiled into `main.css`. If you include the
  autocomplete on a page that does not load `main.css`, you will need to provide the styles
  yourself (see
  the [component's stylesheet](https://github.com/alphagov/accessible-autocomplete/blob/main/src/autocomplete.css)).
- jQuery is deliberately held at 3.x — see [why](#dependencies) before upgrading.

## Accessible autocomplete — demos

The autocomplete enhances a standard `<select>` (or a text input) into an accessible,
type‑ahead combo box. Include the script once per page:

```html

<link rel="stylesheet" href="https://das-at-frnt-end.azureedge.net/css/main.css"/>
<script src="https://das-at-frnt-end.azureedge.net/libs/accessible-autocomplete/accessible-autocomplete.min.js"></script>
```

The demos below are backed by real data in [`demos/data`](demos/data) — the full apprenticeship
courses list (`courses.json`) and training providers list (`providers.json`). A runnable version
is available two ways:

- **In the dev server** — run `npm run dev` and visit <http://localhost:1045/demos/autocomplete>
  (also linked from the home page). Assets come from your local `dist/` build; data from
  `/demos/data`.
- **Standalone** — [`demos/autocomplete.html`](demos/autocomplete.html) loads assets from the AT
  CDN. Because it fetches its data from the co-located `data/` folder, it must be **served over
  HTTP** (visit it at <http://localhost:1045/demos/autocomplete.html> under `npm run dev`, or run
  `npx serve demos`) — opening it via `file://` will block the data fetches.

### Demo 1 — progressive enhancement of a `<select>`

The recommended pattern: render a normal `<select>` server‑side (works without JS), then enhance
it.

```html

<div class="govuk-form-group">
    <label class="govuk-label" for="country">Country</label>
    <select id="country" name="country" class="govuk-select">
        <option value="">Select a country</option>
        <option value="fr">France</option>
        <option value="de">Germany</option>
        <option value="es">Spain</option>
        <option value="it">Italy</option>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="gb">United Kingdom</option>
    </select>
</div>

<script>
    accessibleAutocomplete.enhanceSelectElement({
        selectElement: document.querySelector('#country'),
        minLength: 2,
        defaultValue: '',
        displayMenu: 'overlay',
    });
</script>
```

### Demo 2 — static list (apprenticeship courses)

When there is no `<select>` to enhance, mount an autocomplete into an empty container and provide
the suggestions as an array. Here we fetch the full [`courses.json`](demos/data/courses.json) list
once and hand it over as the `source`.

```html
<div class="govuk-form-group">
  <label class="govuk-label" for="course">Apprenticeship course</label>
  <div id="course-container"></div>
</div>

<script>
  fetch('/demos/data/courses.json')
    .then(response => response.json())
    .then(courses => {
      accessibleAutocomplete({
        element: document.querySelector('#course-container'),
        id: 'course', // matches the <label for="...">
        name: 'course',
        source: courses,
      });
    });
</script>
```

### Demo 3 — async source (training providers)

For a large dataset, pass a `source` function. Here we fetch
[`providers.json`](demos/data/providers.json) once, cache it, and filter by name on each keystroke.
Swapping the fetch for a real search endpoint moves the filtering server‑side.

```html
<div class="govuk-form-group">
  <label class="govuk-label" for="provider">Training provider</label>
  <div id="provider-container"></div>
</div>

<script>
  let providersPromise;
  const loadProviderNames = () =>
    (providersPromise ??= fetch('/demos/data/providers.json')
      .then(response => response.json())
      .then(list => [...new Set(list.map(p => p.ProviderName))].sort()));

  accessibleAutocomplete({
    element: document.querySelector('#provider-container'),
    id: 'provider',
    name: 'provider',
    minLength: 2,
    source: (query, populateResults) => {
      const q = query.toLowerCase();
      loadProviderNames()
        .then(names => populateResults(names.filter(n => n.toLowerCase().includes(q)).slice(0, 100)))
        .catch(() => populateResults([]));
    },
  });
</script>
```

## Local development

### Requirements

- [Node.js](https://nodejs.org/en/) (a current LTS release)
- npm (ships with Node)

### Setup

```bash
npm install     # or `npm ci` for an exact, lockfile-based install
npm run dev     # starts the example server
```

Then visit <http://localhost:1045> for an example view. The example server (`server.js`) serves
the compiled `dist/` folder statically and renders Nunjucks views from `app/views`.

### Gulp tasks

Run from the repo root (via `npm gulp <task>`):

| Task              | Description                                                                     |
|-------------------|---------------------------------------------------------------------------------|
| `gulp build`      | Build all DAS and Apprentice assets into `dist/` (used by CI).                  |
| `gulp das`        | Compile then watch the DAS SCSS (`src/das/sass`) and JS (`src/das/javascript`). |
| `gulp apprentice` | Compile then watch the Apprentice SCSS and JS (`src/apprentice`).               |

`npm run build` is a shortcut for `gulp build`. `npm run prettier` formats the repo.

## Build & release

CI (`azure-pipelines.yml`) runs `npm ci` then `gulp build`, and publishes the contents of `dist/`
(plus `azure/`) as a build artifact. A release pipeline deploys those assets to the CDN endpoint
for each environment. Because `dist/` is produced by the build, **do not** hand‑edit files there —
change the sources under `src/` and rebuild.

## Repository layout

```
src/das/          DAS (Apprenticeship Service) SCSS, JS and images
src/apprentice/   Apprentice portal SCSS and JS
src/fiu/          FIU (being retired — undocumented)
tasks/gulp/       Gulp build tasks
config/           Build config (paths, sass options)
app/              Example server views/routes used by `npm run dev`
dist/             Build output published to the CDN (generated)
demos/            Standalone, runnable component demos
```

## Dependencies

Dependencies use caret ranges backed by a committed `package-lock.json`; CI installs with
`npm ci` for reproducible builds. A couple of deliberate constraints:

- **jQuery is held at 3.x.** Upgrading to 4.x is blocked by Select2 (a jQuery plugin loaded at
  runtime), which is not verified against jQuery 4 and can break silently. Treat jQuery 4 +
  Select2 as one coordinated, browser‑tested upgrade.
