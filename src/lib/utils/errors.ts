export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409)
  }
}

export function handleError(error: unknown): { message: string; statusCode: number } {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    }
  }

  // Handle Zod validation errors
  if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
    const zodError = error as any
    const firstError = zodError.errors?.[0]
    const message = firstError 
      ? `${firstError.path.join('.')}: ${firstError.message}`
      : 'Validation failed'
    
    console.error('Zod validation error:', zodError.errors)
    
    return {
      message,
      statusCode: 400,
    }
  }

  // Handle Mongoose validation errors
  if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
    const mongooseError = error as any
    const firstError = Object.values(mongooseError.errors || {})[0] as any
    const message = firstError?.message || 'Validation failed'
    
    console.error('Mongoose validation error:', mongooseError.errors)
    
    return {
      message,
      statusCode: 400,
    }
  }

  // Handle Mongoose duplicate key errors
  if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
    const duplicateError = error as any
    const field = Object.keys(duplicateError.keyPattern || {})[0]
    const message = field ? `${field} already exists` : 'Duplicate entry'
    
    console.error('Duplicate key error:', duplicateError)
    
    return {
      message,
      statusCode: 409,
    }
  }

  // Log unexpected errors but don't expose details
  console.error('Unexpected error:', error)

  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
  }
}
