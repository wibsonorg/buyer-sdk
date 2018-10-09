// eslint-disable-next-line no-unused-vars
const fourOhFourHandler = (req, res, next) => {
  res.boom.notFound();
};

export default fourOhFourHandler;
