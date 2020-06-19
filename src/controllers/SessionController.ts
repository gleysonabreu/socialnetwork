require('dotenv/config');
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import knex from '../database/connection';
import bcrypt from 'bcrypt';

interface IUser{
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}

class SessionController{

  async create(request: Request, response: Response){
    const { login, password } = request.body;
    
    const user: IUser = await knex('users')
    .where(function(){
      this.where('email', login).orWhere('username', login)
    })
    .first();

    
    if(user){

      bcrypt.compare(password, user.password, (err, result) => {
        if(result){
          const dataUser = {
            id: user.id
          }
      
          jwt.sign(
            { data: dataUser }, 
            process.env.SECRET_KEY || '',
            { algorithm: 'HS256', expiresIn: '100d' },
            (err, token) => {
              if(token){
                return response.json({ token });
              }else{
                return response.status(400).json({ err });
              }
            });
        }else{
          return response.status(400).json({ message: "Password or email/username incorrect!!" })
        }
      });

    }else{
      return response.status(400).json({ message: "Password or email/username incorrect!!" })
    }

  }

}

export default SessionController;