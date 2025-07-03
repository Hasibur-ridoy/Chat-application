const Joi = require('joi');

exports.validateSignup = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required().messages({'any.required': 'Name is required', 'any.invalid': 'name cannot be empty'}),
        email: Joi.string().min(1).max(100).required().messages({'any.required': 'Email is required', 'any.invalid': 'email cannot be empty'}),
        password: Joi.string().min(1).max(100).required()
    });
    return schema.validate(data);
};


exports.validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(1).max(100).required().messages({'any.required': 'Email is required', 'any.invalid': 'email cannot be empty'}),
        password: Joi.string().min(1).max(100).required()
    });
    return schema.validate(data);
};
