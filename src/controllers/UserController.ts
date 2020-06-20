require('dotenv/config');
import {Request, Response} from 'express';
import knex from '@database/connection';
import bcrypt, { genSalt } from 'bcrypt';

interface IUser{
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  photo?: string;
  date_birth: string;
}

class UserController{

  async create(request: Request, response: Response){
    const { firstname, lastname, username, email, date_birth, password } = request.body;

    const user: IUser = {
      firstname,
      lastname,
      username,
      email,
      date_birth,
      password,
      photo: "default"
    }
   
    bcrypt.hash(password, 10, async (err, hash) => {
      if(err) return response.status(400).json({ message: "Error to generate a encrypt password." });
      
        user.password = hash;

        await knex("users").insert(user);

        return response.json({ success: true });
    });
  }

}

export default UserController;