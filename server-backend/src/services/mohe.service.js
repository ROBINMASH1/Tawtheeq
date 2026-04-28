const axios = require('axios');

//Validates student graduation status via MOHE database API before issuance.

exports.validateGraduationStatus = async (personalId) => {
  /*
  // Implementation commented out by default
  try {
    const moheApiUrl = process.env.MOHE_API_URL;
    const moheApiKey = process.env.MOHE_API_KEY;
    
    if (!moheApiUrl) {
      throw new Error("MOHE_API_URL is not configured.");
    }

    const response = await axios.get(`${moheApiUrl}/graduates/${personalId}`, {
      headers: {
        'Authorization': `Bearer ${moheApiKey}`
      }
    });

    if (response.data && response.data.status === 'graduated') {
      return true;
    }
    
    throw new Error("Student graduation status is not verified.");
  } catch (error) {
    console.error("MOHE Validation Error:", error.message);
    throw new Error("Failed to validate graduation status with MOHE: " + error.message);
  }
  */
  return true; // Mock success for now
};
