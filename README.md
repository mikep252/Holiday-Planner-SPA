# Holiday Planner
> Holiday planning Vue PWA

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Deploy setup
### First time
``` bash
# install Firebase CLI (needs log in)
npm i -g firebase-tools

# build for production with minification
npm run build

# log in to the Firebase account
firebase login

# deploy `dist` folder to Firebase
firebase deploy
```
### Consecutive time
``` bash
npm run build && firebase deploy
```
