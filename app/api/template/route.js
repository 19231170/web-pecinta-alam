import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: [
        { downloadCount: 'desc' },
        { updatedAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      templates: templates
    });
  } catch (error) {
    console.error('Fetch templates error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data template' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { judul, kategori, deskripsi, fileName, filePath, fileSize, fileContent } = await request.json();

    const template = await prisma.template.create({
      data: {
        judul,
        kategori,
        deskripsi,
        fileName,
        filePath,
        fileSize,
        fileContent // Store the actual file content
      }
    });

    return NextResponse.json({
      success: true,
      template: template
    });
  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat template' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, judul, kategori, deskripsi, fileName, filePath, fileSize } = await request.json();

    const template = await prisma.template.update({
      where: { id },
      data: {
        judul,
        kategori,
        deskripsi,
        fileName,
        filePath,
        fileSize
      }
    });

    return NextResponse.json({
      success: true,
      template: template
    });
  } catch (error) {
    console.error('Update template error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui template' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    await prisma.template.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Template berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete template error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus template' },
      { status: 500 }
    );
  }
}
