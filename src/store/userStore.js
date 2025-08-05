//import Mobx
import AsyncStorage from "@react-native-async-storage/async-storage";
import {observable, action, configure, makeObservable, toJS} from 'mobx';

configure({
  enforceActions: 'never',
});

class UserStore {
  @observable user = {};
  @observable visible2 = false;
  @observable group = 0;
  @observable rolanti = 0;
  @observable active = 0;
  @observable offline = 0;
  @observable park = 0;
  @observable totalVehicle = 0;
  @observable M_TOKEN = null;
  @observable showUserLocation = false;
  @observable visible = false;
  @observable filterText = null;
  @observable modalVisible = false;
  @observable search = '';
  @observable page = 1;
  @observable endPage = false;
  @observable AllVehicleList = [];
  @observable reportDetail = '';
  @observable remember = false;
  @observable tokenx = null;
  @observable ID = null;
  @observable rememberMe;
  @observable userNotifStatus;
  @observable activationTimeList;
  @observable companyInfo;
  @observable showMessageBox = false;
  @observable responseMessage ;
  @observable passwordChangeResult;
  @observable userName = '-';
  @observable notifications;
  @observable notificationIndicator = false;
  @observable totalAlarms = 0;
  @observable totalKilometer = 0;
  @observable summaryOfAllCarsStatus;
  @observable choosenLanguage;
  @observable campaign;
  constructor() {
    makeObservable(this);
  }

  @action resetUserStore (){
    this.ID = null;
    this.notifications = null;
    this.M_TOKEN = null;
    this.companyInfo = null;
    this.activationTimeList = null;
  }
  @action kullanici(name, pass) {
    this.user.name = name;
    this.user.password = pass;
    console.log(this.user.name);
  }
  @action setRemember(data) {
    this.remember = data;
  }
  @action setUserName(data) {
    this.userName = data;
  }
  @action setTokenx(data) {
    this.tokenx = data;
  }
  @action async setUser(data) {
    this.user = data;
  }
  @action async userCheck() {
    return await getUser();
  }
  @action async setShowMessageBox(data) {
    this.showMessageBox = data;
  }
  @action setPasswordChangeResult(value) {
    this.passwordChangeResult = value
  }
  @action setResponseMessage = async value => {
    this.responseMessage = value;
  };
  @action setUserValue(data) {
    this.user = data;
  }
  @action setGroup(gid) {
    this.group = gid;
  }
  @action setPage(page) {
    this.page = page;
  }
  @action setAllVehicleListValue(value) {
    this.AllVehicleList = value;
  }
  @action setEndPage(value) {
    this.endPage = value;
  }
  @action setM_TOKEN = async M_TOKEN => {
    this.M_TOKEN = M_TOKEN;
  };

  @action setID = async ID => {
    this.ID = ID;
  };

  @action setShowUserLocation = async value => {
    this.showUserLocation = value;
  };

  @action setVisible = async value => {
    this.visible = value;
  };
  @action setVisible2 = async value => {
    this.visible2 = value;
  };
  @action setModalVisible = value => {
    this.modalVisible = value;
    console.log('setmodelvisiblee', this.modalVisible);
  };
  @action setFilterTextValue(value) {
    this.filterText = value;
  }
  @action setFilterText = async value => {
    let param = {
      filterType: 'filter',
      text: value,
    };
    this.resetAllVehicle();
    await this.setAllVehicleList(this.page, param);
    this.setFilterTextValue(value);
    this.setModalVisible(false);
  };

  @action setSearchValue(value) {
    this.search = value;
  }

  @action setSearch = async value => {
    this.search = value;
    let param = {
      filterType: 'search',
      text: value,
    };
    this.resetAllVehicle();
    await this.setAllVehicleList(this.page, param);
    this.setSearchValue(value);
    this.setModalVisible(false);
  };
  @action setRememberMe = data => {
    this.rememberMe = data;
  };
  @action setUserNotifStatus = data => {
    this.userNotifStatus = data;
  };
  @action setCompanyInfo = async  (data) => {
    this.companyInfo = data;
  };
  @action setActivationTimeList = async data => {
    this.activationTimeList = data;
  };
  @action setNotifications = data => {
    this.notifications = data;
  };
  @action setNotificationIndicator = data => {
    this.notificationIndicator = data;
  }
  @action setTotalAlarms = data => {
    this.totalAlarms = data;
  }
  @action setTotalKilometer = data => {
    this.totalKilometer = data;
  }
  @action setSummaryOfAllCarsStatus = data => {
    this.summaryOfAllCarsStatus = data;
  }
  @action setChoosenLanguage = data => {
    this.choosenLanguage = data;
  }
  @action setCampaign = data => {
    this.campaign = data;
  }
}
export default new UserStore();
