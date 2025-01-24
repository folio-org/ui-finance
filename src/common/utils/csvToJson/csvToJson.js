export const csvToJson = async (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      headers: includeHeaders = true,
    } = options;

    const reader = new FileReader();

    // Handle file reading
    reader.onload = (event) => {
      const text = event.target.result;

      const rows = text
        .split('\n')
        .map((row) => row.split(',').map((cell) => cell.trim()));

      if (includeHeaders) {
        // Use the first row as headers
        const headers = rows.shift();

        // Map rows to JSON objects using headers
        const json = rows.map((row) => row.reduce((acc, value, index) => {
          acc[headers[index]] = value;

          return acc;
        }, {}));

        resolve(json);
      } else {
        // If headers are disabled, return an array of arrays
        resolve(rows);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };

    reader.readAsText(file);
  });
};
