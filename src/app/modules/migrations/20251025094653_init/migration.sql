-- CreateEnum
CREATE TYPE "EUserRole" AS ENUM ('USER');

-- CreateEnum
CREATE TYPE "EGender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "EUserRole" NOT NULL DEFAULT 'USER',
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT NOT NULL DEFAULT '/images/placeholder.png',
    "name" TEXT NOT NULL DEFAULT 'Pathao User',
    "date_of_birth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gender" "EGender" NOT NULL DEFAULT 'OTHER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
