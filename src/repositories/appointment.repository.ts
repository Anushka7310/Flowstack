import { Types } from 'mongoose'
import Appointment from '@/models/Appointment'
import { IAppointment, AppointmentStatus } from '@/types'

export class AppointmentRepository {
  async create(data: Partial<IAppointment>): Promise<IAppointment> {
    const appointment = new Appointment(data)
    return appointment.save()
  }

  async findById(id: string): Promise<any> {
    return Appointment.findOne({
      _id: id,
      deletedAt: null,
    })
      .populate('patientId', 'firstName lastName email phone')
      .populate('providerId', 'firstName lastName specialty')
      .lean()
  }

  async findByIdWithReferences(id: string): Promise<any> {
    return Appointment.findOne({
      _id: id,
      deletedAt: null,
    })
      .populate('patientId', 'firstName lastName email phone')
      .populate('providerId', 'firstName lastName specialty')
      .lean()
  }

  async findByPatient(
    patientId: string,
    options: { skip: number; limit: number }
  ): Promise<any[]> {
    return Appointment.find({
      patientId: new Types.ObjectId(patientId),
      deletedAt: null,
    })
      .sort({ startTime: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .populate('providerId', 'firstName lastName specialty')
      .lean()
  }

  async findByProvider(
    providerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    return Appointment.find({
      providerId: new Types.ObjectId(providerId),
      startTime: { $gte: startDate, $lte: endDate },
      deletedAt: null,
    })
      .sort({ startTime: 1 })
      .populate('patientId', 'firstName lastName email phone')
      .lean()
  }

  async findConflictingAppointments(
    providerId: string,
    startTime: Date,
    endTime: Date,
    excludeId?: string
  ): Promise<IAppointment[]> {
    const query: any = {
      providerId: new Types.ObjectId(providerId),
      deletedAt: null,
      status: { $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] },
      $or: [
        { startTime: { $gte: startTime, $lt: endTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
      ],
    }

    if (excludeId) {
      query._id = { $ne: new Types.ObjectId(excludeId) }
    }

    return Appointment.find(query).lean()
  }

  async countByProviderAndDate(providerId: string, date: Date): Promise<number> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return Appointment.countDocuments({
      providerId: new Types.ObjectId(providerId),
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] },
      deletedAt: null,
    })
  }

  async update(id: string, data: Partial<IAppointment>): Promise<any> {
    return Appointment.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: data },
      { new: true }
    )
      .populate('patientId', 'firstName lastName email phone')
      .populate('providerId', 'firstName lastName specialty')
      .lean()
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await Appointment.updateOne(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: new Date() } }
    )
    return result.modifiedCount > 0
  }

  async countByPatient(patientId: string): Promise<number> {
    return Appointment.countDocuments({
      patientId: new Types.ObjectId(patientId),
      deletedAt: null,
    })
  }
}
