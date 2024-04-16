const { Serializer } = require('jsonapi-serializer');
let dataToSerialize;

const serializer = async (type, data, dataToExclude = []) => {
  try {
    let attributes = Object.keys(data.dataValues ? data.dataValues : data);
    dataToExclude = [...dataToExclude, 'id'];
    attributes = attributes.filter(
      (attribute) => !dataToExclude.includes(attribute)
    );

    dataToSerialize = new Serializer(type, { attributes });
    let serializedData = await dataToSerialize.serialize(data);
    return serializedData;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = serializer;
