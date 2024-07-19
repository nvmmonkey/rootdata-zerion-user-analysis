// Sample JSON data (in practice, you would load this from a file)
// const data = [
//     {
//         "id": 1,
//         "name": "John Doe",
//         "info": {
//             "address": {
//                 "city": "New York",
//                 "zipcode": "10001"
//             },
//             "email": "john@example.com"
//         },
//         "age": 30
//     },
//     {
//         "id": 2,
//         "name": "Jane Smith",
//         "info": {
//             "address": {
//                 "city": "Los Angeles",
//                 "zipcode": "90001"
//             },
//             "email": "jane@example.com"
//         },
//         "age": 25
//     }
// ];

const fs = require("fs");
const filename = "data.json";

// Universal function to extract specific fields while maintaining structure
function extractFields(data, fields) {
  return data.map((item) => filterObject(item, fields));
}

// Helper function to filter object based on fields
function filterObject(obj, fields) {
  if (Array.isArray(obj)) {
    return obj.map((subItem) => filterObject(subItem, fields));
  } else if (obj && typeof obj === "object") {
    let result = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const fullPath = fields.find((field) => field.startsWith(key));
        if (fullPath) {
          const remainingPath = fullPath.split(".").slice(1).join(".");
          if (remainingPath) {
            result[key] = filterObject(
              obj[key],
              fields.map((field) =>
                field.startsWith(key + ".")
                  ? field.split(".").slice(1).join(".")
                  : field
              )
            );
          } else {
            result[key] = obj[key];
          }
        }
      }
    }
    console.log(result);
    return result;
  } else {
    return obj;
  }
}

// Read the JSON file
fs.readFile(filename, "utf8", (err, jsonString) => {
  if (err) {
    console.error("Failed to read file:", err);
    return;
  }
  try {
    const data = JSON.parse(jsonString);
    // Define the fields you want to extract
    const fieldsToExtract = [

      "wallet",
      // "detail.positions.data.attributes.id",
      "positions.data.attributes.value",
      "positions.data.attributes.price",
      "positions.data.fungible_info.name",
      "positions.data.fungible_info.symbol",
      "positions.data.fungible_info.flags.verified",
      "positions.data.attributes.symbol",
      "positions.data.attributes.quantity.float",
      "positions.data.attributes.quantity.decimals",
      "positions.data.updated_at",
      "positions.data.relationships.chain.data.id",
      "positions.data.fungible.data.id",
      "portfolio",
    ];
    // Extract the fields
    const extractedData = extractFields(data, fieldsToExtract);
    // Write the extracted data to a new JSON file
    fs.writeFile(
      "extractedData.json",
      JSON.stringify(extractedData, null, 2),
      (err) => {
        if (err) {
          console.error("Failed to write file:", err);
        } else {
          console.log("Extracted data written to extractedData.json");
        }
      }
    );
  } catch (err) {
    console.error("Failed to parse JSON:", err);
  }
});
