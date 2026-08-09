/**
 * Converts an array of flat objects into a CSV string. Hand-rolled rather
 * than pulling in a dependency since the need is simple: quote-escape
 * values containing commas/quotes/newlines, join with a header row.
 *
 * @param {Object[]} rows
 * @param {{key: string, label: string}[]} columns
 * @returns {string}
 */
const toCSV = (rows, columns) => {
  const escape = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = columns.map((c) => escape(c.label)).join(',');
  const body = rows
    .map((row) => columns.map((c) => escape(row[c.key])).join(','))
    .join('\n');

  return `${header}\n${body}`;
};

module.exports = { toCSV };
