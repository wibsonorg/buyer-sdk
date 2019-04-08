const getNotariesFromAudience = (audience, availableNotaries) => {
  if (!audience.notaries) {
    return availableNotaries;
  }

  return availableNotaries.filter(notary =>
    audience.notaries.some(rule => rule.test(notary.label))
  );
};

export { getNotariesFromAudience };
