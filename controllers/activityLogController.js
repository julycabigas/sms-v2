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
    const activityLog = await ActivityLog
                                .find({ 
                                  'reference._id': new Types.ObjectId(req.params.refId), 
                                  user: new Types.ObjectId(req.user.id) 
                                })
                                .populate('user')
                                .sort({ time: -1 })
                                .limit(1);
    res.send(activityLog);
  }
  catch(err) {
    next(err);
  }
}