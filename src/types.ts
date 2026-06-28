export type TPropositionFile = {
    id: number;
    fileName: string;
    fileSize: number;
};

export type TUserPublicData = {
    id: number;
    firstName: string;
    lastName: string;
};

export type TProposition = {
    id: number;
    user: TUserPublicData;
    createdAt: string;
    title: string;
    description: string;
    files: TPropositionFile[];
};

export type TMessageFile = {
    id: number;
    fileName: string;
    fileSize: number;
};

export type TPropositionMessage = {
    id: number;
    proposition: TProposition;
    user: TUserPublicData;
    createdAt: string;
    message: string;
    files: TMessageFile[];
};

export type UserPublicData = {
  id: number;
  name: string;
  surname: string;
};

export type User = {
  id: number;
  name: string | null;
  surname: string | null;
  role: string;
}

