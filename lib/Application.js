import mongoose from 'mongoose'

const ApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, trim: true, maxlength: 120 },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    appliedDate: { type: Date, default: Date.now },
    link: { type: String, trim: true, maxlength: 500 },
    notes: { type: String, trim: true, maxlength: 2000 },
    salary: { type: String, trim: true, maxlength: 120 },
  },
  { timestamps: true }
)

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema)
