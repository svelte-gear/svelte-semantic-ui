/**
 * Svelte Component &lt;InitCalendar&gt;
 * @module components/<InitDropdown>
 */

import type { Snippet, Component } from "svelte";
import type { ModalSettings } from "../data/semantic-types";

/**
 * Svelte data binder and initializer for Semantic UI `Modal` component.
 *
 * Changing the boolean variable bound to `active` will show or hide the dialogue.
 * ```
 * <div id="md" class="ui modal page" use:modal>
 *     ...
 * </div>
 * <InitModal bind:show={show} />
 *
 * `settings` prop allows to customize the Semantic component,
 * see https://fomantic-ui.com/modules/modal.html#/settings for details.
 *
 * InitModal should follow the Semantic UI component (div.ui.modal).
 * The library may be configured to accept InitModal as a parent or a child on the Semantic UI modal.
 * Optional `forId` prop allows to put InitModal in a any location.
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types */
/* prettier-ignore */
declare const InitModal: Component<{
    /** Two-way binding for setting and reading back modal dialog visibillity */
    show: boolean;

    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/modal.html#/settings */
    settings?: ModalSettings;

    /** Id of the Semantic UI input element, takes precendence over tag position */
    forId?: string;

    /** If InitModal is used as a parent, render the children components */
    children?: Snippet;
}, {}, "show">;
/* eslint-enable */

export default InitModal;
