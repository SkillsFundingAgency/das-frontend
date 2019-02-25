# DAS Frontend
Contains frontend code and assets used for DAS services. Code is currently compiled locally and published onto the DAS CDN, to be consumed by the DAS services.

## Requirements 

1. node - https://nodejs.org/en/
2. npm - https://www.npmjs.com/package/npm
3. Gulp - https://gulpjs.com/

## Local setup

1. Clone repo
2. `npm install`
3. `npm run dev`
4. Visit https://localhost:1045 to see an example view 

### Gulp tasks 

Run in the root directory

|Task|Description|
|----|-----------|
| `gulp` | Compiles and then watches the SASS files in `/src/sass` |
| `gulp sass` | Just compiles the SASS files in `/src/sass` |
