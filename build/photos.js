#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const rootDir = "docs/photos";
const outFile = "docs/photos.yaml";
const publicPath = "/photos";

function update(album, dir = "") {
  album = { ...album, photos: [...album.photos], children: [...album.children] };

  const absoluteDir = path.resolve(rootDir, dir);
  const items = fs.readdirSync(absoluteDir);
  const found = new Set();

  for (const item of items) {
    const itemPath = path.join(absoluteDir, item);
    const src = path.posix.join(publicPath, dir, item);

    found.add(src);

    if (/\.(bmp|gif|ico|jpe?g|png|apng|svg|tiff|webp)$/.test(item)) {
      const i = album.photos.findIndex((photo) => photo.src === src);
      const photo = album.photos[i] ?? { src, name: "", description: "" };

      album.photos[i < 0 ? album.photos.length : i] = photo;
    } else if (fs.statSync(itemPath).isDirectory()) {
      const i = album.children.findIndex((album) => album.src === src);
      const child = update(
        album.children[i] ?? { src, name: "", description: "", photos: [], children: [] },
        path.join(dir, item)
      );

      album.children[i < 0 ? album.children.length : i] = child;
    }
  }

  album.photos = album.photos.filter((photo) => found.has(photo.src));
  album.children = album.children.filter((child) => found.has(child.src));

  return album;
}

function load() {
  try {
    return YAML.parse(fs.readFileSync(path.resolve(outFile)));
  } catch {
    return {
      src: publicPath,
      name: "",
      description: "",
      photos: [],
      children: [],
    };
  }
}

if (require.main === module) {
  const current = load();
  const updated = update(current);
  const serialized = YAML.stringify(updated);

  fs.writeFileSync(outFile, serialized);
}
