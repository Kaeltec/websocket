const Socket = require('../structures/Socket');

/**
 * @extends {Map<string, Socket>}
 */
class Subscriptions extends Map {
  get getValues() {
    return Array.from(this.values());
  }

  first() {
    return this.getValues[0];
  }

  add(id, ...params) {
    const newObject = new Socket(...params);

    this.set(id, newObject);
    return newObject;
  }

  remove(id) {
    const old = this.get(id);

    this.delete(id);
    return old;
  }

  map(func) {
    return this.getValues.map(func);
  }

  filter(func) {
    return this.getValues.filter(func);
  }

  some(func) {
    return this.getValues.some(func);
  }

  every(func) {
    return this.getValues.every(func);
  }

  sort(func) {
    return this.getValues.sort(func);
  }

  reduce(...params) {
    return this.getValues.reduce(...params);
  }

  find(func) {
    return this.getValues.find(func);
  }
}

module.exports = Subscriptions;
