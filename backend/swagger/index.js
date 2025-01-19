const { join } = require("path");
const swaggerAutogen = require("swagger-autogen");
const { Model, DataTypes } = require("sequelize");

const doc = {
  info: {
    title: "Blog",
    description: "My blog API",
  },

  definitions: {
    Post: {
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      mediaUrl: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },

    Posts: [
      {
        $ref: "#/models/Post",
      },
    ],

    User: {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
  },
  host: "localhost:5000",
  schemes: ["http"],
};

// Путь и название генерируемого файла
const outputFile = join(__dirname, "output.json");
// Массив путей к роутерам
const endpointsFiles = [join(__dirname, "../server.js")];

swaggerAutogen(/*options*/)(outputFile, endpointsFiles, doc).then(
  ({ success }) => {
    console.log(`Generated: ${success}`);
  }
);
