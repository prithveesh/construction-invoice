const asyncHandler = require('express-async-handler');

const Invoice = require('../models/invoiceModal');
// const User = require('../models/userModel')

const createInvoice = async (id) => {
  return await Invoice.create({
    config: {
      commission: 0.25,
      rates: {
        labor: 25,
        owner: 100,
      },
      tax: {
        material: 0.06,
        labor: 0.06,
      },
    },
    days: {
      0: {
        labor: {
          noOfWorkers: 0,
          hoursWorked: 0,
          ownerHours: 0,
        },
        material: [],
      },
      1: {
        labor: {
          noOfWorkers: 0,
          hoursWorked: 0,
          ownerHours: 0,
        },
        material: [],
      },
      2: {
        labor: {
          noOfWorkers: 0,
          hoursWorked: 0,
          ownerHours: 0,
        },
        material: [],
      },
      3: {
        labor: {
          noOfWorkers: 0,
          hoursWorked: 0,
          ownerHours: 0,
        },
        material: [],
      },
      4: {
        labor: {
          noOfWorkers: 0,
          hoursWorked: 0,
          ownerHours: 0,
        },
        material: [],
      },
      5: {
        labor: {
          noOfWorkers: 0,
          hoursWorked: 0,
          ownerHours: 0,
        },
        material: [],
      },
      6: {
        labor: {
          noOfWorkers: 0,
          hoursWorked: 0,
          ownerHours: 0,
        },
        material: [],
      },
    },
    id,
    paid: 0,
  });
};

const findInvoice = async (id) => {
  return await Invoice.findOne({ id });
};

// @desc    Get Invoice
// @route   GET /api/invoice
// @access  Private
const getInvoice = asyncHandler(async (req, res) => {
  console.log('req.params.id: ', req.params.id);
  let invoice = await findInvoice(req.params.id);
  if (!invoice) {
    invoice = await createInvoice(req.params.id);
  }
  res.status(200).json(invoice);
});

// @desc    Update invoice
// @route   PUT /api/invoice/:id
// @access  Private
const setInvoice = asyncHandler(async (req, res) => {
  console.log('req.body: ', req.body);
  const invoice = await Invoice.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    {
      new: true,
      upsert: true,
    },
  );

  res.status(200).json(invoice);
});

module.exports = {
  getInvoice,
  setInvoice,
};
