import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/leave/[id] - Get single leave request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: {
        id: parseInt(id),
      },
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
        attendanceImpacts: true,
      },
    })

    if (!leaveRequest) {
      return NextResponse.json(
        {
          success: false,
          error: 'Leave request not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: leaveRequest,
    })
  } catch (error: any) {
    console.error('Error fetching leave request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch leave request',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

// PATCH /api/leave/[id] - Update leave request (approve/deny)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    const { status, reviewedBy, adminComments } = body

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Status is required',
        },
        { status: 400 }
      )
    }

    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id: parseInt(id) },
      data: {
        status,
        reviewedBy: reviewedBy ? parseInt(reviewedBy) : null,
        reviewedAt: new Date(),
        adminComments,
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

    // If approved, create/update attendance records
    if (status === 'APPROVED') {
      const startDate = new Date(updatedLeaveRequest.startDate)
      const endDate = new Date(updatedLeaveRequest.endDate)
      const attendanceStatus =
        updatedLeaveRequest.leaveType === 'WORK_FROM_HOME'
          ? 'WFH_APPROVED'
          : 'LEAVE_APPROVED'

      const dates = []
      const currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        dates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }

      await Promise.all(
        dates.map(async (date) => {
          await prisma.attendanceRecord.upsert({
            where: {
              employee_date_attendance: {
                employeeId: updatedLeaveRequest.employeeId,
                date,
              },
            },
            update: {
              status: attendanceStatus,
              leaveRequestId: updatedLeaveRequest.id,
            },
            create: {
              employeeId: updatedLeaveRequest.employeeId,
              date,
              status: attendanceStatus,
              leaveRequestId: updatedLeaveRequest.id,
              importSource: 'leave_approval',
            },
          })
        })
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedLeaveRequest,
      message: `Leave request ${status.toLowerCase()} successfully`,
    })
  } catch (error: any) {
    console.error('Error updating leave request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update leave request',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

// DELETE /api/leave/[id] - Cancel leave request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: parseInt(id) },
    })

    if (!leaveRequest) {
      return NextResponse.json(
        {
          success: false,
          error: 'Leave request not found',
        },
        { status: 404 }
      )
    }

    // Only allow cancellation of pending requests
    if (leaveRequest.status !== 'PENDING') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only pending leave requests can be cancelled',
        },
        { status: 400 }
      )
    }

    await prisma.leaveRequest.update({
      where: { id: parseInt(id) },
      data: {
        status: 'CANCELLED',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Leave request cancelled successfully',
    })
  } catch (error: any) {
    console.error('Error cancelling leave request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cancel leave request',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
