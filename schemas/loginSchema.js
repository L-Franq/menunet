const { z } = require("zod");

const loginSchema = z.object({
  email: z.string(),
  senha: z.string(),
});

module.exports = { loginSchema };
