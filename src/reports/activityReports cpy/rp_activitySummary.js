import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {Card, Icon, Button, Text, Header} from 'react-native-elements';
import {
  TextInput,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import {navigationRef} from '../../navigation/navigationRef';
import {DrawerActions} from '@react-navigation/native';
import {getPlakaService} from '../../services/getPlakaService';
import ModalScreen from '../../screens/modal';
import carListStore from '../../store/carListStore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getActivitySummary} from '../../services/reportServices/activitySummaryService';
import { Item } from '../../components/listItem';
import sellerStore from '../../store/sellerStore';
import { getActivitySummaryReport } from '../../utils/timeOperations';
import { i18n } from '../../localization';
import sellerUI from '../../../assets/sellerUI/sellerUI';

const ActivitySummary = () => {
  //DatePicker States
  const [startDate, setStartDate] = useState(new Date());
  const [openStrt, setOpenStrt] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [openEnd, setOpenEnd] = useState(false);

  //Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPlate, setSelectedPlate] = useState(null);

  const [selectedButton, setSelectedButton] = useState(1);

  const [reportDATA, setReportDATA] = useState([]);

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

  return (
    <>
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
        centerComponent={{text: i18n.t('activity_summary'), style: styles.heading}}
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
      <View style={{padding:5,margin:'3%'}} >
        <View style={{flexDirection:'row',margin:2,justifyContent:'space-evenly'}} >
          <Pressable style={selectedButton == 1 ? styles.selectedButton : styles.outlinedButton} onPress={()=>{setSelectedButton(1)}} >
            <Text allowFontScaling={false} style={{textAlign:'center',fontSize:15,color:'#ffffff'}} >{i18n.t('today')}</Text>
          </Pressable>
          <Pressable style={[selectedButton == 2 ? styles.selectedButton : styles.outlinedButton,{marginHorizontal:2}]} onPress={()=>{setSelectedButton(2)}}>
            <Text allowFontScaling={false} style={{textAlign:'center',fontSize:15,color:'#ffffff'}} >{i18n.t('yesterday')}</Text>
          </Pressable>
          <Pressable style={[selectedButton == 3 ? styles.selectedButton : styles.outlinedButton,{marginRight:2}]} onPress={()=>{setSelectedButton(3)}}>
            <Text allowFontScaling={false} style={{textAlign:'center',fontSize:15,color:'#ffffff'}} >{i18n.t('thisWeek')}</Text>
          </Pressable>
          <Pressable style={selectedButton == 4 ? styles.selectedButton : styles.outlinedButton} onPress={()=>{setSelectedButton(4)}}>
            <Text allowFontScaling={false} style={{textAlign:'center',fontSize:15,color:'#ffffff'}} >{i18n.t('pickDate')}</Text>
          </Pressable>
        </View>
      </View>
      <View style= {{display: selectedButton == 4 ? 'flex' : 'none'}}>
        <Card>
          <Card.Title style={{fontSize: 16}}>{i18n.t('pleasePickADate')}</Card.Title>
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
                {i18n.t('startDate')}
              </Text>
            </View>
            {startDate !== null ? (
              <Text
                allowFontScaling={false}
                style={{
                  alignSelf: 'center',
                  marginLeft: 25,
                  fontSize: 17,
                  color: '#1F1F1F',
                }}>
                {moment(startDate).format('DD-MM-YYYY HH:mm')}
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

          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => {
              setOpenEnd(true);
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="calendar"
                style={{marginRight: 10, color: '#404040'}}
                type="font-awesome"
              />
              <Text h4 h4Style={{fontSize: 17, color: '#404040'}}>
              {i18n.t('endDate')}
              </Text>
            </View>
            {endDate !== null ? (
              <Text
                allowFontScaling={false}
                style={{
                  alignSelf: 'center',
                  marginLeft: 25,
                  fontSize: 17,
                  color: '#1F1F1F',
                }}>
                {moment(endDate).format('DD-MM-YYYY HH:mm')}
              </Text>
            ) : (
              <Text style={{fontSize: 17, color: '#FF6B54', marginLeft: 25}}>
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
          getActivitySummaryReport(selectedButton,selectedId,selectedPlate,startDate,endDate);
        }}
      />
      {/* DatePicker start date*/}
      <DatePicker
        locale="tr"
        maximumDate={new Date()}
        mode="datetime"
        title={ i18n.t('startDate')} 
        confirmText={i18n.t('confirm')}
        cancelText={i18n.t('cancel')}
        modal
        is24hourSource="locale"
        open={openStrt}
        date={startDate}
        onConfirm={startDate => {
          setOpenStrt(false);
          setStartDate(startDate);
          console.log(startDate);
        }}
        onCancel={() => {
          setOpenStrt(false);
        }}
      />

      {/* DatePicker end date*/}
      <DatePicker
        locale="tr"
        maximumDate={new Date()}
        mode="datetime"
        title={'Bitiş Tarihi'}
        confirmText={i18n.t('confirm')}
        cancelText={i18n.t('cancel')}
        modal
        is24hourSource="locale"
        open={openEnd}
        date={endDate}
        onConfirm={endDate => {
          setOpenEnd(false);
          setEndDate(endDate);
        }}
        onCancel={() => {
          setOpenEnd(false);
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
    </>
  );
};

export default ActivitySummary;

const styles = StyleSheet.create({
  datePicker: {
    borderWidth: 0.6,
    borderRadius: 10,
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
    color: sellerUI.color4
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
