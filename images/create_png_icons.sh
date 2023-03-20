#!/usr/bin/sh
for size in "16" "48" "128"
do
  inkscape -w ${size} -h ${size} icon.svg -o icon${size}.png
done
