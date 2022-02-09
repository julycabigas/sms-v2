const Student = require('../models/Student')
const PaymentList = require('../models/PaymentList')
const Deposit = require('../models/Deposit')
const Plan = require('../models/Plan')
const { Types } = require('mongoose')
const moment = require('moment')
const { _htmlPdf, _createPdf } = require('./studentPdf')
const AdmZip = require("adm-zip");
const fs = require('fs');
const { createLog, logTypes } = require('../utils/activityLog');
const { createContext } = require('vm')

exports.downloadStudent = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const { student, paymentLists, deposits } = await _getStudentDetails(studentId);
    const pdf = await _htmlPdf({ student, paymentLists, deposits });
    const filePath = `/storage/student-pdf/${student.email}_${student._id}.pdf`;
    pdf.toFile(__basedir + filePath);
    res.send(filePath);
  }
  catch(err) {
    next(err);
  }
}

exports.downloadStudents = async (req, res, next) => {
  try {
    const { studentIds } = req.body;
    const zip = new AdmZip();
    const pdfFiles = await Promise.all(
      studentIds.map(async studentId => {
        const { student, paymentLists, deposits } = await _getStudentDetails(studentId);
        const pdf = await _htmlPdf({ student, paymentLists, deposits });
        const filePath = `/storage/student-pdf/${student.email}_${student._id}.pdf`;
        pdf.toFile(__basedir + filePath);
        return filePath;
      })
    ); 
    const zipFile = '/storage/student-pdf/students.zip';
    pdfFiles.forEach(file => {
      zip.addLocalFile(__basedir + file);
    });
    zip.writeZip(__basedir + zipFile);
    pdfFiles.forEach(file => {
      fs.unlinkSync(__basedir + '/' + file);
    });
    res.send(zipFile);
  }
  catch(err) {
    next(err);
  }
}

exports.streamPdf = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { student, paymentLists, deposits } = await _getStudentDetails(studentId);
    const pdf = await _htmlPdf({ student, paymentLists, deposits });
    const pdfViewer = _createPdf(pdf.toBase64());
    res.send(pdfViewer);
  }
  catch(err) {
    next(err)
  }
}

exports.index = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const { name, email, plan, sales_rep, signed_contract, payment_status, payment_status_updated } = req.query;
    const match = {}
    if (name) match.$text = { $search: name }
    if (email) match.email = email
    if (sales_rep) match.sales_rep = sales_rep
    if (signed_contract) match.signed_contract = signed_contract
    if (payment_status) match.payment_status = payment_status
    if (plan) match.plan = new Types.ObjectId(plan)
    if (payment_status_updated) {
      const [fromUpdatedAt, toUpdatedAt] = payment_status_updated.split('~');
      const from = moment(fromUpdatedAt).format();
      const to = moment(toUpdatedAt).format();
      match['payment_status_updated'] = {
        $gte: from,
        $lte: to,
      }
    }

    const options = { 
      page, 
      limit: process.env.LIMIT,
      populate: 'plan',
    };
    const student = await Student.paginate({ ...match }, options);
    res.send(student);
  }
  catch(err) {
    next(err);
  }
}

exports.store = async (req, res, next) => {
  try {
    const payload = req.body;
    delete payload.payment_date_start
    const { deposit } = req.body;
    const _studentDetails = {...payload}
    delete _studentDetails.paymentLists;
    delete _studentDetails.deposit;
    const student = await Student.create({ 
      ..._studentDetails,
      currency: deposit[0].currency
    });
    if (student) {
      await createLog({ 
        user: req.user.id,
        time: new Date(),
        type: logTypes.addStudent,
        reference: {
          collectionName: 'students',
          _id: student._id,
        },
      });
      res.send({ 
        student, 
        // paymentLists: listData.paymentLists, 
        // deposits: listData.deposits 
      }); 
    }
  }
  catch(err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    let student = await Student.findById(studentId);
    const payloads = { ...req.body };
    const logUpdates = [];
    delete payloads.paymentLists;
    delete payloads.studentId;
    for (const [key, value] of Object.entries(payloads)) {
      if (key === 'payment_date_start' || key === 'joined_date') {
        payloads.payment_date_start = new Date(moment.utc(payloads.payment_date_start).toString());
        payloads.joined_date = new Date(moment.utc(payloads.joined_date).toString());
      }
      if (payloads[key].toString() !== student[key].toString()) {
        logUpdates.push({ 
          key,  
          type: 'Updated',
          from: key === 'plan' ? (await Plan.findById(student[key])).resultName : student[key],
          to: key === 'plan' ? (await Plan.findById(payloads[key])).resultName : payloads[key],
        });
      }
    }
    const response = {}
    const studentData = { ...req.body };
    response.paymentLists = req.body.paymentLists && (
      await _changePaymentList({ 
        studentId, 
        paymentLists: req.body.paymentLists, 
        isUpdate: true 
      })
    )
    if (req.body.paymentStatusHasChange) {
      studentData.payment_status_updated = moment().format('YYYY-MM-DD');
    }
    delete studentData.paymentLists;
    delete studentData.paymentStatusHasChange;
    response.student = await Student.findByIdAndUpdate(req.params.studentId, { 
      ...studentData,
    })
    await createLog({ 
      user: req.user.id,
      time: new Date(),
      type: logTypes.updateStudent,
      updates: logUpdates,
      reference: {
        collectionName: 'students',
        _id: student._id,
      },
    });
    res.send(response);
  }
  catch(err) {
    next(err)
  }
}

