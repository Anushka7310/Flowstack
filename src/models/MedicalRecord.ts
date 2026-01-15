import mongoose, { Schema, Model } from 'mongoose'
import { IMedicalRecord } from '@/types'

const medicalRecordSchema = new Schema<IMedicalRecord>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
      index: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      index: true,
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },
    treatment: {
      type: String,
      required: true,
      trim: true,
    },
    prescription: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'medical_records',
  }
)

// Compound index for querying records by patient
medicalRecordSchema.index({ patientId: 1, createdAt: -1 })

const MedicalRecord: Model<IMedicalRecord> =
  mongoose.models.MedicalRecord ||
  mongoose.model<IMedicalRecord>('MedicalRecord', medicalRecordSchema)

export default MedicalRecord
