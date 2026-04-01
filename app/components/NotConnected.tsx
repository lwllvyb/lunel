import React from 'react';
import { Image, Text, View } from 'react-native';
import { ThemeColors } from '@/constants/themes';

interface NotConnectedProps {
  colors: ThemeColors;
  fonts: any;
}

export default function NotConnected({ colors, fonts }: NotConnectedProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Image
        source={require('@/assets/images/icon.png')}
        style={{ width: 72, height: 72, borderRadius: 18, marginBottom: 16 }}
        resizeMode="contain"
      />
      <Text style={{
        fontSize: 20,
        fontFamily: fonts.sans.semibold,
        color: colors.fg.default,
        letterSpacing: 0.5,
      }}>
        lunel
      </Text>
      <Text style={{
        fontSize: 12,
        fontFamily: fonts.sans.regular,
        color: colors.fg.subtle,
        marginTop: 4,
        letterSpacing: 0.3,
      }}>
        ship from anywhere
      </Text>
    </View>
  );
}
