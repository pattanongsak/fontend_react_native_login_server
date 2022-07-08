import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { View, TouchableOpacity, ActivityIndicator  } from 'react-native';

//Icon
import {Octicons, Ionicons, Fontisto } from '@expo/vector-icons'

import KeyboardAvoidiingWrapper from './../components/KeyboardAvoidiingWrapper'


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

//API Client
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { CredentialsContext } from './../components/CredentialsContext';

//Colors
const {brand, darkLight, primary } =  Colors;

//Datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';

const Signup = ({navigation}) => {

  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));


  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const [dob, setDob] = useState();

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);


  const onChange = (event, selectedDate) => {
    const currentDate = currentDate || date;
    setShow(false)
    setDate(currentDate)
    setDob(currentDate)
  }

  const showDatePicker = () => {
    setShow(true);
  }
// -------------------------------------------------------

  const handleSignup = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = 'https://loginser.herokuapp.com/user/signup';
    axios.post(url, credentials)
    .then((response) => {
      const result = response.data;
      const {message, status, data} = result;

      if (status !== 'SUCCESS') {
        handleMessage(message, status);
      } else {
        persistLogin({ ...data }, message, status);
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
        <PageTitle>Flower Crib</PageTitle>
        <SubTitle>Account Login</SubTitle>

        {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode='date'
          is24Hour={true}
          onChange={onChange}
        />
      )}

        <Formik
          initialValues={{ name: '', email: '', dateOfBirth: '', password:'', confirmPassword: ''}}
          onSubmit={(values, { setSubmitting}) => { 
           // values = {...values, dateOfBirth: dob};
            if (values.email == '' || 
                values.password == '' || 
                values.name == '' || 
                values.dateOfBirth == '' || 
                values.confirmPassword == ''
            ) {
              handleMessage('Please fill all the fields.');
              setSubmitting(false);
            } else if (values.password !== values.confirmPassword) {
              handleMessage('Passwords do not match.');
              setSubmitting(false);
            } 
            else {
              handleSignup(values, setSubmitting);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (<StyledFormArea>
              <MyTextInput 
                label="Full Name"
                icon="person"
                placeholder="Richard Barnes"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              
              />
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
                label="Date of Birth"
                icon="calendar"
                placeholder="YYY - MM - DD"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('dateOfBirth')}
                onBlur={handleBlur('dateOfBirth')}
                value={values.dateOfBirth}
                isDate={true}
                //editable={false}
                showDatePicker={showDatePicker}
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
              <MyTextInput 
                label="Confirm Password"
                icon="lock"
                placeholder="* * * * * * *"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}       
              />
              <MsgBox type={messageType}>{message}</MsgBox>
             

              {!isSubmitting && (
                 <StyledButton onPress={handleSubmit}>
                 <ButtonText>
                   Sign Up
                 </ButtonText>
               </StyledButton>
              )}

              {isSubmitting && (
              <StyledButton disabled={true}>
                <ActivityIndicator size="large" color={primary}  />
              </StyledButton>
              )}

              <Line />
              <ExtraView>
                <ExtraText>Already have an account? </ExtraText>
                <TextLink onPress={() =>  navigation.navigate("Login")}>
                    <TextLinkContent>Login</TextLinkContent>
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

const MyTextInput =({label, icon, isPassword, hidePassword, setHidePassword,
  isDate, showDatePicker, ...props}) =>  {
  return(
    <View>
     
      <StyledInputLabel>{label}</StyledInputLabel>
      
 
    {!isDate && <StyledTextInput {...props} />}

    {
    isDate && <TouchableOpacity onPress={showDatePicker}>
                 <StyledTextInput {...props} />
             </TouchableOpacity>
      }

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

export default Signup