import mongoose, { Schema, Document, Model } from 'mongoose';
import { ILead, LeadStatus, LeadSource } from '../types';

export interface ILeadDocument extends Omit<ILead, '_id'>, Document {}

const LeadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'] as LeadSource[],
      required: [true, 'Source is required'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

LeadSchema.index({ name: 'text', email: 'text' });
LeadSchema.index({ status: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ createdBy: 1 });

const Lead: Model<ILeadDocument> = mongoose.model<ILeadDocument>('Lead', LeadSchema);

export default Lead;
