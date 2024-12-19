import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // getting the "type" parameters form the url
  const { searchParams } = new URL(request.url);
  //Getting a Specific Query Parameter
  const paramType = searchParams.get("type");
 
  const validator = z.enum(["expense", "income"]).nullable();
  const queryParams = validator.safeParse(paramType);
  // if the parameter is not valid type
  if (!queryParams.success)
    return Response.json(queryParams.error, {
      status: 400,
    });
  //Retrieving categories from the database based on the authenticated user and the validated type.
  const type = queryParams.data;
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), // include the type in the field if it exists
    },
    orderBy: {
      name: "asc",
    },
  });
  return Response.json(categories);
}
