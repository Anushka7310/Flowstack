import mongoose, { Schema, Model } from 'mongoose'
import { IProvider, UserRole, ProviderSpecialty } from '@/types'

const availabilitySchema = new Schema(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
)

const providerSchema = new Schema<IProvider>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: [UserRole.PROVIDER],
      default: UserRole.PROVIDER,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    specialty: {
      type: String,
      enum: Object.values(ProviderSpecialty),
      required: true,
      index: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    availability: {
      type: [availabilitySchema],
      default: [],
    },
    maxDailyAppointments: {
      type: Number,
      default: 8,
      min: 1,
      max: 20,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'providers',
  }
)

// Index for querying active providers by specialty
providerSchema.index({ specialty: 1, isActive: 1 })

const Provider: Model<IProvider> =
  mongoose.models.Provider || mongoose.model<IProvider>('Provider', providerSchema)

export default Provider
