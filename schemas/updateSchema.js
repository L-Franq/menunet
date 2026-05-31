const { z } = require("zod");

const updateSchema = z.object({
  nome: z.string().trim().optional(),
  email: z.string().trim().optional(),
  slug: z.string().trim().optional(),
});

module.exports = { updateSchema };
