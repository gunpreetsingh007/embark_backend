var express = require("express");
const {
  getUserDetails,
  updateUser,
  getAddresses,
  createEditAddresses,
  getWishlists,
  addWishlistItem,
  removeWishlistItem,
  getWishlistItemById,
  getAddressById,
  getCurrentUserDetails,
  getAllOrders,
  getOrderById
} = require("../controllers/user.controller");
var router = express.Router();

router.get("/me", getCurrentUserDetails);
router.get('/getUserDetails', getUserDetails);
router.post('/updateUser', updateUser);
router.get('/getAddresses', getAddresses);
router.get('/getAddressById/:id', getAddressById);
router.post('/createEditAddresses', createEditAddresses);
router.get("/getWishlist", getWishlists);
router.get("/getWishlistItemById/:productId", getWishlistItemById);
router.post("/addWishlistItem", addWishlistItem);
router.delete("/removeWishlistItem", removeWishlistItem);
router.get("/getAllOrders", getAllOrders);
router.get("/getOrderById/:id", getOrderById);

module.exports = router;
