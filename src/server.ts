import startServer from './utils/server/startServer';
import { SocketServices } from './app/modules/socket/Socket.service';

startServer().then(server => {
  //? add server plugins

  //? socket plugins
  const socketCleanup = SocketServices.init(server);

  //? cleanup on process close
  ['SIGINT', 'SIGTERM'].forEach(signal =>
    process.once(signal, async () => {
      socketCleanup();

      server.close(() => process.exit(0));
    }),
  );
});
