# Update Notifier Chrome Extension
A chrome extension that allows adding/removing games from the watchlist of this bot: https://github.com/InfiniteCanvas/UpdateNotifier.git

# Chrome Extension Template (Svelte + Tailwind)
Template from:
https://github.com/taishi55/svelte-chrome-extension-template

## Get started
1. run `npm install -g rollup` or `sudo npm install -g rollup` 
2. run `npm install -g sirv-cli` or `sudo npm install -g sirv-cli`
3. run `npm i`
4. run `npm run dev` to see realtime change (compile files at /public)
5. run `npm run build` for production (To reduce the extension's size, the source map file is not generated by default.)
6. load unpacked files under `/public` on developer mode to test your extension

## Main features
1. Edit manifest file at `/src/manifest.json` (reflect it at `/public/manifest.json`)
2. Edit icons images at `/src/icons` (reflect it at `/public/icons`)
3. Edit chrome.i18 messages at `/src/_locales` (reflect it at `/public/_locales`)
4. Edit content at `/src/content.ts` (reflect it at `/public/build/content.js`)
5. Edit background at `/src/background.ts` (reflect it at `/public/build/background.js`)

## Typescript Support
use `<script lang="ts">` to use typescript in svelte

## Tailwind Support
Use `<style lang="postcss">` to take full advantage.

## MIT License
You are free to use this for your commercial projects!
