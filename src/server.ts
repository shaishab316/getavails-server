process.stdout.write('\x1Bc'); //? clear console
import startServer from './utils/server/startServer';
import { SocketServices } from './app/modules/socket/Socket.service';
import { eventPublishingJob } from './app/modules/event/Event.job';
import { ticketExpirationJob } from './app/modules/ticket/Ticket.job';

/**
 * Start server with plugins
 */
startServer().then(server => {
  server.addPlugins(
    SocketServices.init(server),
    eventPublishingJob(),
    ticketExpirationJob(),
  );
});
