const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const axios = require('axios');

const url = process.env.KALEIDO_API_URL?.replace(/\/$/, '');
const user = process.env.KALEIDO_SIGNER;
const secret = process.env.KALEIDO_SIGNER_SECRET;
const auth = process.env.KALEIDO_AUTH_HEADER;

const headers = {
  'Authorization': auth.startsWith('Basic') ? auth : `Basic ${auth}`,
  'Content-Type': 'application/json'
};

async function enroll() {
  console.log(`Checking identity "${user}"...`);
  try {
    //Check if the identity even exists in the network (Optional check)
    try {
      await axios.get(`${url}/identities/${user}`, { headers });
      console.log(`Identity found on network. Creating membership....`);
    } catch (checkErr) {
      console.log(`Warning: Could not verify identity existence (Permission issue or not found), proceeding to enroll...`);
    }

    // Attempt to enroll
    console.log(`Attempting enrollment for "${user}"...`);
    await axios.post(`${url}/identities/${user}/enroll`, { secret }, { headers });
    console.log('Success! Enrollment complete.');

  } catch (err) {
    const data = err.response?.data;
    const msg = typeof data === 'object' ? JSON.stringify(data) : (data || err.message);

    if (msg.includes('no rows in result set')) {
      console.log(`Error: User "${user}" does not exist in the Kaleido network.`);
    } else if (msg.includes('Authentication failure') || msg.includes('already enrolled')) {
      console.log(`User "${user}" is already enrolled.`);
    } else {
      console.log(`Enrollment Failed: ${msg}`);
    }
  }
}

enroll();