exports.updateV2 = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    let student = await Student.findById(studentId);
    const payloads = { ...req.body };
    const logUpdates = [];
    for (const [key, value] of Object.entries(payloads)) {
      if (key === 'payment_date_start' || key === 'joined_date') {
        payloads.payment_date_start = new Date(moment.utc(payloads.payment_date_start).toString());
        payloads.joined_date = new Date(moment.utc(payloads.joined_date).toString());
      }
      if(key !== "payment_date_start" && key !== "paymentLists" && key !== "studentId"){
        if (payloads[key] != student[key].toString()) {
          logUpdates.push({ 
            key,  
            type: 'Updated',
            from: key === 'plan' ? (await Plan.findById(student[key])).resultName : student[key],
            to: key === 'plan' ? (await Plan.findById(payloads[key])).resultName : payloads[key],
          });
        }
      }
    }
    const response = {}
    if (payloads.paymentLists){
      logUpdates.push({ 
        key: "payment_date_start",  
        type: 'Updated',
        from: "N/A",
        to: payloads.payment_date_start,
      });
      
      console.log("logUpdates:", logUpdates)
      response.paymentLists = payloads.paymentLists && (
        await _changePaymentList({ 
          studentId, 
          paymentLists: payloads.paymentLists, 
          isUpdate: true 
        })
      )
    }
    const studentData = { ...req.body };
    if (req.body.paymentStatusHasChange) {
      studentData.payment_status_updated = moment().format('YYYY-MM-DD');
    }
    delete studentData.paymentLists;
    delete studentData.paymentStatusHasChange;
    response.student = await Student.findByIdAndUpdate(req.params.studentId, { 
      ...studentData,
    })
    await createLog({ 
      user: req.user.id,
      time: new Date(),
      type: logTypes.updateStudent,
      updates: logUpdates,
      reference: {
        collectionName: 'students',
        _id: student._id,
      },
    });
    console.log(response)
    res.send(response);
  }
  catch(err) {
    next(err)
  }
}

exports.get = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate('plan')
    res.send(student);
  }
  catch(err) {
    next(err)
  }
} 

// Payment Lists
exports.getPaymentList = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const { studentId } = req.params;
    const match = {
      is_deleted: false, 
      student: new Types.ObjectId(studentId),
    };
    const options = {
      page, 
      limit: 15,
      sort: { due_date: 1 },
    } 

    const paymentList = await PaymentList.paginate(match, options);
    res.send(paymentList);
  }
  catch(err) {
    next(err);
  }
} 


exports.getPaymentLatest = async (req, res, next) => {
  try {
   
    const { studentId } = req.params;
    const match = {
      is_deleted: false, 
      student: new Types.ObjectId(studentId),
    };
    const options = {
      page, 
      limit: 15,
      sort: { due_date: 1 },
    } 

    // const paymentList = await PaymentList.paginate(match, options);
    // res.send(paymentList);

    const payment = await PaymentList.findOne({"student": studentId})
    res.send(payment);
  }
  catch(err) {
    next(err);
  }
}

exports.updatePaymentList = async (req, res, next) => {
  try {
    const { paymentListId, studentId } = req.params
    const logUpdates = [];
    const payloads = { ...req.body };
    delete payloads.amount;
    let paymentList = await PaymentList.findByIdAndUpdate(paymentListId, { ...req.body })
    for (const [key] of Object.entries(payloads)) {
      if (key === 'due_date' || key === 'date_paid') {
        payloads.due_date = new Date(moment.utc(payloads.due_date).toString());
        payloads.date_paid = new Date(moment.utc(payloads.date_paid).toString());
      }
      if (payloads[key].toString() !== paymentList[key].toString()) {
          logUpdates.push({ 
            key,  
            type: 'Updated',
            from: paymentList[key],
            to: payloads[key],
          })
      }
    }
    paymentList = await PaymentList.findById(paymentListId)
    await createLog({ 
      user: req.user.id,
      time: new Date(),
      type: logTypes.updatePaymentList,
      updates: logUpdates,
      reference: {
        collectionName: 'paymentlists',
        _id: paymentList._id,
      },
    });
    res.send(paymentList)
  }
  catch(err) {
    next(err);
  }
} 

exports.addPaymentList = async (req, res, next) => {
  try {
    const { studentId } = req.params
    const {amount, currency, date_paid, due_date, plan, status, student} = req.body
    let paymentList = await PaymentList.create({ 
      amount, 
      currency, 
      date_paid, 
      due_date, 
      plan, 
      status, 
      student
     })
     await createLog({ 
        user: req.user.id,
        time: new Date(),
        type: logTypes.addPaymentList,
        reference: {
          collectionName: 'paymentlists',
          _id: paymentList._id,
        },
      });
    res.send(paymentList)
  }
  catch(err) {
    next(err);
  }
} 

