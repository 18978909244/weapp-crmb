const post = require('./request').post

module.exports = {
  getCartCount: () => {
    return post('/routine/auth_api/get_cart_num')
  },
  getFirstCat: () => {
    return post('/routine/auth_api/get_pid_cate')
  },
  getChildCat: (id) =>{
    return post('/routine/auth_api/get_id_cate',{
      id
    })
  },
  getAllCat:()=>{
    return post('/routine/auth_api/get_tree_cate')
  }
}