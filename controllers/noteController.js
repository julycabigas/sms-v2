const { Types } = require('mongoose');
const Note = require('../models/Notes');

exports.index = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const match = { student: new Types.ObjectId(studentId) };
    const options = { 
      populate: ['creator', 'student'], 
      page: req.query.page || 1, 
      limit: 20,
    };
    const note = await Note.paginate(match, options);
    res.send(note);
  }
  catch(err) {
    next(err);
  }
}

exports.store = async (req, res, next) => {
  try {
    const { note } = req.body;
    const newNote = await Note.create({ 
      student: req.params.studentId,
      creator: req.user.id, 
      note,  
    });
    res.send({ note: newNote, success: true });
  }
  catch(err) {
    next(err);
  }
}