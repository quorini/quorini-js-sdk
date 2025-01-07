import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: './src/index.ts',
  output: [
    {
      file: './dist/index.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
  external: [],
};
