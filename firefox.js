// Modifications of manifest.json for firefox

import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync("dist/manifest.json"));

for (const res of manifest.web_accessible_resources)
  res.matches = res.matches.map((url) => {
    const url_ = new URL(url);
    if (url_.pathname === "/") return `${url_.origin}/*`;
    else return url;
  });

for (const res of manifest.web_accessible_resources) delete res.use_dynamic_url;

manifest.browser_specific_settings = { gecko: { id: "foo@bar" } };

fs.writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2), {
  encoding: "utf8",
  flag: "w",
});
