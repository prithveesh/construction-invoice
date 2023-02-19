const mongoose = require('mongoose');

const LaborSchema = mongoose.Schema({
  noOfWorkers: {
    type: Number,
    default: 0,
  },
  hoursWorked: {
    type: Number,
    default: 0,
  },
  ownerHours: {
    type: Number,
    default: 0,
  },
});

const MaterialSchema = mongoose.Schema({
  itemId: Number,
  date: String,
  receipt: String,
  storeName: String,
  item: String,
  price: Number,
  type: String,
});

const invoiceSchema = mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'User',
    // },
    id: {
      type: String,
      required: true,
    },
    config: {
      commission: {
        type: Number,
        default: 25,
      },
      rates: {
        labor: {
          type: Number,
          default: 25,
        },
        owner: {
          type: Number,
          default: 25,
        },
      },
      tax: {
        material: {
          type: Number,
          default: 1.06,
        },
        labor: {
          type: Number,
          default: 1.06,
        },
      },
    },
    labor: {
      0: LaborSchema,
      1: LaborSchema,
      2: LaborSchema,
      3: LaborSchema,
      4: LaborSchema,
      5: LaborSchema,
      6: LaborSchema,
    },
    material: [MaterialSchema],
    paid: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('invoice', invoiceSchema);
