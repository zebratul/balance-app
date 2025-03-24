const Joi = require('joi');

const schema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  amount: Joi.number().required().invalid(0),
});

module.exports = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};