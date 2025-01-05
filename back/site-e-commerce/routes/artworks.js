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
router.get("/artwork/:id", getArtworkById);
router.delete("/artwork/:id", verifyToken, isAdmin, deleteArtworkById);
router.post(
  "/artwork",
  verifyToken,
  isAdmin,
  upload.array("files", 6),
  addArtworks
);

//TODO: Put example router.put("/artworks/:id", updateById); //[authMiddleware, upload.single('image')]

module.exports = router;
