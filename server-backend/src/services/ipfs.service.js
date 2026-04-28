const axios = require('axios');
const FormData = require('form-data');

/**
 * Handles Kaleido IPFS operations.
 */
exports.uploadToIPFS = async (fileBuffer, fileName) => {
  try {
    const ipfsApiUrl = process.env.IPFS_API_URL;
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
  const gatewayUrl = process.env.IPFS_GATEWAY_URL;
  try {
    if (!gatewayUrl) {
      return `https://ipfs.io/ipfs/${ipfsHash}`;
    }
    return `${gatewayUrl}/ipfs/${ipfsHash}`;
  }
  catch (error) {
    console.error("IPFS Retrieve Error:", error.message);
    throw new Error("Failed to retrieve from IPFS");
  }
};
