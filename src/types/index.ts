import { Types } from 'mongoose'

export enum UserRole {
  ADMIN = 'admin',
  PROVIDER = 'provider',
  PATIENT = 'patient',
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum ProviderSpecialty {
  GENERAL_PRACTICE = 'general_practice',
  CARDIOLOGY = 'cardiology',
  DERMATOLOGY = 'dermatology',
  PEDIATRICS = 'pediatrics',
  ORTHOPEDICS = 'orthopedics',
  PSYCHIATRY = 'psychiatry',
}

export interface IUser {
  _id: Types.ObjectId
  email: string
  password: string
  role: UserRole
  firstName: string
  lastName: string
  phone: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface IProvider extends IUser {
  specialty: ProviderSpecialty
  licenseNumber: string
  availability: IAvailability[]
  maxDailyAppointments: number
}

export interface IPatient extends IUser {
  dateOfBirth: Date
  address: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  insuranceInfo?: {
    provider: string
    policyNumber: string
  }
}

export interface IAvailability {
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  isActive: boolean
}

export interface IAppointment {
  _id: Types.ObjectId
  patientId: Types.ObjectId
  providerId: Types.ObjectId
  startTime: Date
  endTime: Date
  status: AppointmentStatus
  reason: string
  notes?: string
  // Denormalized patient data for historical accuracy
  patientSnapshot: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface IMedicalRecord {
  _id: Types.ObjectId
  patientId: Types.ObjectId
  providerId: Types.ObjectId
  appointmentId: Types.ObjectId
  diagnosis: string
  treatment: string
  prescription?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// JWT Payload
export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}
