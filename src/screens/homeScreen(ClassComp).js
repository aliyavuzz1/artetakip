import AsyncStorage from "@react-native-async-storage/async-storage";

import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
//import {TextInput} from 'react-native-gesture-handler';
import {getCarList} from '../services/carListService';
import {getPlakaService} from '../services/getPlakaService';
import {BackHandler} from 'react-native';
import { sendM_TOKEN } from '../services/oneSignal/notificationService';
import { getDeviceState } from '../services/oneSignal/getDeviceState';
import CarListv2 from '../components/carListv2';
import { oneSignalSetId } from '../services/oneSignal/setExternalUID';
import { Header ,Image,Text} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions } from '@react-navigation/native';
import CarListv3 from '../components/carListv3';
import sellerStore from '../store/sellerStore';
import sellerUI from '../../assets/sellerUI/sellerUI';

getPlakaService();

@inject('userStore')
@observer
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  refreshFunc() {
    this.setState({refreshing: true});
    getCarList().then(
      this.delay(2000).then(() => this.setState({refreshing: false})),
    );
    this.delay(5000);
  }

  refreshFuncProp = this.refreshFunc.bind(this);

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    oneSignalSetId();
    getDeviceState();
    setTimeout(() =>{sendM_TOKEN()},5000); //Uygulama tekrar açıldığında M_TOKEN hazır olduktan sonra tekrar gönderilmesi için 5sn timeout atıldı.
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }
  render() {
    return (
      <>
        <StatusBar/>
        <View style={{flex: 1, backgroundColor: '#9D9D9D'}}>
          <Header
            backgroundColor={sellerUI.color3}
            leftComponent={
              <View style={styles.headerRight}>
                <Pressable
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    navigationRef.dispatch(DrawerActions.openDrawer());
                  }}>
                  <Ionicons name="menu" color='black' size={26} />
                </Pressable>
              </View>
            }
            centerComponent={
              <View style={{alignItems:'center', justifyContent:'center'}}>
                <Text h4 h4Style={{fontSize:18, alignSelf:'center', fontWeight:'bold',marginTop:3}} >TEK&TEK</Text>
              </View>
            }
            rightComponent={
              <Pressable>
              </Pressable>}
          />
          <TextInput placeholder="Ara" style={styles.search} placeholderTextColor='black'></TextInput>
          <ScrollView
            style={{flex: 1,marginTop:5}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.refreshFuncProp}
              />
            }>
            <CarListv3/>
            {/*<CarList />*/}
          </ScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: '#EFEFEFEF',
    padding: 5,
    margin: 5,
    marginBottom:-2,
    marginTop: 10,
    borderRadius: 10,
  },
});
