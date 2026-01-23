import { db } from "../db";
import { tools } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getAllTools() {
  const result = await db
    .select({
      id: tools.id,
      owner: tools.owner,
      name: tools.name,
      description: tools.description,
      apiURL: tools.apiURL,
      images: tools.images,
      price: tools.price,
    })
    .from(tools);
  return result;
}

export async function getToolById(id: string) {
  const result = await db
    .select({
      id: tools.id,
      owner: tools.owner,
      name: tools.name,
      description: tools.description,
      apiURL: tools.apiURL,
      images: tools.images,
      price: tools.price,
    })
    .from(tools)
    .where(eq(tools.id, id))
    .limit(1);
  return result[0] || null;
}
