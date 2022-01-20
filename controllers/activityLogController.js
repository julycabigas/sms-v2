const ActivityLog = require('../models/ActivityLog');
const { Types } = require('mongoose')

exports.index = async (req, res, next) => {
  try {
    const match = {};
    const options = { 
      populate: 'user', 
      page: req.query.page || 1, 
      limit: 20,
      sort: { time: -1 } 
    };
    const activityLog = await ActivityLog.paginate(match, options);
    res.send(activityLog);
  }
  catch(err) {
    next(err);
  }
}

exports.get = async (req, res, next) => {
  try {
    const match = {
      'reference._id': new Types.ObjectId(req.params.refId),
    };
    const options = { 
      populate: 'user', 
      page: req.query.page || 1, 
      limit: 20,
      sort: { time: -1 } 
    };
    const activityLog = await ActivityLog.paginate(match, options);
    res.send(activityLog);
  }
  catch(err) {
    next(err);
  }
}