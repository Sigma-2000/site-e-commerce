const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");

const {
  getAllArtworks,
  getArtworkById,
  deleteArtworkById,
  addArtworks,
} = require("../controllers/artworksController");

router.get("/artworks", getAllArtworks);
router.get("/artworks/:id", getArtworkById);
router.delete("/artworks/:id", deleteArtworkById);
router.post("/artworks", upload.array("files", 6), addArtworks); //TODO: add authMiddlemare for protecting route

//TODO: Put example router.put("/artworks/:id", updateById); //[authMiddleware, upload.single('image')]

module.exports = router;
