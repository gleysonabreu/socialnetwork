require('dotenv/config');
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import knex from '@database/connection';

interface IToken{
  data: {
    id: number;
  }
}
class CommentLikeController{
  async create(request: Request, response: Response){
    const { authorization } = request.headers;
    const tokenAuth = authorization?.split(' ')[1] || '';
    const { comment_id } = request.body;

    try {
      
      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY||'');

      const dataLike = {
        user_id: decodedToken.data.id,
        comment_id
      }

      await knex('comment_like').insert(dataLike);

      return response.json({ success: true });

    } catch (error) {
      return response.status(400).json({ message: "Invalid token." });
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
    const tokenAuth = authorization?.split(' ')[1] || '';
    const { comment_id } = request.params;

    try {
      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY||'');

      await knex('comment_like')
      .where('user_id', decodedToken.data.id)
      .andWhere('comment_id', comment_id)
      .del();

      return response.json({ success: true });
      
    } catch ([error]) {
      return response.status(400).json({ message: "Invalid token." });
    }

  }

}

export default CommentLikeController;