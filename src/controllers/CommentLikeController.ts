import { Request, Response } from 'express';
import knex from '../database/connection';

class CommentLikeController{
  async create(request: Request, response: Response){
    const { authorization } = request.headers;
    const { comment_id } = request.body;

    const dataLike = {
      user_id: authorization,
      comment_id
    }

    if(authorization){
      await knex('comment_like').insert(dataLike);

      return response.json({ success: true });

    }else{
      return response.json({ message: "Unauthenticated user." });
    }
  }

  async delete(request: Request, response: Response){
    const { authorization } = request.headers;
    const { comment_id } = request.body;

    if( authorization ){

      await knex('comment_like')
      .where('user_id', authorization)
      .andWhere('comment_id', comment_id)
      .del();

      return response.json({ success: true });

    }else{
      return response.status(400).json({ message: "Unauthenticated user." });
    }
  }

}

export default CommentLikeController;