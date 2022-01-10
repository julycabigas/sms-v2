const { Types } = require('mongoose');
const Note = require('../models/Notes');

exports.index = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const match = { student: new Types.ObjectId(studentId) };
    const options = { 
      populate: ['creator'], 
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
    let newNote = await Note.create({ 
      student: req.params.studentId,
      creator: req.user.id, 
      note,  
    });
    newNote = await Note.findById(newNote._id).populate('creator');
    res.send({ note: newNote, success: true });
  }
  catch(err) {
    next(err);
  }
}

exports.update = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    let note = await Note.findByIdAndUpdate(noteId, { ...req.body });
    note = await Note.findById(noteId);
    res.send({ note, success: true });
  }
  catch(err) {
    next(err);
  }
}

exports.deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    await Note.findByIdAndDelete(noteId);
    res.send({ success: true });
  }
  catch(err) {
    next(err);
  }
}