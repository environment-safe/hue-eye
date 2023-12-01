@environment-safe/hue-eye
=========================
A vanilla JS canvas based ESM color picker which uses pixel lookup to do color selection (as opposed to coordinate prediction) allowing many different visualizations to share strategies, work at any resolution and have exact fidelity to the displayed color.

Usage
-----

First install hue-eye

```bash
npm install hue-eye
```

you then need to pull in the dependencies (if you aren't building) in your HTML.

```html
    <script type="importmap"> { "imports": {
        "hue-eye": "../node_modules/@environment-safe/hue-eye/src/index.mjs",
        "@environment-safe/elements": "../node_modules/@environment-safe/elements/src/index.mjs",
        "browser-or-node": "../node_modules/browser-or-node/src/index.js"
    } } </script>
```

include hue-eye in a script with
```javascript
import 'hue-eye';
```

last, use it in your html

```html
    <color-wheel height="300" width="300" hex="#00FF77"></color-wheel>
    <color-disc height="300" width="300" hex="#00FF77"></color-disc>
```

Testing
-------

Run the es module tests to test the root modules
```bash
npm run import-test
```
to run the same test inside the browser:

```bash
npm run browser-test
```
to run the same test headless in chrome:
```bash
npm run headless-browser-test
```

to run the same test inside docker:
```bash
npm run container-test
```

Run the commonjs tests against the `/dist` commonjs source (generated with the `build-commonjs` target).
```bash
npm run require-test
```

Development
-----------
All work is done in the .mjs files and will be transpiled on commit to commonjs and tested.

If the above tests pass, then attempt a commit which will generate .d.ts files alongside the `src` files and commonjs classes in `dist`

