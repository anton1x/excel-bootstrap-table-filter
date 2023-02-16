import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  entry: 'dist/excel-bootstrap-table-filter.js',
  dest: 'dist/excel-bootstrap-table-filter-bundle.js',
  format: 'iife',
  external: [
    'jquery',
  ],
  globals: {
    jquery: 'jQuery',
  },
  sourceMap: true,
  plugins: [
    {
      name: 'replace moment imports',
      transform: code =>
        ({
          code: code.replace(/import\s*\*\s*as\s*moment/g, 'import moment'),
          map: { mappings: '' }
        })
    },

    babel({
      exclude: 'node_modules/**',
    }),
    sourcemaps()
  ]
};
