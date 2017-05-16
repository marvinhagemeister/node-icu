# Node ICU

Downloads the correct icu `.dat` file for your cpu-architecture and node
version.

## Installation

```bash
# npm
npm install node-icu

# yarn
yarn add node-icu
```

To use the icu data, start node with the `--icu-data-dir` option or set the
`NODE_ICU_DATA` environment variable.

Example:

```bash
node --icu-data-dir=/absolut/path/to/node_modules/node-icu myapp.js
```

## License

`MIT` see [License](License.md);
