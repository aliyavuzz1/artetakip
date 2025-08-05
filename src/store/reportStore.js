//import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {observable, action, configure, makeObservable, toJS} from 'mobx';

configure({
  enforceActions: 'observed',
});

class reportStore {
  @observable carActDetail = [];
  @observable excelVariant = [];
  @observable totalIndex = 0;
  @observable LAT1;
  @observable LAT2;
  @observable LNG1;
  @observable LNG2;
  @observable reportPlate;
  @observable adress1;
  @observable adress2;
  @observable carID;
  @observable mapDate;
  @observable mapID;
  @observable mapST;
  @observable fark;
  @observable loading = false;
  @observable ignitionReport= [];
  @observable fuelLevelReport= [];
  @observable fuelLevelArr= [];
  constructor() {
    makeObservable(this);
  }

  @action setLAT1 = async data => {
    this.LAT1 = data;
  };
  @action setLAT2 = async data => {
    this.LAT2 = data;
  };
  @action setLNG1 = async data => {
    this.LNG1 = data;
  };
  @action setLNG2 = async data => {
    this.LNG2 = data;
  };
  @action setReportPlate = async data => {
    this.reportPlate = data;
  };
  @action setAdress1 = async data => {
    this.adress1 = data;
  };
  @action setAdress2 = async data => {
    this.adress2 = data;
  };
  @action setFark = async data => {
    this.fark = data;
  };
  @action setCarActDetail = async data => {
    this.carActDetail = data;
  };
  @action setExcelVariant = async data => {
    this.excelVariant = data;
  };
  @action setTotalIndex = async data => {
    this.totalIndex = data;
  };
  @action setLoading = async data => {
    this.loading = data;
    console.log('====================================');
    console.log(this.loading);
    console.log('====================================');
  };
  @action setIgnitionReport = async data => {
    this.ignitionReport = data;
  };
  @action setFuelLevelReport = async data => {
    this.fuelLevelReport = data;
  };
  @action getFuelLevelArr = () => {
    this.fuelLevelArr = [...this.fuelLevelReport];
    this.fuelLevelArr = this.fuelLevelArr.map((val) => {
      return Number(val.FL)
    })
  }
}
export default new reportStore();
