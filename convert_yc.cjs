const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('yc.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);

// Map the data to a more consistent format based on the SS
const mappedData = data.map((row, index) => ({
    id: row['Unique ID'] || `yc-${index}`,
    company: row['Company'],
    batch: row['Batch'],
    status: row['Status'],
    firstName: row['First Name'],
    lastName: row['Last Name'],
    email: row['Last Name_1'], // In the SS, column F (labeled Last Name but containing emails)
    website: row['Organization Domain'],
    fullName: row['Full Name']
}));

fs.writeFileSync('src/data/yc_startups.json', JSON.stringify(mappedData, null, 2));
console.log('Converted yc.xlsx to src/data/yc_startups.json');
console.log('Sample row:', mappedData[0]);
