const post = require('./request').post
module.exports={
  createOrder:orderKey=>data=>{
    return post('/routine/auth_api/create_order?key='+orderKey, data)
  }
}