require('dotenv/config');
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import knex from '../database/connection';

interface IToken{
  data: {
    id: number;
  }
}

class PostLikeController{

  async create(request: Request, response: Response){

    const { authorization } = request.headers;
    const tokenAuth = authorization?.split(' ')[1] || '';
    const { post_id } = request.body;

    try {

      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY || '');
      
      const dataLike = {
        user_id: decodedToken.data.id,
        post_id
      }

      await knex('post_like').insert(dataLike);

      return response.json({ success: true });

    } catch (error) {
      return response.status(400).json({ message: "Invalid token." });
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
    const tokenAuth = authorization?.split(' ')[1] || '';
    const { post_id } = request.params;

    try {

      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY || '');

      await knex('post_like')
      .where('user_id', decodedToken.data.id)
      .andWhere('post_id', post_id)
      .del();

      return response.json({ success: true });
      
    } catch (error) {
      return response.status(400).json({ message: "Invalid token." });
    }

  }

}

export default PostLikeController;