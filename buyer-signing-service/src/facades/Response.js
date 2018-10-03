export default class Response {
  constructor(result, errors = []) {
    this.result = result;
    this.errors = errors;
  }

  success() {
    return this.errors.length === 0;
  }
}
