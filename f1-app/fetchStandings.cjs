const fs = require('fs');
const https = require('https');
const history = require('./src/data/historicalStandings.json');

const fetchYear = (year) => {
  return new Promise((resolve, reject) => {
    https.get(`https://api.jolpi.ca/ergast/f1/${year}/driverStandings.json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const list = parsed.MRData.StandingsTable.StandingsLists[0];
          resolve({ year, standings: list ? list.DriverStandings : [] });
        } catch (e) {
          resolve({ year, standings: [] });
        }
      });
    }).on('error', reject);
  });
};

async function run() {
  console.log('Fetching all historical driver standings (this will take 10 seconds)...');
  const allData = {};
  
  // Fetch in batches of 5 to avoid overloading the API
  for (let i = 0; i < history.length; i += 5) {
    const batch = history.slice(i, i + 5);
    const promises = batch.map(season => fetchYear(season.year));
    const results = await Promise.all(promises);
    
    for (const res of results) {
      allData[res.year] = res.standings;
      console.log(`Fetched ${res.year}`);
    }
  }
  
  fs.writeFileSync('./src/data/allDriverStandings.json', JSON.stringify(allData));
  console.log('Successfully bundled all historical driver standings into a local file!');
}

run();
