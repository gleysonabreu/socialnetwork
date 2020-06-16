import { Request, Response } from 'express';
import knex from '../database/connection';

class FollowerController{

  async create(request: Request, response: Response){

    const { authorization } = request.headers;
    const { user_following } = request.params;

    const dataFollower = {
      user_follower: authorization,
      user_following
    }

    if( authorization ){

      await knex('followers').insert(dataFollower);

      return response.json({ success: true });

    }else{
      return response.status(400).json({ message: "Unauthenticated user." })
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
    const { user_following } = request.params;

    if( authorization ){

      await knex('followers')
      .where('user_follower', authorization)
      .andWhere('user_following', user_following)
      .del();

      return response.json({ success: true });

    }else{
      return response.status(400).json({ message: "Unauthenticated user." })
    }

  }

}

export default FollowerController;