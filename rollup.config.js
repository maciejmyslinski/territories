import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  input: 'sheets/index.js',
  output: {
    file: `build/index.js`,
    format: 'es',
  },
  treeshake: false,
  plugins: [
    commonjs(),
    resolve(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        [
          'env',
          {
            modules: false,
          },
        ],
      ],
    }),
  ],
};
