const { Schema, model } = require("mongoose");

const ItemsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  objetos: {
    type: [String],
  },
});

const User = model("Items", ItemsSchema, "items");

module.exports = User;
