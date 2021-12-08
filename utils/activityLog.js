const ActivityLog = require('../models/ActivityLog');

exports.createLog = async (props) => {
  const { time, type, message, reference, user } = props;
  return await ActivityLog.create({
    time,
    type,
    message,
    user,
    reference: {
      collectionName: reference.collectionName,
      _id: reference._id,
    },
  });
}