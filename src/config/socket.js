const { Server } = require('socket.io');
const { Profile, User } = require('../db/models');
const { log, toxy } = require('../utils');
const jwt = require('jsonwebtoken');
const { getClients } = require('../config/cacheStore');
const {
  message: { sendMessage, deleteMessage },
} = require('../services/messages');
const { addComment, deleteComment } = require('../services/comment');

const io = new Server(3000, {
  cors: {
    origin: ['http://localhost:8080', 'https://metagram-dev.netlify.app'],
    methods: ['GET', 'POST'],
  },
});

const isValidJwt = async (token, active) => {
  return jwt.verify(
    token,
    process.env.AUTH_ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return false;
      } else {
        let profile = await Profile.update(
          { isActive: active },
          { where: { userId: decoded.sub }, returning: true }
        );
        return profile[1][0].getUser();
      }
    }
  );
};

io.on('connection', async (socket) => {
  const token = socket.handshake.auth.token;
  let verify = await isValidJwt(token, true);

  verify === false
    ? log.info(`Anonymous User has entered the site`, 'User', 'Entered')
    : log.info(
        `User ${verify.userName} has entered the site`,
        'User',
        'Active'
      );

  socket.on('login', async (token) => {
    verify = await isValidJwt(token, true);
    log.info(`User ${verify.userName} logged in`, 'User', 'logged In');
  });

  socket.on('logout', async (token) => {
    verify = await isValidJwt(token, false);
    log.info(`User ${verify.userName} logged out`, 'User', 'logged Out');
  });

  socket.on('joinConversation', (room) => {
    socket.join(room);
  });

  socket.on('sendMessage', async (data, room) => {
    if (room !== '') {
      let verifiedUser = await verify?.getProfile();

      if (verifiedUser) {
        let isOffensive = data?.filterOffensiveMessage
          ? await toxy(data.message)
          : null;



        if (
          !data?.filterOffensiveMessage ||
          data?.totalMembers > 2 ||
          (isOffensive?.status === 200 && isOffensive?.data.status === false)
        ) {
          const serializedMessage = await sendMessage(
            { ...data, messageType: isOffensive?.data.status },
            room,
            verify.id
          );
          io.to(room).emit('receivedMessage', serializedMessage);
        }

        if (
          isOffensive?.status === 200 &&
          isOffensive?.data.status === true &&
          data.totalMembers <= 2
        ) {
          let client = await getClients().cacheInstance;
          let offenseCaused = await client.hGetAll(`offense:${verify.id}`);
          if (
            (await client.exists(`offense:${verify.id}`)) &&
            offenseCaused.suspended > 3
          ) {
            return io.to(socket.id).emit('receivedMessage', {
              status: 403,
              message: `banned`,
            });
          }

          if (!(await client.exists(`offense:${verify.id}`))) {
            await client.hSet(`offense:${verify.id}`, {
              offenseCommited: 1,
              suspended: 0,
            });
            const serializedMessage = await sendMessage(
              { ...data, messageType: isOffensive?.data.status },
              room,
              verify.id
            );
            io.to(socket.id).emit('receivedMessage', serializedMessage);
          } else if (offenseCaused.offenseCommited <= 2) {
            await client.hIncrBy(`offense:${verify.id}`, 'offenseCommited', 1);
            const serializedMessage = await sendMessage(
              { ...data, messageType: isOffensive?.data.status },
              room,
              verify.id
            );
            io.to(socket.id).emit('receivedMessage', serializedMessage);
          } else if (
            offenseCaused.offenseCommited > 2 &&
            offenseCaused.suspended < 3
          ) {
            await client.hSet(`offense:${verify.id}`, 'offenseCommited', 0);
            await client.hIncrBy(`offense:${verify.id}`, 'suspended', 1);
            await client.setEx(`suspendedTime:${verify.id}`, 86400, verify.id);
            await User.update(
              { status: 'suspended' },
              { where: { id: verify.id } }
            );
            return io.to(socket.id).emit('receivedMessage', {
              status: 403,
              message: `suspended`,
            });
          } else if (
            offenseCaused.offenseCommited > 2 &&
            offenseCaused.suspended >= 3
          ) {
            await client.hSet(`offense:${verify.id}`, 'offenseCommited', 0);
            await client.hIncrBy(`offense:${verify.id}`, 'suspended', 1);
            await client.del(`suspendedTime:${verify.id}`);
            await User.update(
              { status: 'banned' },
              { where: { id: verify.id } }
            );
            return io.to(socket.id).emit('receivedMessage', {
              status: 403,
              message: `banned`,
            });
          }
        }
      }
    }
  });

  socket.on('deleteMessage', async (message, room) => {
    if (room !== '') {
      const serializedMessage = await deleteMessage(room, message);
      if (serializedMessage === 1) {
        io.to(room).emit('deletedMessage', message);
      }
    }
  });

  socket.on('joinCommentSection', (postId) => {
    socket.join(postId);
  });

  socket.on('postComment', async (data, postId) => {
    if (postId !== '') {
      const serializedMessage = await addComment(data, postId, verify.id);
      io.to(postId).emit('receivedComment', serializedMessage);
    }
  });

  socket.on('deleteComment', async (commentId, postId) => {
    if (commentId !== '') {
      const serializedMessage = await deleteComment(commentId);
      if (serializedMessage === 1) {
        io.to(postId).emit('deletedComment', {
          status: 200,
          message: 'Successfully deleted comment',
          commentId,
        });
      } else {
        io.to(postId).emit('deletedComment', serializedMessage);
      }
    }
  });

  socket.on('disconnect', async () => {
    let verify = await isValidJwt(token, false);
    verify === false
      ? log.info(`Anonymous User has left the site`, 'User', 'offline')
      : log.info(`User ${verify.userName} left the site`, 'User', 'offline');
  });
});

module.exports = io;
