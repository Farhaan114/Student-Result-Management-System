module.exports = (sequelize, DataTypes) => {
  const Mark = sequelize.define('Mark', {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    course_code: {
      type: DataTypes.STRING(10),
      primaryKey: true
    },
    exam_name: {
      type: DataTypes.STRING(100),
      primaryKey: true
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'marks',
    timestamps: false
  });

  Mark.associate = models => {
    Mark.belongsTo(models.Student, {
      foreignKey: 'ID',
      onDelete: 'CASCADE'
    });
    Mark.belongsTo(models.Exam, {
      foreignKey: 'course_code',
      targetKey: 'course_code',
      onDelete: 'CASCADE'
    });
    Mark.belongsTo(models.Exam, {
      foreignKey: 'exam_name',
      targetKey: 'exam_name',
      onDelete: 'CASCADE'
    });
  };

  return Mark;
};
