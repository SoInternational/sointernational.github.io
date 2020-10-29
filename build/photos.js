#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const calipers = require("calipers")("bmp", "gif", "jpeg", "png", "svg", "webp");

const rootDir = "docs/photos";
const outFile = "docs/photos.yaml";
const publicPath = "/photos";

async function update(album, dir = "") {
  album = { ...album, photos: [...album.photos], children: [...album.children] };

  const absoluteDir = path.resolve(rootDir, dir);
  const items = await fs.promises.readdir(absoluteDir);
  const found = new Set();

  for (const item of items) {
    const itemPath = path.join(absoluteDir, item);
    const src = path.posix.join(publicPath, dir, item);

    found.add(src);

    if (/\.(bmp|gif|jpe?g|png|apng|svg|webp)$/.test(item)) {
      const i = album.photos.findIndex((photo) => photo.src === src);
      const photo = album.photos[i] ?? { src, name: "", description: "" };
      const {
        pages: [{ width = 0, height = 0 } = {}],
      } = await calipers.measure(itemPath);

      album.photos[i < 0 ? album.photos.length : i] = { ...photo, width, height };
    } else if ((await fs.promises.stat(itemPath)).isDirectory()) {
      const i = album.children.findIndex((album) => album.src === src);
      const child = await update(
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

async function load() {
  try {
    return YAML.parse(await fs.promises.readFile(path.resolve(outFile)));
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
  (async () => {
    const current = await load();
    const updated = await update(current);
    const serialized = YAML.stringify(updated);

    await fs.promises.writeFile(outFile, serialized);
  })().catch((err) => {
    console.log(err);
    process.exit(1);
  });
}
