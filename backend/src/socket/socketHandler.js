function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('join_expert_room', (expertId) => {
      if (!expertId) return;
      const room = `expert_${expertId}`;
      socket.join(room);
    });

    socket.on('leave_expert_room', (expertId) => {
      if (!expertId) return;
      socket.leave(`expert_${expertId}`);
    });
  });
}

module.exports = { registerSocketHandlers };
