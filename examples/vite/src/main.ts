import { mount } from "svelte";
import "./app.css";
// eslint-disable-next-line @typescript-eslint/naming-convention
import App from "./App.svelte";

// eslint-disable-next-line @typescript-eslint/typedef
const app = mount(App, { target: document.getElementById("app")! }); // Svelte 5
// const app = new App({ target: document.getElementById("app")! }); // Svelte 4

export default app;
