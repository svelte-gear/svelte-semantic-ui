// import-modules.ts
/* eslint-disable import/extensions */

// add "semantic-ui-css": "2.5.0" to "dependencies" section on package.json
// add "fomantic-ui-css": "2.9.2" to "dependencies" section on package.json
// keep jquery script tag in the app.html

// There are tree ways to inclide Semantic-UI into the project:
// a) staticly link compiled css and js in html file       (css: 629k, js: 276k)
// b) import semantic-ui library as a whole                (css: 565k, js: 276k)
// c) import individual Semantic-UI components             (css: 509k, js: 153k)

// +) add calendar, slider, and toast from fomantic-ui     (css:  35k, js:  60k)

// CORE

import "semantic-ui-css/components/reset.min.css";
import "semantic-ui-css/components/site.min.css";
import "semantic-ui-css/components/site.min.js";

// ELEMENTS

import "semantic-ui-css/components/button.min.css";
import "semantic-ui-css/components/container.min.css";
import "semantic-ui-css/components/divider.min.css";
import "semantic-ui-css/components/flag.min.css"; //...... country flags
import "semantic-ui-css/components/header.min.css";
import "semantic-ui-css/components/icon.min.css";
import "semantic-ui-css/components/item.min.css"; //...... multiple items in flexbox
import "semantic-ui-css/components/image.min.css";
import "semantic-ui-css/components/input.min.css";
import "semantic-ui-css/components/label.min.css";
import "semantic-ui-css/components/list.min.css";
import "semantic-ui-css/components/loader.min.css";
import "semantic-ui-css/components/placeholder.min.css";
import "semantic-ui-css/components/rail.min.css"; //...... requred for sticky
import "semantic-ui-css/components/reveal.min.css";
import "semantic-ui-css/components/segment.min.css";
import "semantic-ui-css/components/step.min.css"; //...... wizard steps

// COLLECTIONS & VIEWS

import "semantic-ui-css/components/breadcrumb.min.css";
import "semantic-ui-css/components/form.min.css";
import "semantic-ui-css/components/grid.min.css";
import "semantic-ui-css/components/menu.min.css";
import "semantic-ui-css/components/message.min.css";
import "semantic-ui-css/components/table.min.css";

// import "semantic-ui-css/components/ad.min.css";
// import "semantic-ui-css/components/card.min.css";
// import "semantic-ui-css/components/card.min.css";
// import "semantic-ui-css/components/feed.min.css";
// import "semantic-ui-css/components/item.min.css";
// import "semantic-ui-css/components/statistic.min.css";

// MODULES

import "semantic-ui-css/components/checkbox.min.css";
import "semantic-ui-css/components/checkbox.min.js";
import "semantic-ui-css/components/dimmer.min.css"; //.... required for modal
import "semantic-ui-css/components/dimmer.min.js";
import "semantic-ui-css/components/dropdown.min.css";
import "semantic-ui-css/components/dropdown.min.js";
import "semantic-ui-css/components/modal.min.css";
import "semantic-ui-css/components/modal.min.js";
import "semantic-ui-css/components/popup.min.css"; //..... required for calendar ?
import "semantic-ui-css/components/popup.min.js";
import "semantic-ui-css/components/sticky.min.css";
import "semantic-ui-css/components/sticky.min.js";
import "semantic-ui-css/components/transition.min.css"; // required for dropdown
import "semantic-ui-css/components/transition.min.js";

// import "semantic-ui-css/components/accordion.min.css";
// import "semantic-ui-css/components/accordion.min.js";
// import "semantic-ui-css/components/embed.min.css";
// import "semantic-ui-css/components/embed.min.js";
// import "semantic-ui-css/components/nag.min.css";
// import "semantic-ui-css/components/nag.min.js";
// import "semantic-ui-css/components/progress.min.css";
// import "semantic-ui-css/components/progress.min.js";
// import "semantic-ui-css/components/rating.min.css";
// import "semantic-ui-css/components/rating.min.js";
// import "semantic-ui-css/components/search.min.css";
// import "semantic-ui-css/components/search.min.js";
// import "semantic-ui-css/components/shape.min.css";
// import "semantic-ui-css/components/shape.min.js";
// import "semantic-ui-css/components/sidebar.min.css";
// import "semantic-ui-css/components/sidebar.min.js";
// import "semantic-ui-css/components/tab.min.css";
// import "semantic-ui-css/components/tab.min.js";
// import "semantic-ui-css/components/video.min.css";
// import "semantic-ui-css/components/video.min.js";

import "fomantic-ui-css/components/calendar.min.css";
import "fomantic-ui-css/components/calendar.min.js";
import "fomantic-ui-css/components/slider.min.css";
import "fomantic-ui-css/components/slider.min.js";
import "fomantic-ui-css/components/toast.min.css";
import "fomantic-ui-css/components/toast.min.js";

// BEHAVIOUR

import "semantic-ui-css/components/form.min.js"; //....... form validation

// import "semantic-ui-css/components/api.min.js"; //........ actions on server
// import "semantic-ui-css/components/colorize.min.js"; //... image processing?
// import "semantic-ui-css/components/state.min.js"; //...... data sources for ui components
// import "semantic-ui-css/components/visibility.min.js"; //. callback when appear in viewport
// import "semantic-ui-css/components/visit.min.js"; //...... visitor counting?
