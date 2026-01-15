import '../setup'
import { AuthService } from '@/services/auth.service'
import { PatientRepository } from '@/repositories/patient.repository'
import { ProviderRepository } from '@/repositories/provider.repository'
import { ConflictError, UnauthorizedError } from '@/lib/utils/errors'
import { UserRole, ProviderSpecialty } from '@/types'
import type { RegisterPatientInput, RegisterProviderInput, LoginInput } from '@/validators/auth.validator'

describe('AuthService', () => {
  let authService: AuthService
  let patientRepo: PatientRepository
  let providerRepo: ProviderRepository

  beforeEach(() => {
    authService = new AuthService()
    patientRepo = new PatientRepository()
    providerRepo = new ProviderRepository()
  })

  describe('registerPatient', () => {
    const validPatientInput: RegisterPatientInput = {
      email: 'patient@test.com',
      password: 'Password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
      address: '123 Main St, City, State',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+1234567891',
        relationship: 'Spouse',
      },
    }

    it('should register a new patient successfully', async () => {
      const result = await authService.registerPatient(validPatientInput)

      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('userId')
      expect(typeof result.token).toBe('string')
      expect(typeof result.userId).toBe('string')

      // Verify patient was created
      const patient = await patientRepo.findByEmail(validPatientInput.email)
      expect(patient).toBeTruthy()
      expect(patient?.email).toBe(validPatientInput.email)
      expect(patient?.role).toBe(UserRole.PATIENT)
    })

    it('should hash the password', async () => {
      await authService.registerPatient(validPatientInput)

      const patient = await patientRepo.findByEmail(validPatientInput.email)
      expect(patient?.password).not.toBe(validPatientInput.password)
      expect(patient?.password.length).toBeGreaterThan(20)
    })

    it('should throw ConflictError if email already exists', async () => {
      await authService.registerPatient(validPatientInput)

      await expect(authService.registerPatient(validPatientInput)).rejects.toThrow(
        ConflictError
      )
      await expect(authService.registerPatient(validPatientInput)).rejects.toThrow(
        'Email already registered'
      )
    })
  })

  describe('registerProvider', () => {
    const validProviderInput: RegisterProviderInput = {
      email: 'provider@test.com',
      password: 'Password123',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      phone: '+1234567890',
      specialty: ProviderSpecialty.CARDIOLOGY,
      licenseNumber: 'LIC123456',
      maxDailyAppointments: 8,
    }

    it('should register a new provider successfully', async () => {
      const result = await authService.registerProvider(validProviderInput)

      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('userId')

      const provider = await providerRepo.findByEmail(validProviderInput.email)
      expect(provider).toBeTruthy()
      expect(provider?.role).toBe(UserRole.PROVIDER)
      expect(provider?.specialty).toBe(ProviderSpecialty.CARDIOLOGY)
    })

    it('should throw ConflictError if email already exists', async () => {
      await authService.registerProvider(validProviderInput)

      await expect(authService.registerProvider(validProviderInput)).rejects.toThrow(
        ConflictError
      )
    })

    it('should throw ConflictError if license number already exists', async () => {
      await authService.registerProvider(validProviderInput)

      const duplicateLicense: RegisterProviderInput = {
        ...validProviderInput,
        email: 'different@test.com',
      }

      await expect(authService.registerProvider(duplicateLicense)).rejects.toThrow(
        'License number already registered'
      )
    })
  })

  describe('login', () => {
    const patientInput: RegisterPatientInput = {
      email: 'patient@test.com',
      password: 'Password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
      address: '123 Main St',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+1234567891',
        relationship: 'Spouse',
      },
    }

    const providerInput: RegisterProviderInput = {
      email: 'provider@test.com',
      password: 'Password123',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      phone: '+1234567890',
      specialty: ProviderSpecialty.CARDIOLOGY,
      licenseNumber: 'LIC123456',
      maxDailyAppointments: 8,
    }

    it('should login patient with valid credentials', async () => {
      await authService.registerPatient(patientInput)

      const loginInput: LoginInput = {
        email: patientInput.email,
        password: patientInput.password,
      }

      const result = await authService.login(loginInput)

      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('userId')
      expect(result.role).toBe(UserRole.PATIENT)
    })

    it('should login provider with valid credentials', async () => {
      await authService.registerProvider(providerInput)

      const loginInput: LoginInput = {
        email: providerInput.email,
        password: providerInput.password,
      }

      const result = await authService.login(loginInput)

      expect(result).toHaveProperty('token')
      expect(result.role).toBe(UserRole.PROVIDER)
    })

    it('should throw UnauthorizedError with invalid email', async () => {
      const loginInput: LoginInput = {
        email: 'nonexistent@test.com',
        password: 'Password123',
      }

      await expect(authService.login(loginInput)).rejects.toThrow(UnauthorizedError)
      await expect(authService.login(loginInput)).rejects.toThrow(
        'Invalid email or password'
      )
    })

    it('should throw UnauthorizedError with invalid password', async () => {
      await authService.registerPatient(patientInput)

      const loginInput: LoginInput = {
        email: patientInput.email,
        password: 'WrongPassword123',
      }

      await expect(authService.login(loginInput)).rejects.toThrow(UnauthorizedError)
    })

    it('should throw UnauthorizedError for inactive account', async () => {
      const { userId } = await authService.registerPatient(patientInput)

      // Deactivate account
      await patientRepo.update(userId, { isActive: false })

      const loginInput: LoginInput = {
        email: patientInput.email,
        password: patientInput.password,
      }

      await expect(authService.login(loginInput)).rejects.toThrow(
        'Account is deactivated'
      )
    })
  })
})
