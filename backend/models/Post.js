const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Post extends Model {}

Post.init(
  {
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
  { sequelize, modelName: "post" }
);

module.exports = Post;
