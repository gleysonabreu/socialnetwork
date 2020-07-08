export default interface IUser {
  id?: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password?: string;
  photo?: string;
  // eslint-disable-next-line camelcase
  date_birth?: string;
}
