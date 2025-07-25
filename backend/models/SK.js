const mongoose = require('mongoose');

const SKSchema = new mongoose.Schema({
  pembukaan: {
    type: String,
    required: true
  },
  isi: {
    type: String,
    required: true
  },
  penutup: {
    type: String,
    required: true
  },
  tandaTangan: [
    {
      type: String
    }
  ],
  tanggalRealisasi: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['draft', 'final', 'archived'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SK', SKSchema);