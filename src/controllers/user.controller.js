var User = require("../database/models").User;
var Address = require("../database/models").Address;
var Wishlist = require("../database/models").Wishlist;
var Product = require("../database/models").Product
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.currentUser.id },
      attributes: ["firstName", "lastName", "email"],
      raw: true
    })
    return res.status(200).json({ "statusCode": 200, user })
  }
  catch (error) {
    return res.status(500).json({ "errorMessage": "Something Went Wrong" })
  }
}

const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, currentPassword, email, newPassword } = req.body;
    let encryptPassword
    if (newPassword) {
      const user = await User.findOne({ where: { id: req.currentUser.id }, raw: true })
      if (! await bcrypt.compare(currentPassword, user.password))
        return res.status(400).json({ "statusCode": 400, "message": "Password is incorrect" })
      else {
        encryptPassword = await bcrypt.hash(newPassword, 10)
      }
    }

    const result = await User.findOne({
      where: {
        email: email.trim(),
        id: {
          [Op.ne]: req.currentUser.id
        }
      },
      raw: true
    })

    if (result) return res.status(400).json({ "statusCode": 400, "message": "Email is already registered" })

    if (encryptPassword) {
      await User.update(
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          // username: username.trim(),
          email: email.trim(),
          password: encryptPassword
        },
        {
          where: {
            id: req.currentUser.id
          }
        })
    }
    else {
      await User.update(
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          // username: username.trim(),
          email: email.trim(),
        }, {
        where: {
          id: req.currentUser.id
        }
      })
    }

    return res.status(200).json({ "statusCode": 200, "message": "User changes are updated" })
  } catch (error) {
    return res.status(500).json({ "errorMessage": "Something Went Wrong" })
  }
}

const getAddresses = async (req, res) => {
    try {

        let addresses = await Address.findAll({
            where: { userId: req.currentUser.id },
            raw: true
        })

        return res.status(200).json({ "statusCode": 200, data: addresses })
    }
  catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
  }
}

const createEditAddresses = async (req, res) => {
  try {
    const { id, firstName, lastName, companyName, gstNumber, country, email, state, streetAddress, city, landmark, postcode, phone, addressType, selectedStateId } = req.body;

    if (id) {
      await Address.update(
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          companyName: companyName.trim(),
          gstNumber: gstNumber.trim(),
          email: email.trim(),
          country: country.trim(),
          state: state.trim(),
          stateId: selectedStateId,
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          landmark: landmark.trim(),
          pincode: postcode.trim(),
          contact: phone.trim()
        }, {
        where: {
          id
        }
      })
      return res.status(200).json({ "statusCode": 200, "message": "Address is updated" })
    }
    else {
      await Address.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        companyName: companyName.trim(),
        gstNumber: gstNumber.trim(),
        email: email.trim(),
        country: country.trim(),
        state: state.trim(),
        stateId: selectedStateId,
        streetAddress: streetAddress.trim(),
        city: city.trim(),
        landmark: landmark.trim(),
        pincode: postcode.trim(),
        contact: phone.trim(),
        addressType,
        userId: req.currentUser.id
      })
      return res.status(200).json({ "statusCode": 200, "message": "Address is saved" })
    }
  }
  catch (error) {
    return res.status(500).json({ "errorMessage": "Something Went Wrong" })
  }
}


const getAddressById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(500).json({ "errorMessage": "Id is not provided" })
    }

    let address = await Address.findOne({
      where: { id: req.params.id },
      raw: true
    })

    return res.status(200).json({ "statusCode": 200, data: address })
  }
  catch (error) {
    return res.status(500).json({ "errorMessage": "Something Went Wrong" })
  }
}
const getWishlists = async (req, res) => {
  let userWishlist = []
  try {
    const result = await Wishlist.findAll({
      where: {
        userId: req.currentUser.id
      },
      attributes: ["productId", "productAttributeId"],
      include: {
        model: Product,
        attributes: ["productDetails", "productName"]
      }
    });

    result.forEach(element => {
      const productDetails = element.Product.productDetails.find((e) => {
        if (e.id == element.productAttributeId) return e
      })
      userWishlist.push({ productId: element.productId, productName: element.Product.productName, productDetails })
    });

    return res.status(200).json({ statusCode: 200, data: userWishlist });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something Went Wrong" });
  }
};

const getWishlistItemById = async (req, res) => {
  const productId = req.params.productId
  const { productAttributeId } = req.query
  try {
    const userWishlist = await Wishlist.findOne({
      where: {
        userId: req.currentUser.id,
        productId,
        productAttributeId
      }
    });
    return res.status(200).json({ statusCode: 200, itemAddedToWishlist: userWishlist ? true : false });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something Went Wrong" });
  }
};

const addWishlistItem = async (req, res) => {
  const { productId, productAttributeId } = req.body
  try {
    await Wishlist.create({
      productId,
      productAttributeId,
      userId: req.currentUser.id
    });
    return res.status(200).json({ statusCode: 200, message: "Product added to wish list" });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something Went Wrong", error });
  }
};

const removeWishlistItem = async (req, res) => {
  const { productId, productAttributeId } = req.body
  try {
    await Wishlist.destroy({
      where: {
        productId,
        productAttributeId,
        userId: req.currentUser.id
      },
      force: true
    });
    return res.status(200).json({ statusCode: 200, message: "Product is remove from wish list" });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something Went Wrong" });
  }
};
module.exports = {
  getUserDetails,
  updateUser,
  getAddresses,
  createEditAddresses,
  getAddressById,
  getWishlists,
  addWishlistItem,
  removeWishlistItem,
  getWishlistItemById,
}