import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Slider from '@react-native-community/slider'; // ✅ Updated import
import Block from './Block';
import Text from './Text';
import { theme } from '../constants';

class SliderBlock extends React.Component {
  renderLabel = () => {
    const { label } = this.props;
    return label ? (
      <Block flex={false}>
        <Text gray2>{label}</Text>
      </Block>
    ) : null;
  };

  renderValue = () => {
    const { value } = this.props;
    return (
      <Block flex={false}>
        <Text primary right>
          {value}
        </Text>
      </Block>
    );
  };

  render() {
    return (
      <Block margin={[theme.sizes.base * 0.5, theme.sizes.base * 2]}>
        {this.renderLabel()}
        <Slider
          value={this.props.value}
          step={this.props.step}
          minimumValue={this.props.minimumValue}
          maximumValue={this.props.maximumValue}
          onValueChange={this.props.onValueChange}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor="#ddd" // ✅ Added to avoid default styling issues
          thumbTintColor={theme.colors.primary} // ✅ Updated for new package
        />
        {this.renderValue()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
    elevation: 1.5,
  },
  thumb: {
    width: 16,
    height: 16,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.white,
    borderWidth: 3.5,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.35,
    elevation: 2,
  },
});

SliderBlock.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  step: PropTypes.number,
  minimumValue: PropTypes.number,
  maximumValue: PropTypes.number,
  onValueChange: PropTypes.func,
};

SliderBlock.defaultProps = {
  label: null,
  value: 0,
  step: 1,
  minimumValue: 0,
  maximumValue: 100,
  onValueChange: () => {},
};

export default SliderBlock;
