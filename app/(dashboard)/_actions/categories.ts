"use server";

import prisma from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categoris";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const paresedBody = CreateCategorySchema.safeParse(form);
  if (!paresedBody.success) throw new Error("bad request");
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const { name, icon, type } = paresedBody.data;
  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const paresedBody = DeleteCategorySchema.safeParse(form);
  if (!paresedBody.success) throw new Error("bad request");
  const user = await currentUser();
  if (!user) redirect("/sign-in");

 return await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: paresedBody.data.name,
        type: paresedBody.data.type,
      },
    },
  });
}
