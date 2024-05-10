# svelte app

This is a project template for [Svelte](https://svelte.dev) apps.

## Get started

Install the dependencies...

```bash
cd svelte-app
yarn install
```

...then start [Rollup](https://rollupjs.org):

```bash
yarn dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running.
Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from
other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

## Building and running in production mode

To create an optimised version of the app:

```bash
yarn build
```

You can run the newly built app with `yarn start`. This uses [sirv](https://github.com/lukeed/sirv),
which is included in your package.json's `dependencies` so that the app will work when you deploy
to platforms like [Heroku](https://heroku.com).

## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise
compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond
to requests for _any_ path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

## Using TypeScript

If you want to use `baseUrl` or `path` aliases within your `tsconfig`, you need to set up
`@rollup/plugin-alias` to tell Rollup to resolve the aliases. For more info, see
[StackOverflow](https://stackoverflow.com/questions/63427935/setup-tsconfig-path-in-svelte).

# VScode

If you're using [Visual Studio Code](https://code.visualstudio.com/)
we recommend installing the official extension
[Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Back

-   [Readme](../README) - [Readme](../index.html)

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
