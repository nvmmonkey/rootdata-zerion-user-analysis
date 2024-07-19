const wallets = require("/")
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const wallets=[
  //0x0000,
  //0x0000
]

const options = {
  headers: {
    accept: "application/json",
    authorization: `Basic ${process.env.ZERION_TOKEN}`,
  },
};

const fetchDataForWallet = async (wallet) => {
  const url1 = `https://api.zerion.io/v1/wallets/${wallet}/positions/?filter[positions]=only_simple&currency=usd&filter[trash]=only_non_trash&sort=value`;
  const url2 = `https://api.zerion.io/v1/wallets/${wallet}/portfolio?currency=usd`;

  try {
    const [response1, response2] = await Promise.all([
      axios.get(url1, options),
      axios.get(url2, options),
    ]);

    const data = {
      wallet,
      positions: response1.data,
      portfolio: response2.data,
    };

    const dataFilePath = path.join(__dirname, "data.json");
    fs.appendFileSync(
      dataFilePath,
      JSON.stringify(data, null, 2) + ",\n",
      "utf8"
    );

    console.log(`Data for wallet ${wallet} successfully written to data.json`);

    return true;
  } catch (error) {
    console.error(`Error fetching data for wallet ${wallet}:`, error);

    const logFilePath = path.join(__dirname, "log.txt");
    fs.appendFileSync(
      logFilePath,
      `Error fetching data for wallet ${wallet}: ${error.message}\n`,
      "utf8"
    );

    return false;
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchDataForAllWallets = async () => {
  for (const wallet of wallets) {
    const success = await fetchDataForWallet(wallet);

    if (!success) {
      console.log(`Stopping execution due to error with wallet ${wallet}`);
      break;
    }

    // Add a delay of 1 second between requests
    await sleep(1000);
  }
};

fetchDataForAllWallets();
