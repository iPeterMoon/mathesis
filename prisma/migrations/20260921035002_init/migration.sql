-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "author" TEXT NOT NULL,
    "publisher" TEXT,
    "language" TEXT,
    "pageCount" INTEGER,
    "price" DECIMAL(10,2) NOT NULL,
    "coverImageUrl" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_user_key" ON "Admin"("user");
