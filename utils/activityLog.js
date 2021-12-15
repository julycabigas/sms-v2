const ActivityLog = require('../models/ActivityLog');

exports.logTypes = {
  addStudent: { 
    type: 'Add Student',
    message: 'New Student has been added'
  },
  deleteStudent: { 
    type: 'Delete Student',
    message: 'Student has been deleted'
  },
  updateStudent: { 
    type: 'Update Student',
    message: 'Student has been updated'
  },
  deletePaymentList: { 
    type: 'Delete Payment List',
    message: 'Payment List has been deleted'
  },
  updatePaymentList: { 
    type: 'Update Payment List',
    message: 'Payment List has been updated'
  },
  addPaymentList: { 
    type: 'Add Payment List',
    message: 'New Payment List has been added'
  },
  deleteDeposit: { 
    type: 'Delete Deposit',
    message: 'Deposit has been deleted'
  },
  updateDeposit: { 
    type: 'Update Deposit',
    message: 'Deposit has been updated'
  },
  addDeposit: { 
    type: 'Add Deposit',
    message: 'New Deposit has been added'
  },
  deletePlan: { 
    type: 'Delete Plan',
    message: 'Plan has been deleted'
  },
  updatePlan: { 
    type: 'Update Plan',
    message: 'Plan has been updated'
  },
  addPlan: { 
    type: 'Add Plan',
    message: 'New Plan has been added'
  },
  deleteUser: { 
    type: 'Delete User',
    message: 'User has been deleted'
  },
  updateUser: { 
    type: 'Update User',
    message: 'User has been updated'
  },
  addUser: { 
    type: 'Add User',
    message: 'New User has been added'
  },
}

exports.createLog = async (props) => {
  const { time, type, message, reference, user } = props;
  return await ActivityLog.create({
    time,
    type,
    user,
    reference: {
      collectionName: reference.collectionName,
      _id: reference._id,
    },
  });
}