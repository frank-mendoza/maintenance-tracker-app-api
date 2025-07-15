/**
 * Build a generic Mongoose query object for text search and exact field filters.
 *
 * @param search - text search value
 * @param searchFields - array of field names to search in (e.g., ['name', 'location.town'])
 * @param filters - record of exact filters (e.g., { type: 'house', status: 'active' })
 */
export const buildGenericQuery = ({
  search,
  searchFields,
  filters = {},
}: {
  search?: string;
  searchFields?: string[];
  filters?: Record<string, any>;
}) => {
  const query: Record<string, any> = {};

  if (search && searchFields && searchFields.length > 0) {
    query.$or = searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      query[key] = value;
    }
  });

  return query;
};
