const HARVEST_API_TOKEN = process.env.HARVEST_API_TOKEN;
const HARVEST_ACCOUNT_ID = Number(process.env.HARVEST_ACCOUNT_ID);
const HARVEST_USER_ID = Number(process.env.HARVEST_USER_ID);
const HARVEST_API_BASE_URL = "https://api.harvestapp.com/v2";

const startDate = new Date(process.argv[2]);
const endDate = new Date(process.argv[3]);

exports.getUserTimeEntries = async function () {
  const harvestTimeEntriesUrl = `${HARVEST_API_BASE_URL}/time_entries?from=${startDate.toISOString()}&to=${endDate.toISOString()}`;
  const headers = {
    Authorization: `Bearer ${HARVEST_API_TOKEN}`,
    "Harvest-Account-ID": HARVEST_ACCOUNT_ID,
    "User-Agent": "Harvest Automation",
  };

  const response = await fetch(harvestTimeEntriesUrl, { headers });
  const responseJson = await response.json();
  const userEntries = responseJson.time_entries.filter(
    (t) => t.user.id === HARVEST_USER_ID
  );

  return userEntries;
};
