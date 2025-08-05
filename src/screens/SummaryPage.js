import React, {Component, useEffect, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import {getCarList} from '../services/carListService';
import {Button, Header, Image, Input, Text} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {navigationRef} from '../navigation/navigationRef';
import {
  DrawerActions,
  useFocusEffect,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import {getCarToMap, getNotificationScreen} from '../components/getCarToHomeP';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {VictoryPie} from 'victory-native';
import {Svg} from 'react-native-svg';
import {i18n} from '../localization';
import getDailyTotalDistance, {
  getAlarmsDetail,
  getSummaryofCarsStatus,
  getTotalAlarms,
} from '../services/summaryServices';
import userStore from '../store/userStore';
import {
  AlarmLinesWithIcons,
  SummaryLinesWithIcons,
} from '../components/summaryLinesWithIcons';
import {FlatList} from 'react-native-gesture-handler';
import sellerUI from '../../assets/sellerUI/sellerUI';
import sellerInfo from '../../assets/sellerUI/sellerInfo';
import {sendM_TOKEN} from '../services/oneSignal/notificationService';
import {oneSignalSetId} from '../services/oneSignal/setExternalUID';
import {getDeviceState} from '../services/oneSignal/getDeviceState';
import {observer} from 'mobx-react';
import MapView, {Marker} from 'react-native-maps';
import getCarsMap from '../services/mapService';
import carListStore from '../store/carListStore';
import createPlateIconForAllCars from '../components/plateIconCreator';
import AllCarsMap from './AllCarsMap';
import HomeMap from './HomeMap';

const screenHeight = Dimensions.get('window').height;
let interval = null;
const SummaryPage = observer(() => {
  const widthAndHeight = Dimensions.get('window').width / 2.4;
  const [carsMostKilometerSt, setCarsMostKilometerSt] = useState(false);
  const [allAlarmsSt, setAllAlarmsSt] = useState(false);
  const [reRender, setReRender] = useState(false);
  const navigation = useNavigation();
  function handleBackButtonClick() {
    try {
      navigationRef.navigate('HomeScreen');
      return true;
    } catch (e) {}
  }
  const startCarInterval = () => {
    interval = setInterval(function () {
      getTotalAlarms();
      getDailyTotalDistance();
      getSummaryofCarsStatus();
      getAlarmsDetail();
    }, 5000);
  };

  const clearCarInterval = () => {
    clearInterval(interval);
    interval = null;
  };
  const renderMostKilometerLines = ({item, index}) => {
    return <SummaryLinesWithIcons params={item} index={index + 1} />;
  };
  const renderAlarmLines = ({item, index}) => {
    return <AlarmLinesWithIcons params={item} />;
  };
  useFocusEffect(
    React.useCallback(() => {
      startCarInterval();
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () => {
        clearCarInterval();
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
      };
    }, []),
  );

  useEffect(() => {
    getCarList();
    oneSignalSetId(); //OneSignal External User ID atandı.
    getDeviceState(); //OneSignal'den alınan player id ile app id veritabanında istenen formata getirildi.
    setTimeout(() => {
      sendM_TOKEN();
    }, 5000); //Uygulama tekrar açıldığında, M_TOKEN hazır olduktan sonra gönderilmesi için 5sn timeout atıldı.
  }, []);
  console.log('SummaryOfAllCarsStatus:', userStore.summaryOfAllCarsStatus);
  console.log('defedefedefedef:', userStore);

  return (
    <>
      <Header
        backgroundColor={sellerUI.color3}
        leftComponent={
          <View style={styles.headerRight}>
            <Pressable
              style={{marginLeft: 10}}
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}>
              <Ionicons name="menu" color={sellerUI.color4} size={26} />
            </Pressable>
          </View>
        }
        centerComponent={
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text
              h4
              h4Style={{
                fontSize: 21,
                alignSelf: 'center',
                fontWeight: '700',
                color: sellerUI.color4,
              }}
              numberOfLines={1}>
              {sellerInfo.companyName}
            </Text>
          </View>
        }
      />
      <ScrollView horizontal={false} style={{marginBottom: 20}}>
        <View style={{flex: 0.7, backgroundColor: '#F2F1F5'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              padding: 1,
              margin: 7,
              borderRadius: 10,
              flex: 1,
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
                margin: 4,
                padding: 5,
              }}>
              <View>
                <View style={styles.carStatusLine}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        backgroundColor: '#000',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <FontAwesome5 name="car-alt" size={20} color="#fff" />
                    </View>
                    <Text style={{marginLeft: 5, fontSize: 15}}>
                      {i18n.t('total')}:
                    </Text>
                  </View>
                  <Text style={{alignSelf: 'center', fontWeight: '700'}}>
                    {userStore.summaryOfAllCarsStatus.toplam}
                  </Text>
                </View>
                <View style={styles.carStatusLine}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        backgroundColor: '#B9FFAA',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <FontAwesome5 name="car-alt" size={20} color="#2B711B" />
                    </View>
                    <Text style={{marginLeft: 5, fontSize: 15}}>
                      {i18n.t('moving')}:{' '}
                    </Text>
                  </View>
                  <Text style={{alignSelf: 'center', fontWeight: '700'}}>
                    {userStore.summaryOfAllCarsStatus.hareketli}
                  </Text>
                </View>
                <View style={styles.carStatusLine}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        backgroundColor: '#FFF5B3',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <FontAwesome5 name="car-alt" size={20} color="#898200" />
                    </View>
                    <Text style={{marginLeft: 5, fontSize: 15}}>
                      {i18n.t('idling')}:{' '}
                    </Text>
                  </View>
                  <Text style={{alignSelf: 'center', fontWeight: '700'}}>
                    {userStore.summaryOfAllCarsStatus.rolanti}
                  </Text>
                </View>
                <View style={styles.carStatusLine}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        backgroundColor: '#FCC6C6',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <FontAwesome5 name="car-alt" size={20} color="#9B1E1E" />
                    </View>
                    <Text style={{marginLeft: 5, fontSize: 15}}>
                      {i18n.t('standing')}:{' '}
                    </Text>
                  </View>
                  <Text style={{alignSelf: 'center', fontWeight: '700'}}>
                    {userStore.summaryOfAllCarsStatus.duran}
                  </Text>
                </View>
                <View style={styles.carStatusLine}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        backgroundColor: '#D0D0D0',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <FontAwesome5 name="car-alt" size={20} color="#474747" />
                    </View>
                    <Text style={{marginLeft: 5, fontSize: 15}}>
                      {i18n.t('passive')}:{' '}
                    </Text>
                  </View>
                  <Text style={{alignSelf: 'center', fontWeight: '700'}}>
                    {userStore.summaryOfAllCarsStatus.kullanim_disi}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigationRef.navigate('HomeScreen')}>
              <View style={styles.pieWrapper}>
                <Svg width={widthAndHeight} height={widthAndHeight}>
                  <VictoryPie
                    width={widthAndHeight}
                    height={widthAndHeight}
                    innerRadius={70} // İç kısmı daha dar yap
                    padAngle={2} // Dilimler arasına hafif boşluk ekle
                    colorScale={['#2B711B', '#FFF5B3', '#9B1E1E', '#474747']}
                    data={[
                      {x: ' ', y: userStore.summaryOfAllCarsStatus.hareketli},
                      {x: ' ', y: userStore.summaryOfAllCarsStatus.rolanti},
                      {x: ' ', y: userStore.summaryOfAllCarsStatus.duran},
                      {
                        x: ' ',
                        y: userStore.summaryOfAllCarsStatus.kullanim_disi,
                      },
                    ]}
                  />
                </Svg>
                {/* TAM ORTADAKİ SAYI */}
                <View style={styles.pieCenterText}>
                  <Text style={styles.pieText}>
                    {userStore.summaryOfAllCarsStatus.toplam}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* <PieChart
              style={{alignSelf:'center'}}
              widthAndHeight={widthAndHeight}
              series={series}
              sliceColor={sliceColor}
              doughnut={true}
              coverRadius={0.50}
              coverFill={'#FFF'}
            /> */}
          </View>
        </View>
        <View style={styles.topContainer}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginTop: '5%',
              marginLeft: '2%',
            }}>
            {i18n.t('dailySummary')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigationRef.navigate('HomeScreen');
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                padding: 4,
                borderRadius: 10,
                marginTop: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    backgroundColor: '#FEF2DF',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    color={'#FF7B54'}
                    name="map-marker-distance"
                    size={22}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '400',
                    alignSelf: 'center',
                    marginLeft: 3,
                  }}>
                  {i18n.t('todaysTotalKm')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{alignSelf: 'center', color: 'gray', fontSize: 15}}>
                  {userStore.totalKilometer.en_cok_km} km
                </Text>
                <MaterialCommunityIcons
                  color={'gray'}
                  name="chevron-right"
                  size={22}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              //console.log(id);
              //await getCarsMap(userStore.totalKilometer.en_cok_km);
              //carListStore.setCarReplayID(data.ID);
              //navigationRef.navigate('CarsMap1',{cameFrom:'HomeScreen'});
              setCarsMostKilometerSt(st => !st);
              console.log('QWEEQWQ', carsMostKilometerSt);
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                padding: 4,
                borderRadius: 10,
                marginTop: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    backgroundColor: '#FEF2DF',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <FontAwesome5 name="car-alt" color={'#FF7B54'} size={22} />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '400',
                    alignSelf: 'center',
                    marginLeft: 3,
                  }}>
                  {i18n.t('mostKmInVehichles')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome
                  color={'gray'}
                  name={carsMostKilometerSt ? 'angle-down' : 'angle-right'}
                  size={22}
                  style={{marginRight: 5}}
                />
              </View>
            </View>
          </TouchableOpacity>
          {carsMostKilometerSt ? (
            <ScrollView horizontal>
              <FlatList
                nestedScrollEnabled
                scrollEnabled={false}
                style={{width: Dimensions.get('window').width * 0.95}}
                data={userStore.totalKilometer.result}
                renderItem={renderMostKilometerLines}
                initialNumToRender={3}
                keyExtractor={(item, index) => String(index)}
                scrollIndicatorInsets={{right: 1}}
              />
            </ScrollView>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              setAllAlarmsSt(st => !st);
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                padding: 4,
                borderRadius: 10,
                marginTop: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    backgroundColor: '#FEF2DF',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <FontAwesome5
                    name="exclamation"
                    color={'#FF7B54'}
                    size={22}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '400',
                    alignSelf: 'center',
                    marginLeft: 3,
                  }}>
                  {i18n.t('totalAlarm')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: 'gray',
                    fontSize: 13,
                    maxWidth: '80%',
                    marginRight: 7,
                  }}>
                  {userStore.totalAlarms.total_ihlal}
                </Text>
                <FontAwesome
                  color={'gray'}
                  name={allAlarmsSt ? 'angle-down' : 'angle-right'}
                  size={22}
                  style={{marginRight: 5}}
                />
              </View>
            </View>
          </TouchableOpacity>
          {allAlarmsSt ? (
            <ScrollView horizontal>
              <FlatList
                nestedScrollEnabled
                scrollEnabled={false}
                style={{width: Dimensions.get('window').width * 0.95}}
                data={userStore.totalAlarms.result}
                renderItem={renderAlarmLines}
                initialNumToRender={3}
                keyExtractor={(item, index) => String(index)}
                scrollIndicatorInsets={{right: 1}}
              />
            </ScrollView>
          ) : null}
        

          <View
            style={{
              marginTop: '12%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: '1%',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigationRef.navigate('HomeScreen');
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 4,
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    color={'#000'}
                    name="car-2-plus"
                    size={26}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '600',
                    alignSelf: 'center',
                    marginLeft: 3,
                  }}>
                  {i18n.t('myCars')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                getCarToMap();
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 4,
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '600',
                    alignSelf: 'center',
                    marginRight: '2%',
                  }}>
                  {i18n.t('map')}
                </Text> 
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons color={'#000'} name="map" size={26} />
                </View>
              </View>
            </TouchableOpacity> 
           </View>
        </View>
      </ScrollView>
    </>
  );
});

export default SummaryPage;

const styles = StyleSheet.create({
  topContainer: {
    flex: 1.6,
    padding: 5,
    margin: 4,
  },
  carStatusLine: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 6,
    justifyContent: 'space-between',
    width: '80%',
  },
  pieContainer: {
    position: 'relative', // absolute yerine relative kullan, normal akışta kalsın
    alignSelf: 'center', // Ortaya hizala
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20, // Yukarı doğru kaydır (beyaz alana girmesi için)
  },
  pieCenterText: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieWrapper: {
    alignSelf: 'center', // Ortaya al
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10, // Hafif yukarı kaydır
  },
 mapContainer: {
    height: screenHeight * 0.3,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
