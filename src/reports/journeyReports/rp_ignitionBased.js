import React, {useLayoutEffect, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {Card, Icon, Button, Text, Header} from 'react-native-elements';
import {
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Pressable,
  Alert,
} from 'react-native';
import {navigationRef} from '../../navigation/navigationRef';
import {DrawerActions, useRoute} from '@react-navigation/native';
import carListStore from '../../store/carListStore';
import { Item } from '../../components/listItem';
import { getActivityDetail } from '../../services/reportServices/activityDetailService';
import reportStore from '../../store/reportStore';
import { ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react';
import { configure } from 'mobx';
import sellerStore from '../../store/sellerStore';
import { dateAdd, getActivityDetailReport } from '../../utils/timeOperations';
import { getCarList } from '../../services/carListService';
import { i18n } from '../../localization';
import sellerUI from '../../../assets/sellerUI/sellerUI';
import { getIgnitionReport } from '../../services/reportServices/ignitionService';

configure({
    enforceActions: "never",
})

const IgnitionReport = observer(() => {
  //DatePicker States
  const [reportDay, setReportDay] = useState(new Date());
  const [openStrt, setOpenStrt] = useState(false);
  
  //Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPlate, setSelectedPlate] = useState(null);


  const [selectedButton, setSelectedButton] = useState(1);
  
  const route = useRoute();
  let params = route.params;
  useLayoutEffect(() => {
    if (params && params.id) {
      setSelectedPlate(params.plate);
      setSelectedId(params.id);
      console.log('changed PRPS',params);
    }
  }, [params]);

  //beginDay: moment(reportDay).format('MM/DD/YYYY'),
  //endDay: moment(endDate).format('MM/DD/YYYY'),
  //beginTime: moment(reportDay).format('HH:mm'),
  //endTime: moment(endDate).format('HH:mm'),


/*  const getIgnitionReportReport = (changedDateButton) => {
    let repreportDay = new Date();
    let repEndDate = new Date();
    switch (changedDateButton) {
      case (2):
      repreportDay = dateAdd(repreportDay,'day',-1).setHours(0,0,0);
      repEndDate = dateAdd(repEndDate,'day',-1).setHours(23,59);
      console.log('2');
        break;
      case (3):
        let unit = repreportDay.getDay();
        repreportDay = dateAdd(repreportDay,'day',1-unit).setHours(0,0);
        repEndDate = repEndDate.setHours(23,59);
        break;
      case (4):
        break;
      default:
        repreportDay.setHours(0,0,0);
        repEndDate.setHours(23,59,59);
        console.log('1');
        break;
    }
    getIgnitionReport({
      beginDay: moment(repreportDay).format('MM/DD/YYYY'),
      endDay: moment(repEndDate).format('MM/DD/YYYY'),
      beginTime: moment(repreportDay).format('HH:mm'),
      endTime: moment(repEndDate).format('HH:mm'),
      selectedId: selectedId,
      plate: selectedPlate
    });
  }; */

  const renderItem = ({item}) => {
    const backgroundColor = item.ID === selectedId ? '#8EC3B0' : '#DEF5E5';
    const color = item.ID === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.ID);
          setSelectedPlate(item.P);
          setModalVisible(!modalVisible);
          console.log(selectedId);
        }}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  const changeSelectedButton = (button,reportDate) =>{
    switch (button) {
        case 1:
            setSelectedButton(1);
            setReportDay(new Date())
            break;
        case 2:
            setSelectedButton(2)
            let date = dateAdd(new Date(),'day',-1); 
            setReportDay(date);
            break;
        case 3:
            let today = new Date();
            if (moment(reportDate).format('DD-MM-YYYY') == moment(today).format('DD-MM-YYYY')) {
                setSelectedButton(1);
                setReportDay(reportDate)
            }else if (moment(reportDate).format('DD-MM-YYYY') == moment(dateAdd(today,'day',-1)).format('DD-MM-YYYY')) {
                setSelectedButton(2);
                setReportDay(reportDate);
            }else{
                setSelectedButton(3)
                setReportDay(reportDate);
            }
            break;
        default:
            changeSelectedButton(1);
            break;
    }
  }
  return (
    <View style={styles.container} >
      <Header
        backgroundColor={sellerUI.color3}
        leftComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => {
                navigationRef.dispatch(DrawerActions.toggleDrawer());
              }}>
              <Icon type="feather" name="menu" color={sellerUI.color4} size={26} />
            </TouchableOpacity>
          </View>
        }
        rightComponent={<View style={styles.headerRight}></View>}
        centerComponent={{text: i18n.t('ignition_based'), style: styles.heading}}
      />
      <Card>
        <Card.Divider />
        <TouchableOpacity
          style={styles.datePicker}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="car"
              style={{marginRight: 10, color: '#404040'}}
              type="font-awesome"
            />
            <Text h4 h4Style={{fontSize: 17, color: '#404040'}}>
              {i18n.t('plate')}
            </Text>
          </View>
          {selectedId !== null ? (
            <Text
              allowFontScaling={false}
              style={{
                alignSelf: 'center',
                marginLeft: 25,
                fontSize: 17,
                color: '#1F1F1F',
              }}>
              {selectedPlate}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 17,
                color: '#FF6B54',
                marginLeft: 25,
                alignSelf: 'center',
              }}>
              {i18n.t('notSelected')}
            </Text>
          )}
        </TouchableOpacity>
      </Card>
      
      <View style={{padding:5,marginHorizontal :'3%',marginTop:10}} >
        <View style={{flexDirection:'row',margin:2,justifyContent:'space-evenly'}} >
          <Pressable style={[selectedButton == 2 ? styles.selectedButton : styles.outlinedButton,{marginHorizontal:2}]} onPress={()=>{changeSelectedButton(2)}}>
            <Text allowFontScaling={false} style={{textAlign:'center',fontSize:15,color:'#ffffff'}} >{i18n.t('yesterday')}</Text>
          </Pressable>
          <Pressable style={selectedButton == 1 ? styles.selectedButton : styles.outlinedButton} onPress={()=>{changeSelectedButton(1)}} >
            <Text allowFontScaling={false} style={{textAlign:'center',fontSize:15,color:'#ffffff'}} >{i18n.t('today')}</Text>
          </Pressable>
        </View>
      </View>
      <View>
        <Card>
          <Card.Title style={{fontSize: 16}}>{i18n.t('pleasePickADay')}</Card.Title>
          <Card.Divider />
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => {
              setOpenStrt(true);
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="calendar"
                style={{marginRight: 10, color: '#404040'}}
                type="font-awesome"
              />
              <Text h4 h4Style={{fontSize: 17, color: '#404040'}}>
                {i18n.t('date')}
              </Text>
            </View>
            {reportDay !== null ? (
              <Text
                allowFontScaling={false}
                style={{
                  alignSelf: 'center',
                  marginLeft: 25,
                  fontSize: 17,
                  color: '#1F1F1F',
                }}>
                {moment(reportDay).format('DD-MM-YYYY')}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 17,
                  color: '#FF6B54',
                  marginLeft: 25,
                  alignSelf: 'center',
                }}>
                {i18n.t('notSelected')}
              </Text>
            )}
          </TouchableOpacity>
        </Card>
      </View>
      <Button
        title={i18n.t('getReport')}
        iconPosition="right"
        icon={
          <Icon
            name="description"
            color="#ffffff"
            style={{marginLeft: 10, alignSelf: 'auto'}}
            size={20}
          />
        }
        buttonStyle={{
          borderRadius: 0,
          marginTop: 20,
          margin: 15,
          backgroundColor: 'black',
        }}
        onPress={() => {
          reportStore.setReportPlate(selectedPlate);
          selectedId 
          ?  getIgnitionReport(selectedId,reportDay) 
          : Alert.alert(
            'Hata',
            'Plaka alanı boş geçilemez.',
            [{text: 'TAMAM'}],
            {cancelable: false},
          );
        }}
      />
        {reportStore.loading ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={true}
              statusBarTranslucent={true}>
              <View style={styles.centeredView}>
                <View style={[styles.modalView,{justifyContent:'center', backgroundColor:'#FFFFFF59'}]}>
                  <View style={{backgroundColor:'#fff', padding:40, borderRadius:30}}>
                    <ActivityIndicator size="large" color={'red'} style={{marginBottom:25}} />
                    <Text style={[styles.modalText,{fontSize:18,}]}>{i18n.t('reportGettingReady')}</Text>
                    <Text style={styles.modalText}>{i18n.t('thisMayTakeSometime')}</Text>
                  </View>
                </View>
              </View>
            </Modal>
          ) : null}
      {/* DatePicker start date*/}
      <DatePicker
        locale="tr"
        maximumDate={new Date()}
        mode="date"
        title={i18n.t('reportDay')}
        confirmText={i18n.t('confirm')}
        cancelText={i18n.t('cancel')}
        modal
        is24hourSource="locale"
        open={openStrt}
        date={reportDay}
        onConfirm={reportDay => {
          setOpenStrt(false);
          changeSelectedButton(3,reportDay);
          console.log(reportDay);
        }}
        onCancel={() => {
          setOpenStrt(false);
        }}
      />
      <Modal
        style={{flex:1}}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <TouchableOpacity style={{flex:1}} onPress={()=>{setModalVisible(!modalVisible)}} >
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View style={{width: '100%',}}>
                  <Text style={{fontSize: 20, fontWeight: '600', margin: 5}}>
                    {i18n.t('plates')}
                  </Text>
                  <FlatList
                    style={{width: '100%', marginBottom: 26}}
                    data={carListStore.plate}
                    renderItem={renderItem}
                    keyExtractor={item => item.ID}
                    extraData={selectedId}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

export default IgnitionReport;

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#ffffff',
    width:'100%',
    height:'100%'
  },
  datePicker: {
    borderWidth: 0.4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'justify',
    color:sellerUI.color4
  },
  centeredView: {
    flex: 1,
    justifyContent:'flex-end'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignSelf:'flex-end',
    height: '70%',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  
  selectedButton: {
    backgroundColor:'#579BB1',
    flex:1,
    margin:0,
    borderRadius:3,
    padding:6,
    textAlign:'center',
    justifyContent:'center'
  },
  outlinedButton: {
    backgroundColor:'gray',
    flex:1,
    margin:0,
    padding:6,
    borderRadius:3,
    textAlign:'center',
    justifyContent:'center'
  }
});
