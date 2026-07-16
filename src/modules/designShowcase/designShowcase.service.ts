import { normalize } from "../../utils";
import AppError from "../../utils/AppError";
import { getTotalNumberOfUsers } from "../user";
import { getTotalDesignLikes } from "./designLike";
import DesignLikeModel from "./designLike/designLike.model";
import DesignShowcaseModel from "./designShowcase.model";
import { IDesignShowcase } from "./designShowcase.types";

export const createDesignShowcase = async (
  data: Omit<IDesignShowcase, "createdAt" | "updatedAt">,
) => {
  try {
    const designShowcase = await DesignShowcaseModel.create(data);
    return designShowcase;
  } catch (error) {
    console.error("Error creating design showcase:", error);
    throw new Error("Failed to create design showcase");
  }
};

export const getDesignShowcases = async ({
  page,
  limit,
  userId,
  category,
}: {
  page: number;
  limit: number;
  userId?: string;
  category?: string;
}) => {
  try {
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;

    const designShowcases = await DesignShowcaseModel.find(filter)
      .populate("user", "firstName lastName profilePicture")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    let likedDesignIds = new Set<string>();

    if (userId && designShowcases.length) {
      const likes = await DesignLikeModel.find({
        user: userId,
        design: { $in: designShowcases.map((design) => design._id) },
      })
        .select("design")
        .lean();

      likedDesignIds = new Set(likes.map((like) => like.design.toString()));
    }

    return designShowcases.map(({ user, ...design }) => ({
      ...design,
      author: user,
      isLiked: likedDesignIds.has(design._id.toString()),
    }));
  } catch (error) {
    console.error("Error fetching design showcases:", error);
    throw new Error("Failed to fetch design showcases");
  }
};

export const getDesignById = async (id: string) => {
  if (!id) {
    throw new AppError("No design Id found", 404);
  }

  const design = await DesignShowcaseModel.findById(id)
    .populate({
      path: "user",
      select: "firstName lastName profilePicture",
    })
    .lean();

  if (!design) {
    throw new AppError("Design not found", 404);
  }

  const { user, ...rest } = design;

  return {
    ...rest,
    author: user,
  };
};

const getTotalDesigns = async () => {
  return await DesignShowcaseModel.countDocuments();
};

export const getDesignCategoriesCount = () => {
  return (DesignShowcaseModel.schema.path("category") as any).enumValues.length;
};

export const getDesignShowcaseStats = async () => {
  const [totalUsers, totalProjects, totalLikes, totalCategories] =
    await Promise.all([
      getTotalNumberOfUsers(),
      getTotalDesigns(),
      getTotalDesignLikes(),
      getDesignCategoriesCount(),
    ]);

  return { totalUsers, totalProjects, totalLikes, totalCategories };
};

export const findUserDesignsPaginated = async ({
  userId,
  page,
  limit,
}: {
  userId: string;
  page: number;
  limit: number;
}) => {
  if (!userId) throw new AppError("No user found", 409);

  const skip = (page - 1) * limit;

  const [designs, total] = await Promise.all([
    DesignShowcaseModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    DesignShowcaseModel.countDocuments({ user: userId }),
  ]);

  return {
    designs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getUserShowcaseProfile = async (userId: string) => {
  const showcases = await DesignShowcaseModel.find({ user: userId })
    .select("tools category")
    .lean();

  const tools = new Set<string>();
  const categories = new Set<string>();

  for (const showcase of showcases) {
    showcase.tools?.forEach((t: string) => tools.add(normalize(t)));
    if (showcase.category) categories.add(showcase.category);
  }

  return { tools, categories };
};
