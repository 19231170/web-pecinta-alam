import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const template = await prisma.template.findUnique({
      where: { id: id }
    });
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update download count
    await prisma.template.update({
      where: { id: id },
      data: {
        downloadCount: {
          increment: 1
        }
      }
    });

    // Log download if user is authenticated
    const session = await getServerSession();
    if (session?.user) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      
      if (user) {
        await prisma.downloadLog.create({
          data: {
            userId: user.id,
            templateId: template.id
          }
        });
      }
    }

    // Simulasi konten template
    const templateContent = `TEMPLATE: ${template.judul}

Kategori: ${template.kategori}
Deskripsi: ${template.deskripsi}

[Konten template akan berada di sini...]

File: ${template.fileName}
Diunduh: ${template.downloadCount + 1} kali`;

    return new NextResponse(templateContent, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${template.fileName}"`,
      },
    });

  } catch (error) {
    console.error('Template download error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengunduh template' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: {
        downloadCount: 'desc'
      }
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
