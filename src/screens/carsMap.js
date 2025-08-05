import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Button,
  TextInput
} from 'react-native';
import {Card, Text} from 'react-native-elements';
//import {TextInput} from 'react-native-gesture-handler';
import CarList from '../components/carList';
import {getCarList} from '../services/carListService';
import carListStore from '../store/carListStore';
import userStore from '../store/userStore';
import ModalScreen from './modal';
import {Header} from 'react-native-elements';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {navigationRef} from '../navigation/navigationRef';
import driverLogo from '../../assets/img/driver.png';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommutyIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import getCarsMap from '../services/mapService';
import {inject, observer} from 'mobx-react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {setBlockage} from '../services/blockageService';
import {ActivityIndicator} from 'react-native-paper';
import {makeAutoObservable, makeObservable} from 'mobx';
import sellerStore from '../store/sellerStore';
import sellerUI from '../../assets/sellerUI/sellerUI';

let interval = null;

@inject('carListStore')
@observer
export class CarsMap extends Component {
  constructor(props) {
    super(props);
    //makeAutoObservable(this)
    let tokenx = userStore.tokenx;
    let carInfo = props.route.params.carInfo;
    this.state = {
      carInfo: props.route.params.carInfo,
      carID: props.route.params.carInfo.ID,
      hello: props.route.params.hello,
      index: props.route.params.index,
      focus: false,
    };
  }
  startCarInterval() {
    interval = setInterval(function () {
      getCarsMap(carListStore.mapID);
    }, 5000);
  }
  clearCarInterval() {
    clearInterval(interval);
    interval = null;
  }
  toggleCarInterval() {
    if (interval == null) {
      this.startCarInterval();
    } else {
      this.clearCarInterval();
      console.log('====================================');
      console.log('clearlandı');
      console.log('====================================');
    }
  }
  componentDidMount() {
    this.startCarInterval();
  }
  componentWillUnmount() {
    this.clearCarInterval();
  }
  render() {
    let latitude = carListStore.mapLT;
    let longitude = carListStore.mapLG;
    let plate = carListStore.mapPlate;
    let speed = carListStore.mapSpeed;
    let adress = carListStore.mapAdress;
    let locationURL = Platform.select({
      ios: 'maps:' + latitude + ',' + longitude + '?q=' + adress,
      android: 'geo:' + latitude + ',' + longitude + '?q=' + adress,
    });
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={sellerUI.color3}
          leftComponent={
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={{marginLeft: 10}}
                onPress={() => {
                  this.clearCarInterval();
                  navigationRef.navigate('HomeScreen');
                }}>
                <Icon name="return-up-back" color="black" size={26} />
              </TouchableOpacity>
            </View>
          }
          centerComponent={{text: 'Harita Görüntüsü', style: styles.heading}}
        />

        <View
          style={{
            borderBottomWidth: 1,
            borderColor: 'gray',
            marginTop: 5,
            borderRadius: 10,
          }}>
          <Text style={{color: 'white', padding: 2, textAlign: 'center'}}>
            Son Bilgi: {carListStore.mapDate}
          </Text>
          <MapView
            key={'map'}
            
            showsUserLocation
           
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude: carListStore.mapLT,
              longitude: carListStore.mapLG,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}>
            <Marker
              key={'index'}
              coordinate={{
                latitude: carListStore.mapLT,
                longitude: carListStore.mapLG,
              }}
              title={plate}
              description={speed + ' km/h'}>
              <Image
                source={driverLogo}
                resizeMethod="scale"
                resizeMode="contain"
                style={{width: 35, height: 35}}
              />
            </Marker>
          </MapView>
          {/*<ActivityIndicator style={{position:'absolute', alignSelf:'center',marginTop:'60%'}} animating={true} size={26} color='red' />*/}
        </View>
        <View
          style={{flexDirection: 'row', justifyContent: 'flex-start', flex: 1}}>
          <View style={{marginVertical: 10, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(locationURL);
              }}
              style={styles.button}>
              <FontAwesome
                name="send"
                color={'#fff'}
                size={16}
                style={{marginRight: 10}}
              />
              <Text style={styles.text}>Git</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                getCarsMap(carListStore.mapID);
              }}
              style={styles.button}>
              <FontAwesome
                name="exclamation-triangle"
                color={'#fff'}
                size={16}
                style={{marginRight: 10}}
              />
              <Text style={styles.text}>Resetle </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setBlockage();
              }}
              style={styles.button}>
              <FontAwesome
                name="exclamation-triangle"
                color={'#fff'}
                size={16}
                style={{marginRight: 10}}
              />
              <Text style={styles.text}>BLOKAJ </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <Card containerStyle={{borderRadius: 15, flex: 1}}>
              <View style={{justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommutyIcons
                    name="truck"
                    color={'black'}
                    size={24}
                    style={{alignSelf: 'flex-end', marginRight: 10}}
                  />
                  <Text h4 h4Style={{fontSize: 17, color: '#404040'}}>
                    Plaka:
                  </Text>
                  <Text
                    h4
                    h4Style={{
                      fontSize: 15,
                      color: '#404040',
                      alignSelf: 'center',
                    }}>
                    {' ' + plate}
                  </Text>
                </View>
                <Card.Divider />
                <View style={{flexDirection: 'row'}}>
                  <MaterialIcons
                    name="speed"
                    color={'black'}
                    size={24}
                    style={{alignSelf: 'flex-end', marginRight: 10}}
                  />
                  <Text h4 h4Style={{fontSize: 17, color: '#404040'}}>
                    Hız:
                  </Text>
                  <Text
                    h4
                    h4Style={{
                      fontSize: 15,
                      color: '#404040',
                      alignSelf: 'center',
                    }}>
                    {' ' + carListStore.mapSpeed + '  km/h'}
                  </Text>
                </View>
                <Card.Divider />
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommutyIcons
                    name="map-marker-radius"
                    color={'black'}
                    size={24}
                    style={{alignSelf: 'center', marginRight: 10}}
                  />
                  <View>
                    <Text
                      h4
                      h4Style={{
                        fontSize: 17,
                        color: '#404040',
                        textAlign: 'center',
                      }}>
                      Adres
                    </Text>
                    <Card.Divider color="black" />
                    <Text
                      h4
                      h4Style={{
                        fontSize: 15,
                        color: '#404040',
                        alignSelf: 'center',
                        maxWidth: '80%',
                        textAlign: 'justify',
                      }}>
                      {adress}
                    </Text>
                  </View>
                </View>
                <Card.Divider />
              </View>
            </Card>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: 'white',
    padding: 5,
    margin: 5,
    marginTop: 15,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'black',
  },
  map: {
    height: 360,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: 'red',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'justify',
    margin: 2,
  },
  button: {
    padding: 10,
    margin: 1,
    backgroundColor: '#3A3A3A',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  buttonDisable: {
    padding: 10,
    margin: 1,
    backgroundColor: 'red',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
