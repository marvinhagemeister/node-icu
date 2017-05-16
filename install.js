const http = require("https");
const path = require("path");
const fs = require("fs");
const tar = require("tar");
const rimraf = require("rimraf");

const icu = process.versions.icu !== undefined
  ? process.versions.icu
  : process.config.variables.icu_ver_major;

if (icu === undefined) {
  throw new Error("Cannot determine Node’s ICU version!");
}

const icumaj = icu.split(".")[0];

const icuend = process.config.variables.icu_endiannes !== undefined
  ? process.config.variables.icu_endiannes.toLowerCase()
  : "l";

if (!/^(l|b|e)$/.test(icuend)) {
  throw Error(
    `Don’t know what to make of endianness “${icuend}” - expected l, b, or e`
  );
}

const minor = {
  l: 2,
  e: 0,
  b: 1
};

const icumin = icuend;
const pkg = `icu4c-data-0.${icumaj}.${minor[icuend]}`;
const url = `https://registry.npmjs.org/icu4c-data/-/${pkg}.tgz`;
const filename = `icudt${icumaj}${icuend}`;

function download(url, dest) {
  const file = fs.createWriteStream(dest);

  return new Promise((resolve, reject) => {
    http
      .get(url, res => {
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", err => {
        fs.unlink(dest);
        reject(err);
      });
  });
}

function extract(file) {
  const outputFile = path.join(__dirname, filename + ".dat");
  const output = fs.createWriteStream(outputFile);

  fs.createReadStream(file).pipe(tar.t()).on("entry", entry => {
    if (/\.dat$/.test(entry.path)) {
      entry.pipe(output);
    }
  });
}

function install() {
  const tmp = path.join(__dirname, "tmp");
  if (!fs.existsSync(tmp)) {
    fs.mkdirSync(tmp);
  }

  const dest = path.join(tmp, filename + ".tgz");
  return download(url, dest)
    .then(() => extract(dest))
    .then(() => rimraf.sync(tmp))
    .catch(err => {
      rimraf.sync(tmp);
      throw err;
    });
}

install().catch(err => {
  throw err;
});
