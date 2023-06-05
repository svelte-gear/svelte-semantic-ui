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

-   [Readme](../README)
