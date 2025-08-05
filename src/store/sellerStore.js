
import {observable, action, configure, makeObservable,} from 'mobx';

configure({
  enforceActions: 'observed',
});

class sellerStore {

  @observable sellerInfo;

  constructor() {
    makeObservable(this);
  }

  @action setSellerInfo = async data => {
    this.sellerInfo = data;
  };
}
export default new sellerStore();
