import mongoose, { Schema, Model } from 'mongoose'
import { IAppointment, AppointmentStatus } from '@/types'

const appointmentSchema = new Schema<IAppointment>(
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
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.SCHEDULED,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    // Denormalized patient data for historical accuracy
    patientSnapshot: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'appointments',
  }
)

// Compound index for querying appointments by provider and date range
appointmentSchema.index({ providerId: 1, startTime: 1 })

// Compound index for querying appointments by patient
appointmentSchema.index({ patientId: 1, startTime: -1 })

// Index for querying by status and date
appointmentSchema.index({ status: 1, startTime: 1 })

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>('Appointment', appointmentSchema)

export default Appointment
