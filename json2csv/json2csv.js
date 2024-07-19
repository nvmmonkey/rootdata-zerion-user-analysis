const fs = require("fs");
const { Parser } = require("json2csv");
const filename = "transformedData.json";

// Read the transformed data file
const transformedData = JSON.parse(fs.readFileSync(filename, "utf-8"));

// Define the fields (column headers) based on the keys of the first object in the transformedData array
const fields = Object.keys(transformedData[0]);

// Create the json2csv parser
const json2csvParser = new Parser({ fields });

// Convert JSON to CSV
const csv = json2csvParser.parse(transformedData);

// Write the CSV data to a new file
fs.writeFileSync("transformedData.csv", csv, "utf-8");

console.log("CSV export complete.");
