/**
 * Expose default options used to generate JavaScript code.
 *
 * These options are, by default, passed to `escodegen.generate()` when
 * generating JavaScript code.  For reference, see:
 *   https://github.com/Constellation/escodegen/wiki/API
 */
exports.generate = {
  format: {
    indent: {
      style: '  ',
      base: 0
    },
    json: false,
    renumber: false,
    hexadecimal: false,
    quotes: 'single',
    escapeless: false,
    compact: false,
    parentheses: true,
    semicolons: true
  },
  parse: null,
  comment: false,
  sourceMap: undefined
}
