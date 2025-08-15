class APIFeatures {
  constructor(queryString) {
    this.queryString = queryString;
    this.filters = [];
    this.values = [];
    this.paramIndex = 1;
    this.sortStr = '';
    this.limitStr = '';
    this.fieldsStr = '*';
  }

  filter(allowedFields = []) {
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    const queryObj = { ...this.queryString };
    excludedFields.forEach((el) => delete queryObj[el]);

    for (const key in queryObj) {
      if (allowedFields.length && !allowedFields.includes(key)) continue;
      let value = queryObj[key];

      // Advanced filtering for gte, lte, gt, lt
      if (typeof value === 'string' && value.match(/(gte|lte|gt|lt)$/)) {
        const [field, op] = key.split('_');
        let sqlOp = '';
        if (op === 'gte') sqlOp = '>=';
        if (op === 'gt') sqlOp = '>';
        if (op === 'lte') sqlOp = '<=';
        if (op === 'lt') sqlOp = '<';
        this.filters.push(`${field} ${sqlOp} $${this.paramIndex}`);
        this.values.push(value);
        this.paramIndex++;
      }
      // Multi-value filtering (IN)
      else if (typeof value === 'string' && value.includes(',')) {
        const items = value.split(',').map((v) => v.trim());
        const placeholders = items.map((_, i) => `$${this.paramIndex + i}`);
        this.filters.push(`${key} IN (${placeholders.join(', ')})`);
        this.values.push(...items);
        this.paramIndex += items.length;
      }
      // Default single value
      else {
        this.filters.push(`${key} = $${this.paramIndex}`);
        this.values.push(value);
        this.paramIndex++;
      }
    }
    return this;
  }

  sort(defaultSort = 'created_at DESC') {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort
        .split(',')
        .map((f) => f.trim())
        .filter(f => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(f)) // Only allow valid column names
        .join(', ');
      this.sortStr = `ORDER BY ${sortBy}`;
    } else {
      this.sortStr = `ORDER BY ${defaultSort}`;
    }
    return this;
  }

  limitFields(allowedFields = []) {
    // If no query param, still use all allowedFields
    const fields = this.queryString.fields
      ? this.queryString.fields
          .split(',')
          .map((f) => f.trim())
          .filter((f) => allowedFields.includes(f) && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(f)) // Validate field names
      : allowedFields;

    if (fields.length) this.fieldsStr = fields.join(', ');

    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 5;
    const offset = (page - 1) * limit;
    this.limitStr = `LIMIT ${limit} OFFSET ${offset}`;
    return this;
  }

  build(baseQuery) {
    let query = baseQuery.replace('*', this.fieldsStr);

    if (this.filters.length) {
      // Check if baseQuery already has WHERE
      const hasWhere = /WHERE/i.test(baseQuery);
      query += (hasWhere ? ' AND ' : ' WHERE ') + this.filters.join(' AND ');
    }

    if (this.sortStr) query += ' ' + this.sortStr;
    if (this.limitStr) query += ' ' + this.limitStr;

    return { query, values: this.values };
  }
}

module.exports = APIFeatures;
