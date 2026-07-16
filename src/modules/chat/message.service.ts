import mongoose from "mongoose";
import { ConversationModel } from "./conversation.model";
import { MessageModel } from "./message.model";
import {
  CreateMessageParams,
  ParticipantType,
  SenderContext,
  SocketFilePayload,
} from "./message.types";
import { uploadFile } from "../media";
import { ROLE_TO_SENDER_TYPE } from "./message.contants";
import AppError from "../../utils/AppError";
import {
  getCurrentEmployerBlockedIds,
  getOtherEmployersBlockMap,
} from "../employer";
import { getCurrentUserBlockedIds, getOtherUsersBlockMap } from "../user";
import { getSubEmployerContext } from "../subEmployer";

export const resolveSenderContext = async (user: {
  id: string;
  role: string;
  name?: string;
  companyId?: string;
}): Promise<SenderContext> => {
  const senderType = ROLE_TO_SENDER_TYPE[user.role];

  if (!senderType) {
    throw new AppError("Invalid sender role", 400);
  }

  if (user.role === "sub_employer") {
    if (user.companyId && user.name) {
      return {
        senderId: user.id,
        senderType,
        senderName: user.name,
        conversationParticipantId: user.companyId,
        conversationParticipantType: "Employer",
      };
    }

    const subEmployer = await getSubEmployerContext(user.id);

    return {
      senderId: user.id,
      senderType,
      senderName: subEmployer.name,
      conversationParticipantId: subEmployer.assignedBy.toString(),
      conversationParticipantType: "Employer",
    };
  }

  if (user.role === "employer") {
    return {
      senderId: user.id,
      senderType,
      senderName: user.name || "Employer",
      conversationParticipantId: user.id,
      conversationParticipantType: "Employer",
    };
  }

  return {
    senderId: user.id,
    senderType,
    senderName: user.name || "User",
    conversationParticipantId: user.id,
    conversationParticipantType: "User",
  };
};

export const getOrCreateConversationSummary = async (
  conversationParticipantId: string,
  conversationParticipantType: ParticipantType,
  receiverId: string,
  receiverType: ParticipantType,
) => {
  const conversation = await findOrCreateConversation(
    conversationParticipantId,
    conversationParticipantType,
    receiverId,
    receiverType,
  );

  const populated = await ConversationModel.findById(conversation._id)
    .populate("participants.participantId")
    .populate("lastMessage")
    .lean();

  if (!populated) return null;

  const otherParticipant = populated.participants.find(
    (p: any) => p.participantId?._id?.toString() !== conversationParticipantId,
  );

  return {
    _id: populated._id,
    participant: otherParticipant?.participantId,
    participantType: otherParticipant?.participantType,
    lastMessage: populated.lastMessage,
    unreadCount: 0,
    updatedAt: populated.updatedAt,
    hasSubEmployerActivity: false,
  };
};

export const findOrCreateConversation = async (
  conversationParticipantId: string,
  conversationParticipantType: ParticipantType,
  receiverId: string,
  receiverType: ParticipantType,
) => {
  let conversation = await ConversationModel.findOne({
    $and: [
      { "participants.participantId": conversationParticipantId },
      { "participants.participantId": receiverId },
    ],
  });

  if (!conversation) {
    conversation = await ConversationModel.create({
      participants: [
        {
          participantId: conversationParticipantId,
          participantType: conversationParticipantType,
        },
        { participantId: receiverId, participantType: receiverType },
      ],
    });
  }

  return conversation;
};

const toMulterFile = (file: SocketFilePayload): Express.Multer.File => {
  const buffer = Buffer.isBuffer(file.buffer)
    ? file.buffer
    : Buffer.from(file.buffer);

  return {
    buffer,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    fieldname: "file",
    encoding: "7bit",
  } as Express.Multer.File;
};

export const uploadSocketFile = async (
  file: SocketFilePayload,
  userId: string,
) => {
  const multerFile = toMulterFile(file);
  return uploadFile(multerFile, userId);
};

