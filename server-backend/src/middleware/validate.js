const validate = (schemas) => (req, res, next) => {
  const errors = [];
  //To return all errors not just the first
  ['body', 'query', 'params'].forEach((source) => {
    if (schemas[source]) {
      const { error, value } = schemas[source].validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
      });

      if (error) {
        errors.push(
          ...error.details.map((d) => ({
            field: d.path.join('.'),
            message: d.message,
            source,
          }))
        );
      } else {
        req[source] = value;
      }
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed ' + errors[0].message, errors });
  }

  next();
};

module.exports = { validate };
