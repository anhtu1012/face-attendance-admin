import {  z } from "zod";

export const BranchSchema = z.object({
    id: z.string().or(z.bigint()),
    createdAt: z.string(),
    updatedAt: z.string(),
    code: z.string(),
    branchName: z.string(),
    addressLine: z.string(),
    placeId: z.string(),
    city: z.string(),
    lat: z.string().or(z.number()),
    long: z.string().or(z.number()),
    companyCode: z.string(),
})

export type Branch = z.infer<typeof BranchSchema>
