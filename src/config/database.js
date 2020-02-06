module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true, // para usar padrão underscore para nome de tabelas e colunas
    underscoredAll: true,
  },
};
