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

  async index(request: Request, response: Response){
    const { post_id } = request.params;

    const comments = await knex('comment')
    .innerJoin('users', function() {
      this.on('comment.user_id', 'users.id')
    })
    .where('post_id', post_id)
    .select('comment.id', 'comment.message', 'comment.date',
    'users.firstname', 'users.lastname', 'users.photo', 'users.username'
    );

    return response.json(comments);
  }

  async show(request: Request, response: Response){

    const { post_id, comment_id } = request.params;

    const comment = await knex('comment')
    .innerJoin('users', function(){
      this.on('comment.user_id', 'users.id')
    })
    .where('comment.post_id', post_id)
    .andWhere('comment.id', comment_id)
    .select('comment.id', 'comment.message', 'comment.date',
    'users.firstname', 'users.lastname', 'users.photo', 'users.username'
    )
    .first();

    return response.json(comment)

  }

}

export default CommentController;