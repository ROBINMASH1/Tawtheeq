const axios = require('axios');
const FormData = require('form-data');

/**
 * Handles Kaleido IPFS operations.
 */
exports.uploadToIPFS = async (fileBuffer, fileName) => {
  try {
    let ipfsApiUrl = process.env.IPFS_API_URL;
    if (ipfsApiUrl) ipfsApiUrl = ipfsApiUrl.replace(/\/+$/, '');
    const ipfsApiUser = process.env.IPFS_API_USER;
    const ipfsApiPass = process.env.IPFS_API_PASS;

    if (!ipfsApiUrl) {
      console.warn("IPFS_API_URL not configured, using mock IPFS upload");
      return `mock_ipfs_hash_${Date.now()}`;
    }

    const formData = new FormData();
    formData.append('file', fileBuffer, { filename: fileName });

    const auth = Buffer.from(`${ipfsApiUser}:${ipfsApiPass}`).toString('base64');
  
    const response = await axios.post(`${ipfsApiUrl}/api/v0/add`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Basic ${auth}`
      }
    });

    return response.data.Hash;
  } catch (error) {
    console.error("IPFS Upload Error:", error.message);
    throw new Error("Failed to upload to IPFS");
  }
};

exports.retrieveFromIPFS = async (ipfsHash) => {
  let gatewayUrl = process.env.IPFS_GATEWAY_URL;
  if (gatewayUrl) gatewayUrl = gatewayUrl.replace(/\/+$/, '');
  const user = process.env.IPFS_API_USER;
  const pass = process.env.IPFS_API_PASS;

  try {
    let url = gatewayUrl ? `${gatewayUrl}/ipfs/${ipfsHash}` : `https://ipfs.io/ipfs/${ipfsHash}`;
    let config = {};

    if (gatewayUrl && user && pass) {
      const auth = Buffer.from(`${user}:${pass}`).toString('base64');
      config.headers = { 'Authorization': `Basic ${auth}` };
    }

    const response = await axios.get(url, config);
    console.log("IPFS Retrieve Response:", response.data);
    return response.data;
  }
  catch (error) {
    console.error("IPFS Retrieve Error:", error.message);
    throw new Error("Failed to retrieve from IPFS");
  }
};

exports.downloadFromIPFS = async (ipfsHash) => {
  let gatewayUrl = process.env.IPFS_GATEWAY_URL;
  if (gatewayUrl) gatewayUrl = gatewayUrl.replace(/\/+$/, '');
  const user = process.env.IPFS_API_USER;
  const pass = process.env.IPFS_API_PASS;

  try {
    if (!gatewayUrl) {
      const response = await axios.get(`https://ipfs.io/ipfs/${ipfsHash}`, { responseType: 'stream' });
      return response.data;
    }

    // This only for demo , not in production
    const auth = Buffer.from(`${user}:${pass}`).toString('base64');
    const response = await axios.get(`${gatewayUrl}/ipfs/${ipfsHash}`, {
      headers: {
        'Authorization': `Basic ${auth}`
      },
      responseType: 'stream'
    });

    return response.data;
  } catch (error) {
    console.error("IPFS Download Error:", error.message);
    throw new Error("Failed to download from IPFS");
  }
};
