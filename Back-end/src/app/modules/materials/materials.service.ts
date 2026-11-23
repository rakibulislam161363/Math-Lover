import httpStatus from "http-status";
import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../utils/httpError";
import {
  MaterialCreateInput,
  MaterialUpdateInput,
} from "./materials.interface";

const assertMaterialAccess = async (
  studentId: string,
  batchId: string,
) => {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId,
      batchId,
      status: { in: ["ACTIVE", "COMPLETED"] },
      materialAccessEnabled: true,
    },
    select: { id: true },
  });

  if (!enrollment) {
    throw new HttpError(
      httpStatus.FORBIDDEN,
      "Active material access is required for this batch.",
    );
  }
};

export const listMaterials = async (
  batchId: string,
  userId: string,
  userRole: UserRole,
) => {
  const isAdmin = userRole === UserRole.ADMIN;
  if (!isAdmin) {
    await assertMaterialAccess(userId, batchId);
  }

  return prisma.material.findMany({
    where: { batchId, isPublished: isAdmin ? undefined : true },
    orderBy: { createdAt: "desc" },
  });
};

export const createMaterial = async (
  batchId: string,
  data: MaterialCreateInput,
) => {
  if (data.chapterId) {
    const chapter = await prisma.chapter.findFirst({
      where: { id: data.chapterId, batchId },
      select: { id: true },
    });
    if (!chapter) {
      throw new HttpError(
        httpStatus.BAD_REQUEST,
        "Material chapter must belong to the selected batch.",
      );
    }
  }

  return prisma.material.create({ data: { ...data, batchId } });
};

export const updateMaterial = async (
  id: string,
  data: MaterialUpdateInput,
) => {
  if (data.chapterId) {
    const material = await prisma.material.findUnique({
      where: { id },
      select: { batchId: true },
    });
    if (!material) {
      throw new HttpError(httpStatus.NOT_FOUND, "Material not found.");
    }

    const chapter = await prisma.chapter.findFirst({
      where: { id: data.chapterId, batchId: material.batchId },
      select: { id: true },
    });
    if (!chapter) {
      throw new HttpError(
        httpStatus.BAD_REQUEST,
        "Material chapter must belong to the material's batch.",
      );
    }
  }

  return prisma.material.update({ where: { id }, data });
};

export const deleteMaterial = (id: string) =>
  prisma.material.delete({ where: { id } });
