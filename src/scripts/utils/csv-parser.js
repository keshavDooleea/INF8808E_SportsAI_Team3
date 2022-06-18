/**
 * Utilitary funtion that parses a CSV file to a json object
 *
 * @param {number} csvPath The folder name and file name (path) of the CSV file found in assets/data/
 * @returns {Object[]} The array of objects parsed from the csv file
 *
 */
export async function csvToJSON(csvPath) {
  return new Promise(async function (resolve, reject) {
    try {
      const data = await d3.csv(csvPath);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}
