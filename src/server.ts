import startServer from './utils/server/startServer';
import { SocketServices } from './app/modules/socket/Socket.service';

startServer().then(server => {
  //? add server plugins

  //? socket plugins
  SocketServices.init(server);
});
