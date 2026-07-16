export const getPagination = (page?: string, limit?: string) => {
  const pageNumber = typeof page === "string" ? parseInt(page, 10) : 1;

  const limitNumber = typeof limit === "string" ? parseInt(limit, 10) : 10;

  return {
    page: isNaN(pageNumber) ? 1 : pageNumber,
    limit: isNaN(limitNumber) ? 10 : limitNumber,
  };
};
