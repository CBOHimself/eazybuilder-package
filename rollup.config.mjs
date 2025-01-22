import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import path from 'path'; // For resolving paths
import cryptoBrowserify from 'crypto-browserify';

import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.jsx'],
      preferBuiltins: false, // Prevents Node.js builtins from being bundled
    }),
    commonjs(),
    json(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      presets: ['@babel/preset-react'],
    }),
    terser(), // Minify the output
  ],
  external: ['react', 'react-dom'],
  resolve: {
    alias: {
      // Polyfill `node:crypto` to `crypto-browserify`
      'node:crypto': 'crypto-browserify',
    },
    fallback: {
      // Provide the fallback for `crypto`
      crypto: path.resolve('node_modules/crypto-browserify'),
    },
  },
};
