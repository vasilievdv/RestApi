const router = require('express').Router();
const mime = require('mime-types');
const fs = require('fs').promises;
const verify = require('../middlewares/verifyToken');
const { File } = require('../../db/models');

router.post('/upload', verify, async (req, res) => {
  const { id } = req.user;
  if (req.files) {
    const { name, mimetype, size } = req.files.file;
    const { file } = req.files;
    const type = mime.extension(mimetype);
    const uniqueName = `${new Date().toISOString()}-${name}`;
    try {
      await File.create({
        user_id: id, name: uniqueName, mimetype, size, type,
      });
      file.mv(`./uploads/${uniqueName}`, (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send('File Uploaded');
        }
      });
    } catch (error) {
      res.sendStatus(400);
    }
  }
});

router.get('/list', verify, async (req, res) => {
  const { id } = req.user;
  // eslint-disable-next-line camelcase
  let { list_size, page } = req.query;
  // eslint-disable-next-line camelcase
  if (list_size === '') {
    // eslint-disable-next-line camelcase
    list_size = 10;
  }
  if (page === '') {
    page = 1;
  }
  // eslint-disable-next-line camelcase
  const offset = +((page - 1) * list_size);
  // eslint-disable-next-line camelcase
  const limit = +list_size;
  try {
    const userFiles = await File.findAll({ where: { user_id: id }, offset, limit });
    res.send(userFiles);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete('/delete/:id', verify, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const checkId = await File.findOne({ where: { id } });
    if (userId === checkId.user_id) {
      await File.destroy({ where: { id } });
      const filePath = `./uploads/${checkId.name}`;
      fs.unlink(filePath);
      res.send('Done');
    } else {
      res.send('Not your file');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:id', verify, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const checkId = await File.findOne({ where: { id } });
    if (userId === checkId.user_id) {
      res.send(checkId);
    } else {
      res.send('Not your file');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
