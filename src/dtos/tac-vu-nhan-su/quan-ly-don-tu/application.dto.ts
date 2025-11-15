import { z } from "zod";

export const zApplicationItem = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  reason: z.string(),
  response: z.string().optional(),
  formCategoryId: z.string(),
  formCategoryTitle: z.string(),
  submittedBy: z.string(),
  submittedName: z.string(),
  approvedBy: z.string().optional(),
  approvedName: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
  approvedTime: z.string().optional(),
  file: z.array(z.string()),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "INACTIVE"]),
});

export type ApplicationItem = z.infer<typeof zApplicationItem>;

export const zApplicationItemArray = z.array(zApplicationItem);

export default zApplicationItem;
