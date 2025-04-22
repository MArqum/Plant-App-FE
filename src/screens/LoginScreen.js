import React from 'react';
import { Keyboard, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Input, Button, Text, DotIndicator } from '../elements/Index';
import { theme } from '../constants';
import { CommonUtils } from '../utils';
import axios from 'axios';
import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: [],
      loading: false,
    };
  }

  onLoginClicked = async () => {
    Keyboard.dismiss();
    this.setState({ loading: true });

    const { email, password } = this.state;
    const errors = [];

    if (!CommonUtils.validateEmail(email)) {
      errors.push("email");
    }
    if (password.length === 0) {
      errors.push("password");
    }

    this.setState({ errors });

    if (errors.length === 0) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        });

        console.log("Login Response:", response.data); // Log full response

        if (response.data.success) {
          const user = response.data.user; // Get user data from response

          console.log("User Data:", user); // Log user data
          console.log("User Role:", user.role); // Log user role
          console.log("User ID:", user._id); // Log user ID

          // Store user details in AsyncStorage
          await AsyncStorage.setItem('userId', JSON.stringify(user._id));
          await AsyncStorage.setItem('role', user.role);

          alert("Login successful!");
          this.props.navigation.navigate("browse"); // Navigate to the next screen
        }
      } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Login failed. Please try again.");
      }
    }

    this.setState({ loading: false });
  };

  onForgotPasswordClicked = () => {
    this.props.navigation.navigate("forgot_password");
  };

  render() {
    const { errors } = this.state;
    const errorStyle = key => errors.includes(key) ? styles.inputError : null;

    return (
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: theme.sizes.base * 2 })}
        behavior="padding"
      >
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>Login</Text>
          <Block middle>
            <Input
              label="Email"
              error={errorStyle("email")}
              style={[styles.input, errorStyle("email")]}
              value={this.state.email}
              onChangeText={(text) => this.setState({ email: text })}
            />
            <Input
              secure
              label="Password"
              error={errorStyle("password")}
              style={[styles.input, errorStyle("password")]}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
            />

            <Button gradient onPress={this.onLoginClicked}>
              {this.state.loading ? (
                <DotIndicator color={theme.colors.white} count={4} size={theme.sizes.base * 0.5} />
              ) : (
                <Text bold white center>Login</Text>
              )}
            </Button>
            <Button onPress={this.onForgotPasswordClicked}>
              <Text center caption gray style={{ textDecorationLine: "underline" }}>Forgot Password?</Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

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

export default LoginScreen;
