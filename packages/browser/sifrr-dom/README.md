# sifrr-dom &middot; [![npm version](https://img.shields.io/npm/v/@sifrr/dom.svg)](https://www.npmjs.com/package/@sifrr/dom)

A < 5KB DOM library for creating user interfaces for websites using Custom Elements, one way/two way data binding.

### Size
| Type | Size     |
| :------------ | :------------: |
| Normal (`dist/sifrr.dom.js`)       | [![Normal](https://img.badgesize.io/sifrr/sifrr/master/packages/browser/sifrr-dom/dist/sifrr.dom.js?maxAge=600)](https://github.com/sifrr/sifrr/blob/master/packages/browser/sifrr-dom/dist/sifrr.dom.js) |
| Minified (`dist/sifrr.dom.min.js`) | [![Minified](https://img.badgesize.io/sifrr/sifrr/master/packages/browser/sifrr-dom/dist/sifrr.dom.min.js?maxAge=600)](https://github.com/sifrr/sifrr/blob/master/packages/browser/sifrr-dom/dist/sifrr.dom.min.js) |
| Minified + Gzipped (`dist/sifrr.dom.min.js`) | [![Minified + Gzipped](https://img.badgesize.io/sifrr/sifrr/master/packages/browser/sifrr-dom/dist/sifrr.dom.min.js?compression=gzip&maxAge=600)](https://github.com/sifrr/sifrr/blob/master/packages/browser/sifrr-dom/dist/sifrr.dom.min.js) |

## How to use
### Directly in Browser using standalone distribution
Add script tag in your website.
```html
<script src="https://unpkg.com/@sifrr/dom@0.1.0-alpha1/dist/sifrr.dom.min.js"></script>
```

#### Compatibility table for standalone distribution (Needs support for JavaScript Custom Elements and Shadow DOM)
- chrome >= 55
- safari >= 10.1
- opera >= 42
- firefox >= 53

### Using npm
Do `npm i @sifrr/dom` or `yarn add @sifrr/dom` or add the package to your `package.json` file.

example, put in your frontend js module (compatible with webpack/rollup/etc):
#### Commonjs
```js
window.Sifrr = window.Sifrr || {};
window.Sifrr.Dom = require('@sifrr/dom');
```

#### ES modules
```js
import DOM from '@sifrr/dom';
window.Sifrr = window.Sifrr || {};
window.Sifrr.Dom = DOM;
```