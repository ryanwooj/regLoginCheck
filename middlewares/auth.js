const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  //read the token from header or url
  const token = req.headers['x-access-token'] || req.query.token

  //token doesn't exist
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Not logged in'

    })
  }

  //create a promise that decodes the token
  const p = new Promise((resolve, reject) => {
    jwt.verify(token, req.app.get('wootennis-secret'), (err,decoded) => {
      if (err) reject(err)
      resolve(decoded)
    })
  })

  //if it has failed to verify, it will return an error msg

  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message
    })
  }

  //process the promise
  p.then((decoded) => {
    req.decoded = decoded
    next()
  }).catch(onError)
}

module.exports = authMiddleware
