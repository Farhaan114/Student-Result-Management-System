// const { Sequelize, DataTypes } = require("sequelize");

// module.exports = (Sequelize, DataTypes) => {
//     const Students = Sequelize.define("Students", {
//         classno: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//         },
//         rollno: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//     });

//     return Students;
// };

module.exports = (sequelize, DataTypes) => {
    const Students = sequelize.define("Students", {
                    classno: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                    },
                    rollno: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                    },
                    name: {
                        type: DataTypes.STRING,
                        allowNull: false,
                    },
                    email: {
                        type: DataTypes.STRING,
                        allowNull: false,
                    },
    })

    return Students;
}