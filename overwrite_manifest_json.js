// this is a script to convert "https://lms.keio.jp" in web_accessible_resources[].matches[] to "https://lms.keio.jp/*"
// because the former value causes error when importing the extension.

import fs from "node:fs";

const convert = (url) => {
  const url_ = new URL(url);
  if (url_.pathname === "/") return `${url_.origin}/*`;
  else return url;
};

const buf = fs.readFileSync("dist/manifest.json");
const manifest = JSON.parse(buf);
for (const res of manifest.web_accessible_resources) {
  res.matches = res.matches.map((match) => convert(match));
}
fs.writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2), {
  encoding: "utf8",
  flag: "w",
});
