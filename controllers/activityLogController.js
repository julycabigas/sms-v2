const ActivityLog = require('../models/ActivityLog');

exports.index = async (req, res, next) => {
  try {
    const match = {};
    const options = { populate: 'user', page: req.query.page || 1, limit: 20 };
    const activityLog = await ActivityLog.paginate(match, options);
    res.send(activityLog);
  }
  catch(err) {
    next(err);
  }
}