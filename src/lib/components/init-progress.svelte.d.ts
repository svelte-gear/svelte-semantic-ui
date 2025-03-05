/**
 * Svelte Component &lt;InitProgress&gt;
 * @module components/<InitProgress>
 */

import type { Snippet, Component } from "svelte";
import type { ProgressSettings } from "../data/semantic-types";

/**
 * Svelte data binder and initializer for Semantic UI `Progress` component.
 * ```
 * <div class="ui progress">
 *   <div class="bar">
 *     <div class="progress"></div>
 *   </div>
 *  </div>
 * <InitProgress value={progress} settings={{ ... }} />
 * ```
 * `value` binding is number for simple progress and number[] for multiple bars.
 *
 * `settings` prop allows to customize the Semantic component,
 * see https://fomantic-ui.com/modules/progress.html#/settings for details.
 *
 * InitProgress should follow the Semantic UI component (div.ui.progress).
 * The library may be configured to accept InitProgress as a parent or a child on the Semantic UI progress.
 * Optional `forId` prop allows to put InitProgress in a any location.
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types */
/* prettier-ignore */
declare const InitProgress: Component<{
    /** Parameter for setting the current progress value */
    value: number | number[];

    /** Parameter for setting the bar total. Default to 100 */
    total?: number;

    /** Settings for Semantic UI component, see https://fomantic-ui.com/modules/progress.html#/settings */
    settings?: ProgressSettings;

    /** Id of the Semantic UI component element, takes precedence over tag position */
    forId?: string;

    /** If InitProgress is used as a parent, render the children components */
    children?: Snippet;
}, {}, "value">;
/* eslint-enable */

export default InitProgress;
