const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

try {
    const workbook = XLSX.readFile('yc.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON with headers
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    // Map to a cleaner format based on the screenshot/actual data
    const cleanedData = rawData.map((row, index) => {
        // Headers from screenshot: Company, Batch, Status, First Name, Last Name, Last Name (email), Organization Domain, Unique ID, Full Name
        // We'll use more robust mapping - usually XLSX.utils.sheet_to_json uses the first row as keys
        return {
            id: row['Unique ID'] || `yc-${index}`,
            company: row['Company'] || 'Unknown',
            batch: row['Batch'] || '',
            website: row['Organization Domain'] || '',
            contactName: row['Full Name'] || `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim(),
            contactEmail: row['Last Name_1'] || row['Email'] || '', // XLSX usually appends _1 to duplicate headers
            status: row['Status'] || 'ACTIVE'
        };
    });

    // Handle duplicate header "Last Name" which likely becomes "Last Name_1" for the email column
    // Let's refine the search for email if "Last Name_1" doesn't exist
    const finalData = cleanedData.map(item => {
        if (!item.contactEmail) {
            // Find any key that looks like an email or has "Email" in it
            const rawRow = rawData[cleanedData.indexOf(item)];
            const emailKey = Object.keys(rawRow).find(key =>
                key.toLowerCase().includes('email') ||
                (typeof rawRow[key] === 'string' && rawRow[key].includes('@'))
            );
            if (emailKey) item.contactEmail = rawRow[emailKey];
        }
        return item;
    });

    fs.writeFileSync(
        path.join(__dirname, 'src/data/yc_startups.json'),
        JSON.stringify(finalData, null, 2)
    );

    console.log(`Successfully converted ${finalData.length} startups to JSON.`);
} catch (error) {
    console.error('Error converting XLSX to JSON:', error);
    process.exit(1);
}
