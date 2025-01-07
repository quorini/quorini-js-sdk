import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import commonjs from 'rollup-plugin-commonjs';

export default [
  {
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
        tsconfig: './tsconfig.json'
      })
    ],
    external: ['react', 'react-dom', '@quorini/core']
  },
  {
    input: './src/index.ts', // Path to your entry declaration file
    output: [{ file: './dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
