const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Регистрация
router.post("/register", async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Регистрация нового пользователя'
  // #swagger.description = 'Роут для регистрации нового пользователя'
  /* #swagger.parameters['User'] = {
    in: 'body',
    description: 'Данные для регистрации пользователя',
    required: true,
    schema: {
	"username": "username",
	"password": "password"
}
  } */
  /* #swagger.responses[201] = {
    description: 'Пользователь успешно зарегистрирован',
    schema: { id: "user.id", username: "user.username" }
  } */
  /* #swagger.responses[400] = {
    description: 'Некорректные данные для регистрации'
  } */
  /* #swagger.responses[500] = {
    description: 'Ошибка сервера',
    schema: { error: "Ошибка регистрации" }
  } */

  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Ошибка регистрации" });
  }
});

// Авторизация
router.post("/login", async (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Авторизация пользователя'
  // #swagger.description = 'Роут для авторизации пользователя'
  /* #swagger.parameters['User'] = {
    in: 'body',
    description: 'Данные для авторизации пользователя',
    required: true,
    schema: {
	"username": "username",
	"password": "password"
}
  } */
  /* #swagger.responses[200] = {
    description: 'Пользователь успешно авторизовался',
    schema: {
	"token": "jwttoken"
}
  } */
  /* #swagger.responses[400] = {
    description: 'Неверные учетные данные',
    schema: { error: "Неверные учетные данные" }
  } */
  /* #swagger.responses[500] = {
    description: 'Ошибка сервера',
    schema: { error: "Ошибка авторизации" }
  } */

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Неверные учетные данные" });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Ошибка авторизации" });
  }
});

module.exports = router;
