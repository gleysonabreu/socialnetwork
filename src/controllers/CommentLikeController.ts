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

  async index(request: Request, response: Response){
    const { comment_id } = request.params;

    const allLikes = await knex('comment_like')
    .innerJoin('users', function(){
      this.on('comment_like.user_id', '=', 'users.id')
    })
    .select('comment_like.user_id', 'comment_like.comment_id', 'comment_like.date',
    'users.firstname', 'users.lastname', 'users.photo', 'users.username'
    )
    .where('comment_like.comment_id', comment_id);

    return response.json(allLikes);

  }

  async delete(request: Request, response: Response){
    const { authorization } = request.headers;
    const { comment_id } = request.params;

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