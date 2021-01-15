import { extendObservable } from 'mobx'

/**
 *UserStore
 */
class UserStore{
  constructor(){
    extendObservable(this, {
      history: true,
    })
  }
}

export default new UserStore();