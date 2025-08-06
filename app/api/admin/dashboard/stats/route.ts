import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface DashboardStats {
  totalSubscribers: number;
  activeSubscribers: number;
  recentSubscribers: number;
  totalCampaigns: number;
  recentEmails: number;
  successfulEmails: number;
  failedEmails: number;
  growthPercentage: number;
  subscribersByCategory: Array<{
    id: string;
    name: string;
    color: string;
    description: string;
    _count: {
      subscribers: number;
    };
  }>;
}



export async function GET() {
  try {
    // Get total subscribers count
    const totalSubscribers = await prisma.subscriber.count();
    
    // Get active subscribers count
    const activeSubscribers = await prisma.subscriber.count({
      where: { status: "ACTIVE" }
    });

    // Get subscribers by category
    const subscribersByCategory = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            subscribers: {
              where: { status: "ACTIVE" }
            }
          }
        }
      }
    });

    // Get recent subscribers (last 7 days)
    const recentSubscribers = await prisma.subscriber.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Get total email campaigns
    const totalCampaigns = await prisma.emailCampaign.count();

    // Get recent email logs (last 24 hours)
    const recentEmails = await prisma.emailLog.count({
      where: {
        sentAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    // Get successful emails in last 24 hours
    const successfulEmails = await prisma.emailLog.count({
      where: {
        status: "SENT",
        sentAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    // Get failed emails in last 24 hours
    const failedEmails = await prisma.emailLog.count({
      where: {
        status: "FAILED",
        sentAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    // Get recent activity (last 10 subscribers)
    const recentActivity = await prisma.subscriber.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true
      }
    });

    // Calculate growth percentage (comparing last 7 days to previous 7 days)
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    
    const lastWeekSubscribers = await prisma.subscriber.count({
      where: {
        createdAt: { gte: lastWeek }
      }
    });

    const previousWeekSubscribers = await prisma.subscriber.count({
      where: {
        createdAt: {
          gte: twoWeeksAgo,
          lt: lastWeek
        }
      }
    });

    const growthPercentage = previousWeekSubscribers > 0 
      ? Math.round(((lastWeekSubscribers - previousWeekSubscribers) / previousWeekSubscribers) * 100)
      : lastWeekSubscribers > 0 ? 100 : 0;

    const stats: DashboardStats = {
      totalSubscribers,
      activeSubscribers,
      recentSubscribers,
      totalCampaigns,
      recentEmails,
      successfulEmails,
      failedEmails,
      growthPercentage,
      subscribersByCategory
    };

    return NextResponse.json({
      success: true,
      stats,
      recentActivity
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard stats',
        details: errorMessage
      },
      { status: 500 }
    );
  }
} 