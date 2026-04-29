const axios = require('axios');

/**
 * Handles Kaleido REST API gateway calls for Hyperledger Fabric chaincode.
*/

const REQUIRED_ENV_VARS = [
  'KALEIDO_API_URL',
  'KALEIDO_CHANNEL',
  'KALEIDO_CHAINCODE',
  'KALEIDO_SIGNER',
  'KALEIDO_AUTH_HEADER'
];

const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`[BlockchainService] Missing required env variables: ${missing.join(', ')}`);
  }
};

const getKaleidoConfig = () => ({
  apiUrl: process.env.KALEIDO_API_URL.replace(/\/$/, ''),
  channel: process.env.KALEIDO_CHANNEL,
  chaincode: process.env.KALEIDO_CHAINCODE,
  signer: process.env.KALEIDO_SIGNER,
  authHeader: process.env.KALEIDO_AUTH_HEADER
});

const getKaleidoHeaders = (config) => ({
  'Authorization': config.authHeader.startsWith('Basic') ? config.authHeader : `Basic ${config.authHeader}`,
  'Content-Type': 'application/json'
});

const parseKaleidoError = (error) => {
  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data === 'object') return data.error || data.message || JSON.stringify(data);
    if (typeof data === 'string') return data.replace(/<[^>]*>/g, '').trim();
  }
  return error.message || 'Unknown Error';
};

exports.issueCertificate = async (certificateId, studentId, degreeName, major, gpa, university, gradYear, pdfCid) => {
  validateEnv();
  const config = getKaleidoConfig();

  const requestBody = {
    headers: {
      type: 'SendTransaction',
      signer: config.signer,
      channel: config.channel,
      chaincode: config.chaincode
    },
    func: 'issueCertificate',
    args: [certificateId, studentId, degreeName, major, gpa, university, gradYear, pdfCid].map(arg => String(arg).trim()),
    init: false
  };

  try {
    const response = await axios.post(`${config.apiUrl}/transactions?fly-sync=true`, requestBody, {
      headers: getKaleidoHeaders(config),
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to issue certificate to blockchain: ${parseKaleidoError(error)}`);
  }
};

exports.revokeCertificateOnChain = async (certificateId, reason) => {
  validateEnv();
  const config = getKaleidoConfig();

  const requestBody = {
    headers: {
      type: 'SendTransaction',
      signer: config.signer,
      channel: config.channel,
      chaincode: config.chaincode
    },
    func: 'revokeCertificate',
    args: [String(certificateId).trim(), String(reason || '').trim()],
    init: false
  };

  try {
    const response = await axios.post(`${config.apiUrl}/transactions?fly-sync=true`, requestBody, {
      headers: getKaleidoHeaders(config),
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to revoke certificate on blockchain: ${parseKaleidoError(error)}`);
  }
};

exports.verifyCertificateOnChain = async (certificateId) => {
  validateEnv();
  const config = getKaleidoConfig();

  const requestBody = {
    headers: {
      signer: config.signer,
      channel: config.channel,
      chaincode: config.chaincode
    },
    func: 'getCertificate',
    args: [String(certificateId).trim()],
    strongread: true
  };

  try {
    const response = await axios.post(`${config.apiUrl}/query`, requestBody, {
      headers: getKaleidoHeaders(config),
      timeout: 30000
    });
    return response.data.result || response.data;
  } catch (error) {
    throw new Error(`Verification service temporarily unavailable: ${parseKaleidoError(error)}`);
  }
};
