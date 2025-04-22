import React, { Component } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, StyleSheet } from 'react-native';

class Dropdown extends Component {
  render() {
    const { label, options, selectedValue, onValueChange } = this.props;

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Picker
          selectedValue={selectedValue}
          style={styles.picker}
          onValueChange={onValueChange}
        >
          {options.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default Dropdown;
