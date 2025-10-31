import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/notifications - Get notifications
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const employeeId = searchParams.get('employeeId')
    const isRead = searchParams.get('isRead')
    const type = searchParams.get('type')
    const limit = searchParams.get('limit')

    const where: any = {}

    if (employeeId) {
      where.employeeId = parseInt(employeeId)
    }

    if (isRead !== null) {
      where.isRead = isRead === 'true'
    }

    if (type) {
      where.type = type
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeCode: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({
      success: true,
      data: notifications,
      count: notifications.length,
    })
  } catch (error: any) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch notifications',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employeeId,
      type,
      title,
      message,
      priority = 'NORMAL',
      relatedId,
      relatedType,
    } = body

    if (!employeeId || !type || !title || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Employee ID, type, title, and message are required',
        },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        employeeId: parseInt(employeeId),
        type,
        title,
        message,
        priority,
        relatedId: relatedId ? parseInt(relatedId) : null,
        relatedType,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeCode: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: notification,
        message: 'Notification created successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create notification',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, isRead = true } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'IDs array is required',
        },
        { status: 400 }
      )
    }

    await prisma.notification.updateMany({
      where: {
        id: {
          in: ids.map((id: string) => parseInt(id)),
        },
      },
      data: {
        isRead,
        readAt: isRead ? new Date() : null,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Updated ${ids.length} notifications successfully`,
    })
  } catch (error: any) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update notifications',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
