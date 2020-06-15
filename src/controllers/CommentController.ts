import { Request, Response } from 'express';
import knex from '../database/connection';

class CommentController{

  async create(request: Request, response: Response){
    const { authorization } = request.headers;
    const { message, post_id } = request.body;

    const dataComment = {
      message,
      user_id: authorization,
      post_id
    }

    if(authorization){

      const post = await knex('posts')
      .where('id', post_id)
      .first();

      if(post){
        await knex('comment').insert(dataComment);
        return response.json({ success: true });
      }else{
        return response.json({ message: "This post not exists to you comment."});
      }

    }else{
      return response.json({ message: "You not authencated."});
    }
  }

}

export default CommentController;