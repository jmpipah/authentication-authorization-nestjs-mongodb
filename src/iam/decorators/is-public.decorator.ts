import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC = "isPublic";

export const IsPublic = () => SetMetadata(IS_PUBLIC, true);
