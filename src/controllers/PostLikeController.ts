import { Request, Response } from 'express';
import knex from '../database/connection';

class PostLikeController{

  async create(request: Request, response: Response){

    const { authorization } = request.headers;
    const { post_id } = request.body;

    const dataLike = {
      user_id: authorization,
      post_id
    }

    if( authorization ){

      await knex('post_like').insert(dataLike);

      return response.json({ success: true });

    }else{
      return response.status(400).json({ message: "Unauthenticated user." })
    }

  }

  async index(request: Request, response: Response){

    const { post_id } = request.params;

    const listAllLikes = await knex('post_like')
    .innerJoin('users', function(){
      this.on('post_like.user_id', '=', 'users.id')
    })
    .select('post_like.user_id', 'post_like.post_id', 'post_like.date',
    'users.firstname', 'users.lastname', 'users.photo', 'users.username'
    )
    .where('post_like.post_id', post_id);

    return response.json(listAllLikes);

  }

  async delete(request: Request, response: Response){

    const { authorization } = request.headers;
    const { post_id } = request.params;

    if( authorization ){

      await knex('post_like')
      .where('user_id', authorization)
      .andWhere('post_id', post_id)
      .del();

      return response.json({ success: true });

    }else{
      return response.status(400).json({ message: "Unauthenticated user." });
    }

  }

}

export default PostLikeController;