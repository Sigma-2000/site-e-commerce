const express = require("express");
const router = express.Router();

const {
  getAllArtworks,
  getArtworkById,
  deleteArtworkById,
} = require("../controllers/artworksController");

router.get("/artworks", getAllArtworks);
router.get("/artworks/:id", getArtworkById);
router.delete("/artworks/:id", deleteArtworkById);
//router.post("/artworks", addArtworks); // [authMiddleware, upload.single('image')]
//router.put("/artworks/:id", updateById); //[authMiddleware, upload.single('image')]

module.exports = router;
