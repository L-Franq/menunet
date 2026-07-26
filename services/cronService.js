const cron = require("node-cron");
const db = require("../databases/db");

cron.schedule(
  "0 0 * * *",
  async () => {
    console.log(
      "[CRON] Executando varredura diária para limpar o menu ativo...",
    );

    const sql = `UPDATE pratos SET no_menu = FALSE WHERE no_menu = TRUE`;

    try {
      const result = await db.query(sql);
      console.log(
        `[CRON] Varredura concluída. ${result.rowCount} pratos foram movidos para o histórico.`,
      );
    } catch (error) {
      console.error("[CRON] Erro ao executar a varredura automática: ", error);
    }
  },
  {
    scheduled: true,
    timezone: "Africa/Luanda",
  },
);
