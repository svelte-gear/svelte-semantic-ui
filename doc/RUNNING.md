# Get started

Install the dependencies...

```bash
yarn install
```

...then start the app:

```bash
yarn dev
```

Navigate to [localhost:5173](http://localhost:5173). You should see your app running.<br/>
Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from
other computers, edit the `dev` commands in package.json to include the option `--host`.

## Building and running in production mode

To create an optimized version of the app:

```bash
yarn build
```

You can run the newly built app with `yarn preview`.

# create-svelte

Initialized using [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

Read more about creating a library [in the docs](https://kit.svelte.dev/docs/packaging).

## Creating a project

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish --access public
```

# VScode

If you're using [Visual Studio Code](https://code.visualstudio.com/)
we recommend installing the official extension
[Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

# Rollup Visualizer

Fixing visual layout:

```js
    const simulation = forceSimulation()
        .force("collision", forceCollide().radius((node) => node.radius*1.25))
        .force("charge", forceManyBody().strength(-300))
        .force("link", forceLink(links)
        .strength((link) => {
        if (nodeGroups[link.source.uid] === nodeGroups[link.target.uid]) {
            return 1;
        }
        else {
            return 0.1;
        }
    })
```

# Semantic UI

```
// There are multiple ways to include Semantic-UI into the project:
// 1) staticky link compiled css and js in app.html file (faster compile time)
//     A: fomantic-ui                                       (css: 1374k, js: 370k)
//     B: semantic-ui (our favorite method)                  (css: 629k, js: 276k)
// 2) import sematic-ui js in the project (smaller project size)
//     C: fomantic-ui,
//     D: semantic-ui + fomantic components                  (css: 565k, js: 276k)
//        calendar, slider, and toast from fomantic-ui       (css:  35k, js:  60k)
// 3) import individual components
//     E: project size depends on component selection        (css: 509k, js: 153k)
//        small size gain is not worth it in current
// 4) build semantic-ui-less from source
```
