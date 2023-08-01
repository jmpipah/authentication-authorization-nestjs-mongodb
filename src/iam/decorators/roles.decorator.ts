import { SetMetadata } from "@nestjs/common";
import { Role } from "../models/roles.model";

export const ROLES_KEY = "roles";

export const Roles = (...roles: (Role | string)[]) => {
  // Valores por defecto
  const defaultRoles = ["owner", "admin"];

  // Combinar roles proporcionados con roles por defecto
  roles = [...defaultRoles, ...roles];

  return SetMetadata(ROLES_KEY, roles);
};
