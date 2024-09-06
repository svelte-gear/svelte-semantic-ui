import "./global.css";

// eslint-disable-next-line @typescript-eslint/naming-convention
import App from "./App.svelte";

// eslint-disable-next-line @typescript-eslint/typedef
const app = new App({
    target: document.body,
    props: {
        name: "world",
    },
});

export default app;
