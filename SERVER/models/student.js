module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    classNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        is: /^[A-Za-z ]+$/i
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    }
  }, {
    tableName: 'student_details',
    timestamps: false
  });

  Student.associate = models => {
    Student.hasMany(models.Mark, {
      foreignKey: 'ID',
      onDelete: 'CASCADE'
    });
  };

  return Student;
};
