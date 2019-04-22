#!/usr/bin/env bash

if [[ -z $1 ]]; then
    echo >&2 Must pass path to root of site
    exit 1
fi
assets_root=$1/assets

command -v identify >/dev/null 2>&1 || { echo >&2 "I need identify from ImageMagick, but it is not installed."; exit 1; }

posts_imgs=$(ls -d1 ${assets_root}/images/posts/*)
projects_imgs=$(ls -d1 ${assets_root}/images/projects/*)

failed=0
for file in $posts_imgs; do
  format=$(identify -format '%m' "$file")
  width=$(identify -format '%w' "$file")
  height=$(identify -format '%h' "$file")
  filesize=$(du -s "$file" | awk '{print $1}')
  exif=$(identify -format "%[EXIF:*]" "$file")
  if [[ "$format" != "JPEG" ]]; then
    >&2 echo "Person image $file is $format, but it should be a jpg."
    failed=1
  fi
  if (( "$width" > 600 || "$height" > 600 )); then
    >&2 echo "Person image $file (${width}x${height}) is too large. Should fit within 500x500."
    failed=1
  fi
  if (( "$filesize" > 300 )); then
    >&2 echo "Person image $file (${filesize}KB) is too large. Should fit within 300KB."
    failed=1
  fi
  if [[ "${exif}" ]]; then
    >&2 echo "Person image $file contains EXIF metadata. Please strip these to avoid accidentally sharing personal information."
    >&2 echo "Metadata: $exif"
    failed=1
  fi
done

for file in $projects_imgs; do
  format=$(identify -format '%m' "$file")
  width=$(identify -format '%w' "$file")
  height=$(identify -format '%h' "$file")
  filesize=$(du -s "$file" | awk '{print $1}')
  if (( $width > 2000 || $height > 1500 )); then
    >&2 echo "Project image $file (${width}x${height}) is too large. Should fit within 2000x1500."
    failed=1
  fi
  if (( "$filesize" > 500 )); then
    >&2 echo "Project image $file (${filesize}KB) is too large. Should fit within 500KB."
    failed=1
  fi
done

exit $failed