class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne|eq|nin|in)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  InFilter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let filter = {};
    let queryArray = [];

    if (queryObj.docIds !== undefined && queryObj.docIds !== null) {
      queryArray = queryObj.docIds.split(',');
    }

    if (queryArray instanceof Array && queryArray.length) {
      if (queryObj.artist !== undefined && queryObj.artist !== null) {
        filter = {
          category: {
            $in: queryArray
          },
          artist: queryObj.artist
        };
      } else {
        filter = {
          category: {
            $in: queryArray
          }
        };
      }
    } else {
      filter = {};
    }
    this.query = this.query.find(filter);

    return this;
  }

  InFilterTag() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let filter = {};
    let queryArray = [];

    if (queryObj.docIds !== undefined && queryObj.docIds !== null) {
      queryArray = queryObj.docIds.split(',');
    }

    if (queryArray instanceof Array && queryArray.length) {
      filter = {
        tag: {
          $in: queryArray
        }
      };
    } else {
      filter = {};
    }
    this.query = this.query.find(filter);

    return this;
  }

  InFilterMood() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let filter = {};
    let queryArray = [];

    if (queryObj.docIds !== undefined && queryObj.docIds !== null) {
      queryArray = queryObj.docIds.split(',');
    }

    if (queryArray instanceof Array && queryArray.length) {
      filter = {
        mood: {
          $in: queryArray
        }
      };
    } else {
      filter = {};
    }
    this.query = this.query.find(filter);

    return this;
  }

  InFilterLocation() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let filter = {};
    let queryArray = [];

    if (queryObj.docIds !== undefined && queryObj.docIds !== null) {
      queryArray = queryObj.docIds.split(',');
    }

    if (queryArray instanceof Array && queryArray.length) {
      filter = {
        location: {
          $in: queryArray
        }
      };
    } else {
      filter = {};
    }
    this.query = this.query.find(filter);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
