const { APIError } = require('../utils').errorHandler;
const { room, message } = require('../services/messages');
const { roomSerializer } = require('../serializers');

// Room

exports.getRoom = async (req, res, next) => {
  try {
    let message = await room.getRoom(req.params.roomId);
    return message?.status === 404
      ? res.status(200).json(message)
      : res.status(200).json(await roomSerializer(message));
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.getRooms = async (req, res, next) => {
  try {
    let serializedMessage = await room.getRooms(req.user, req.query.page);
    return res.status(200).json(serializedMessage);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.addRoom = async (req, res, next) => {
  try {
    if (req.body.users?.length > 0) {
      let message = await room.addRoom(req.body, req.user);
      const serializedMessage = await roomSerializer(message);
      res.status(200).json(serializedMessage);
    } else {
      next(
        APIError.badRequest({
          type: 'Null Error',
          message: 'No Users Specified',
        })
      );
    }
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const serializedMessage = await room.deleteRoom(req.params.roomId);
    res
      .status(200)
      .json(
        serializedMessage === 1
          ? { status: 200, message: 'Successfully deleted room' }
          : serializedMessage
      );
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

// Message

exports.getMessages = async (req, res, next) => {
  try {
    let serializedMessage = await message.getMessages(
      req.params.roomId,
      req.query.page,
      await req.user.getProfile()
    );
    return res.status(200).json(serializedMessage);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const serializedMessage = await message.sendMessage(
      req.body,
      req.params.roomId,
      req.user.id
    );

    res.status(200).json(serializedMessage);
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const serializedMessage = await message.deleteMessage(
      req.params.roomId,
      req.params.messageId
    );
    res
      .status(200)
      .json(
        serializedMessage === 1
          ? { status: 200, message: 'Successfully deleted message' }
          : serializedMessage
      );
  } catch (error) {
    next(APIError.internalServerError(error));
  }
};
