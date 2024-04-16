class Pagination {
  constructor(page, size) {
    this.itemPerPage = parseInt(size) || 20;
    this.page = parseInt(page) || 1;
  }
  getOffset() {
    return (this.page - 1) * this.itemPerPage;
  }
  getItemPerPage() {
    return this.itemPerPage;
  }
  getPageOffsets(totalData) {
    // necessary with offset and limit convention
    // not necessary with page and page size convention
    const totalPages = Math.ceil(totalData / this.itemPerPage);
    const first = 0;
    const last = (totalPages - 1) * this.itemPerPage;
    const next = this.page < totalPages ? this.page * this.itemPerPage : null;
    const previous = this.page > 1 ? (this.page - 2) * this.itemPerPage : null;
    const self = this.getOffset();
    return { self, first, last, next, previous };
  }
  getPageNos(totalData) {
    // necessary with page and page size convention
    const totalPages = Math.ceil(totalData / this.itemPerPage);
    const first = 1;
    const last = totalPages;
    const next = this.page < totalPages ? this.page + 1 : null;
    const previous = this.page > 1 ? this.page - 1 : null;
    const self = this.page;
    return { self, first, last, next, previous };
  }
}

module.exports = Pagination;
