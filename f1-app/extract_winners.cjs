const fs = require('fs');
const content = fs.readFileSync('C:/Users/aswin/.gemini/antigravity-ide/brain/8257dc0e-5740-414f-9a53-10328e32f299/.system_generated/steps/81/content.md', 'utf8');

// We know rows data starts at offset ~4526 from "Race Results"
// The results table has the following structure:
// Each row contains: [race link, date, driver name/info, car, laps, time]
// The race link points to /en/results/2026/races/<meetingId>/<slug>/race-result

const startIdx = content.indexOf('Race Results');
const bigChunk = content.substring(startIdx, startIdx + 100000);

// Extract all rows from the results table
// Each row starts with a link to the race result page
const racePattern = /\/en\/results\/2026\/races\/(\d+)\/([a-z-]+)\/race-result/g;
let match;
const races = [];

while ((match = racePattern.exec(bigChunk)) !== null) {
  const meetingId = match[1];
  const slug = match[2];
  
  // After each race link, we need to find the driver who won (position 1)
  // The race name appears nearby, then the winner info
  // Let's get a chunk after this match
  const afterMatch = bigChunk.substring(match.index, match.index + 3000);
  
  // The driver 3-letter code is embedded in the data
  // Pattern: "children":"XXX" where XXX is the 3-letter code
  const driverCodeMatch = afterMatch.match(/"children":"([A-Z]{3})"/);
  
  // Also find the full name - pattern: first name then last name
  // "children":"Kimi" ... "children":"Antonelli"
  const firstNameMatch = afterMatch.match(/body-m-compact-regular[^"]*","children":"([A-Za-z]+)"/);
  const lastNameMatch = afterMatch.match(/body-m-compact-bold[^"]*\s*uppercase[^"]*","children":"([A-Za-z]+)"/);
  
  if (driverCodeMatch && !races.find(r => r.slug === slug)) {
    races.push({
      meetingId,
      slug,
      driverCode: driverCodeMatch[1],
      firstName: firstNameMatch ? firstNameMatch[1] : '?',
      lastName: lastNameMatch ? lastNameMatch[1] : '?'
    });
  }
}

console.log('=== Extracted Race Winners ===');
races.forEach(r => {
  console.log(`${r.slug}: ${r.firstName} ${r.lastName} (${r.driverCode})`);
});

// Also, let's look at the "season schedule" overview table that lists all races and their winners
// This is typically in a different section - let's look for the season races listing
// Pattern: Grand Prix name followed by Winner in an overview table

// Search for content that has multiple race links in sequence (the overview/season table)
const overviewStart = bigChunk.indexOf('race-result');
const overviewChunk = bigChunk.substring(overviewStart - 500, overviewStart + 50000);

// Count race-result occurrences to see how many races are in this section
const raceResultCount = (overviewChunk.match(/race-result/g) || []).length;
console.log(`\nTotal race-result links found: ${raceResultCount}`);

// Now let's write the extracted data as JSON
fs.writeFileSync('extracted_results.json', JSON.stringify(races, null, 2));
console.log('\nSaved to extracted_results.json');
