//import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {observable, action, configure, makeObservable, toJS} from 'mobx';


//Araba-Marker Resimleri   
import redCar from '../../assets/img/kirmizi.png';
import greenCar from '../../assets/img/yesil.png';
import yellowCar from '../../assets/img/sari.png';
import blackCar from '../../assets/img/siyah.png';

configure({
  enforceActions: 'observed',
});

class CarListStore {
  @observable car;
  @observable mapCar = this.car;
  @observable allCarsMap;
  @observable index = null;
  @observable plate = [];
  @observable carsInfo = [];
  @observable redCars ;
  @observable blackCars;
  @observable greenCars;
  @observable yellowCars;
  @observable chosenPlate = null;
  @observable modalStatus = false;
  @observable mapLT;
  @observable mapLG;
  @observable temperature;
  @observable mapPlate;
  @observable mapSpeed;
  @observable mapAdress;
  @observable carID;
  @observable mapDate;
  @observable mapID;
  @observable mapST;
  @observable mapRotate;
  @observable mapActI = false;
  @observable carReplayID;
  @observable replayData = [];
  @observable refreshFlatlist = true;
  @observable mapMarkersImage;
  @observable mapMarkersIconColor;
  @observable mapMarkersType ;
  @observable polylineCoordinates = [
    { latitude: 37.8025259, longitude: -122.4351431 },
    { latitude: 37.7896386, longitude: -122.4216463 },
    { latitude: 37.7665248, longitude: -122.4161628 },
    { latitude: 37.7734153, longitude: -122.4577787 },
    { latitude: 37.7948605, longitude: -122.4596065 },
    { latitude: 37.8025259, longitude: -122.4351431 }
  ];
  @observable GLOBAL_CARS = this.car;
  @observable mapActId;
  constructor() {
    makeObservable(this);
  }

  @action setCar = async device => {
    this.car = device;
  };
  @action setMapCar = async data => {
    this.mapCar = data;
    switch (data.mobil_icon) {
      case '0':
        this.mapMarkersType = 'icon';
        break;
      case '1':
        this.mapMarkersType = 'image';
        break;
      case '2':
        this.mapMarkersType = 'dot';
        break;
      default:
        this.mapMarkersType = 'dot';
        break;
    }
  };
  @action setAllCarsMap = async data => {
    this.allCarsMap = data;
  };
  @action setCarsInfo = async data => {
    this.carsInfo.push(data);
  };
   @action setTemperature = async data => {
    this.temperature = data;
  };
  @action setRedCars = async data => {
    this.redCars = data;
  };
  @action setBlackCars = async data => {
    this.blackCars = data;
  };
  @action setGreenCars = async data => {
    this.greenCars = data;
  };
  @action setYellowCars = async data => {
    this.yellowCars = data;
  };
  @action setMapLT = async data => {
    this.mapLT = parseFloat(data);
  };
  @action setMapLG = async data => {
    this.mapLG = parseFloat(data);
  };
  @action setMapPlate = async data => {
    this.mapPlate = data;
  };
  @action setMapSpeed = async data => {
    this.mapSpeed = data;
  };
  @action setMapAdress = async data => {
    this.mapAdress = data;
  };
  @action setMapID = async data => {
    this.mapID = data;
  };
  @action setMapST = async data => {
    this.mapST = data;
    if (data == '2') {
      this.mapMarkersImage = greenCar;
      this.mapMarkersIconColor = 'green'; 
    } else if (data == '9') {
      this.mapMarkersImage = blackCar
      this.mapMarkersIconColor = 'black'; 
    }else if (data == '0') {
      this.mapMarkersImage = redCar
      this.mapMarkersIconColor = 'red'; 
    }else if (data == '1') {
      this.mapMarkersImage = yellowCar
      this.mapMarkersIconColor = '#F0A500'; 
    }
  };
  @action setMapRotate = async data => {
    this.mapRotate = data;
  };
  @action setMapActI = async data => {
    this.mapActI = data;
  };
  @action setCarID = async data => {
    this.carID = data;
  };
  @action setPlate = data => {
    this.plate.push(data);
    console.log('Eklendi', data);
  };
  @action setMapDate = data => {
    this.mapDate = data;
    console.log('====================================');
    console.log('Tarih Değişti');
    console.log('====================================');
  };
  @action setModalStatus = data => {
    this.modalStatus = data;
  };
  @action setChoosenPlate = data => {
    this.chosenPlate = data;
  };
  @action setCarReplayID = data => {
    this.carReplayID = data;
  };
  @action setReplayData = data => {
    this.replayData = data;
  };
  @action setPolylineCoordinates = data => {
    this.polylineCoordinates = data;
  };
  @action SET_GLOBAL_CARS = data => {
    this.GLOBAL_CARS = data;
  };
  @action toggleRefreshFlatlist = () => {
    this.refreshFlatlist = !this.refreshFlatlist
  };
  @action setMapMarkerType = data =>{
    this.mapMarkersType = data;
  }
  @action setMapActId = data => {
    this.mapActId = data;
  }
}
export default new CarListStore();
