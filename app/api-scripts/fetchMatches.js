const puppeteer = require('puppeteer');

(async (name) => {
  //fetching league info from backend
  const leagueIdReq = await fetch(`http://localhost:8080/api/leagues?name=${name}`);



  //if no result then there was a fetch error
  if(!leagueIdReq.ok){
    console.error(`Error Fetching matches`);
    return;
  }
  const leagues = await leagueIdReq.json();

  //if no league found end function too
  if(leagues.length <0){
    console.error(`No league with name: ${name} found`);
    return;
  }

  //the most current version of the league is the league e.g same name can have different seasons
  const league = leagues[leagues.length-1];

  //setting the id and api_id to the returned json values
  let leagueId = league.league_id;
  let leagueApiId = league.api_id;

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto(`https://www.fotmob.com/en-GB/leagues/${leagueApiId}/`, {
    waitUntil: 'networkidle2'
  });

  // Simulate 3 Tabs + Enter to accept cookie consent
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  // Wait for consent acceptance and API to be accessible
  await new Promise(resolve => setTimeout(resolve,5000))

  // Evaluate fetch in page context to get first 4 matches
  const result = await page.evaluate(async (leagueId, leagueApiId) => {
    try {
      const res = await fetch(`https://www.fotmob.com/api/fixtures?id=${leagueApiId}&season=2025`);
      const data = await res.json();
      const formatted = [];


      for (let i = 0; i < Math.min(7, data.length); i++) {
        const match = data[i];
        const isFinished = match.status.finished;
        const isCancelled = match.status.cancelled;
        if(isCancelled){

          continue;
        }
        formatted.push({
          league_id:leagueId,
          home_team: match.home.name,
          away_team: match.away.name,
          match_status: isFinished ? "finished" : "upcoming",
          home_score: isFinished ? match.home.score : null,
          away_score: isFinished ? match.away.score : null,
          date_played: match.status.utcTime.slice(0, 10), // Extract YYYY-MM-DD
          api_id: match.id,
          home_id: match.home.id,
          away_id: match.away.id,


        });
      }

      return JSON.stringify(formatted);
    } catch (err) {
      return { error: err.message };
    }
  },
leagueId, leagueApiId
);

  console.log(result);
  await browser.close();
})("FIFA Club World Cup");
