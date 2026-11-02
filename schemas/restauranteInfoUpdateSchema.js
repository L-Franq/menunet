const { z } = require("zod");

const restauranteInfoUpdateSchema = z.object({
  nome: z.string().trim().optional(),
  email: z.string().trim().optional(),
  slug: z.string().trim().optional(),
});

module.exports = { restauranteInfoUpdateSchema };
