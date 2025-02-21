### Settings and options

#### Rollup Visualizer

Fixing visual layout:

```js
    const simulation = forceSimulation()
        .force("collision", forceCollide().radius((node) => node.radius*1.25))
        .force("charge", forceManyBody().strength(-300))
        .force("link", forceLink(links)
        .strength((link) => {
        if (nodeGroups[link.source.uid] === nodeGroups[link.target.uid]) {
            return 1;
        }
        else {
            return 0.1;
        }
    })
```

#### Including Semantic UI

```
// There are multiple ways to include Semantic-UI into the project:
// 1) staticky link compiled css and js in app.html file (faster compile time)
//     A: fomantic-ui                                       (css: 1374k, js: 370k)
//     B: semantic-ui (our favorite method)                  (css: 629k, js: 276k)
// 2) import sematic-ui js in the project (smaller project size)
//     C: fomantic-ui,
//     D: semantic-ui + fomantic components                  (css: 565k, js: 276k)
//        calendar, slider, and toast from fomantic-ui       (css:  35k, js:  60k)
// 3) import individual components
//     E: project size depends on component selection        (css: 509k, js: 153k)
//        small size gain, may be not worth it
// 4) build semantic-ui-less from source
```
