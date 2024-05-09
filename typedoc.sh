cat src/lib/data/data-bind.svelte \
| sed -z s/.*@component/\\/**/ \
| sed -z s/--\>.*@module/@module/ \
| sed -z s/\<\\/script\>.*// \
> src/lib/data/_svelte-data-bind.ts

cat src/lib/data/form-validator-bind.svelte \
| sed -z s/.*@component/\\/**/ \
| sed -z s/--\>.*@module/@module/ \
| sed -z s/\<\\/script\>.*// \
> src/lib/data/_svelte-form-validator-bind.ts

yarn typedoc

rm src/lib/data/_svelte-*
