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
import { Card, Button } from 'react-native-elements';



const CarListv2 = props => {
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

  if (carStatus === 0) {
    return carListStore.car.map((data, index) => {
      return (
      <View key={index} style={{marginVertical:5}}>
        <Card>
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
                    h4Style={{color: 'black', fontSize: 16, marginLeft: 10,fontWeight:'700'}}
                    h4>
                    Plaka:
                  </Text>
                  <Text
                    h4Style={{color: 'black', fontSize: 16, marginLeft: 10, textAlign:'center',fontWeight:'bold'}}
                    h4>
                    {data.P}
                  </Text>
                </View>
                <Card.Divider width={1}/>
                <Text style={styles.descriptionText}>Son Bilgi: {data.KT}</Text>
                <Text style={styles.nameText}>Bekleme: {data.PT}</Text>
                <Text style={styles.nameText}>Gün/KM: {data.DD}</Text>
              </View>
            </View>
            <View style={styles.sharesText}>
              <Text style={styles.speedText}>{data.SP} km/h</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
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


export default CarListv2;


const styles = StyleSheet.create({
  item: {
    //flex:1,
    //backgroundColor: 'gray',
    aspectRatio: 1 * 2.5,
    borderRadius: 15,
    justifyContent: 'space-between',
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
    fontWeight: '500',
    marginTop:1
  },
  plate: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  descriptionText: {
    color: '#000',
    marginLeft:8,
    marginTop:-5,
    marginBottom:5,
    fontSize:14,
    fontWeight:'600'
  },
  sharesText: {
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  redSeperator: {
    backgroundColor: '#D2001A',
    height: '7%',
    width: '100%',
    marginTop:'-4%',
    padding:10,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  greenSeperator: {
    backgroundColor: '#38E54D',
    height: '7%',
    width: '100%',
    marginTop:'-4%',
    padding:10,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  yellowSeperator: {
    backgroundColor: '#FFDE00',
    height: '7%',
    width: '100%',
    marginTop:'-4%',
    padding:10,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  blackSeperator: {
    backgroundColor: '#413F42',
    height: '7%',
    width: '100%',
    marginTop:'-4%',
    padding:10,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  speedText: {
    fontSize: 16,
    color: '#000',
    fontStyle: 'italic',
    fontWeight: 'bold',
    maxWidth: '100%',
    textAlign:'right'
  },
});

