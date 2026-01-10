import { z } from 'zod';
export declare const CreateUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginDTO = z.infer<typeof LoginSchema>;
export declare const HelpRequestSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodEnum<["ALIMENTOS", "MEDICAMENTOS", "TRANSPORTE", "OUTROS"]>;
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    category: "ALIMENTOS" | "MEDICAMENTOS" | "TRANSPORTE" | "OUTROS";
    latitude: number;
    longitude: number;
}, {
    title: string;
    description: string;
    category: "ALIMENTOS" | "MEDICAMENTOS" | "TRANSPORTE" | "OUTROS";
    latitude: number;
    longitude: number;
}>;
export type HelpRequestDTO = z.infer<typeof HelpRequestSchema>;
//# sourceMappingURL=index.d.ts.map