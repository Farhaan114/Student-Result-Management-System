module.exports = (sequelize, DataTypes) => {
  const Exam = sequelize.define('Exam', {
    course_code: {
      type: DataTypes.STRING(10),
      primaryKey: true
    },
    exam_name: {
      type: DataTypes.STRING(100),
      primaryKey: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    max_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    min_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'exams',
    timestamps: false
  });

  Exam.associate = models => {
    Exam.hasMany(models.Mark, {
      foreignKey: 'course_code',
      sourceKey: 'course_code',
      onDelete: 'CASCADE'
    });
    Exam.hasMany(models.Mark, {
      foreignKey: 'exam_name',
      sourceKey: 'exam_name',
      onDelete: 'CASCADE'
    });
  };

  return Exam;
};
