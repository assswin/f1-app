const fs = require('fs');
const https = require('https'); // Jolpi API uses https! Wait, the URL I used was http://api.jolpi.ca! That might have caused a redirect to https which returns HTML!
// Let's use https://api.jolpi.ca

async function fetchYear(year) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.jolpi.ca/ergast/f1/${year}/driverStandings.json?limit=2`, {
      headers: {
        'User-Agent': 'F1AppSimulator/1.0 (Contact: local@localhost)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const standings = parsed.MRData.StandingsTable.StandingsLists[0].DriverStandings;
          resolve({
            year,
            champion: standings[0].Driver.givenName + ' ' + standings[0].Driver.familyName,
            championTeam: standings[0].Constructors[0].name,
            championPoints: standings[0].points,
            rival: standings[1].Driver.givenName + ' ' + standings[1].Driver.familyName,
            rivalTeam: standings[1].Constructors[0].name,
            rivalPoints: standings[1].points
          });
        } catch (e) {
          console.error(`Error parsing ${year}`, e.message);
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const history = [];
  console.log("Fetching F1 History (1950-2024)...");
  
  for (let year = 1950; year <= 2024; year += 3) {
    const promises = [];
    for(let i = 0; i < 3 && (year + i) <= 2024; i++) {
       promises.push(fetchYear(year + i));
    }
    const results = await Promise.all(promises);
    results.forEach(r => { if(r) history.push(r); });
    console.log(`Fetched up to ${Math.min(year+2, 2024)}`);
    // sleep for 500ms to be extremely polite to the API
    await new Promise(r => setTimeout(r, 500));
  }
  
  history.sort((a, b) => b.year - a.year); // descending
  fs.writeFileSync('src/data/historicalStandings.json', JSON.stringify(history, null, 2));
  console.log("Saved to src/data/historicalStandings.json");
}

run();
