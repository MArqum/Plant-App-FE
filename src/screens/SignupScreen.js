import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Block, Input, Button, Text, DotIndicator, Dropdown } from '../elements/Index';
import { theme } from '../constants';
import { CommonUtils } from '../utils';
import axios from 'axios';
import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      role: 'user', // Default role
      profession: '',
      experience: '',
      qualification: '',
      showEmailLabel: true,
      showUsernameLabel: true,
      showPasswordLabel: true,
      errors: [],
      loading: false,
    };
  }

  handleInputChange = (key, value) => {
    this.setState({
      [key]: value,
      [`show${key.charAt(0).toUpperCase() + key.slice(1)}Label`]: value.length === 0
    });
  };

  onSignupClicked = async () => {
    Keyboard.dismiss();
    this.setState({ loading: true });

    const { email, password, username, role, profession, experience, qualification } = this.state;
    const errors = [];

    if (!CommonUtils.validateEmail(email)) errors.push('email');
    if (password.length <= 0) errors.push('password');
    if (username.length <= 0) errors.push('username');

    if (role === 'professional') {
      if (profession.length <= 0) errors.push('profession');
      if (experience.length <= 0) errors.push('experience');
      if (qualification.length <= 0) errors.push('qualification');
    }

    this.setState({ errors });

    if (errors.length === 0) {
      try {
        const userData = {
          name: username,
          email: email,
          password: password,
          role: role,
        };

        if (role === 'professional') {
          userData.profession = profession;
          userData.experience = experience;
          userData.qualification = qualification;
        }

        const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);

        if (response.status === 201) {
          alert('Signup successful!');
          this.props.navigation.navigate('login');
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Signup failed. Please try again.');
      }
    }

    this.setState({ loading: false });
  };

  onLoginClicked = () => {
    this.props.navigation.navigate("login");
  }

  render() {
    const { email, password, username, role, profession, experience, qualification, showEmailLabel, showUsernameLabel, showPasswordLabel, errors } = this.state;
    const errorStyle = key => errors.includes(key) ? styles.inputError : null;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>Signup</Text>
          <Block middle>
            <Dropdown
              label="Select Role"
              options={['user', 'professional']}
              selectedValue={role}
              onValueChange={(value) => this.handleInputChange('role', value)}
            />
            
            <Input
              label={showEmailLabel ? "Email" : ""}
              error={errorStyle('email')}
              style={[styles.input, errorStyle('email')]}
              value={email}
              onChangeText={(text) => this.handleInputChange('email', text)}
            />
            <Input
              label={showUsernameLabel ? "Username" : ""}
              error={errorStyle('username')}
              style={[styles.input, errorStyle('username')]}
              value={username}
              onChangeText={(text) => this.handleInputChange('username', text)}
            />
            <Input
              secure
              label={showPasswordLabel ? "Password" : ""}
              style={[styles.input, errorStyle('password')]}
              error={errorStyle('password')}
              value={password}
              onChangeText={(text) => this.handleInputChange('password', text)}
            />

            {role === 'professional' && (
              <>
                <Input
                  label="Profession"
                  error={errorStyle('profession')}
                  style={[styles.input, errorStyle('profession')]}
                  value={profession}
                  onChangeText={(text) => this.handleInputChange('profession', text)}
                />
                <Input
                  label="Experience (years)"
                  error={errorStyle('experience')}
                  style={[styles.input, errorStyle('experience')]}
                  value={experience}
                  keyboardType="numeric"
                  onChangeText={(text) => this.handleInputChange('experience', text)}
                />
                <Input
                  label="Qualification"
                  error={errorStyle('qualification')}
                  style={[styles.input, errorStyle('qualification')]}
                  value={qualification}
                  onChangeText={(text) => this.handleInputChange('qualification', text)}
                />
              </>
            )}

            <Button gradient onPress={this.onSignupClicked}>
              {this.state.loading ?
                <DotIndicator color={theme.colors.white} count={4} size={theme.sizes.base * 0.5} /> :
                <Text bold white center>Signup</Text>
              }
            </Button>
            <Button onPress={this.onLoginClicked}>
              <Text center caption gray style={{ textDecorationLine: 'underline' }}>Back to Login</Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

SignupScreen.propTypes = {}

SignupScreen.defaultProps = {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderColor: "transparent",
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputError: {
    borderBottomColor: theme.colors.accent,
  },
});

export default SignupScreen;
