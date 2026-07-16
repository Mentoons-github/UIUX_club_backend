import ContestModel from "./contests.model";

export const getContests = async (limit: number, page: number) => {
  const skip = (page - 1) * limit;

  const [featured, regular, regularTotal, closed, closedTotal] =
    await Promise.all([
      ContestModel.find({
        featured: true,
        status: { $nin: ["draft", "closed"] },
      }).sort({ deadline: 1 }),

      ContestModel.find({
        featured: false,
        status: { $nin: ["draft", "closed"] },
      })
        .sort({ deadline: 1 })
        .skip(skip)
        .limit(limit),

      ContestModel.countDocuments({
        featured: false,
        status: { $nin: ["draft", "closed"] },
      }),

      ContestModel.find({ status: "closed" })
        .sort({ resultsDate: -1 })
        .skip(skip)
        .limit(limit),

      ContestModel.countDocuments({ status: "closed" }),
    ]);

  return {
    featured,
    regular: {
      data: regular,
      pagination: {
        page,
        limit,
        total: regularTotal,
        totalPages: Math.ceil(regularTotal / limit),
      },
    },
    closed: {
      data: closed,
      pagination: {
        page,
        limit,
        total: closedTotal,
        totalPages: Math.ceil(closedTotal / limit),
      },
    },
  };
};

export const getContestBySlug = async (slug: string) => {
  const contest = await ContestModel.findOne({
    slug,
    status: { $ne: "draft" },
  });
  if (!contest) throw new Error("Contest not found");
  return contest;
};

