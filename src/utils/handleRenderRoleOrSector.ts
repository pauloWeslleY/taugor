import { ListRolesOrSectors } from "../contexts/employerContext";

interface HandleSectorOrRole {
  id: string;
  list: ListRolesOrSectors;
}

export function handleRenderRoleOrSector({ id, list }: HandleSectorOrRole) {
  const roleOrSector = list.filter((item) => item?.id === id);
  return roleOrSector[0]?.name;
}
