const mongoose = require('mongoose');

const DaySchema = mongoose.Schema({
  labor: {
    day: Number,
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
  },
  material: [
    {
      item: {
        type: String,
      },
      price: {
        type: Number,
      },
    },
  ],
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
    days: {
      0: DaySchema,
      1: DaySchema,
      2: DaySchema,
      3: DaySchema,
      4: DaySchema,
      5: DaySchema,
      6: DaySchema,
    },
    paid: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('invoice', invoiceSchema);
