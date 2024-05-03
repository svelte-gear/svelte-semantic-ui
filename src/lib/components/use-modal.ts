// use-modal.ts

import { get, writable } from "svelte/store";

import type { ActionReturnType, JQueryApi, DataController } from "../data/_common";
import { jQueryElem, uid, SVELTE_DATA_STORE } from "../data/_common";

export type ModalSettings = {
    [key: string]: unknown;
};

export const modalDefaults: ModalSettings = {};

type ModalApi = {
    modal(settings?: ModalSettings): void;
    modal(command: string): unknown;
};

/**
 * Initializes Semantic UI Modal componenet. Takes settings object as argument.
 *
 * https://semantic-ui.com/modules/modal.html
 *
 * Example:
```
    <div class="ui basic modal"
        use:modal={{ onApprove: okFn, closable: false }}>
        <Data bind:active={show} />
        ...
    </div>
```
or
```
    <div  class="ui basic modal"
        use:modal={{ onApprove: okFn, closable: false }}>
        use:controller={ctrl} />
        ...
    </div>
    <script>
        ctrl.modal("show");
    </script>
```
*/
export function modal(node: Element, settings?: ModalSettings): ActionReturnType {
    const elem = jQueryElem(node) as JQueryApi & ModalApi;
    if (!elem.modal) {
        throw new Error("Semantic UI is not initialized");
    }
    /*
            dP
            88
 .d8888b. d8888P .d8888b. 88d888b. .d8888b.
 Y8ooooo.   88   88'  `88 88'  `88 88ooood8
       88   88   88.  .88 88       88.  ...
 `88888P'   dP   `88888P' dP       `88888P'

    */

    // create store to push data back to the binder
    const holder: DataController<boolean> = {
        uid: uid(),
        mode: "modal",
        store: writable(),

        /** Push value into the modal. */
        doUpdate(value: boolean) {
            if (value) {
                if (!elem.modal("is active")) {
                    elem.modal("show");
                }
            } else {
                if (elem.modal("is active")) {
                    elem.modal("hide");
                }
            }
        },

        /** Return updated value from the modal. */
        onChange(newValue: boolean) {
            console.debug(`  onChange(${this.uid}) = ${newValue}`);
            if (get(this.store) !== newValue) {
                console.debug(`  store(${this.uid}) <- modal = ${newValue}`);
                this.store.set(newValue);
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

    type OnChangeFn = () => void;

    function onModalShow() {
        if (modalDefaults.onShow) {
            (modalDefaults.onShow as OnChangeFn)();
        }
        if (settings && settings.onShow) {
            (settings.onShow as OnChangeFn)();
        }
        holder.onChange(true);
    }

    function onModalHidden() {
        if (modalDefaults.onHidden) {
            (modalDefaults.onHidden as OnChangeFn)();
        }
        if (settings && settings.onHidden) {
            (settings.onHidden as OnChangeFn)();
        }
        holder.onChange(false);
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
    elem.modal({
        ...modalDefaults,
        ...settings,
        onShow: onModalShow,
        onHidden: onModalHidden,
    });

    // Attach store holder to jQuery element
    console.debug(`  store(${holder.uid}) - ${holder.mode} created`);
    elem.data(SVELTE_DATA_STORE, holder);

    // IMPORTANT:
    // elem must be removed throght jQuery as modal() function has moved it in DOM
    // and Svelte no longer knows where it is
    return {
        destroy() {
            console.debug("  action - destroy");
            elem.remove();
        },
    };
}
