import { StatusCodes } from 'http-status-codes';
import { EAgentOfferStatus, prisma } from '../../../utils/db';
import type { TAcceptAgentOfferMetadata } from '../organizer/Organizer.interface';
import ServerError from '../../../errors/ServerError';

/**
 * Payment Services
 */
export const PaymentServices = {
  /**
   * Accept agent offer
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
};
