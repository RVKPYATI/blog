const express = require("express");
const Post = require("../models/Post");
const { authenticateJWT } = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const path = require("path"); //

// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// Создание записи
router.post(
  "/",
  authenticateJWT,
  upload.single("mediaFile"),
  async (req, res) => {
    // #swagger.tags = ['Post']
    // #swagger.summary = 'Создание нового поста'
    // #swagger.description = 'Роут создание нового поста'
    /* #swagger.parameters['User'] = {
    in: 'body',
    description: 'Данные для асоздание нового поста',
    required: true,
    schema: {
	      message:"message text",
        mediaUrl:"mediaUrl",
        userId: "userId",
        username: "username",
            }
  } */
    /* #swagger.responses[201] = {
    description: 'Пост создался',
    schema: {
	      message:"message text",
        mediaUrl:"mediaUrl",
        userId: "userId",
        username: "username",
            }
  } */
    /* #swagger.responses[500] = {
    description: 'Ошибка создания записи',
    schema: { error: "Ошибка создания записи" }
  } */

    const { message } = req.body;
    const mediaUrl = req.file ? req.file.path.replace(/\\/g, "/") : null;
    try {
      const post = await Post.create({
        message,
        mediaUrl,
        userId: req.user.id,
        username: req.user.username,
      });
      res.status(201).json(post);
    } catch (error) {
      console.error("Ошибка создания записи:", error);
      res.status(500).json({ error: "Ошибка создания записи" });
    }
  }
);

// Получение всех записей
router.get("/", async (req, res) => {
  // #swagger.tags = ['Post']
  // #swagger.summary = 'Получение всех записей'
  // #swagger.description = 'Роут получение всех записей'
  /* #swagger.responses[200] = {
    description: 'Список постов',
    schema: [
	{
		"id": 22,
		"message": "Это сообщение от боба",
		"mediaUrl": null,
		"date": "2025-01-19T05:23:52.409Z",
		"userId": 15,
		"username": "bob",
		"createdAt": "2025-01-19T05:23:52.409Z",
		"updatedAt": "2025-01-19T05:23:52.409Z"
	},]
  } */
  /* #swagger.responses[500] = {
    description: 'Ошибка получения записей',
    schema: { error: "Ошибка получения записей" }
  } */
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Ошибка получения записей" });
  }
});

// Получение записи по ID
router.get("/:id", async (req, res) => {
  // #swagger.tags = ['Post']
  // #swagger.summary = 'Получение записи по ID'
  // #swagger.description = 'Роут получение записи по ID'
  /* #swagger.responses[200] = {
    description: 'Пост по ID',
    schema: 
	{
		"id": 22,
		"message": "Это сообщение от боба",
		"mediaUrl": null,
		"date": "2025-01-19T05:23:52.409Z",
		"userId": 15,
		"username": "bob",
		"createdAt": "2025-01-19T05:23:52.409Z",
		"updatedAt": "2025-01-19T05:23:52.409Z"
	},
  } */
  /* #swagger.responses[404] = {
    description: 'Запись не найдена',
    schema: { error: "Запись не найдена" }
  } */
  /* #swagger.responses[500] = {
    description: 'Ошибка получения записи',
    schema: { error: "Ошибка получения записи" }
  } */
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Ошибка получения записи" });
  }
});

// Редактирование записи по ID
router.put(
  "/:id",
  authenticateJWT,
  upload.single("mediaFile"),
  async (req, res) => {
    // #swagger.tags = ['Post']
    // #swagger.summary = 'Редактирование записи по ID'
    // #swagger.description = 'Роут для редактирования записи по ID'
    /* #swagger.parameters['Post'] = {
    in: 'body',
    description: 'Данные для редактирования записи',
    required: true,
    schema: {
	      message:"message text",
        mediaUrl:"mediaUrl",
        userId: "userId",
        username: "username",
            }
  } */
    /* #swagger.responses[201] = {
    description: 'Пост по ID',
    schema: 
	{
		"id": 22,
		"message": "Это сообщение от боба",
		"mediaUrl": null,
		"date": "2025-01-19T05:23:52.409Z",
		"userId": 15,
		"username": "bob",
		"createdAt": "2025-01-19T05:23:52.409Z",
		"updatedAt": "2025-01-19T05:23:52.409Z"
	},
  } */
    /* #swagger.responses[404] = {
    description: 'Запись не найдена',
    schema: { error: "Запись не найдена" }
  } */
    /* #swagger.responses[403] = {
    description: 'Нет доступа для редактирования этой записи',
    schema: { error: "Нет доступа для редактирования этой записи" }
  } */
    /* #swagger.responses[500] = {
    description: 'Ошибка редактирования записи',
    schema: { error: "Ошибка редактирования записи" }
  } */

    const { id } = req.params;
    const { message, mediaUrl } = req.body;
    try {
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ error: "Запись не найдена" });
      }

      if (post.userId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Нет доступа для редактирования этой записи" });
      }

      post.message = message || post.message;

      if (req.file) {
        post.mediaUrl = req.file.path;
      } else {
        post.mediaUrl = mediaUrl || post.mediaUrl;
      }

      await post.save();

      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка редактирования записи" });
    }
  }
);

// Удаление записи по ID
router.delete("/:id", authenticateJWT, async (req, res) => {
  // #swagger.tags = ['Post']
  // #swagger.summary = 'Удаление записи по ID'
  // #swagger.description = 'Роут для удаления записи по ID'
  /* #swagger.parameters['Post'] = {
    in: 'body',
    description: 'Данные для удаления записи',
    required: true,
    schema: {
	"id": "postid",
}
  } */
  /* #swagger.responses[204] = {
    description: 'Запись удалена',
  } */
  /* #swagger.responses[404] = {
    description: 'Запись не найдена',
    schema: { error: "Запись не найдена" }
  } */
  /* #swagger.responses[403] = {
    description: 'Нет доступа для редактирования этой записи',
    schema: { error: "Нет доступа для редактирования этой записи" }
  } */
  /* #swagger.responses[500] = {
    description: 'Ошибка удаления записи',
    schema: { error: "Ошибка удаления записи" }
  } */

  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Запись не найдена" });
    }

    if (post.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Нет доступа для удаления этой записи" });
    }

    await post.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Ошибка удаления записи" });
  }
});

module.exports = router;
