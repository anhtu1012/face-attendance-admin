import { z } from "zod";

export const CreateBranchSchema = z.object({
    branchName: z
        .string()
        .min(2, "Branch name must be at least 2 characters"),
    addressLine: z.string().or(z.number()),
    placeId: z.string().or(z.number()),
    city: z.string().or(z.number()),
    district: z.string().or(z.number()),
    lat: z.string().or(z.number()),
    long: z.string().or(z.number()),
    companyCode: z.string().or(z.number())
});

export type CreateBranchRequest = z.infer<typeof CreateBranchSchema>;

// export const UpdateBranchSchema = z.object({
//     branchName: z
//         .string()
//         .min(2, "Branch name must be at least 2 characters"),
//     addressLine: z.string().or(z.number()),
//     placeId: z.string().or(z.number()),
//     city: z.string().or(z.number()),
//     district: z.string().or(z.number()),
//     lat: z.string().or(z.number()),
//     long: z.string().or(z.number()),
//     companyCode: z.string().or(z.number())
// });

// export type UpdateBranchSchema = z.infer<typeof UpdateBranchSchema>;