exports.getDeposits = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const deposit = await Deposit.find({ student: studentId })
    res.send(deposit);
  }
  catch(err) {
    next(err)
  }
} 

exports.updateDeposit = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { amount, currency, date, _id: depositId } = req.body;
    const payloads = { currency, date };
    const logUpdates = [];
    let deposit = await Deposit.findByIdAndUpdate(depositId, { amount, currency, date, });
    for (const [key] of Object.entries(payloads)) {
      if (key === 'date') {
        payloads.date = new Date(moment.utc(payloads.date).toString());
      }
      if (payloads[key].toString() !== deposit[key].toString()) {
        logUpdates.push({ 
          key,  
          type: 'Updated',
          from: deposit[key],
          to: payloads[key],
        });
      }
    }
    deposit = await Deposit.findById(depositId)
    await createLog({ 
      user: req.user.id,
      time: new Date(),
      type: logTypes.updateDeposit,
      updates: logUpdates,
      reference: {
        collectionName: 'deposits',
        _id: deposit._id,
      },
    });
    res.send(deposit) 
  }
  catch(err) {
    next(err)
  }
} 

exports.addDeposit = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { amount, date, currency } = req.body;
    let deposit = await Deposit.create({ amount, date, currency, student: studentId })
    await createLog({ 
      user: req.user.id,
      time: new Date(),
      type: logTypes.addDeposit,
      reference: {
        collectionName: 'deposits',
        _id: deposit._id,
      },
    });
    res.send(deposit)
  }
  catch(err) {
    next(err)
  }
} 

exports.deleteDeposit = async (req, res, next) => {
  try {
    const { studentId, depositId } = req.params;
    const deposit = await Deposit.findByIdAndDelete(depositId)
    if (deposit) {
      await createLog({ 
        user: req.user.id,
        time: new Date(),
        type: logTypes.deleteDeposit,
        reference: {
          collectionName: 'deposits',
          _id: depositId,
        },
      });
      res.send({ success: true })
    }
  }
  catch(err) {
    next(err)
  }
} 

exports.allPaymentDues = async (req, res, next) => {
  try {
    let due_date = {};
    if (req.query.dues) {
      const [fromDue, toDue] = req.query.dues.split('~');
      due_date = { 
        $lte: toDue,
        $gte: fromDue,
      };
    } else {
      const now = moment().format();
      const _7DaysAgo = moment().add(-7, 'days');
      due_date = {
        $lte: now,
        $gte: _7DaysAgo,
      };
    }
    const lists = await PaymentList.find({  
      due_date
    })
      .populate('student')
      .populate('plan')
      .sort('due_date');
    res.send(lists)
  }
  catch(err) {
    next(err)
  }
}

exports.totalPaid = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const paymentLists = await PaymentList.find({ 
      student: new Types.ObjectId(studentId),
      status: 'Paid',
    });
    const deposits = await Deposit.find({ student: new Types.ObjectId(studentId) });
    res.send({ paymentLists, deposits });
  }
  catch(err) {
    next(err);
  }
}

exports.deleleStudentPaymentListsAndDeposits = async (req, res, next) => {
  const { studentId } = req.params;
  await Student.findByIdAndDelete(studentId);
  await PaymentList.deleteMany({ student: new Types.ObjectId(studentId) });
  await Deposit.deleteMany({ student: new Types.ObjectId(studentId) });
  res.send({ success: true });
}


// Private
async function _getStudentDetails(studentId) {
  const student = await Student.findById(studentId).populate('plan');
  const paymentLists = await PaymentList.find({  student: new Types.ObjectId(studentId) });
  const deposits = await Deposit.find({  student: new Types.ObjectId(studentId) });
  return {
    student,
    paymentLists,
    deposits,
  }
}

async function _changePaymentAndDeposit({ studentId, deposits = [], paymentLists = [], isUpdate = false }) {
  const depositMap = deposits.map(item => ({ ...item, student: new Types.ObjectId(studentId) }));
  const paymentListMap = paymentLists.map(item => ({ ...item, student: new Types.ObjectId(studentId) }));
  if (isUpdate) {
    await PaymentList.deleteMany({ 
            status: { $ne: 'Paid' }, 
            date_paid: null,
            student: new Types.ObjectId(studentId),
          }); 
  }
  return {
    deposits: await Deposit.insertMany(depositMap),
    paymentLists: await PaymentList.insertMany(paymentListMap)
  }
}

async function _changePaymentList({ studentId, paymentLists = [], isUpdate = false }) {
  const paymentListMap = paymentLists.map(item => ({ ...item, student: new Types.ObjectId(studentId) }));
  if (isUpdate) {
    await PaymentList.deleteMany({ 
            status: { $ne: 'Paid' }, 
            date_paid: null,
            student: new Types.ObjectId(studentId),
          }); 
  }
  return await PaymentList.insertMany(paymentListMap);
}