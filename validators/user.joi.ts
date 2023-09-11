import Joi from "joi";

const userValidObject = Joi.object({
  email: Joi.string().email().required().min(5).max(100),
  fullName: Joi.string().required().min(5).max(100),
  password: Joi.string().required().min(6).max(100),
});

export default userValidObject;
