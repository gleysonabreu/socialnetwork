import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import knex from '@database/connection';

require('dotenv/config');

interface IToken{
  data: {
    id: number;
  }
}

class FollowerController {
  create = async (request: Request, response: Response) => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(' ')[1];
    const { userFollowing } = request.params;

    try {
      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY);

      const dataFollower = {
        user_follower: decodedToken.data.id,
        user_following: userFollowing,
      };
      await knex('followers').insert(dataFollower);

      return response.json({ success: true });
    } catch (error) {
      return response.status(400).json({ message: 'Invalid token.' });
    }
  }

  index = async (request: Request, response: Response) => {
    const { userFollower } = request.params;

    const users = await knex('followers')
      .innerJoin('users', function user() {
        this.on('followers.user_following', '=', 'users.id');
      })
      .select('followers.user_follower', 'followers.user_following', 'followers.date',
        'users.firstname', 'users.lastname', 'users.username', 'users.photo')
      .where('followers.user_follower', userFollower);

    return response.json(users);
  }

  delete = async (request: Request, response: Response) => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(' ')[1];
    const { userFollowing } = request.params;

    try {
      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY);

      await knex('followers')
        .where('user_follower', decodedToken.data.id)
        .andWhere('user_following', userFollowing)
        .del();

      return response.json({ success: true });
    } catch (error) {
      return response.status(400).json({ message: 'Invalid token.' });
    }
  }
}

export default FollowerController;
