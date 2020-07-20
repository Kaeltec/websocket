import path from 'path';
import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, 'src/index.js');
const PKG = require(path.join(PACKAGE_ROOT_PATH, 'package.json')); // eslint-disable-line import/no-dynamic-require

function makeExternalPredicate(externalArr) {
  if (!externalArr.length) return () => false;
  return id => new RegExp(`^(${externalArr.join('|')})($|/)`).test(id);
}

function getExternal() {
  return makeExternalPredicate(
    Object.keys(PKG.peerDependencies || {}).concat(
      Object.keys(PKG.dependencies || {}),
    ),
  );
}

module.exports = {
  input: INPUT_FILE,
  external: getExternal(),
  plugins: [url(), json(), resolve(), commonjs()],
  output: [
    {
      format: 'cjs',
      sourcemap: true,
      file: path.resolve(PACKAGE_ROOT_PATH, 'dist/index.js'),
    },
  ],
};
