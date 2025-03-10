export interface User {
  iUserID?: number | null;
  sUserName: string | null;
  sFullName: string | null;
  sEmail: string | null;
  sImgUrl?: string | null;
  sPassword?: string | null;
  sRole?: string | null;
  iModifyBy?: number | null;
}