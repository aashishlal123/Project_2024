const { getRoom } = require('../helpers');

module.exports = async (id) => {
  if (id) {
    let room = await getRoom(id);
    return room;
  } else {
    return { status: 400, messages: 'Id must be specified' };
  }
};
