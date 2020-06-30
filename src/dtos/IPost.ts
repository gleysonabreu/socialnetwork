export default interface IPost {
  id: number;
  message: string;
  // eslint-disable-next-line camelcase
  user_id: number;
  date: string;
  images: string;
}
