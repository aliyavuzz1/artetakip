import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import moment from 'moment/moment';
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
} from 'react-native';
import {navigationRef} from '../../navigation/navigationRef';
import {DrawerActions} from '@react-navigation/native';
import {getPlakaService} from '../../services/getPlakaService';
import ModalScreen from '../../screens/modal';
import carListStore from '../../store/carListStore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Item } from '../../components/listItem';
import { getActivityDetail } from '../../services/reportServices/activityDetailService';
import { getFuelLevel } from '../../services/reportServices/fuelGraphService';
import sellerStore from '../../store/sellerStore';
import sellerUI from '../../../assets/sellerUI/sellerUI';



const FuelGraph = () => {
  //DatePicker States
  const [startDate, setStartDate] = useState(new Date());
  const [openStrt, setOpenStrt] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [openEnd, setOpenEnd] = useState(false);

  //Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPlate, setSelectedPlate] = useState(null);

  const [reportDATA, setReportDATA] = useState([]);

  const renderItem = ({item}) => {
    const backgroundColor = item.ID === selectedId ? '#FFAD60' : '#FFFDA2';
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
              <Icon type="feather" name="menu" color={sellerUI.color2} size={26} />
            </TouchableOpacity>
          </View>
        }
        rightComponent={<View style={styles.headerRight}></View>}
        centerComponent={{text: 'Yakıt-Grafik Raporu', style: styles.heading}}
      />
      <Card>
        <Card.Title style={{fontSize: 16}}>Araç</Card.Title>
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
              Plaka
            </Text>
          </View>
          {selectedId !== null ? (
            <Text
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
              Seçilmedi!
            </Text>
          )}
        </TouchableOpacity>
      </Card>

      <Card>
        <Card.Title style={{fontSize: 16}}>Gün</Card.Title>
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
              Tarih ->
            </Text>
          </View>
          {startDate !== null ? (
            <Text
              style={{
                alignSelf: 'center',
                marginLeft: 25,
                fontSize: 17,
                color: '#1F1F1F',
              }}>
              {moment(startDate).format('DD-MM-YYYY')}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 17,
                color: '#FF6B54',
                marginLeft: 25,
                alignSelf: 'center',
              }}>
              Seçilmedi!
            </Text>
          )}
        </TouchableOpacity>
      </Card>
      <Button
        title="Getir"
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
          getFuelLevel({
            reportDay: moment(startDate).format('YYYY-MM-DD'),
            selectedId: selectedId,
            plate: selectedPlate
          });
        }}
      />
      {/* DatePicker start date*/}
      <DatePicker
        locale="tr"
        maximumDate={new Date()}
        mode="date"
        title={'Başlangıç Tarihi'}
        confirmText={'Onayla'}
        cancelText="İptal"
        modal
        is24hourSource="locale"
        open={openStrt}
        date={startDate}
        onConfirm={startDate => {
          setOpenStrt(false);
          setStartDate(startDate);
          console.log(moment(startDate).format('DD-MM-YYYY'));
        }}
        onCancel={() => {
          setOpenStrt(false);
        }}
      />
      <Modal
        style={{flex: 1}}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{width: '100%'}}>
              <Text style={{fontSize: 20, fontWeight: '600', margin: 5}}>
                CAN'li Araçlar
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
        </View>
      </Modal>
    </>
  );
};

export default FuelGraph;

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
  },
  centeredView: {
    flex: 1,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    height: '100%',
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
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
  item: {
    margin: 3,
    padding: 26,
    borderRadius: 10,
    alignItems: 'center',
  },
});
