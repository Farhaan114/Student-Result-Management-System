'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('marks', {
      ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
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
      marks: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    });

    // Foreign key: marks.ID → student_details.ID
    await queryInterface.addConstraint('marks', {
      fields: ['ID'],
      type: 'foreign key',
      name: 'fk_marks_student',
      references: {
        table: 'student_details',
        field: 'ID'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Foreign key: marks.course_code, exam_name → exams.course_code, exam_name
    await queryInterface.addConstraint('marks', {
      fields: ['course_code', 'exam_name'],
      type: 'foreign key',
      name: 'fk_marks_exam',
      references: {
        table: 'exams',
        fields: ['course_code', 'exam_name']
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('marks');
  }
};
