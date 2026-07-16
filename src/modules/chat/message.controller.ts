// modules/chat/message.controller.ts
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import {
  getConversationMessages,
  getOrCreateConversationSummary,
  getUserConversations,
  resolveSenderContext,
} from "./message.service";
import { successResponse } from "../../utils";

export const getConversations = asyncHandler(
  async (req: Request, res: Response) => {
    const context = await resolveSenderContext({
      id: req.user!.id,
      role: req.user!.role,
      name: (req.user as any).name,
      companyId: (req.user as any).companyId,
    });

    const conversations = await getUserConversations(
      context.conversationParticipantId,
      context.conversationParticipantType,
    );

    return successResponse(
      res,
      200,
      "Conversations fetched successfully",
      conversations,
    );
  },
);

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId as string;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const messages = await getConversationMessages(conversationId, page, limit);

  return successResponse(res, 200, "Messages fetched successfully", messages);
});

export const findOrCreateConversation = asyncHandler(
  async (req: Request, res: Response) => {
    const { receiverId, receiverType } = req.body;

    const context = await resolveSenderContext({
      id: req.user!.id,
      role: req.user!.role,
      name: (req.user as any).name,
      companyId: (req.user as any).companyId,
    });

    const conversation = await getOrCreateConversationSummary(
      context.conversationParticipantId,
      context.conversationParticipantType,
      receiverId,
      receiverType,
    );

    return successResponse(
      res,
      200,
      "Conversation fetched successfully",
      conversation,
    );
  },
);
