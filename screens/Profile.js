import React, {useContext} from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    WelcomeIamge,
    Avatar
} from './../components/style'

import AsyncStorage from '@react-native-async-storage/async-storage';

import { CredentialsContext } from './../components/CredentialsContext';


const Profile = () => {

  
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const {name, email} = storedCredentials;

  const clearLogin = () => {
    AsyncStorage
    .removeItem('flowerCribCredentials')
    .then(() => {
      setStoredCredentials("");
    })
    .catch(error => console.log(error))
  }

  return (
    <>
      <StatusBar style="dark" />
      <InnerContainer>
   
    <WelcomeIamge resizeMode="cover" source={require('./../assets/img/register.gif')} />

        <WelcomeContainer>

        <PageTitle welcome={true}>Welcome! Buddy</PageTitle>
        <SubTitle welcome={true}>{name || 'Olga Simpson'}</SubTitle>
        <SubTitle welcome={true}>{email || 'dxterous@gmail.com'}</SubTitle>

        <Avatar resizeMode="cover" source={require('./../assets/img/login.gif')} />
          <Line />
          <StyledFormArea>
              <StyledButton onPress={clearLogin}>
                <ButtonText>
                  Logout
                </ButtonText>
              </StyledButton>
              
         
          </StyledFormArea>
          
        </WelcomeContainer>
      </InnerContainer>
    </>
  )
}



export default Profile;