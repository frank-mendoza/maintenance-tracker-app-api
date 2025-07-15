export interface PaginationAndSortParams {
  sort?: string;
  page?: number;
  limit?: number;
  sortOptions?: Record<string, string>; // custom sort map per model
}

export const getPaginationAndSort = ({
  sort,
  page = 1,
  limit = 10,
  sortOptions = {},
}: PaginationAndSortParams) => {
  const sortKey =
    sortOptions[sort || ""] || sortOptions["newest"] || "-createdAt";
  const skip = (page - 1) * limit;

  return { sortKey, skip, limit };
};
