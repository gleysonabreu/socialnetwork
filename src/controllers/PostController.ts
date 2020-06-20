require('dotenv/config');
import { Request, Response } from 'express';
import jwt, { decode } from 'jsonwebtoken';
import knex from '@database/connection';

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

interface IToken {
  data: {
    id: number;
  }
}

interface IPostUser extends IPost, IUser {}


class PostController {
  
  async create(request: Request, response: Response){
      
    const { authorization } = request.headers;
    const tokenAuth = authorization?.split(' ')[1] || '';
    const { message } = request.body;

    try {
      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY || '');
      
      const dataPost = {
        message,
        user_id: decodedToken.data.id
      }

      const resPost = await knex('posts').insert(dataPost);
        
      return response.json({ success: true });
    } catch (error) {
      return response.json({ message: "Invalid token" })
    }
      
  }

  async index(request: Request, response: Response){

    const { authorization } = request.headers;
    const tokenAuth = authorization?.split(' ')[1] || '';

    try {

      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY || '');
      
      const posts = await knex('posts')
      .innerJoin('users', function(){
        this.on('posts.user_id', '=', 'users.id')
      })
      .whereIn('posts.user_id', function(){
        this.select('user_following').from('followers').where('user_follower', decodedToken.data.id)
      })
      .select('posts.id', 'posts.message', 'posts.date', 'users.id as user_id',
      'users.firstname', 'users.lastname', 'users.username', 'users.photo'
      ).orderBy('posts.id', 'desc');

      return response.json(posts);

    } catch (error) {
      return response.json({ message: "Invalid token." })
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
    const tokenAuth = authorization?.split(' ')[1] || '';
    const { id } = request.params;
    const { message } = request.body;

    try {
      
      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY || '');

      const post: IPost = await knex('posts')
      .where('id', id)
      .first();

      if(decodedToken.data.id === post.user_id){
        await knex('posts')
        .where('id', post.id)
        .update({
          message
        });
        return response.json({ message: "Updated post." })
      }else{
        return response.status(400).json({ message: "This post not your, so you can not update." });
      }

    } catch (error) {
      return response.json({ message: "Invalid token." });
    }

  }

  async delete(request: Request, response: Response){

    const { authorization } = request.headers;
    const tokenAuth = authorization?.split(' ')[1] || '';
    const { id } = request.params;

    const trx = await knex.transaction();

    try {

      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY || '');
      
      const post: IPost = await trx('posts')
      .where('id', '=', id)
      .first();

      if(post.user_id === decodedToken.data.id){

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

    } catch (error) {
      return response.json({ message: "Invalid token." });
    }

  }

}

export default PostController;