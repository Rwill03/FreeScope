-- CreateTable
CREATE TABLE "FreelancerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "hourlyRate" REAL NOT NULL,
    "skills" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FeatureEstimate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "freelancerId" TEXT NOT NULL,
    "featureDescription" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "aiResponse" TEXT NOT NULL,
    "totalHours" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    "confidence" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeatureEstimate_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "FreelancerProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
