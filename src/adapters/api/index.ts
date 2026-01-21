/* eslint-disable prettier/prettier */
import Controllers from '../../controllers/index'
import { Openrouter } from '../openrouter'
import { signSession } from '../../utilts/sign-session'
import { Guard } from './guard'
import * as swaggerUi from 'swagger-ui-express'
import swagger from '../../libs/swagger'

export class Routes {
  private guard = new Guard()
  private openRouter = new Openrouter()

  constructor(app: any) {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swagger))

    app.use(async (req, res, next) => {
      if (req.path.startsWith('/auth')) {
        return next()
      }

      if (req.sessionID && req.session && req.session.jwt) {
        const isValid = await this.guard.checkAuth(req)

        if (!isValid) {
          return res.status(401).json({ ok: false, message: 'Unauthorized' })
        }

        return next()
      }

      return res.status(401).json({ ok: false, message: 'Unauthorized' })
    })

    this.registerRoutes(app)
  }

  async registerRoutes(app: any) {
    /**
     * @swagger
     * tags:
     *   - name: Auth
     *     description: Authentication endpoints
     *
     * /auth/signUp:
     *   post:
     *     tags: [Auth]
     *     summary: Create a new user account.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - name
     *               - phone
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "user@example.com"
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "P@ssw0rd123"
     *               name:
     *                 type: string
     *                 example: "Ivan Ivanov"
     *               phone:
     *                 type: string
     *                 example: "+79995553311"
     *     responses:
     *       201:
     *         description: Successfully signed up
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                   example: true
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: integer
     *                       example: 1
     *                     roleId:
     *                       type: integer
     *                       example: 0
     *                     name:
     *                       type: string
     *                       example: "Ivan Ivanov"
     *                     email:
     *                       type: string
     *                       example: "email@example.com"
     *                     phone:
     *                       type: string
     *                       example: "+79995553311"
     *                     balance:
     *                       type: integer
     *                       example: 0
     *                     dateCreate:
     *                       type: string
     *                       format: date-time
     *                       example: "2026-01-09 10:40:50.414"
     *                 sid:
     *                   type: string
     *                   example: "s%3AQ5mE9XoFnuT4rtMmSD7QtcqCYKbknlyh.kAHBKGq2yGdnUBD8JnG2c3JqMH%2BbTlV79EVjkFdjKRw"
     *                 message:
     *                   type: string
     *                   example: "Successfully signed up"
     *       400:
     *         description: Bad request
     */

    app.post('/auth/signUp', async (req: any, res: any) => {
      const result = await Controllers.AuthController.signUp({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        roleId: req.body.isAdmin == 'true' ? 0 : 1
      })

      if (result.ok == true) {
        req.session.jwt = Controllers.AuthController.createJwtToken({
          userId: result.newUser.id,
          roleId: result.newUser.roleId
        })

        const sessionId = req.sessionID

        const tokens = await Controllers.TokensController.getTokensByUserId(
          result.newUser.id
        )

        return res.status(201).json({
          ok: true,
          user: {
            id: result.newUser.id,
            roleId: result.newUser.roleId,
            name: result.newUser.name,
            email: result.newUser.email,
            phone: result.newUser.phone,
            balance: tokens.balance,
            dateCreate: result.newUser.dateCreate
          },
          sid: signSession(sessionId),
          message: 'Successfully signed up'
        })
      } else {
        return res.status(400).json({
          ok: false,
          message: result.message
        })
      }
    })

    /**
     * @swagger
     * tags:
     *   - name: Auth
     *     description: Authentication endpoints
     *
     * /auth/signIn:
     *   post:
     *     tags: [Auth]
     *     summary: Log in existing account.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "user@example.com"
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "P@ssw0rd123"
     *     responses:
     *       201:
     *         description: Successfully logged in
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                   example: true
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: integer
     *                       example: 1
     *                     roleId:
     *                       type: integer
     *                       example: 0
     *                     name:
     *                       type: string
     *                       example: "Ivan Ivanov"
     *                     email:
     *                       type: string
     *                       example: "email@example.com"
     *                     phone:
     *                       type: string
     *                       example: "+79995553311"
     *                     balance:
     *                       type: integer
     *                       example: 0
     *                     dateCreate:
     *                       type: string
     *                       format: date-time
     *                       example: "2026-01-09 10:40:50.414"
     *                 sid:
     *                   type: string
     *                   example: "s%3AQ5mE9XoFnuT4rtMmSD7QtcqCYKbknlyh.kAHBKGq2yGdnUBD8JnG2c3JqMH%2BbTlV79EVjkFdjKRw"
     *                 message:
     *                   type: string
     *                   example: "Successfully signed in"
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: "Wrong password"
     */

    app.post('/auth/signIn', async (req: any, res: any) => {
      const result = await Controllers.AuthController.signIn({
        email: req.body.email,
        password: req.body.password
      })

      if (result.ok == true) {
        const tokens = await Controllers.TokensController.getTokensByUserId(
          result.user.id
        )

        req.session.jwt = Controllers.AuthController.createJwtToken({
          userId: result.user.id,
          roleId: result.user.roleId
        })

        const sessionId = req.sessionID

        return res.status(201).json({
          ok: true,
          user: {
            id: result.user.id,
            roleId: result.user.roleId,
            name: result.user.name,
            email: result.user.email,
            phone: result.user.phone,
            balance: tokens.balance,
            dateCreate: result.user.dateCreate
          },
          sid: signSession(sessionId),
          message: result.message
        })
      } else {
        return res.status(400).json({
          ok: false,
          message: result.message
        })
      }
    })

    /**
     * @swagger
     * tags:
     *   - name: Auth
     *     description: Authentication endpoints
     *
     * /auth/logOut:
     *   get:
     *     tags: [Auth]
     *     summary: Log out of account.
     *     responses:
     *       200:
     *         description: Successfully logged out
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: "Successfully logged out"
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: "Logout error: Database connection lost"
     */

    app.get('/auth/logOut', async (req: any, res: any) => {
      try {
        await req.session.destroy()

        return res
          .status(200)
          .json({ ok: true, message: 'Successfully logged out' })
      } catch (err) {
        return res.status(400).json({
          ok: false,
          message: `Logout error: ${err}`
        })
      }
    })

    /**
     * @swagger
     * tags:
     *   - name: User
     *     description: User endpoints
     *
     * /user/create:
     *   post:
     *     tags: [User]
     *     summary: Create new user account.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - name
     *               - phone
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "user@example.com"
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "P@ssw0rd123"
     *               name:
     *                 type: string
     *                 example: "Ivan Ivanov"
     *               phone:
     *                 type: string
     *                 example: "+79995553311"
     *     responses:
     *       201:
     *         description: User successfully created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                   example: true
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: integer
     *                       example: 1
     *                     roleId:
     *                       type: integer
     *                       example: 0
     *                     name:
     *                       type: string
     *                       example: "Ivan Ivanov"
     *                     email:
     *                       type: string
     *                       example: "user@example.com"
     *                     phone:
     *                       type: string
     *                       example: "+79995553311"
     *                     balance:
     *                       type: integer
     *                       example: 0
     *                     dateCreate:
     *                       type: string
     *                       format: date-time
     *                       example: "2026-01-09 10:40:50.414"
     *                 message:
     *                   type: string
     *                   example: "User successfully created"
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: "Cannot create user"
     */

    app.post('/user/create', async (req: any, res: any) => {
      const result = await Controllers.UsersContoller.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        roleId: req.body.isAdmin == 'true' ? 0 : 1
      })

      if (result.ok == false) {
        return res.status(400).json({
          ok: result.ok,
          message: 'Cannot create user',
          statusCode: 400
        })
      } else {
        const tokens = await Controllers.TokensController.getTokensByUserId(
          result.user.id
        )

        return res.status(201).json({
          ok: true,
          user: {
            id: result.user.id,
            roleId: result.user.roleId,
            name: result.user.name,
            email: result.user.email,
            phone: result.user.phone,
            balance: tokens.balance,
            dateCreate: result.user.dateCreate
          },
          message: 'User successfully created'
        })
      }
    })

    /**
     * @swagger
     * tags:
     *   - name: User
     *     description: User endpoints
     *
     * /user/getUser/id:
     *   get:
     *     tags: [User]
     *     summary: Get user by id.
     *     responses:
     *       200:
     *         description: User successfully taken
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                   example: true
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: integer
     *                       example: 1
     *                     roleId:
     *                       type: integer
     *                       example: 0
     *                     name:
     *                       type: string
     *                       example: "Ivan Ivanov"
     *                     email:
     *                       type: string
     *                       example: "user@example.com"
     *                     phone:
     *                       type: string
     *                       example: "+79995553311"
     *                     dateCreate:
     *                       type: string
     *                       format: date-time
     *                       example: "2026-01-09 10:40:50.414"
     *                 balance:
     *                       type: integer
     *                       example: 0
     *       404:
     *         description: Not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: "User not found"
     *                 statusCode:
     *                   type: integer
     *                   example: 404
     */

    app.get('/user/getUser/:id', async (req: any, res: any) => {
      const user = await Controllers.UsersContoller.getUserById(req.params.id)

      const tokens = await Controllers.TokensController.getTokensByUserId(
        req.params.id
      )

      if (user) {
        return res.status(200).json({
          ok: true,
          user,
          balance: tokens.balance
        })
      } else {
        return res
          .status(404)
          .json({ ok: false, message: 'User not found', statusCode: 404 })
      }
    })

    /**
     * @swagger
     * tags:
     *   - name: User
     *     description: User endpoints
     *
     * /user/getAllUsers:
     *   get:
     *     tags: [User]
     *     summary: Get all users.
     *     responses:
     *       200:
     *         description: Users successfully taken
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                   example: true
     *                 users:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: integer
     *                         example: 1
     *                       roleId:
     *                         type: integer
     *                         example: 0
     *                       name:
     *                         type: string
     *                         example: "Ivan Ivanov"
     *                       email:
     *                         type: string
     *                         example: "user@example.com"
     *                       phone:
     *                         type: string
     *                         example: "+79995553311"
     *                       dateCreate:
     *                         type: string
     *                         format: date-time
     *                         example: "2026-01-09 10:40:50.414"
     *                       balance:
     *                         type: integer
     *                         example: 0
     *                   example:
     *                     - id: 1
     *                       name: "Ivan Ivanov"
     *                       roleId: 0
     *                       email: "user@example.com"
     *                       phone: "+79995553311"
     *                       dateCreate: "2026-01-09 10:40:50.414"
     *                       balance: 0
     *                     - id: 2
     *                       name: "Petr Petrov"
     *                       roleId: 1
     *                       email: "petr@example.com"
     *                       phone: "+79995553322"
     *                       dateCreate: "2026-01-10 11:30:25.123"
     *                       balance: 100
     *       404:
     *         description: Not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ok:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: "Users not found"
     *                 statusCode:
     *                   type: integer
     *                   example: 404
     */

    app.get('/user/getAllUsers', async (req: any, res: any) => {
      const users = await Controllers.UsersContoller.findAll()

      if (users.length == 0) {
        return res.status(404).json({
          ok: false,
          message: 'Users not found',
          statusCode: 404
        })
      } else {
        return res.status(200).json({
          ok: true,
          users: users
        })
      }
    })

    app.patch('/user/updateUser/:id', async (req: any, res: any) => {
      const updateResult = await Controllers.UsersContoller.updateById(
        req.params.id,
        req.body
      )

      const updatedUser = await Controllers.UsersContoller.getUserById(
        req.params.id
      )

      if (!updatedUser) {
        return res.status(404).json({
          ok: false,
          message: `User with id ${req.params.id} not found`,
          statusCode: 404
        })
      }

      if (updateResult.ok == true) {
        return res.status(200).json({
          ok: true,
          user: updatedUser,
          message: 'User successfully updated'
        })
      } else {
        return res.status(422).json({
          ok: false,
          message: 'Cannot update user',
          statusCode: 422
        })
      }
    })

    app.delete('/user/deleteUser/:id', async (req: any, res: any) => {
      const deleteResult = await Controllers.UsersContoller.removeById(
        req.params.id
      )

      if (deleteResult.affected == 1) {
        res.status(200).json({
          ok: true,
          message: 'User successfully deleted'
        })
      } else {
        res.status(422).json({
          ok: false,
          message: 'Cannot update user',
          statusCode: 422
        })
      }
    })

    app.patch('/tokens/add/:id', async (req: any, res: any) => {
      console.log('req.user', req.user)

      const addTokensResult =
        await Controllers.TokensController.operateWithTokensByUserId(
          req.params.id,
          +req.body.amount,
          true
        )

      const subtractTokensResult =
        await Controllers.TokensController.operateWithTokensByUserId(
          req.user.userId,
          +req.body.amount,
          false
        )

      const tokens = await Controllers.TokensController.getTokensByUserId(
        req.params.id
      )

      if (addTokensResult.ok == true && subtractTokensResult.ok == true) {
        return res.status(200).json({
          ok: true,
          tokens,
          message: 'Tokens successfully added'
        })
      } else {
        return res
          .status(400)
          .json({ ok: false, message: 'Cannot add tokens', statusCode: 400 })
      }
    })

    app.get('/tokens/getUsersTokens/:id', async (req: any, res: any) => {
      const tokens = await Controllers.TokensController.getTokensByUserId(
        req.params.id
      )

      if (tokens) {
        return res.status(200).json({
          ok: true,
          tokens
        })
      } else {
        return res
          .status(404)
          .json({ ok: false, message: 'Cannot get tokens', statusCode: 404 })
      }
    })

    app.get('/tokens/findAll', async (req: any, res: any) => {
      const tokens = await Controllers.TokensController.findAll()

      if (tokens) {
        return res.status(200).json({
          ok: true,
          tokens
        })
      } else {
        return res
          .status(404)
          .json({ ok: false, message: 'Cannot get tokens', statusCode: 404 })
      }
    })

    app.patch('/tokens/removeByUserId/:id', async (req: any, res: any) => {
      const removeResult = await Controllers.TokensController.removeByUserId(
        req.params.id
      )

      const tokens = await Controllers.TokensController.getTokensByUserId(
        req.params.id
      )

      if (removeResult.affected == 1) {
        return res.status(200).json({
          ok: true,
          tokens,
          message: 'Tokens successfully deleted'
        })
      } else {
        return res
          .status(422)
          .json({ ok: false, message: 'Cannot delete tokens', statusCode: 422 })
      }
    })

    app.get('/tokens/requestTokens/:id', async (req: any, res: any) => {
      const result = await Controllers.TokensController.requestTokens(
        req.params.id,
        req.body.amount
      )

      console.log('result', result)

      const tokens = await Controllers.TokensController.getTokensByUserId(
        req.params.id
      )

      if (result.ok == true) {
        return res.status(200).json({
          ok: true,
          balance: tokens.balance,
          message: 'Tokens successfully added'
        })
      } else {
        return res.status(400).json({
          ok: false,
          message: result.message,
          statusCode: 400
        })
      }
    })

    app.get('/llm/makeRequest', async (req: any, res: any) => {
      const result = await this.openRouter.makeRequest(req.body.message)

      console.log('result', result)

      const tokens = await Controllers.TokensController.getTokensByUserId(
        req.user.userId
      )

      if (result.usage.completionTokens > tokens.balance) {
        return res.status(400).json({
          ok: false,
          message: 'Not enough tokens on balance to make request'
        })
      }

      await Controllers.TokensController.operateWithTokensByUserId(
        req.user.userId,
        result.usage.totalTokens,
        false
      )

      return res.status(200).json({
        ok: true,
        message: result.choices[0].message.content
      })
    })
  }
}
