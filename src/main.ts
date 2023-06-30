// main.ts

import App from "./app.svelte";

const app = new App(
    // the line below may casue "Expected 0 arguments" error in VS code
    // but it compiles well by TS compiler or your build tool
    // @ts-ignore
    { target: document.body }
);

export default app;
