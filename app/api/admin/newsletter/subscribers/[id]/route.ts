import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { validateAdminOriginPermissive } from "@/app/lib/adminUtils";

function addNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addNoCacheHeaders(response);
    }

    validateAdminOriginPermissive(request);

    const { id } = await params;
    const updateData = await request.json();

    const subscriber = await prisma.subscriber.findUnique({
      where: { id }
    });
    
    if (!subscriber) {
      const response = NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
      return addNoCacheHeaders(response);
    }

    // Validate/sanitize categoryId or category (name) to avoid FK errors
    const hasCategoryIdProp = Object.prototype.hasOwnProperty.call(updateData, 'categoryId');
    const hasCategoryProp = Object.prototype.hasOwnProperty.call(updateData, 'category');
    if (hasCategoryIdProp || hasCategoryProp) {
      const rawValue = hasCategoryIdProp ? updateData.categoryId : updateData.category;
      if (!rawValue) {
        updateData.categoryId = null;
      } else {
        const asString = String(rawValue);
        let category = await prisma.category.findUnique({ where: { id: asString } });
        if (!category) {
          category = await prisma.category.findFirst({ where: { name: { equals: asString, mode: 'insensitive' } } });
        }
        updateData.categoryId = category ? category.id : null;
      }
      if (hasCategoryProp) delete updateData.category;
    }

    // Update subscriber data
    const updatedSubscriber = await prisma.subscriber.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });

    const response = NextResponse.json({
      success: true,
      message: "Subscriber updated successfully",
      subscriber: updatedSubscriber
    });

    return addNoCacheHeaders(response);

  } catch (error) {
    console.error("Error updating subscriber:", error);
    const response = NextResponse.json(
      { error: "Failed to update subscriber" },
      { status: 500 }
    );
    return addNoCacheHeaders(response);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addNoCacheHeaders(response);
    }

    validateAdminOriginPermissive(request);

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const softDelete = searchParams.get('soft') === 'true';
    
    const subscriber = await prisma.subscriber.findUnique({
      where: { id }
    });
    
    if (!subscriber) {
      const response = NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
      return addNoCacheHeaders(response);
    }

    if (softDelete) {
      await prisma.subscriber.update({
        where: { id },
        data: {
          status: 'UNSUBSCRIBED',
          notes: subscriber.notes ? `${subscriber.notes}\n[SOFT DELETED]` : '[SOFT DELETED]'
        }
      });

      const response = NextResponse.json({
        success: true,
        message: "Subscriber soft deleted successfully"
      });
      return addNoCacheHeaders(response);
    } else {
      await prisma.subscriber.delete({
        where: { id }
      });

      const response = NextResponse.json({
        success: true,
        message: "Subscriber deleted successfully"
      });
      return addNoCacheHeaders(response);
    }

  } catch (error) {
    console.error("Error deleting subscriber:", error);
    const response = NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
    return addNoCacheHeaders(response);
  }
} 