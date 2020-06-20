import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import knex from '@database/connection'
require('dotenv/config')

interface IComment{
  id: number;
  message: string;
  user_id: number;
  post_id: number;
  date: string;
}

interface IToken{
  data: {
    id: number;
  }
}

class CommentController {
  async create (request: Request, response: Response) {
    const { authorization } = request.headers
    const tokenAuth = authorization?.split(' ')[1] || ''
    const { message, post_id } = request.body

    try {
      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY || '')

      const dataComment = {
        message,
        user_id: decodedToken.data.id,
        post_id
      }

      const post = await knex('posts')
        .where('id', post_id)
        .first()

      if (post) {
        await knex('comment').insert(dataComment)
        return response.json({ success: true })
      } else {
        return response.json({ message: 'This post does not exist for you to comment.' })
      }
    } catch (error) {
      return response.status(400).json({ message: 'Invalid token.' })
    }
  }

  async index (request: Request, response: Response) {
    const { post_id } = request.params

    const comments = await knex('comment')
      .innerJoin('users', function () {
        this.on('comment.user_id', 'users.id')
      })
      .where('post_id', post_id)
      .select('comment.id', 'comment.message', 'comment.date',
        'users.firstname', 'users.lastname', 'users.photo', 'users.username'
      )

    return response.json(comments)
  }

  async show (request: Request, response: Response) {
    const { post_id, comment_id } = request.params

    const comment = await knex('comment')
      .innerJoin('users', function () {
        this.on('comment.user_id', 'users.id')
      })
      .where('comment.post_id', post_id)
      .andWhere('comment.id', comment_id)
      .select('comment.id', 'comment.message', 'comment.date', 'comment.post_id',
        'users.firstname', 'users.lastname', 'users.photo', 'users.username'
      )
      .first()

    return response.json(comment)
  }

  async update (request: Request, response: Response) {
    const { authorization } = request.headers
    const tokenAuth = authorization?.split(' ')[1] || ''
    const { comment_id } = request.params
    const { message } = request.body

    try {
      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY || '')

      const comment: IComment = await knex('comment')
        .where('id', comment_id)
        .first()

      if (comment.user_id === decodedToken.data.id) {
        await knex('comment')
          .where('id', comment.id)
          .andWhere('user_id', decodedToken.data.id)
          .update({
            message
          })

        return response.json({ success: true })
      } else {
        return response.json({ message: 'This comment is not yours, so you cannot update it.' })
      }
    } catch (error) {
      return response.status(400).json({ message: 'Invalid token.' })
    }
  }

  async delete (request: Request, response: Response) {
    const { authorization } = request.headers
    const tokenAuth = authorization?.split(' ')[1] || ''
    const { comment_id } = request.params

    try {
      const decodedToken = <IToken>jwt.verify(tokenAuth, process.env.SECRET_KEY || '')

      const commentDel: IComment = await knex('comment')
        .where('id', comment_id)
        .first()

      if (commentDel.user_id === decodedToken.data.id) {
        await knex('comment')
          .where('id', commentDel.id)
          .andWhere('user_id', decodedToken.data.id)
          .del()

        return response.json({ success: true })
      } else {
        return response.json({ message: 'This comment is not yours, so you cannot delete it.' })
      }
    } catch (error) {
      return response.status(400).json({ message: 'Invalid token.' })
    }
  }
}

export default CommentController
