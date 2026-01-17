import Patient from '@/models/Patient'
import { IPatient } from '@/types'

export class PatientRepository {
  async create(data: Partial<IPatient>): Promise<IPatient> {
    const patient = new Patient(data)
    return patient.save()
  }

  async findById(id: string): Promise<IPatient | null> {
    return Patient.findOne({
      _id: id,
      deletedAt: null,
    }).lean()
  }

  async findByEmail(email: string): Promise<IPatient | null> {
    return Patient.findOne({
      email: email.toLowerCase(),
      deletedAt: null,
    })
      .select('+password')
      .lean()
  }

  async findAll(options: { skip: number; limit: number }): Promise<IPatient[]> {
    return Patient.find({
      deletedAt: null,
      isActive: true,
    })
      .sort({ lastName: 1, firstName: 1 })
      .skip(options.skip)
      .limit(options.limit)
      .lean()
  }

  async update(id: string, data: Partial<IPatient>): Promise<IPatient | null> {
    return Patient.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: data },
      { new: true }
    ).lean()
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await Patient.updateOne(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: new Date(), isActive: false } }
    )
    return result.modifiedCount > 0
  }

  async count(): Promise<number> {
    return Patient.countDocuments({
      deletedAt: null,
      isActive: true,
    })
  }
}
