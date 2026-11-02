const { z } = require("zod");

const registerSchema = z.object({
  nome: z.string().trim(),
  email: z.string().trim(),
  senha: z.string().trim().min(8, "Senha muito curta. no minimo 8 caracteres"),
  slug: z.string().trim(),
});

module.exports = { registerSchema };
