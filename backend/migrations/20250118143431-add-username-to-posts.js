"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("posts", "username", {
      type: Sequelize.STRING, // Укажите тип данных
      allowNull: true, // Укажите, допускает ли столбец NULL
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("posts", "username"); // Удаление столбца при откате миграции
  },
};
