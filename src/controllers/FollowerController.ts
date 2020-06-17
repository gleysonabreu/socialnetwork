require('dotenv/config');
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import knex from '../database/connection';

interface IToken{
  data: {
    id: number;
  }
}

class FollowerController{

  async create(request: Request, response: Response){

    const { authorization } = request.headers;
    const tokenAuth = authorization?.split(' ')[1] || '';
    const { user_following } = request.params;

    try {

      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY || '');
      
      const dataFollower = {
        user_follower: decodedToken.data.id,
        user_following
      }

      await knex('followers').insert(dataFollower);

      return response.json({ success: true });

    } catch (error) {
      return response.status(400).json({ message: "Invalid token." });
    }

  }

  async index(request: Request, response: Response){

    const { user_follower } = request.params;

    const users = await knex('followers')
    .innerJoin('users', function(){
      this.on('followers.user_following', '=', 'users.id')
    })
    .select('followers.user_follower', 'followers.user_following', 'followers.date',
    'users.firstname', 'users.lastname', 'users.username', 'users.photo'
    )
    .where('user_follower', user_follower);

    return response.json(users)

  }

  async delete(request: Request, response: Response){

    const { authorization } = request.headers;
    const tokenAuth = authorization?.split(' ')[1] ||'';
    const { user_following } = request.params;

    try {

      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY || '');

      await knex('followers')
      .where('user_follower', decodedToken.data.id)
      .andWhere('user_following', user_following)
      .del();

      return response.json({ success: true });
      
    } catch (error) {
      return response.status(400).json({ message: "Invalid token." });
    }

  }

}

export default FollowerController;