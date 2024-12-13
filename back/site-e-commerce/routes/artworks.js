const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const {
  getAllArtworks,
  getArtworkById,
  deleteArtworkById,
  addArtworks,
} = require("../controllers/artworksController");

router.get("/artworks", getAllArtworks);
router.get("/artworks/:id", getArtworkById);
router.delete("/artworks/:id", verifyToken, isAdmin, deleteArtworkById);
router.post(
  "/artworks",
  verifyToken,
  isAdmin,
  upload.array("files", 6),
  addArtworks
);

//TODO: Put example router.put("/artworks/:id", updateById); //[authMiddleware, upload.single('image')]

module.exports = router;
