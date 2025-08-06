import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData = await request.json();

    const subscriber = await prisma.subscriber.findUnique({
      where: { id }
    });
    
    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    // Update subscriber data
    const updatedSubscriber = await prisma.subscriber.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Subscriber updated successfully",
      subscriber: updatedSubscriber
    });

  } catch (error) {
    console.error("Error updating subscriber:", error);
    return NextResponse.json(
      { error: "Failed to update subscriber" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const subscriber = await prisma.subscriber.findUnique({
      where: { id }
    });
    
    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    await prisma.subscriber.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Subscriber deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
} 