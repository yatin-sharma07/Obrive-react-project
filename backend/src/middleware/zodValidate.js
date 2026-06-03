const { z } = require('zod');

module.exports = (config, legacyPart = 'body') => (req, res, next) => {
  try {
    const schema = config && typeof config.safeParse === 'function'
      ? config
      : config?.schema;

    const part = config && typeof config.safeParse === 'function'
      ? legacyPart
      : config?.part || 'body';

    if (!schema || typeof schema.safeParse !== 'function') {
      return res.status(500).json({
        success: false,
        message: 'Validation schema is missing or invalid',
      });
    }

    const input = part === 'all'
      ? { body: req.body, params: req.params, query: req.query }
      : req[part];

    const result = schema.safeParse(input);
    if (!result.success) {
      return res.status(422).json({ success: false, errors: result.error.errors });
    }

    if (part === 'all') {
      req.body = result.data.body;
      req.params = result.data.params;
      req.query = result.data.query;
    } else {
      req[part] = result.data;
    }

    next();
  } catch (err) {
    next(err);
  }
};


//It is a middleware function for Express.js that validates incoming request data using Zod schemas.
//The middleware takes an options object with two properties: 'part', which specifies which part of the request to validate (defaulting to 'body'), and 'schema', which is the Zod schema to use for validation. The middleware attempts to parse the specified part of the request using the provided schema. 
//If validation fails, it responds with a 422 Unprocessable Entity status and includes the validation errors in the response. If validation succeeds, it replaces the original request data with the validated data and calls the next middleware or route handler. This helps ensure that incoming data adheres to expected formats and types before being processed further in the application.
