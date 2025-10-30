import { TSocketHandler } from '../socket/Socket.interface';
import { catchAsyncSocket, socketResponse } from '../socket/Socket.utils';
import { MessageServices } from './Message.service';
import { MessageValidations } from './Message.validation';

export const MessageSocket: TSocketHandler = ({ socket, io }) => {
  const { user } = socket.data;

  socket.on(
    'send_message',
    catchAsyncSocket(async payload => {
      const { chat, ...message } = await MessageServices.createMessage({
        ...payload,
        user_id: user.id,
      });

      const opponent_id = chat.user_ids.find(id => id !== user.id)!;

      //? notify opponent
      io.to(opponent_id).emit(
        'new_message',
        socketResponse({
          message: "You've received a new message!",
          data: {
            ...message,
            name: user.name,
            avatar: user.avatar,
          },
        }),
      );

      return {
        message: 'Message sent successfully!',
        data: message,
      };
    }, MessageValidations.createMessage),
  );

  socket.on(
    'delete_message',
    catchAsyncSocket(async payload => {
      const { chat } = await MessageServices.deleteMessage({
        ...payload,
        user_id: user.id,
      });

      const opponent_id = chat.user_ids.find(id => id !== user.id)!;

      //? notify opponent
      io.to(opponent_id).emit(
        'delete_message',
        socketResponse({
          message: 'A message has been deleted!',
          data: payload,
        }),
      );

      return {
        message: 'Message deleted successfully!',
      };
    }, MessageValidations.deleteMessage),
  );
};
