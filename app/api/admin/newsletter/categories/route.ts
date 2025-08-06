import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            subscribers: {
              where: {
                status: "ACTIVE"
              }
            }
          }
        }
      }
    });

    // Calculate subscriber count for each category
    const categoriesWithCounts = categories.map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      description: category.description,
      subscriberCount: category._count.subscribers
    }));

    return NextResponse.json({
      success: true,
      categories: categoriesWithCounts
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, color, description } = await request.json();

    if (!name || !color || !description) {
      return NextResponse.json(
        { error: "Name, color, and description are required" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        color,
        description
      }
    });

    return NextResponse.json({
      success: true,
      category: newCategory,
      message: "Category created successfully"
    });

  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
} 