/*
  Warnings:

  - A unique constraint covering the columns `[fileName]` on the table `templates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'MAPALA',
    "siteDescription" TEXT NOT NULL DEFAULT 'Mahasiswa Pecinta Alam',
    "adminEmail" TEXT NOT NULL DEFAULT 'admin@mapala.com',
    "maxMembers" INTEGER NOT NULL DEFAULT 100,
    "registrationOpen" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "autoApproval" BOOLEAN NOT NULL DEFAULT false,
    "backupInterval" TEXT NOT NULL DEFAULT 'weekly',
    "sessionTimeout" INTEGER NOT NULL DEFAULT 30,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "lastBackup" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "templates_fileName_key" ON "templates"("fileName");
