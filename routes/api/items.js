const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
// Item Model:
const Item = require("../../models/Item");

// *NOTE* Protecting the routes by adding auth as a parameter

// Test
router.get('/test', (req, res) => res.json({ success: 'APi Works!' }));

// @ desc    Get ALL items
// @ route    GET api/items
// @ access   Public
router.get("/", (req, res) => {
    Item.find()
    .sort({ date: -1 })
    .then(items => res.json(items))
});

// @ desc    Create A New Item
// @ route    POST api/items
// @ access   Private
router.post("/", auth, (req, res) => {
    // Create item:
    const newItem = new Item({
        name: req.body.name
    });
    // Save item to DB:
    newItem.save().then(item => res.json(item));
});

// @ route    POST api/items/:id
// @ desc    Delete a Item:
// @ access   Private
router.delete("/:id", auth, (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({success: "Successfully Removed!"})))
        .catch(err => res.status(404).json({failed: "Failed to remove item..."}))
})

module.exports = router;