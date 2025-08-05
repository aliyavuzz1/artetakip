import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  BackHandler,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Container, Card} from 'native-base';
import {RFPercentage} from 'react-native-responsive-fontsize';
import BackButton from '../../../store/BackButton';
import {getSingleVehicle} from '../../../services/user';
//import window
import ModalScreen from './modalScreen';
import HeaderAllVehicle from './HeaderAllVehicle';

//MobX
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
// import index from '../../../store';
import userStore from '../store/userStore';
import { navigationRef } from '../navigation/navigationRef';
@inject('userStore')
@observer
export default class AllVehicleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: null,
      modalVisible: false,
      data: [],
      page: 1,
      endPage: false,
      isLoading: false,
      visible: userStore.modalVisible,
    };
  }

  componentDidMount() {
    this.setState(
      {
        isLoading: true,
      },
      this.getData,
    );
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid,
    );
  }

  handleBackButtonPressAndroid = () => {
    navigationRef.navigate(BackButton.previous);
    BackButton.setClassname(BackButton.previous);
    return true;
  };

  renderVehicle(item, index) {
    return (
      <Card
        style={[
          styles.itemContainer,
          {backgroundColor: index % 2 == 0 ? '#F5F5F5' : '#FFFFFF'},
        ]}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 1,
            justifyContent: 'space-around',
          }}>
          <View
            style={[
              styles.plateArea,
              item.arte_ignition_text.status == 0 ? {borderColor: 'red'} : null,
              item.arte_ignition_text.status == 2
                ? {borderColor: 'green'}
                : null,
              item.arte_ignition_text.status == 1
                ? {borderColor: '#f5b461'}
                : null,
              item.arte_ignition_text.status == 9
                ? {borderColor: 'grey'}
                : null,
            ]}>
            <View
              style={[
                styles.plateBackground,
                item.arte_ignition_text.status == 0
                  ? {borderColor: 'red'}
                  : null,
                item.arte_ignition_text.status == 2
                  ? {borderColor: 'green'}
                  : null,
                item.arte_ignition_text.status == 1
                  ? {borderColor: '#f5b461'}
                  : null,
                item.arte_ignition_text.status == 9
                  ? {borderColor: 'grey'}
                  : null,
              ]}>
              <View
                style={[
                  styles.plateCountryArea,
                  item.arte_ignition_text.status == 0
                    ? {backgroundColor: 'red'}
                    : null,
                  item.arte_ignition_text.status == 2
                    ? {backgroundColor: 'green'}
                    : null,
                  item.arte_ignition_text.status == 1
                    ? {backgroundColor: '#f5b461'}
                    : null,
                  item.arte_ignition_text.status == 9
                    ? {backgroundColor: 'grey'}
                    : null,
                ]}>
                <Text style={styles.countryAbbreviationText}>TR</Text>
              </View>
              <View style={styles.plateNameArea}>
                <Text style={styles.plateText} allowFontScaling={false}>
                  {item.arte_client_plate}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.infoCarView}>
            <View style={{width: '93%'}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '50%', flexDirection: 'row'}}>
                  <Image
                    style={styles.image}
                    source={
                      item.arte_ignition_text.status == 0
                        ? require('../../../image/speedometer.png')
                        : null || item.arte_ignition_text.status == 2
                        ? require('../../../image/speedometerGreen.png')
                        : null || item.arte_ignition_text.status == 1
                        ? require('../../../image/speedometerYellow.png')
                        : null || item.arte_ignition_text.status == 9
                        ? require('../../../image/speedometerGray.png')
                        : null
                    }
                  />
                  <Text style={styles.kilometerText}>
                    {item.arte_satalite < 5 ? (
                      <Text>Veri Alınamıyor</Text>
                    ) : (
                      <Text>{item.arte_speed} Km/s</Text>
                    )}
                  </Text>
                </View>
                <View style={{width: '50%', flexDirection: 'row'}}>
                  <Image
                    style={styles.image}
                    source={
                      item.arte_ignition_text.status == 0
                        ? require('../../../image/switchOff.png')
                        : null || item.arte_ignition_text.status == 2
                        ? require('../../../image/switchActive.png')
                        : null || item.arte_ignition_text.status == 1
                        ? require('../../../image/switchOn.png')
                        : null || item.arte_ignition_text.status == 9
                        ? require('../../../image/switchNull.png')
                        : null
                    }
                  />
                  <Text style={styles.kilometerText}>
                    {item.arte_ignition_text.text}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: 5,
                }}>
                <Image
                  style={styles.image}
                  source={
                    item.arte_ignition_text.status == 0
                      ? require('../../../image/calendar.png')
                      : null || item.arte_ignition_text.status == 2
                      ? require('../../../image/calendarGreen.png')
                      : null || item.arte_ignition_text.status == 1
                      ? require('../../../image/calendarYellow.png')
                      : null || item.arte_ignition_text.status == 9
                      ? require('../../../image/calendarGray.png')
                      : null
                  }
                />
                <Text style={styles.kilometerText}>
                  {item.updated_at == null ? (
                    <Text>Veri Alınamıyor</Text>
                  ) : (
                    <Text>{item.updated_at}</Text>
                  )}
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: 5,
                }}>
                <Text style={styles.kilometerText}>
                  {item.arte_last_address}
                </Text>
              </View>
            </View>
            <View style={styles.rightArrowView}>
              <Image
                style={{width: 20, height: 20, marginLeft: 'auto'}}
                source={require('../../../image/right-arrow.png')}
              />
            </View>
          </View>
        </View>
      </Card>
    );
  }

  renderRow = item => {
    var filter = true;
    var search = true;
    // var search = item.arte_client_plate(userStore.search)
    // if(this.props.userStore.filterText == null || this.props.userStore.filterText == item.arte_ignition.text){
    //   filter = true
    // }
    return (
      <TouchableOpacity
        key={item.index}
        onPress={async () => {
          try {
            let singleVehicle = await getSingleVehicle(
              item.item.arte_client_id,
            );
            BackButton.setClassname('VehicleDetail');
             navigationRef.navigate('VehicleDetail', {
              vehicle: singleVehicle.data,
            });
          } catch (e) {
            console.log('singleVehicleError', e);
          }

          // this.props.userStore.setImei(item.item.arte_imei_id)
        }}>
        {filter == true && search == true
          ? this.renderVehicle(item.item, item.index)
          : null}
      </TouchableOpacity>
    );
  };
  getData = async () => {
    await this.props.userStore.setAllVehicleList();
  };
  renderFooter = () => {
    return this.state.isLoading == true ? (
      <View style={styles.loader}>
        <ActivityIndicator color={'red'} size="large" />
      </View>
    ) : null;
  };
  handleLoadMore = async () => {
    if (
      !this.props.userStore.endPage &&
      !this.onEndReachedCalledDuringMomentum
    ) {
      this.props.userStore.setPage(this.props.userStore.page + 1);
      await this.getData();
      this.onEndReachedCalledDuringMomentum = true;
      this.setState({
        isLoading: true,
      });
    }
  };

  render() {
    console.log('dasdadadasdasda=>', toJS(userStore.AllVehicleList));
    return (
      <Container>
        <HeaderAllVehicle />
        <FlatList
          data={this.props.userStore.AllVehicleList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
          // onEndReached={this.handleLoadMore.bind(this)}
          onEndReachedThreshold={0.5}
          initialNumToRender={7}
          listFooterComponent={this.renderFooter}
          // onEndReached={this.onEndReached.bind(this)}
          //  onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={userStore.modalVisible}
          onRequestClose={() => {
            userStore.setModalVisible(false);
          }}>
          <ModalScreen />
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  plateArea: {
    width: '24%',
    borderRightWidth: 3,
  },
  countryAbbreviationText: {
    color: 'white',
    fontSize: RFPercentage(1),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  plateBackground: {
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row',
    marginTop: 'auto',
    marginBottom: 'auto',
    borderWidth: 1,
  },
  plateCountryArea: {
    width: '20%',
    paddingVertical: 2,
  },
  plateNameArea: {
    width: '80%',
    paddingVertical: 2,
    backgroundColor: '#F0F0F0',
  },
  plateText: {
    fontSize: RFPercentage(1.4),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  infoCarView: {
    width: '74%',
    marginLeft: '2%',
    flexDirection: 'row',
  },
  image: {
    width: 22,
    height: 22,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  kilometerText: {
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: RFPercentage(1.7),
    fontWeight: 'bold',
    marginLeft: 3,
    color: '#0C3572',
  },
  rightArrowView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: 10,
    alignItems: 'center',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    marginBottom: 0,
    borderBottomWidth: 0,
    borderBottomColor: '#eee',
  },
});
