import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { EmphasizeText, Infotext, InlineGroup, 
TextLink, TextLinkContent,Colors } from './style';

const { brand } = Colors;


const ResendTimer = ({ 
    activeResend, resendEmail, resendingEmail, resendStatus,
    timeLeft, targetTime
 }) => {
  return (
    <View>
    <InlineGroup>
        <Infotext>Didn't receive the email? </Infotext>

        {!resendingEmail && (
            <TextLink 
            style={{ opacity: !activeResend && 0.5 }}
            disabled={!activeResend} 
            onPress={resendEmail}>
            <TextLinkContent 
                resendStatus={resendStatus}
                style={{ textDecorationLine: 'underline' }}
            >
                {resendStatus}
            </TextLinkContent>
        </TextLink>
        )}
        
        {resendingEmail && (
            <TextLink 
                disabled
            >
            <TextLinkContent>
               <ActivityIndicator color={brand} />
            </TextLinkContent>
        </TextLink>
        )} 
    </InlineGroup>

            {
                !activeResend && (
                    <Infotext>
                        in <EmphasizeText>{timeLeft || targetTime}</EmphasizeText> second(s)
                    </Infotext>
                )
            }
 
</View>
  )
}

export default ResendTimer