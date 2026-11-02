const { z } = require("zod");

const pratoCadastroSchema = z.object({
  nome: z.string().trim().min(3),
  descricao: z.string().trim(),
  preco: z.preprocess((val) => Number(val), z.number().positive()),
  categoria: z.string().trim(),
});

module.exports = { pratoCadastroSchema };
