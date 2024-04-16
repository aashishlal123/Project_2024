const { generateConformationCode } = require('./helpers');
const { getClients } = require('../../config/cacheStore');
const { sendMail } = require('../../utils');

module.exports = async (email) => {
  try {
    let client = await getClients().cacheInstance;
    let conformationCode = await generateConformationCode();
    await sendMail(
      `conformationCode:${email}`,
      'Email Conformation',
      `Conformation Code: ${conformationCode}`,
      `Conformation Code: ${conformationCode}`
    );
    let setConformationCode = await client.setEx(
      `conformationCode:${email}`,
      3600,
      JSON.stringify(conformationCode)
    );
    return Promise.all(setConformationCode).then(() => {
      return {
        status: 200,
        message: `Email Conformation Code Sent to ${email}`,
      };
    });
  } catch (error) {
    throw new Error(error);
  }
};
