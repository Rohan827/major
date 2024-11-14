const Joi = require('joi');

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required(),
        image : Joi.string().allow("" , null),

    }).required()
})