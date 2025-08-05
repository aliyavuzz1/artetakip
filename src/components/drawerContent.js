import React, {useState} from 'react';
import {Image, Text} from 'react-native-elements';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Linking, View, TouchableOpacity,Alert} from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigationRef} from '../navigation/navigationRef';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import userStore from '../store/userStore';
import {getPlakaService} from '../services/getPlakaService';
import {
  getCampaignsScreen,
  getCarToMap,
  getNotificationScreen,
  getProfileScreen,
} from './getCarToHomeP';
import {clearM_TOKEN} from '../services/logoutService';
import sellerStore from '../store/sellerStore';
import {i18n} from '../localization';
import sellerUI from '../../assets/sellerUI/sellerUI';
import sellerInfo from '../../assets/sellerUI/sellerInfo';
import { SafeAreaView } from 'react-native-safe-area-context';

export function CustomDrawerContent(props) {
  const logout = async () => {
  Alert.alert(
    i18n.t('logout'), // Örn: 'Çıkış Yap' / 'Log Out'
    i18n.t('logoutMessage'), // Örn: 'Çıkmak istediğinize emin misiniz?' / 'Are you sure you want to log out?'
    [
      {
        text: i18n.t('cancel'), // Örn: 'İptal' / 'Cancel'
        style: 'cancel',
      },
      {
        text: i18n.t('ok'), // Örn: 'Evet' / 'Yes'
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          userStore.clearUser?.();
          navigationRef.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]
  );
  };

  //'http://m1.aragis.com/resimuret/firmalar/arte.png'
  const [rapor, setRapor] = useState(false);
  const [canbus, setCanbus] = useState(false);
  const [aktivite, setAktivite] = useState(false);
  const [sefer, setSefer] = useState(false);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: sellerUI.color1}}>
      <View
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
        }}>
        <Image
          resizeMethod="resize"
          resizeMode="contain"
          source={require('../../assets/sellerUI/sellerIcons/arte.png')}
          style={{
            padding: 1,
            aspectRatio: 1 * 1,
            margin: 5,
            marginTop: '5%',
            width: '70%',
          }}></Image>
      </View>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{marginTop: -10}}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('SummaryPage');
          }}
          style={{
            paddingBottom: '6%',
            flexDirection: 'row',
            marginLeft: 7,
            alignItems: 'center',
          }}>
          <FontAwesome name={'home'} size={22} color={sellerUI.color2} />
          <View style={{marginLeft: '4%'}} disabled={true}>
            <Text
              style={{
                fontSize: 18,
                marginLeft: '4%',
                color: sellerUI.color2,
              }}>
              {i18n.t('home')}
            </Text>
          </View>
          <FontAwesome
            style={{marginLeft: 'auto', marginRight: 10}}
            name={'angle-right'}
            size={18}
            color={sellerUI.color2}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('HomeScreen');
          }}
          style={{
            paddingBottom: '6%',
            flexDirection: 'row',
            marginTop: 8,
            marginLeft: 7,
            alignItems: 'center',
          }}>
          <FontAwesome5 name={'car-alt'} size={22} color={sellerUI.color2} />
          <View style={{marginLeft: '4%'}} disabled={true}>
            <Text
              style={{
                fontSize: 18,
                marginLeft: '4%',
                color: sellerUI.color2,
              }}>
              {i18n.t('myCars')}
            </Text>
          </View>
          <FontAwesome
            style={{marginLeft: 'auto', marginRight: 10}}
            name={'angle-right'}
            size={18}
            color={sellerUI.color2}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            getCarToMap();
          }}
          style={{
            paddingBottom: '6%',
            flexDirection: 'row',
            marginTop: 8,
            marginLeft: 7,
            alignItems: 'center',
          }}>
          <FontAwesome name={'map'} size={18} color={sellerUI.color2} />
          <View style={{marginLeft: '4%'}} disabled={true}>
            <Text
              style={{
                fontSize: 18,
                marginLeft: '5%',
                color: sellerUI.color2,
              }}>
              {i18n.t('map')}
            </Text>
          </View>
          <FontAwesome
            style={{marginLeft: 'auto', marginRight: 10}}
            name={'angle-right'}
            size={18}
            color={sellerUI.color2}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            getProfileScreen();
          }}
          style={{
            paddingBottom: '6%',
            flexDirection: 'row',
            marginTop: 8,
            marginLeft: 7,
            alignItems: 'center',
          }}>
          <FontAwesome name={'user-circle'} size={20} color={sellerUI.color2} />
          <View style={{marginLeft: '4%'}} disabled={true}>
            <Text
              style={{
                fontSize: 18,
                marginLeft: '4%',
                marginTop: 3,
                color: sellerUI.color2,
              }}>
              {i18n.t('profile')}
            </Text>
          </View>
          <FontAwesome
            style={{marginLeft: 'auto', marginRight: 10}}
            name={'angle-right'}
            size={18}
            color={sellerUI.color2}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setRapor(!rapor),
              setCanbus(false),
              setAktivite(false),
              setSefer(false);
          }}
          style={{
            paddingBottom: '6%',
            flexDirection: 'row',
            marginTop: 8,
            marginLeft: 10,
            alignItems: 'center',
          }}>
          <FontAwesome name={'file-text'} size={18} color={sellerUI.color2} />
          <View style={{marginLeft: '4%'}} disabled={true}>
            <Text
              style={{
                fontSize: 18,
                marginLeft: '3%',
                marginTop: 3,
                color: sellerUI.color2,
              }}>
              {i18n.t('reportManagement')}
            </Text>
          </View>
          <FontAwesome
            style={{marginLeft: 'auto', marginRight: 10}}
            name={rapor === false ? 'angle-right' : 'angle-down'}
            size={18}
            color={sellerUI.color2}
          />
        </TouchableOpacity>
        {rapor === true ? (
          <>
            {/*
                    {<TouchableOpacity
                        onPress={() => {
                            setCanbus(!canbus)
                            setAktivite(false)
                            setSefer(false)
                        }}
                        style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 20,alignItems:'center'}}>
                        <FontAwesome name={'microchip'} size={18}
                                        color={'#616161'}/>
                        <View style={{marginLeft: '4%'}} disabled={true}>
                            <Text style={{
                                fontSize: 16,
                                marginLeft: '4%',
                                marginTop: 3,
                                color: '#616161',
                            }}>Canbus Raporları</Text>
                        </View>
                        <FontAwesome style={{marginLeft: 'auto', marginRight: 10}}
                                        name={canbus === false ? 'angle-right':'angle-down'}
                                        size={16} color={'#616161'}/>
                    </TouchableOpacity>}
*/}
            {/*
                        canbus === true ?
                            <>
                        <TouchableOpacity
                            onPress={() => {
                                getPlakaService(" AND CAN=1 ");
                                navigationRef.navigate('FuelLevelReports')
                            }}
                            style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>
                            <View style={{marginLeft: '10%'}} disabled={true}>
                                <Text style={{
                                    fontSize: 16,
                                    marginLeft: '3%',
                                    marginTop: 3,
                                    color: '#616161',
                                }}>Yakıt-Seviye Raporu</Text>
                            </View>
                            <FontAwesome style={{marginLeft: 'auto', marginRight: 10}}
                                            name={'angle-right'}
                                            size={16} color={'#616161'}/>
                        </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                    getPlakaService(" AND CAN=1 ");
                                    navigationRef.navigate('FuelGraph')
                                    }}
                                    style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>
                                    <View style={{marginLeft:'10%'}} disabled={true}>
                                        <Text style={{
                                            fontSize: 16,
                                            marginLeft: '4%',
                                            marginTop: 3,
                                            color: '#616161',
                                        }}>Yakıt-Grafik Raporu</Text>
                                    </View>
                                    <FontAwesome style={{marginLeft: 'auto', marginRight: 10}}
                                                    name={'angle-right'}
                                                    size={16} color={'#616161'}/>
                                </TouchableOpacity>
                            </>
                                :null 
                    */}

            <TouchableOpacity
              onPress={() => {
                setAktivite(!aktivite);
                setCanbus(false);
                setSefer(false);
              }}
              style={{
                paddingBottom: '6%',
                flexDirection: 'row',
                marginTop: 8,
                marginLeft: 20,
                alignItems: 'center',
              }}>
              <FontAwesome
                name={'line-chart'}
                size={17}
                color={sellerUI.color2}
              />
              <View style={{marginLeft: '4%'}} disabled={true}>
                <Text
                  style={{
                    fontSize: 17,
                    marginLeft: '4%',
                    marginTop: 3,
                    color: sellerUI.color2,
                  }}>
                  {i18n.t('activityReports')}
                </Text>
              </View>
              <FontAwesome
                style={{marginLeft: 'auto', marginRight: 10}}
                name={aktivite === false ? 'angle-right' : 'angle-down'}
                size={17}
                color={sellerUI.color2}
              />
            </TouchableOpacity>
            {aktivite === true ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    getPlakaService();
                    navigationRef.navigate('ActivitySummary');
                  }}
                  style={{
                    paddingBottom: '6%',
                    flexDirection: 'row',
                    marginTop: 8,
                    marginLeft: 20,
                    alignItems: 'center',
                  }}>
                  <View style={{marginLeft: '4%'}} disabled={true}>
                    <Text
                      style={{
                        fontSize: 16,
                        marginLeft: '4%',
                        marginTop: 3,
                        color: sellerUI.color2,
                      }}>
                      {i18n.t('activity_summary')}
                    </Text>
                  </View>
                  <FontAwesome
                    style={{marginLeft: 'auto', marginRight: 10}}
                    name={'angle-right'}
                    size={16}
                    color={sellerUI.color2}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    getPlakaService();
                    navigationRef.navigate('ActivityDetail');
                  }}
                  style={{
                    paddingBottom: '6%',
                    flexDirection: 'row',
                    marginTop: 8,
                    marginLeft: 20,
                    alignItems: 'center',
                  }}>
                  <View style={{marginLeft: '4%'}} disabled={true}>
                    <Text
                      style={{
                        fontSize: 16,
                        marginLeft: '4%',
                        marginTop: 3,
                        color: sellerUI.color2,
                      }}>
                      {i18n.t('activity_detail')}
                    </Text>
                  </View>
                  <FontAwesome
                    style={{marginLeft: 'auto', marginRight: 10}}
                    name={'angle-right'}
                    size={16}
                    color={sellerUI.color2}
                  />
                </TouchableOpacity>
                {/*
                                <TouchableOpacity
                                    onPress={()=>{props.navigation.navigate('alarmreports')}}
                                    style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>
                                    <View style={{marginLeft: '4%'}} disabled={true}>
                                        <Text style={{
                                            fontSize: 16,
                                            marginLeft: '4%',
                                            marginTop: 3,
                                            color: '#616161',
                                        }}>Alarm Raporu</Text>
                                    </View>
                                    <FontAwesome style={{marginLeft: 'auto', marginRight: 10}} name={'angle-right'}
                                                    size={16} color={'#616161'}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={()=>{props.navigation.navigate('speedchartreports')}}
                                    style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>

                                    <View style={{marginLeft: '4%'}} disabled={true}>
                                        <Text style={{
                                            fontSize: 16,
                                            marginLeft: '4%',
                                            marginTop: 3,
                                            color: '#616161',
                                        }}>Hız Grafik Raporu</Text>
                                    </View>
                                    <FontAwesome style={{marginLeft: 'auto', marginRight: 10}} name={'angle-right'}
                                                    size={16} color={'#616161'}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={()=>{props.navigation.navigate('distancesummaryreports')}}
                                    style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>
                                    <View style={{marginLeft: '4%'}} disabled={true}>
                                        <Text style={{
                                            fontSize: 16,
                                            marginLeft: '4%',
                                            marginTop: 3,
                                            color: '#616161',
                                        }}>Mesafe Özet Raporu</Text>
                                    </View>
                                    <FontAwesome style={{marginLeft: 'auto', marginRight: 10}} name={'angle-right'}
                                                    size={16} color={'#616161'}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={()=>{props.navigation.navigate('eventsviolationsreports')}}
                                    style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>
                                    <View style={{marginLeft: '4%'}} disabled={true}>
                                        <Text style={{
                                            fontSize: 16,
                                            marginLeft: '4%',
                                            marginTop: 3,
                                            color: '#616161',
                                        }}>Olay/İhlaller Raporu</Text>
                                    </View>
                                    <FontAwesome style={{marginLeft: 'auto', marginRight: 10}} name={'angle-right'}
                                                    size={16} color={'#616161'}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={()=>{props.navigation.navigate('waitreports')}}
                                    style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>
                                    <View style={{marginLeft: '4%'}} disabled={true}>
                                        <Text style={{
                                            fontSize: 16,
                                            marginLeft: '4%',
                                            marginTop: 3,
                                            color: '#616161',
                                        }}>Bekleme Raporu</Text>
                                    </View>
                                    <FontAwesome style={{marginLeft: 'auto', marginRight: 10}} name={'angle-right'}
                                                    size={16} color={'#616161'}/>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    onPress={()=>{props.navigation.navigate('activitystatus')}}
                                    style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>
                                    <View style={{marginLeft: '4%'}} disabled={true}>
                                        <Text style={{
                                            fontSize: 16,
                                            marginLeft: '4%',
                                            marginTop: 3,
                                            color: '#616161',
                                        }}>Duraklama Raporu</Text>
                                    </View>
                                    <FontAwesome style={{marginLeft: 'auto', marginRight: 10}} name={'angle-right'}
                                                    size={16} color={'#616161'}/>
                                </TouchableOpacity>
                                */}
              </>
            ) : null}
            {
              <TouchableOpacity
                onPress={() => {
                  setSefer(!sefer), setAktivite(false), setCanbus(false);
                }}
                style={{
                  paddingBottom: '6%',
                  flexDirection: 'row',
                  marginTop: 8,
                  marginLeft: 10,
                  alignItems: 'center',
                }}>
                <FontAwesome
                  name={'globe'}
                  size={20}
                  color={'#FFFFFF'}
                  style={{marginLeft: '4%'}}
                />
                <View style={{marginLeft: '4%'}} disabled={true}>
                  <Text
                    style={{
                      fontSize: 17,
                      marginLeft: '4%',
                      marginTop: 3,
                      color: sellerUI.color2,
                    }}>
                    Sefer Raporları
                  </Text>
                </View>
                <FontAwesome
                  style={{marginLeft: 'auto', marginRight: 10}}
                  name={sefer === false ? 'angle-right' : 'angle-down'}
                  size={17}
                  color={'#FFFFFF'}
                />
              </TouchableOpacity>
            }
            {sefer === true ? (
              <>
                {
                  <TouchableOpacity
                    onPress={() => {
                      getPlakaService();
                      navigationRef.navigate('IgnitionReport');
                    }}
                    style={{
                      paddingBottom: '6%',
                      flexDirection: 'row',
                      marginTop: 8,
                      marginLeft: 10,
                      alignItems: 'center',
                    }}>
                    <View style={{marginLeft: '4%'}} disabled={true}>
                      <Text
                        style={{
                          fontSize: 16,
                          marginLeft: '4%',
                          marginTop: 3,
                          color: '#FFFFFF',
                        }}>
                        {i18n.t('ignition_based')}
                      </Text>
                    </View>
                    <FontAwesome
                      style={{marginLeft: 'auto', marginRight: 10}}
                      name={'angle-right'}
                      size={16}
                      color={'#FFFFFF'}
                    />
                  </TouchableOpacity>
                }

                {/*<TouchableOpacity
                                onPress={()=>{
                                    getPlakaService();
                                    navigationRef.navigate('FuelLevel');
                                    }}
                                style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>
                                <View style={{marginLeft: '5%'}} disabled={true}>
                                    <Text style={{
                                        fontSize: 16,
                                        marginLeft: '4%',
                                        marginTop: 3,
                                        color: '#FFFFFF',
                                    }}>Yakıt-Seviye Raporu</Text>
                                </View>
                                <FontAwesome style={{marginLeft: 'auto', marginRight: 10}} name={'angle-right'}
                                                size={16} color={'#FFFFFF'}/>
                            </TouchableOpacity>*/}

                {/*<TouchableOpacity
                                onPress={()=>{props.navigation.navigate('AlarmReport')}}
                                style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>
                                <View style={{marginLeft: '5%'}} disabled={true}>
                                    <Text style={{
                                        fontSize: 16,
                                        marginLeft: '4%',
                                        marginTop: 3,
                                        color: '#FFFFFF',
                                    }}>Alarm Raporu</Text>
                                </View>
                                <FontAwesome style={{marginLeft: 'auto', marginRight: 10}} name={'angle-right'}
                                                size={16} color={'#FFFFFF'}/>
                            </TouchableOpacity>*/}

                {/*<TouchableOpacity
                                onPress={()=>{props.navigation.navigate('expeditionwaitingreports')}}
                                style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>
                                <View style={{marginLeft: '4%'}} disabled={true}>
                                    <Text style={{
                                        fontSize: 16,
                                        marginLeft: '4%',
                                        marginTop: 3,
                                        color: '#616161',
                                    }}>Sefer Bekleme Raporu</Text>
                                </View>
                                <FontAwesome style={{marginLeft: 'auto', marginRight: 10}} name={'angle-right'}
                                                size={16} color={'#616161'}/>
                            </TouchableOpacity>*/}
                {/*<TouchableOpacity
                                    onPress={()=>{props.navigation.navigate('expeditiondailyworkreports')}}
                                    style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>

                                    <View style={{marginLeft: '4%'}} disabled={true}>
                                        <Text style={{
                                            fontSize: 16,
                                            marginLeft: '4%',
                                            marginTop: 3,
                                            color: '#616161',
                                        }}>Sefer Günlük Çalışması</Text>
                                    </View>
                                    <FontAwesome style={{marginLeft: 'auto', marginRight: 10}} name={'angle-right'}
                                                    size={16} color={'#616161'}/>
                                </TouchableOpacity>*/}
                {/*<TouchableOpacity
                                    onPress={()=>{props.navigation.navigate('usagereports')}}
                                    style={{paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 10,alignItems:'center'}}>

                                    <View style={{marginLeft: '4%'}} disabled={true}>
                                        <Text style={{
                                            fontSize: 16,
                                            marginLeft: '4%',
                                            marginTop: 3,
                                            color: '#616161',
                                        }}>Kullanım Raporu</Text>
                                    </View>
                                    <FontAwesome style={{marginLeft: 'auto', marginRight: 10}} name={'angle-right'}
                                                    size={16} color={'#616161'}/>
                                </TouchableOpacity>*/}
              </>
            ) : null}
          </>
        ) : null}

        <TouchableOpacity
          onPress={() => {
            getCampaignsScreen();
          }}
          style={{
            paddingBottom: '6%',
            flexDirection: 'row',
            marginTop: 8,
            marginLeft: 7,
            alignItems: 'center',
          }}>
          <FontAwesome name={'gift'} size={22} color={sellerUI.color2} />
          <View style={{marginLeft: '4%'}} disabled={true}>
            <Text
              style={{
                fontSize: 18,
                marginLeft: '4%',
                marginTop: 3,
                color: sellerUI.color2,
              }}>
              {i18n.t('campaigns')}
            </Text>
          </View>
          <FontAwesome
            style={{marginLeft: 'auto', marginRight: 10}}
            name={'angle-right'}
            size={18}
            color={sellerUI.color2}
          />
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => {
            getNotificationScreen();
          }}
          style={{
            paddingBottom: '6%',
            flexDirection: 'row',
            marginTop: 8,
            marginLeft: 7,
            alignItems: 'center',
          }}>
          <FontAwesome name={'bell'} size={20} color={sellerUI.color2} />
          <View style={{marginLeft: '4%'}} disabled={true}>
            <Text
              style={{
                fontSize: 18,
                marginLeft: '4%',
                marginTop: 3,
                color: sellerUI.color2,
              }}>
              {i18n.t('notifications')}
            </Text>
          </View>
          <FontAwesome
            style={{marginLeft: 'auto', marginRight: 10}}
            name={'angle-right'}
            size={18}
            color={sellerUI.color2}
          />
        </TouchableOpacity> */}
      </DrawerContentScrollView>

      <View style={{padding: 15, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 2,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              marginLeft: 5,
              color: sellerUI.color2,
            }}>
            {i18n.t('contact')}
          </Text>
          <View style={{flexDirection: 'row', marginRight: '10%'}}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`https://wa.me/+9${sellerInfo.phone_whatsapp}`);
              }}>
              <FontAwesome
                name="whatsapp"
                size={22}
                color={sellerUI.color2}
                style={{marginRight: 10}}></FontAwesome>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${sellerInfo.phone_gsm}`);
              }}>
              <Icon name="phone" size={22} color={sellerUI.color2}></Icon>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigationRef.navigate('AboutUs');
          }}
          style={{paddingVertical: 5}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginLeft: 5,
                color: sellerUI.color2,
              }}>
              {i18n.t('aboutUs')}
            </Text>
            <Icon
              name="info-with-circle"
              size={22}
              color={sellerUI.color2}
              style={{marginRight: '16%', marginTop: 5}}></Icon>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            // navigationRef.navigate('Login');
            await logout();
          }}
          style={{paddingVertical: 5}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginLeft: 5,
                color: sellerUI.color2,
              }}>
              {i18n.t('logout')}
            </Text>
            <Icon
              name="log-out"
              size={22}
              color="red"
              style={{marginRight: '15%', marginTop: 5}}></Icon>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
