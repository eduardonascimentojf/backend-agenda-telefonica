type File = {
  name: string;
  lastModified: number;
  webkitRelativePath: string;
  size: number;
  type: string;
};
type Telephone = {
  type: string;
  number: string;
};
export type ContactType = {
  id: number;
  name: string;
  email: string;
  img: File | null;
  telephones: Telephone;
  isFavorite?: boolean;
};
