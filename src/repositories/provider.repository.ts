import { Types } from 'mongoose'
import Provider from '@/models/Provider'
import { IProvider, ProviderSpecialty } from '@/types'

export class ProviderRepository {
  async create(data: Partial<IProvider>): Promise<IProvider> {
    const provider = new Provider(data)
    return provider.save()
  }

  async findById(id: string): Promise<IProvider | null> {
    return Provider.findOne({
      _id: id,
      deletedAt: null,
    }).lean()
  }

  async findByEmail(email: string): Promise<IProvider | null> {
    return Provider.findOne({
      email: email.toLowerCase(),
      deletedAt: null,
    })
      .select('+password')
      .lean()
  }

  async findByLicenseNumber(licenseNumber: string): Promise<IProvider | null> {
    return Provider.findOne({
      licenseNumber,
      deletedAt: null,
    }).lean()
  }

  async findAll(options: { skip: number; limit: number }): Promise<IProvider[]> {
    return Provider.find({
      deletedAt: null,
      isActive: true,
    })
      .sort({ lastName: 1, firstName: 1 })
      .skip(options.skip)
      .limit(options.limit)
      .lean()
  }

  async findBySpecialty(
    specialty: ProviderSpecialty,
    options: { skip: number; limit: number }
  ): Promise<IProvider[]> {
    return Provider.find({
      specialty,
      isActive: true,
      deletedAt: null,
    })
      .sort({ lastName: 1, firstName: 1 })
      .skip(options.skip)
      .limit(options.limit)
      .lean()
  }

  async update(id: string, data: Partial<IProvider>): Promise<IProvider | null> {
    return Provider.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: data },
      { new: true }
    ).lean()
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await Provider.updateOne(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: new Date(), isActive: false } }
    )
    return result.modifiedCount > 0
  }

  async count(): Promise<number> {
    return Provider.countDocuments({
      deletedAt: null,
      isActive: true,
    })
  }
}
