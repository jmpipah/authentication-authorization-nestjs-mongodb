import { SetMetadata } from "@nestjs/common";

export const API_KEY_IS_REQUIRED = "ApiKeyIsRequired";

export const ApiKeyIsRequired = () => SetMetadata(API_KEY_IS_REQUIRED, true);
