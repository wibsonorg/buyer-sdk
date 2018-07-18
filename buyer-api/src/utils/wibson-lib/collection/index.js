const partition = (collection, partitionFunc) => {
  let left = [];
  let right = [];

  collection.forEach((item) => {
    if (partitionFunc(item)) {
      left = [...left, item];
    } else {
      right = [...right, item];
    }
  });

  return [left, right];
};

export { partition }; // eslint-disable-line import/prefer-default-export
