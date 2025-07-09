'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exams', {
      course_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        primaryKey: true
      },
      exam_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 1 }
      },
      max_marks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      min_marks: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });

    // Manually add the CHECK constraint for year >= 1
    await queryInterface.sequelize.query(`
      ALTER TABLE exams
      ADD CONSTRAINT exams_year_check CHECK (year >= 1)
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exams');
  }
};
