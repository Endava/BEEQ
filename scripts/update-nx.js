/**
 * This script will update the nx.json file with read/write Nx cloud access token.
 * ❗️Remove this file once the Nx team automatically read the NX_CLOUD_ACCESS_TOKEN value
 * to create seamless integration with Nx Cloud❗️
 */
const fs = require('fs').promises;

const file = './nx.json';
const nxCloudAccessToken = process.env.NX_CLOUD_ACCESS_TOKEN;

async function updateNxJsonFile() {
  try {
    // Read the file
    const data = await fs.readFile(file, 'utf8');
    // Parse the file
    const json = JSON.parse(data);
    // Add new property
    json['nxCloudAccessToken'] = nxCloudAccessToken;
    // Write the file back to disk
    await fs.writeFile(file, JSON.stringify(json, null, 2));
  } catch (err) {
    console.error(err);
  }
}

if (nxCloudAccessToken) {
  updateNxJsonFile();
} else {
  console.error('✘ NX_CLOUD_ACCESS_TOKEN environment variable not found.');
}
