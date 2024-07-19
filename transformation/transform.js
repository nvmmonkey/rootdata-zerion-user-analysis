const fs = require('fs');
const filename = "extractedData.json"

// Read the original data file
const data = JSON.parse(fs.readFileSync(filename));

// Transform the data
const transformedData = data.map(walletData => {
  const wallet = walletData.wallet;
  const portfolio = walletData.portfolio.data.attributes;

  return walletData.positions.data.map(position => {
    const attributes = position.attributes;
    const relationships = position.relationships;

    return {
        updated_at: new Date(attributes.updated_at).toISOString(),
      wallet: wallet,
      tokenName: attributes.fungible_info.name,
      symbol: attributes.fungible_info.symbol,
      chain: relationships.chain.data.id,
      fungibleID: relationships.fungible.data.id,
      verified: attributes.fungible_info.flags.verified,
      decimals: attributes.quantity.decimals,
      float: attributes.quantity.float,
      value: attributes.value,
      price: attributes.price,
      // porfolioTotal: {
      //   walletTotal: portfolio.positions,
      //   ...portfolio.positions_distribution_by_chain
      // }
    };
  });
}).flat();

// Write the transformed data to a new file
fs.writeFileSync('transformedData.json', JSON.stringify(transformedData, null, 2), 'utf-8');

console.log('Data transformation complete.');
