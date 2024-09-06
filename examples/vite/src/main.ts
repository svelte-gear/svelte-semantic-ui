/* eslint-disable @typescript-eslint/naming-convention */

import "./app.css";
import App from "./App.svelte";

// eslint-disable-next-line @typescript-eslint/typedef
const app = new App({
    target: document.getElementById("app")!,
});

export default app;
