import { StatusCodes } from 'http-status-codes';
import { EAgentOfferStatus, prisma } from '../../../utils/db';
import type { TAcceptAgentOfferMetadata } from '../organizer/Organizer.interface';
import ServerError from '../../../errors/ServerError';
import { TWithdrawArgs } from './Payment.interface';
import stripeAccountConnectQueue from '../../../utils/mq/stripeAccountConnectQueue';
import withdrawQueue from '../../../utils/mq/withdrawQueue';

/**
 * Payment Services
 */
export const PaymentServices = {
  /**
   * Accept agent offer
   *
   * @event agent_offer
   */
  async agent_offer(metadata: TAcceptAgentOfferMetadata) {
    const offer = await prisma.agentOffer.findFirst({
      where: { id: metadata.offer_id },
      select: { agent_id: true, artist: true, status: true },
    });

    if (!offer) {
      throw new ServerError(StatusCodes.NOT_FOUND, 'Agent Offer not found');
    }

    //? if offer is already approved
    if (offer.status === EAgentOfferStatus.APPROVED) return;

    const amount = Number(metadata.amount);

    const artistAmount = amount * 0.8; //? 80% to artist
    const agentAmount = amount - artistAmount; //? 20% to agent

    await prisma.$transaction(async tx => {
      //? add money in artist wallet
      await tx.user.update({
        where: { id: offer.artist.id },
        data: { balance: { increment: artistAmount } },
        select: { balance: true }, //? skip body
      });

      //? add money in agent wallet
      await tx.user.update({
        where: { id: offer.agent_id },
        data: { balance: { increment: agentAmount } },
        select: { balance: true }, //? skip body
      });

      //? update agent offer
      await tx.agentOffer.update({
        where: { id: metadata.offer_id },
        data: { status: EAgentOfferStatus.APPROVED, approved_at: new Date() },
      });
    });
  },

  /**
   * Withdraw money
   *
   * @event withdraw
   */
  async withdraw({ amount, user }: TWithdrawArgs) {
    if (user.balance < amount) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        "You don't have enough balance",
      );
    }

    if (!user.is_stripe_connected) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        "You haven't connected your Stripe account",
      );
    }

    if (!user.stripe_account_id) {
      await stripeAccountConnectQueue.add({ user_id: user.id });

      throw new ServerError(
        StatusCodes.ACCEPTED,
        'Stripe account connecting. Try again later!',
      );
    }

    await withdrawQueue.add({ amount, user });
  },
};
