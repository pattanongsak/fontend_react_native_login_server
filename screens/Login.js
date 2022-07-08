import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { View, ActivityIndicator } from 'react-native';

//Icon
import {Octicons, Ionicons, Fontisto } from '@expo/vector-icons'

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    RightIcon,
    StyledButton,
    ButtonText,
    Colors,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
} from './../components/style'

//Colors
const {brand, darkLight, primary } =  Colors;

//Keyboard avoiding view
import KeyboardAvoidiingWrapper from './../components/KeyboardAvoidiingWrapper'

//API Client
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { CredentialsContext } from './../components/CredentialsContext';


const Login = ({navigation}) => {

  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

  const handleLogin = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = 'https://loginser.herokuapp.com/user/signin';
    axios.post(url, credentials)
    .then((response) => {
      const result = response.data;
      const {message, status, data} = result;

      if (status !== 'SUCCESS') {
        handleMessage(message, status);
      } else {
        persistLogin({ ...data[0] }, message, status);
      }
      setSubmitting(false);
    })
    .catch(error => {
      console.log(error.JSON());
      setSubmitting(false);
      handleMessage("An error accurred. Check your network and try again");
    })
  }

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  }

  const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem('flowerCribCredentials', JSON.stringify(credentials))
    .then(() => {
      handleMessage(message, status)
      setStoredCredentials(credentials);
    })
    .catch((error) => {
      console.log(error);
      handleMessage('Persisting login failed');
    })
  }

  return (
    <KeyboardAvoidiingWrapper>
      <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <PageLogo resizeMode="cover" source={require('./../assets/img/login.gif')} />
        <PageTitle>Flower Crib</PageTitle>
        <SubTitle>Account Login</SubTitle>

        <Formik
          initialValues={{email: '', password:''}}
          onSubmit={(values, {setSubmitting}) => {
            if (values.email == '' || values.password == '') {
              handleMessage('Please fill all the fields.');
              setSubmitting(false);
            } else {
              handleLogin(values, setSubmitting);
            }
          }}
        >
          {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (<StyledFormArea>
              <MyTextInput 
                label="Email Address"
                icon="mail"
                placeholder="andyj@gmail.com"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
              />

              <MyTextInput 
                label="Password"
                icon="lock"
                placeholder="* * * * * * *"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}       
              />
              <MsgBox type={messageType}>{message}</MsgBox>
              {!isSubmitting && (
                <StyledButton onPress={handleSubmit}>
                  <ButtonText>
                    Login
                  </ButtonText>
                </StyledButton>
              )}

              {isSubmitting && (
              <StyledButton disabled={true}>
                <ActivityIndicator size="large" color={primary}  />
              </StyledButton>
              )}

              <Line />
              <StyledButton google={true} onPress={handleSubmit}>
                  <Fontisto name="google" color={primary} size={25} />
                <ButtonText google={true}>Sign in with Google</ButtonText>
              </StyledButton>
              <ExtraView>
                <ExtraText>Don't have an account already?</ExtraText>
                <TextLink onPress={() =>  navigation.navigate("Signup")}>
                    <TextLinkContent>Sign up</TextLinkContent>
                </TextLink>
              </ExtraView>
          </StyledFormArea>
          )}  
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidiingWrapper>
  )
}

const MyTextInput =({label, icon, isPassword, hidePassword, setHidePassword, ...props}) =>  {
  return(
    <View>
     
      <StyledInputLabel>{label}</StyledInputLabel>
      
      <StyledTextInput {...props} />

      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight}/>
        </RightIcon>
      )}

{/* ------------------------------------------------- */}

      <LeftIcon>
        <Octicons name={icon} size={30} color={brand}/>
      </LeftIcon>
        
    </View>
  )
}

export default Login