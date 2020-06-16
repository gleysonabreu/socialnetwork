import { Request, Response } from 'express';
import knex from '../database/connection';

interface IPost{
  id: number;
  message: string;
  user_id: number;
}

interface IUser{
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  photo: string;
}
interface IPostUser extends IPost, IUser {}


class PostController {
  
  async create(request: Request, response: Response){
      
    const { authorization } = request.headers;
    const { message } = request.body;
      
    const dataPost = {
      message,
      user_id: authorization
    }
      
    const resPost = await knex('posts').insert(dataPost);
      
    return response.json({ success: true });
      
  }

  async index(request: Request, response: Response){

    const { authorization } = request.headers;
    
    if(authorization){

      const posts = await knex('posts')
      .innerJoin('users', function(){
        this.on('posts.user_id', '=', 'users.id')
      })
      .whereIn('posts.user_id', function(){
        this.select('user_following').from('followers').where('user_follower', authorization)
      })
      .select('posts.id', 'posts.message', 'posts.date', 'users.id as user_id',
      'users.firstname', 'users.lastname', 'users.username', 'users.photo'
      ).orderBy('posts.id', 'desc');

      return response.json(posts);

    }

  }

  async show(request: Request, response: Response){

    const { id } = request.params;

    const post: IPostUser = await knex('posts')
    .innerJoin('users', function() {
      this.on('posts.user_id', 'users.id')
    })
    .where('posts.id', '=', parseInt(id))
    .select('posts.id', 'posts.message', 'posts.date', 'users.id as user_id',
    'users.firstname', 'users.lastname', 'users.username', 'users.photo')
    .first();

    return response.json(post);

  }

  async update(request: Request, response: Response){

    const { authorization }  = request.headers;
    const { id } = request.params;
    const { message } = request.body;

    if(authorization){

      const post: IPost = await knex('posts')
      .where('id', id)
      .first();

      if(parseInt(authorization) === post.id){
        await knex('posts')
        .where('id', post.id)
        .update({
          message
        });
        return response.json({ message: "Updated post." })
      }else{
        return response.status(400).json({ message: "This post not your, so you can not update." });
      }

    }else{
      return response.json({ message: "Unauthenticated user." })
    }

  }

  async delete(request: Request, response: Response){

    const { authorization } = request.headers;
    const { id } = request.params;

    const trx = await knex.transaction();

    if(authorization){
      const post: IPost = await trx('posts')
      .where('id', '=', id)
      .first();

      if(post.user_id === parseInt(authorization)){

        await trx('comment_like')
        .whereIn('comment_id', function(){
          this.select('id').from('comment').where('post_id', post.id)
        })
        .del();

        await trx('comment')
        .where('post_id', post.id)
        .del();

        await trx('post_image')
        .where('post_id', post.id)
        .del();

        await trx('post_like')
        .where('post_id', post.id)
        .del();

        await trx('posts')
        .where('id', post.id)
        .del();
      
        response.status(200).json({ message: 'Post deleted.' });
      
      }else{
        response.status(400).json({ message: 'This post is not yours, so you can not delete it.' });
      }

      trx.commit();
    }

  }

}

export default PostController;