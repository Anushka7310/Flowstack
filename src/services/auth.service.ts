import { hashPassword, comparePassword } from '@/lib/auth/password'
import { signToken } from '@/lib/auth/jwt'
import { PatientRepository } from '@/repositories/patient.repository'
import { ProviderRepository } from '@/repositories/provider.repository'
import { UnauthorizedError, ConflictError } from '@/lib/utils/errors'
import { UserRole, JWTPayload, type IPatient, type IProvider } from '@/types'
import type { RegisterPatientInput, RegisterProviderInput, LoginInput } from '@/validators/auth.validator'

export class AuthService {
  private patientRepo: PatientRepository
  private providerRepo: ProviderRepository

  constructor() {
    this.patientRepo = new PatientRepository()
    this.providerRepo = new ProviderRepository()
  }

  async registerPatient(input: RegisterPatientInput): Promise<{ token: string; userId: string; role: UserRole }> {
    // Check if email already exists
    const existingPatient = await this.patientRepo.findByEmail(input.email)
    if (existingPatient) {
      throw new ConflictError('Email already registered')
    }

    // Hash password
    const hashedPassword = await hashPassword(input.password)

    // Create patient
    const patient = await this.patientRepo.create({
      ...input,
      password: hashedPassword,
      role: UserRole.PATIENT,
      dateOfBirth: new Date(input.dateOfBirth),
    })

    // Generate JWT
    const payload: JWTPayload = {
      userId: patient._id.toString(),
      email: patient.email,
      role: UserRole.PATIENT,
    }
    const token = await signToken(payload)

    return {
      token,
      userId: patient._id.toString(),
      role: UserRole.PATIENT,
    }
  }

  async registerProvider(input: RegisterProviderInput): Promise<{ token: string; userId: string; role: UserRole }> {
    // Check if email already exists
    const existingProvider = await this.providerRepo.findByEmail(input.email)
    if (existingProvider) {
      throw new ConflictError('Email already registered')
    }

    // Check if license number already exists
    const existingLicense = await this.providerRepo.findByLicenseNumber(input.licenseNumber)
    if (existingLicense) {
      throw new ConflictError('License number already registered')
    }

    // Hash password
    const hashedPassword = await hashPassword(input.password)

    // Create provider
    const provider = await this.providerRepo.create({
      ...input,
      password: hashedPassword,
      role: UserRole.PROVIDER,
    })

    // Generate JWT
    const payload: JWTPayload = {
      userId: provider._id.toString(),
      email: provider.email,
      role: UserRole.PROVIDER,
    }
    const token = await signToken(payload)

    return {
      token,
      userId: provider._id.toString(),
      role: UserRole.PROVIDER,
    }
  }

  async login(input: LoginInput): Promise<{ token: string; userId: string; role: UserRole }> {
    // Try to find user as patient first
    let user: IPatient | IProvider | null = await this.patientRepo.findByEmail(input.email)
    let role = UserRole.PATIENT

    // If not found, try provider
    if (!user) {
      user = await this.providerRepo.findByEmail(input.email)
      role = UserRole.PROVIDER
    }

    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated')
    }

    // Verify password
    const isPasswordValid = await comparePassword(input.password, user.password as string)
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Generate JWT
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role,
    }
    const token = await signToken(payload)

    return {
      token,
      userId: user._id.toString(),
      role,
    }
  }
}
