const Plan = require('../models/Plan');
const { createLog, logTypes } = require('../utils/activityLog');

exports.index = async (req, res, next) => {
  try {
    const match = {
      $or: [
        { deleted: { $exists: false } },
        { deleted: false },
      ]
    };
    const options = { page: req.query.page || 1, limit: 12 };
    const plan = await Plan.paginate(match, options);
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
  let plan = await Plan.findByIdAndUpdate(req.params.id, req.body);
  plan = await Plan.findById(req.params.id);
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

exports.deletePlan = async (req, res, next) => {
  let plan = await Plan.findByIdAndUpdate(req.params.id, { deleted: true });
  await createLog({ 
    user: req.user.id,
    time: new Date(),
    type: logTypes.deletePlan,
    reference: {
      collectionName: 'plans',
      _id: plan._id,
    },
  });
  res.send({ success: true });
}