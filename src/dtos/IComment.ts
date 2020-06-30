export default interface IComment {
  id: number;
  message: string;
  // eslint-disable-next-line camelcase
  user_id: number;
  // eslint-disable-next-line camelcase
  post_id: number;
  date: string;
}
