import { Request, Response } from 'express';
import knex from '../database/connection';

interface IComment{
  id: number;
  message: string;
  user_id: number;
  post_id: number,
  date: string;
}

class CommentController{

  async create(request: Request, response: Response){
    const { authorization } = request.headers;
    const { message, post_id } = request.body;

    const dataComment = {
      message,
      user_id: authorization,
      post_id
    }

    const trx = await knex.transaction();

    if(authorization){

      const post: IComment = await trx('post')
      .where('id', post_id)
      .first();

      if(post){
        await trx('comment').insert(dataComment);
      }
    }
    trx.commit();
    return response.json({ success: true });
  }

}

export default CommentController;