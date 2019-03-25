const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
/*
    POST /api/auth/register
    {
        username,
        password
    }
*/
exports.register = (req, res) => {

    const {username, password} = req.body
    let newUser = null

    //create a new user if doesn't exist

    const create = (user) => {
      if (user) {
        throw new Error('Username already exists.')
      }else {
        return User.create(username, password)
      }
    }

    //count the number of the user
    const count = (user) => {
      newUser = user
      return User.count({}).exec()
    }

    //assign admin if count is 1
    const assign = (count) => {
      if (count === 1) {
        return newUSer.assignAdmin()
      } else {
        return Promise.resolve(false)
      }
    }

    //respond to the client
    const respond = (isAdmin) => {
      res.json({
        message: 'registerd successfully',
        admin: isAdmin ? true : false
      })
    }

    //run when there's an error (if username exist)
    const onError = (error) => {
      res.status(409).json({
        message: error.message
      })
    }

    //check username duplication
    User.findOneByUsername(username)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError)
}

/*
    POST /api/auth/login
    {
        username,
        password
    }
*/

exports.login = (req, res) => {
    const {username, password} = req.body
    const secret = req.app.get('wootennis-secret')

    //check the uwer info&generate the jwt
    const check = (user) => {
      if (!user) {
        //user doesn't exists
        throw new Error('login failed')
      }else {
        //user exists, check the password
        if (user.verify(password)) {
          //create a promise generates jwt asynchronously
          const p = new Promise((resolve, reject) => {
            jwt.sign(
              {
                _id: user.id,
                username: user.username,
                admin: user.admin
              },
              secret,
              {
                expiresIn:'7d',
                issuer: 'wootennis.com',
                subject: 'userInfo'
              }, (err, token) => {
                if (err) reject(err)
                resolve(token)
              }
            )
          })
          return p
        }else {
          throw new Error('login failed')
        }
      }
    }
    //respond the jsonwebtoken
    const respond = (token) => {
      res.json({
        message: 'logged in successfully',
        token
      })
    }
    //error
    const onError = (error) => {
      res.status(403).json({
        message:  error.message
      })
    }

    //find the username
    User.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError)
}

/*
    GET /api/auth/check
*/

exports.check = (req, res) => {
  res.json({
    success: true,
    info: req.decoded
  })
}
