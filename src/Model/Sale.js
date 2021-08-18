'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const { Schema } = require('mongoose');s

const saleSchema = new mongoose.Schema(
  {
    location: {
        type: String,
        default: '', 
        required: [true, 'Sale must have location']
    },
    customerName: {
        type: String,
        default: '', 
        required: [true, 'Sale must have customerName'],
    },
    
    amountPaid: {
        type: Number,
        default: 0, 
        required: [true, 'Sale must have amountPaid'],
    },
    volumeDispensed: {
        type: Number,
        default: 0,
        required: [true, 'Sale must have volumeDispensed']
    }
  },
  { strictQuery: true, timestamps: true },
);

module.exports.Sale = mongoose.model('Sale', saleSchema);
