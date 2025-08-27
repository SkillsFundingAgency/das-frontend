# DAS Frontend

Contains frontend code and assets used for The Apprentice Service and the www.apprenticeships.gov.uk website.

## Requirements

1. node - https://nodejs.org/en/
2. npm - https://www.npmjs.com/package/npm
3. Gulp - https://gulpjs.com/

## Local setup

1. Clone repo
2. `npm install`
3. `npm run dev`
4. Visit http://localhost:1045 to see an example view

### Gulp tasks

Run in the root directory

| Task         | Description                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `gulp das`   | Compiles, then watches the SCSS files in `/src/das/sass` and JS files in `/src/das/javascript` - for The Apprenticeship Service |
| `gulp fiu`   | Compiles, then watches the SCSS and JS files across the `/src/fiu` directory - for the www.apprenticeships.gov.uk website       |
| `gulp build` | Build all frontend assets for `das` and `fiu`                                                                                   |
