import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Image} from 'react-native';
import carListStore from '../store/carListStore';
//Araba-Marker Resimleri   
import redCar from '../../assets/img/kirmizi.png';
import greenCar from '../../assets/img/yesil.png';
import yellowCar from '../../assets/img/sari.png';
import blackCar from '../../assets/img/siyah.png';
const markerWithCarStatus = (status) => {
    console.log('status', status);
    if (status == '2') {
        return(
            <Image source={greenCar}
                style={{height:75,width:75, transform:[{rotate:carListStore.mapRotate+'deg'}] }}
                resizeMethod='scale'
                resizeMode='contain' 
              />  
        )
    } else if (status == '9'){
        return(
            <Image source={blackCar}
                  style={{height:75,width:75, transform:[{rotate:carListStore.mapRotate+'deg'}] }}
                  resizeMethod='scale'
                  resizeMode='contain' 
                />  
        )
    }else if (status == '0'){
        return(
            <Image source={redCar}
                  style={{height:75,width:75, transform:[{rotate:carListStore.mapRotate+'deg'}] }}
                  resizeMethod='scale'
                  resizeMode='contain' 
            />  
        )
    }else {
        return(
            <Image source={yellowCar}
                style={{height:75,width:75, transform:[{rotate:carListStore.mapRotate+'deg'}] }}
                resizeMethod='scale'
                resizeMode='contain' 
              />  
        )
    };
  };

  export default markerWithCarStatus;