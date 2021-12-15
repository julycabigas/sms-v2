const Plan = require('../models/Plan');
const { createLog, logTypes } = require('../utils/activityLog');

exports.index = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const plan = await Plan.paginate({}, { page, limit: 12 });
    res.send(plan);
  }
  catch(err) {
    next(err);
  }
}

exports.all = async (req, res, next) => {
  try {
    const plan = await Plan.find({});
    res.send(plan);
  }
  catch(err) {
    next(err);
  }
}

exports.get = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const plan = await Plan.findById(planId)
    res.send(plan);
  }
  catch(err) {
    next(err);
  }
}

exports.create = async (req, res, next) => {
  const { amount, currency, quantity, resultName, recurrence } = req.body;

  try {
    const plan = await Plan.create({ 
      amount,
      currency,
      quantity,
      resultName,
      recurrence,
    });
    await createLog({ 
      user: req.user.id,
      time: new Date(),
      type: logTypes.addPlan,
      reference: {
        collectionName: 'plans',
        _id: plan._id,
      },
    });
    res.send(plan);
  }
  catch(err) {
    next(err);
  }
}

exports.edit = async (req, res, next) => {
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body);
  await createLog({ 
    user: req.user.id,
    time: new Date(),
    type: logTypes.addPlan,
    reference: {
      collectionName: 'plans',
      _id: plan._id,
    },
  });
  res.send(plan);
}