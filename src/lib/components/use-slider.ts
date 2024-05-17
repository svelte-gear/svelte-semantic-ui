/**
 * Svelte action to initialize fomantic slider component.
 * @module components/use-slider
 */

import { get, writable } from "svelte/store";

import type { ActionReturnType, JQueryApi, DataController } from "../data/common";
import { jQueryElem, uid, SVELTE_DATA_STORE } from "../data/common";

export interface SliderSettings {
    [key: string]: unknown;
}

export const sliderDefaults: SliderSettings = {};

/**
 * Initializes Fomantic UI Slider componenet. Takes settings object as argument.
 *
 * https://fomantic-ui.com/modules/slider.html
 *
 * Bing using `<Data bind:value` inside the component tag.
 *
 * Example:
```
    <div class="ui labeled ticked slider" use:slider={{ min: 0, max: 10 }}>
        <Data bind:value={num} />
    </div>
```
*/
export function slider(node: Element, settings?: SliderSettings): ActionReturnType {
    type SliderApi = JQueryApi & {
        slider(settings: SliderSettings): void;
        slider(command: string, arg1?: unknown, arg2?: unknown, arg3?: unknown): unknown;
    };
    const elem: SliderApi = jQueryElem(node) as SliderApi;
    if (!elem.slider) {
        throw new Error("Semantic UI is not initialized");
    }
    elem.append('<input type="hidden" />');
    const input: JQueryApi = elem.find("input");

    /*
            dP
            88
 .d8888b. d8888P .d8888b. 88d888b. .d8888b.
 Y8ooooo.   88   88'  `88 88'  `88 88ooood8
       88   88   88.  .88 88       88.  ...
 `88888P'   dP   `88888P' dP       `88888P'

    */

    // create store to push data back to the binder
    const holder: DataController<number> = {
        uid: uid(),
        mode: "slider",
        store: writable(),

        /** Push value into the slider */
        doUpdate(value: number) {
            const curValue: number = elem.slider("get value") as number;
            if (curValue !== value) {
                console.debug(`  update(${this.uid}) -> slider = ${value}`);
                elem.slider("set value", value);
                input.val(`${value}`);
            }
        },

        /** Return updated value from the slider */
        onChange(newValue: number) {
            console.debug(`  onChange(${this.uid}) = ${newValue} ${typeof newValue}`);
            const value: number = get(this.store);
            if (value !== newValue) {
                console.debug(`  store(${this.uid}) <- slider = ${newValue}`);
                this.store.set(newValue);
                input.val(`${newValue}`);
            }
        },
    };

    /*
                                       dP
                                       88
 .d8888b. dP   .dP .d8888b. 88d888b. d8888P
 88ooood8 88   d8' 88ooood8 88'  `88   88
 88.  ... 88 .88'  88.  ... 88    88   88
 `88888P' 8888P'   `88888P' dP    dP   dP

    */

    type OnChangeFn = (newValue: number) => void;

    function onSliderChange(newValue: number): void {
        if (sliderDefaults.onChange) {
            (sliderDefaults.onChange as OnChangeFn)(newValue);
        }
        if (settings && settings.onChange) {
            (settings.onChange as OnChangeFn)(newValue);
        }
        holder.onChange(newValue);
    }
    /*
 oo          oo   dP
                  88
 dP 88d888b. dP d8888P
 88 88'  `88 88   88
 88 88    88 88   88
 dP dP    dP dP   dP

    */

    // Initialize Semantic component
    elem.slider({
        ...sliderDefaults,
        ...settings,
        onChange: onSliderChange,
    });

    // Attach store holder to jQuery element
    console.debug(`  store(${holder.uid}) - ${holder.mode} created`);
    elem.data(SVELTE_DATA_STORE, holder);
}
