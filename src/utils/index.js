const isNull = v => typeof v === 'undefined' || v === null;

module.exports = {
  isNull,

  mergeObject(def, obj = {}) {
    const fullObj = Object.assign(def, obj);

    return Object.entries(def).reduce(
      (o, [k, v]) => Object.assign(o, { [k]: isNull(obj[k]) ? v : obj[k] }),
      fullObj,
    );
  },
};
