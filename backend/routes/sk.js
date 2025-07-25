const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Auth middleware
const authorize = require('../middleware/authorize'); // Authorization middleware
const SK = require('../models/SK');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// @route   POST /api/sk
// @desc    Create a new SK (draft)
// @access  Private (user and admin)
router.post('/', auth, async (req, res) => {
  try {
    const { pembukaan, isi, penutup, tandaTangan, tanggalRealisasi } = req.body;

    const newSK = new SK({
      pembukaan,
      isi,
      penutup,
      tandaTangan,
      tanggalRealisasi,
      createdBy: req.user.id,
      status: 'draft'
    });

    const sk = await newSK.save();
    res.json(sk);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/sk
// @desc    Get all SKs (for admin) or SKs created by user (for user)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let sks;
    const { status, search } = req.query;
    const query = {};

    if (req.user.role !== 'admin') {
      query.createdBy = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { pembukaan: { $regex: search, $options: 'i' } },
        { isi: { $regex: search, $options: 'i' } },
        { penutup: { $regex: search, $options: 'i' } },
        { 'tandaTangan': { $regex: search, $options: 'i' } }
      ];
    }

    sks = await SK.find(query).populate('createdBy', 'username');
    
    res.json(sks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET /api/sk/:id
// @desc    Get SK by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const sk = await SK.findById(req.params.id);

    if (!sk) {
      return res.status(404).json({ msg: 'SK not found' });
    }

    // Ensure user owns SK or is admin
    if (sk.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(sk);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'SK not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/sk/generate-pdf/:id
// @desc    Generate PDF for an SK
// @access  Private
router.get('/generate-pdf/:id', auth, async (req, res) => {
  try {
    const sk = await SK.findById(req.params.id).populate('createdBy', 'username');

    if (!sk) {
      return res.status(404).json({ msg: 'SK not found' });
    }

    // Ensure user owns SK or is admin
    if (sk.createdBy._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Surat Keputusan Direksi</title>
          <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .section-title { font-weight: bold; margin-bottom: 10px; }
              .signer-list { margin-top: 20px; }
              .signer-item { margin-bottom: 10px; }
          </style>
      </head>
      <body>
          <h1>SURAT KEPUTUSAN DIREKSI</h1>
          <div class="section">
              <div class="section-title">Pembukaan:</div>
              <p>${sk.pembukaan}</p>
          </div>
          <div class="section">
              <div class="section-title">Isi:</div>
              <p>${sk.isi}</p>
          </div>
          <div class="section">
              <div class="section-title">Penutup:</div>
              <p>${sk.penutup}</p>
          </div>
          <div class="section">
              <div class="section-title">Tanggal Realisasi:</div>
              <p>${new Date(sk.tanggalRealisasi).toLocaleDateString('id-ID')}</p>
          </div>
          <div class="section signer-list">
              <div class="section-title">Tanda Tangan:</div>
              ${sk.tandaTangan.map(signer => `<p class="signer-item">${signer}</p>`).join('')}
          </div>
          <p>Dibuat oleh: ${sk.createdBy.username}</p>
          <p>Pada: ${new Date(sk.createdAt).toLocaleDateString('id-ID')}</p>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=SK_${sk._id}.pdf`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT /api/sk/archive/:id
// @desc    Archive an SK (update status to 'archived')
// @access  Private (admin only)
router.put('/archive/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const sk = await SK.findById(req.params.id);

    if (!sk) {
      return res.status(404).json({ msg: 'SK not found' });
    }

    // Ensure only admin can archive
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized to archive SK' });
    }

    sk.status = 'archived';
    await sk.save();

    res.json({ msg: 'SK archived successfully', sk });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;