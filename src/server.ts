import startServer from './utils/server/startServer';
import { SocketServices } from './app/modules/socket/Socket.service';
import { eventJobs } from './app/modules/event/Event.job';

startServer().then(server => {
  //? add server plugins

  //? socket plugins
  const socketCleanup = SocketServices.init(server);

  //? event jobs
  const eventJobsCleanup = eventJobs();

  //? cleanup on process close
  ['SIGINT', 'SIGTERM'].forEach(signal =>
    process.once(signal, async () => {
      socketCleanup();
      eventJobsCleanup();

      server.close(() => process.exit(0));
    }),
  );
});
