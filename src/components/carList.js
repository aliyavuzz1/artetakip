import AsyncStorage from "@react-native-async-storage/async-storage";

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getCarList} from '../services/carListService';
import carListStore from '../store/carListStore';
import {ListItem} from 'react-native-elements/dist/list/ListItem';
import {Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {navigationRef} from '../navigation/navigationRef';
import getCarsMap from '../services/mapService';

const CarList = props => {
  const id = props.id;
  let plateArr = [];
  plateArr = carListStore.carsInfo;

  const [plate, setPlate] = useState('');
  const [carStatus, setCarStatus] = useState(0);

  async function removeToken() {
    await AsyncStorage.removeItem('tokenx');
    let a = await AsyncStorage.getItem('tokenx');
    console.log('REMOVED->>>>>', a);
  }

  //console.log('PLAKALAR:::::>>>>',carListStore.carsInfo);
  if (carStatus === 0) {
    return carListStore.car.map((data, index) => {
      return (
        <React.Fragment key={index}>
          <TouchableOpacity
            style={styles.item}
            onPress={async () => {
              //console.log(id);
              await getCarsMap(data.ID);
              carListStore.setCarReplayID(data.ID);
              navigationRef.navigate('CarsMap1', {
                hello: 'MAP ssssSCREEEN',
                carInfo: data,
                index: index,
              });
            }}>
            <View style={data.ST == 'black' ? styles.blackSeperator : null} />
            <View style={data.ST == 'danger' ? styles.redSeperator : null} />
            <View
              style={data.ST == 'warning' ? styles.yellowSeperator : null}
            />
            <View style={data.ST == 'success' ? styles.greenSeperator : null} />
            <View style={styles.itemLeft}>
              <View style={{flexDirection: 'column'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Icon
                    name="car-alt"
                    size={24}
                    color="black"
                    style={{marginLeft: 15}}
                  />
                  <Text
                    h4Style={{color: 'black', fontSize: 16, marginLeft: 10}}
                    h4>
                    Plaka:
                  </Text>
                  <Text
                    h4Style={{color: 'black', fontSize: 16, marginLeft: 10}}
                    h4>
                    {data.P}
                  </Text>
                </View>
                <Text style={[styles.nameText, {marginTop: -10}]}></Text>
                <Text style={styles.descriptionText}>Son Bilgi: {data.KT}</Text>
                {data.DR == ('' || '-' || null) ? null : (
                  <Text style={styles.nameText}>Şoför: {data.DR} </Text>
                )}
                <Text style={styles.nameText}>Adres:{data.LK}</Text>
                <Text style={styles.nameText}>Bekleme: {data.PT}</Text>
                <Text style={styles.nameText}>Gün/KM: {data.DD}</Text>
              </View>
            </View>
            <View style={styles.sharesText}>
              <Text style={styles.speedText}>{data.SP} km/h</Text>
            </View>
          </TouchableOpacity>
        </React.Fragment>
      );
    });
  } else if (carStatus === 1) {
    return <Text> CARSTATUS1</Text>;
  } else if (carStatus === 2) {
    return <Text> CARSTATUS2</Text>;
  } else if (carStatus === 3) {
    return <Text> CARSTATUS3</Text>;
  } else {
    return <Text> 0000</Text>;
  }
};
const styles = StyleSheet.create({
  item: {
    //flex:1,
    backgroundColor: '#FFFF',
    aspectRatio: 1 * 2,
    borderRadius: 15,
    marginBottom: 5,
    margin: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  direction: {
    justifyContent: 'center',
  },
  itemLeft: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '90%',
  },
  pictures: {
    width: 100,
    height: 66,
    backgroundColor: '#000',
    marginLeft: 5,
  },
  nameText: {
    fontSize: 14,
    marginLeft: 10,
    color: '#000',
    fontStyle: 'italic',
    fontWeight: 'bold',
    maxWidth: '90%',
  },
  plate: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  descriptionText: {
    color: '#000',
    marginLeft: 8,
  },
  sharesText: {
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  redSeperator: {
    backgroundColor: '#D2001A',
    height: '100%',
    width: '3%',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  greenSeperator: {
    backgroundColor: '#38E54D',
    height: '100%',
    width: '3%',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  yellowSeperator: {
    backgroundColor: '#FFDE00',
    height: '100%',
    width: '3%',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  blackSeperator: {
    backgroundColor: '#181818',
    height: '100%',
    width: '3%',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  speedText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
    fontStyle: 'italic',
    fontWeight: 'bold',
    maxWidth: '100%',
  },
});

export default CarList;
