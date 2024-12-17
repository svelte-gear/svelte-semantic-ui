## Get started

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

To create an optimised version of the app:

```bash
yarn build
```

You can run the newly built app with `yarn preview`.

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
// There are multiple ways to inclide Semantic-UI into the project:
// 1) staticly link compiled css and js in app.html file (faster compile time)
//     A: fomantic-ui                                       (css: 1374k, js: 370k)
//     B: semantic-ui (our favorite method)                  (css: 629k, js: 276k)
// 2) import sematic-ui js in the project (smaller project size)
//     C: fomantic-ui,
//     D: semantic-ui + fomantic components                  (css: 565k, js: 276k)
//        calendar, slider, and toast from fomantic-ui       (css:  35k, js:  60k)
// 3) import individual components - this file ()
//     E: project size depends on component selection        (css: 509k, js: 153k)
//        small size gain is not worth it in current
// 4) build semantic-ui-less from source
```
