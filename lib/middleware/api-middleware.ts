import { NextRequest, NextResponse } from 'next/server'

export interface APIError {
  message: string
  code?: string
  status: number
}

export class APIException extends Error {
  public status: number
  public code?: string

  constructor(message: string, status: number = 500, code?: string) {
    super(message)
    this.status = status
    this.code = code
    this.name = 'APIException'
  }
}

export function withErrorHandling(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context)
    } catch (error) {
      console.error('API Error:', error)

      if (error instanceof APIException) {
        return NextResponse.json(
          { 
            error: error.message,
            code: error.code 
          },
          { status: error.status }
        )
      }

      // Handle Supabase errors
      if (error && typeof error === 'object' && 'code' in error) {
        const supabaseError = error as any
        
        switch (supabaseError.code) {
          case '23505': // Unique constraint violation
            return NextResponse.json(
              { error: 'Resource already exists' },
              { status: 409 }
            )
          case '23503': // Foreign key constraint violation
            return NextResponse.json(
              { error: 'Referenced resource not found' },
              { status: 400 }
            )
          case 'PGRST116': // No rows found
            return NextResponse.json(
              { error: 'Resource not found' },
              { status: 404 }
            )
          default:
            return NextResponse.json(
              { error: 'Database error occurred' },
              { status: 500 }
            )
        }
      }

      // Generic error
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null || data[field] === ''
  )

  if (missingFields.length > 0) {
    throw new APIException(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      'MISSING_FIELDS'
    )
  }
}

export function validatePositiveNumber(
  value: any,
  fieldName: string
): void {
  if (typeof value !== 'number' || value < 0) {
    throw new APIException(
      `${fieldName} must be a positive number`,
      400,
      'INVALID_NUMBER'
    )
  }
}

export function validateUUID(
  value: string,
  fieldName: string
): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  
  if (!uuidRegex.test(value)) {
    throw new APIException(
      `${fieldName} must be a valid UUID`,
      400,
      'INVALID_UUID'
    )
  }
}

export function validateEmail(
  value: string,
  fieldName: string
): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(value)) {
    throw new APIException(
      `${fieldName} must be a valid email address`,
      400,
      'INVALID_EMAIL'
    )
  }
}

export function parsePaginationParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const limit = Math.min(
    parseInt(searchParams.get('limit') || '50'),
    100 // Maximum limit
  )
  
  const offset = Math.max(
    parseInt(searchParams.get('offset') || '0'),
    0 // Minimum offset
  )
  
  return { limit, offset }
}

export function parseDateRange(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')
  
  // Validate date format if provided
  if (startDate && !isValidDate(startDate)) {
    throw new APIException(
      'start_date must be in YYYY-MM-DD format',
      400,
      'INVALID_DATE'
    )
  }
  
  if (endDate && !isValidDate(endDate)) {
    throw new APIException(
      'end_date must be in YYYY-MM-DD format',
      400,
      'INVALID_DATE'
    )
  }
  
  return { startDate, endDate }
}

function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateString)) return false
  
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

export function createSuccessResponse(
  data: any,
  status: number = 200
): NextResponse {
  return NextResponse.json(data, { status })
}

export function createErrorResponse(
  message: string,
  status: number = 400,
  code?: string
): NextResponse {
  return NextResponse.json(
    { error: message, code },
    { status }
  )
}