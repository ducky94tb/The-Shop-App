import React, { useCallback, useState, useEffect } from "react";
import { useReducer } from "react";
import {
  View,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useDispatch } from "react-redux";

import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import * as authActions from "../store/actions/auth";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.id]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.id]: action.isValid,
    };
    let updatedIsValid = true;
    for (const key in updatedValidities) {
      updatedIsValid &= updatedValidities[key];
    }
    state = {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      isValidForm: updatedIsValid,
    };
  }
  return state;
};

const AuthenticationScreen = (props) => {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState();
  const [isWaiting, setIsWaiting] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    isValidForm: false,
  });

  useEffect(() => {
    if (error) Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
  }, [error]);

  const inputChangeHandler = useCallback(
    (id, value, isValid) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        id: id,
        value: value,
        isValid: isValid,
      });
    },
    [dispatchFormState]
  );
  const authencationHandler = async () => {
    if (!formState.isValidForm) {
      alert("Please enter valid email and password!");
      return;
    }
    setError(null);
    setIsWaiting(true);
    try {
      await dispatch(
        authActions.authenticate(
          !isSignup,
          formState.inputValues.email,
          formState.inputValues.password
        )
      );
      props.navigation.navigate("Shop");
    } catch (err) {
      setError(err.message);
    }
    setIsWaiting(false);
  };
  return (
    <View style={styles.screen}>
      <Card style={styles.cardComponent}>
        <ScrollView>
          <Input
            id="email"
            label="Email"
            keyboardType="email-address"
            email
            required
            onInputChange={inputChangeHandler}
            errorText="*Please enter a valid email!"
          />
          <Input
            id="password"
            label="Password"
            required
            keyboardType="number-pad"
            onInputChange={inputChangeHandler}
            secureTextEntry="true"
            minLen={6}
            maxLength={6}
            errorText="*Please enter password with 6 numbers"
          />
          <View style={styles.buttonContainer}>
            {!isWaiting ? (
              <Button
                title={isSignup ? "Signup" : "Login"}
                onPress={authencationHandler}
                color={Colors.primary}
              />
            ) : (
              <ActivityIndicator size="large" />
            )}
          </View>
          <View>
            <Button
              style={styles.buttonContainer}
              title={`Switch to ${isSignup ? "Login" : "Signup"}`}
              color={Colors.accent}
              onPress={() => {
                setIsSignup((isSignup) => !isSignup);
              }}
            />
          </View>
        </ScrollView>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardComponent: {
    width: "80%",
    maxWidth: 400,
    padding: 20,
  },
  buttonContainer: {
    paddingVertical: 10,
  },
});
export default AuthenticationScreen;
