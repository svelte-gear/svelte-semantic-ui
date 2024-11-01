# pre-publish.sh
# add missing namespace references

if ! grep -q '/// <reference types="jquery" />' dist/data/semantic-types.d.ts; then
  sed -i '/ * @module data\/semantic-ui-types/a \
 */\
/// <reference types="jquery" />\
/// <reference types="fomantic-ui-css" />\
/* <reference> lines above were added manually to fix Svelte 5 packaging bug' dist/data/semantic-types.d.ts
fi
