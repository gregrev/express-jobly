const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
// ** 
// This function takes two parameters: 
// 1. ( { dataToUpdate },
// data can include: {name, description, numEmployees, logoUrl}
// 2. { jsToSql mapping of keys to SQL column names(if needed) } )
// i.e.: {
//   numEmployees: "num_employees",
//   logoUrl: "logo_url",
// }
// it then checks to see if there is any data submitted and returns error if not.
// 
// returns an object with two properties: setCols, values
// setCols: joins the cols array into a string that will be used to construct the SQL
// 'SET' clause.
// example" {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
// values: 
// gets the values from the dataToUpdate object and puts them into an array
// example: {firstName: 'Aliya', age: 32} will be ['Aliya', 32]


function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No Data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate)
  };
}

module.exports = { sqlForPartialUpdate };
