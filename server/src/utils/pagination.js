/**
 * Pagination utility for MongoDB queries
 */

/**
 * Parse pagination parameters from request query
 * @param {Object} req - Express request object
 * @returns {Object} - { page, limit, skip }
 */
exports.parsePagination = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Create paginated response
 * @param {Array} data - Array of documents
 * @param {Number} total - Total count of documents
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} - Paginated response
 */
exports.createPaginatedResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

/**
 * Apply pagination to a Mongoose query
 * @param {Object} query - Mongoose query object
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Object} - Modified query
 */
exports.applyPagination = (query, page, limit) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

