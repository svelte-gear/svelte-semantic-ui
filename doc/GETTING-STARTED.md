# 1. Clone and run the library project, it has examples

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

Code inside `src/lib` is part of the library, <br>
everything inside `src/routes` can be used as a showcase or preview app.

# 2. Create you own project which uses the library

## a) copy one of the examples

Look at the `examples` folder, it has simple projects using vite, svelte kit, and an i18n example. <br>
You can start by copying and modifying one of them.

## b) create new project

Create a new project using [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

### Add dependencies

add `@svelte-gear/svelte-semantic-ui` as a dependency in you package.json </br>
add other dependencies that you need

Install dependencies with `npm install` (or `pnpm install` or `yarn install`), start a development server:

# 3. Start developing

Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

By default, the server will only respond to requests from localhost. To allow connections from
other computers, edit the `dev` commands in package.json to include the option `--host`.

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## VScode

If you're using [Visual Studio Code](https://code.visualstudio.com/)
we recommend installing the official extension
[Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).