export const createMessage = async (
  params: CreateMessageParams & { file?: SocketFilePayload },
) => {
  const {
    senderId,
    senderType,
    senderName,
    conversationParticipantId,
    conversationParticipantType,
    receiverId,
    receiverType,
    conversationId,
    type,
    content,
    file,
  } = params;

  let resolvedConversationId = conversationId;

  try {
    if (!resolvedConversationId) {
      const conversation = await findOrCreateConversation(
        conversationParticipantId,
        conversationParticipantType,
        receiverId,
        receiverType,
      );
      resolvedConversationId = conversation._id.toString();
    }

    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let fileSize: number | null = null;
    let mimeType: string | null = null;

    if (file) {
      const uploaded = await uploadSocketFile(file, senderId);
      fileUrl = uploaded.url;
      fileName = file.originalname;
      fileSize = file.size;
      mimeType = file.mimetype;
    }

    const message = await MessageModel.create({
      conversationId: resolvedConversationId,
      senderId,
      senderType,
      senderName,
      receiverId,
      receiverType,
      type: type || "text",
      content: content || "",
      fileUrl,
      fileName,
      fileSize,
      mimeType,
    });

    await ConversationModel.findByIdAndUpdate(resolvedConversationId, {
      lastMessage: message._id,
    });

    return JSON.parse(JSON.stringify(message));
  } catch (err) {
    console.log(err);
  }
};

export const getConversationMessages = async (
  conversationId: string,
  page = 1,
  limit = 20,
) => {
  const skip = (page - 1) * limit;

  return MessageModel.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const markMessagesAsSeen = async (
  conversationId: string,
  userId: string,
) => {
  const unseenMessages = await MessageModel.find({
    conversationId,
    receiverId: userId,
    seenAt: null,
  }).select("_id");

  if (unseenMessages.length === 0) {
    return { seenAt: null, messageIds: [] };
  }

  const seenAt = new Date();
  const messageIds = unseenMessages.map((m) => m._id.toString());

  await MessageModel.updateMany({ _id: { $in: messageIds } }, { seenAt });

  return { seenAt, messageIds };
};

export const getUserConversations = async (
  conversationParticipantId: string,
  conversationParticipantType: ParticipantType,
) => {
  const conversations = await ConversationModel.find({
    "participants.participantId": conversationParticipantId,
  })
    .populate("participants.participantId")
    .populate("lastMessage")
    .sort({ updatedAt: -1 })
    .lean();

  const conversationIds = conversations.map((c) => c._id);

  const unreadCounts = await MessageModel.aggregate([
    {
      $match: {
        conversationId: { $in: conversationIds },
        receiverId: new mongoose.Types.ObjectId(conversationParticipantId),
        seenAt: null,
      },
    },
    { $group: { _id: "$conversationId", count: { $sum: 1 } } },
  ]);

  const unreadMap = new Map(
    unreadCounts.map((u) => [u._id.toString(), u.count]),
  );

  const subEmployerConvIds = await MessageModel.distinct("conversationId", {
    conversationId: { $in: conversationIds },
    senderType: "SubEmployer",
  });

  const subEmployerConvSet = new Set(
    subEmployerConvIds.map((id) => id.toString()),
  );

  const myBlockedIds =
    conversationParticipantType === "Employer"
      ? await getCurrentEmployerBlockedIds(conversationParticipantId)
      : await getCurrentUserBlockedIds(conversationParticipantId);

  const otherUserIds: string[] = [];
  const otherEmployerIds: string[] = [];

  conversations.forEach((conversation) => {
    const other = conversation.participants.find(
      (p: any) =>
        p.participantId?._id?.toString() !== conversationParticipantId,
    );
    if (!other) return;
    if (other.participantType === "Employer") {
      otherEmployerIds.push(other.participantId._id.toString());
    } else {
      otherUserIds.push(other.participantId._id.toString());
    }
  });

  const [otherUsersBlockMap, otherEmployersBlockMap] = await Promise.all([
    getOtherUsersBlockMap(otherUserIds),
    getOtherEmployersBlockMap(otherEmployerIds),
  ]);

  return conversations.map((conversation) => {
    const otherParticipant = conversation.participants.find(
      (p: any) =>
        p.participantId?._id?.toString() !== conversationParticipantId,
    );
    const otherId = otherParticipant?.participantId?._id?.toString();
    const otherType = otherParticipant?.participantType;

    const isBlockedByMe = otherId ? myBlockedIds.has(otherId) : false;

    const otherBlockedSet =
      otherType === "Employer"
        ? otherEmployersBlockMap.get(otherId || "")
        : otherUsersBlockMap.get(otherId || "");

    const isBlockedByOther =
      otherBlockedSet?.has(conversationParticipantId) || false;

    return {
      _id: conversation._id,
      participant: otherParticipant?.participantId,
      participantType: otherParticipant?.participantType,
      lastMessage: conversation.lastMessage,
      unreadCount: unreadMap.get(conversation._id.toString()) || 0,
      updatedAt: conversation.updatedAt,
      isBlockedByMe,
      isBlockedByOther,
      hasSubEmployerActivity: subEmployerConvSet.has(
        conversation._id.toString(),
      ),
    };
  });
};
