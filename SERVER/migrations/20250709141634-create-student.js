'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_details', {
      ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        validate: { min: 1 }
      },
      classNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 1 }
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: { is: /^[A-Za-z ]+$/ }
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 1 }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('student_details');
  }
};
