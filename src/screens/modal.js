import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import carListStore from '../store/carListStore';

const DATA = carListStore.plate;

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, backgroundColor, {margin: 3, padding: 15}]}>
    <Text style={[styles.title, textColor, {fontSize: 16}]}>{item.P}</Text>
  </TouchableOpacity>
);

const ModalScreen = data => {
  const [modalVisible, setModalVisible] = useState(true);

  const [selectedId, setSelectedId] = useState(null);
  const [selectedPlate, setSelectedPlate] = useState(null);

  const renderItem = ({item}) => {
    const backgroundColor = item.ID === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.ID === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.ID);
          setSelectedPlate(item.P);
          carListStore.setModalStatus(!carListStore.modalStatus);
        }}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        style={{flex: 1}}
        animationType="slide"
        transparent={true}
        visible={carListStore.modalStatus}
        onRequestClose={() => {
          setModalVisible(!carListStore.modalStatus);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{width: '100%'}}>
              <Text>Plaka Seçin</Text>
              <FlatList
                style={{width: '100%'}}
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.ID}
                extraData={selectedId}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ModalScreen;
