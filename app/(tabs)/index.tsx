import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import ChessGame from '../../components/ChessGame';

const HomeScreeen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />
      <ChessGame />
    </SafeAreaView>
  );
};

export default HomeScreeen;
