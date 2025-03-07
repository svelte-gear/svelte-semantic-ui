# typedoc.sh
# generates html documentation for the project

# fix svelte type definition mistake (exists in svelte 5.20.2)
sed -i 's/@param internal /@param internals /' node_modules/svelte/types/index.d.ts

# # pre-process *.svelte components
# WRK_DIR="src/lib/data"
# PREFIX="_svelte-"
# for file in "$WRK_DIR"/*.svelte; do
#   filename=$(basename "$file")
#   dest_file="$WRK_DIR/$PREFIX${filename%.svelte}.ts"
#   cat "$WRK_DIR/$filename" \
#   | sed -z s/.*@component/\\/**/ \
#   | sed -z s/--\>.*@module/@module/ \
#   | sed -z s/\<\\/script\>.*// \
#   > "$dest_file"
#   echo "void children;" >> "$dest_file"
# done

# pre-process *.md documents
SRC_DIR="doc"
DST_DIR="src/lib/man"
mkdir -p "$DST_DIR"
for file in "$SRC_DIR"/*.md; do
  filename=$(basename "$file")
  dest_file="$DST_DIR/${filename%.md}.ts"
  echo "/**" > "$dest_file"
  cat "$file" >> "$dest_file"
  echo "@module man/${filename%.md} */" >> "$dest_file"
done

# generate documentation
yarn typedoc

# clean up
rm -r src/lib/man
# rm $WRK_DIR/$PREFIX*
