import React from 'react';
import { TouchableOpacity ,View, Text, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const Item = ({item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.item,
        backgroundColor,
        {flexDirection: 'row', justifyContent: 'space-between'},
      ]}>
      <Text
        style={[styles.title, textColor, {fontSize: 16, textAlign: 'center'}]}>
        {item.P}
      </Text>
      <FontAwesome name="bus" size={26} style={{alignSelf: 'flex-start'}} />
    </TouchableOpacity>
  );

  
const styles = StyleSheet.create({
    item: {
      margin: 3,
      padding: 26,
      borderRadius: 10,
      alignItems: 'center',
    },
  });
  