const validate = (req, res, admin) => {
  res
    .status(200)
    .json({ admin: req.admin.userName, reduction: req.admin.reductionStatus });
};

module.exports = validate;
