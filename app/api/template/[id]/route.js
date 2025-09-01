import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import path from 'path';
import fs from 'fs';

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

    // Determine content type based on the filename extension
    const fileExt = path.extname(template.fileName || '').toLowerCase();
    let contentType = 'application/octet-stream'; // Default fallback
    let fileExtension = '.docx'; // Default extension
    
    if (fileExt === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      fileExtension = '.docx';
    } else if (fileExt === '.doc') {
      contentType = 'application/msword';
      fileExtension = '.doc';
    } else if (fileExt === '.txt') {
      contentType = 'text/plain';
      fileExtension = '.txt';
    } else if (fileExt === '.rtf') {
      contentType = 'application/rtf';
      fileExtension = '.rtf';
    }

    // Use the stored file content if available
    let buffer;
    
    if (template.fileContent) {
      // Convert base64 back to binary data
      const binaryString = atob(template.fileContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      buffer = Buffer.from(bytes);
    } else {
      // Fallback if no content was stored (for backward compatibility)
      const fallbackContent = `MAHASISWA PECINTA ALAM (MAPALA)
${template.judul}

Kategori: ${template.kategori}
Deskripsi: ${template.deskripsi}

---

Kepada Yth,
[Nama Penerima]
[Alamat]

Dengan hormat,

Sehubungan dengan [isi surat sesuai keperluan], dengan ini kami mengajukan permohonan...

[Isi konten template - silakan sesuaikan dengan kebutuhan]

Demikian surat ini kami buat, atas perhatian dan kerjasamanya kami ucapkan terima kasih.

Hormat kami,

[Nama Penandatangan]
[Jabatan]
MAPALA

Template MAPALA - Downloaded ${template.downloadCount + 1} times`;

      buffer = Buffer.from(fallbackContent, 'utf8');
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${template.judul.replace(/[^a-zA-Z0-9]/g, '_')}${fileExtension}"`,
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

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { judul, kategori, deskripsi, fileName, filePath, fileSize } = await request.json();

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

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

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
