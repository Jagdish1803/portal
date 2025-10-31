import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/leave - Get leave requests with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const employeeId = searchParams.get('employeeId')
    const status = searchParams.get('status')
    const leaveType = searchParams.get('leaveType')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}

    if (employeeId) {
      where.employeeId = parseInt(employeeId)
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (leaveType) {
      where.leaveType = leaveType
    }

    if (startDate && endDate) {
      where.startDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeCode: true,
            email: true,
            department: true,
            designation: true,
          },
        },
      },
      orderBy: {
        requestedAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: leaveRequests,
      count: leaveRequests.length,
    })
  } catch (error: any) {
    console.error('Error fetching leave requests:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch leave requests',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

// POST /api/leave - Create new leave request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      isUrgent = false,
    } = body

    // Validate required fields
    if (!employeeId || !leaveType || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Employee ID, leave type, start date, and end date are required',
        },
        { status: 400 }
      )
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      return NextResponse.json(
        {
          success: false,
          error: 'Start date cannot be after end date',
        },
        { status: 400 }
      )
    }

    // Check for overlapping leave requests
    const overlapping = await prisma.leaveRequest.findFirst({
      where: {
        employeeId: parseInt(employeeId),
        status: {
          in: ['PENDING', 'APPROVED'],
        },
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gte: start } },
            ],
          },
          {
            AND: [
              { startDate: { lte: end } },
              { endDate: { gte: end } },
            ],
          },
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } },
            ],
          },
        ],
      },
    })

    if (overlapping) {
      return NextResponse.json(
        {
          success: false,
          error: 'Leave request overlaps with an existing request',
        },
        { status: 400 }
      )
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId: parseInt(employeeId),
        leaveType,
        startDate: start,
        endDate: end,
        reason,
        isUrgent,
        status: 'PENDING',
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeCode: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: leaveRequest,
        message: 'Leave request submitted successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating leave request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create leave request',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
