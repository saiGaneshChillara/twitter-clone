import { View, Text, Button } from 'react-native'
import React from 'react'
import { useClerk } from '@clerk/clerk-expo'

const HomeScreen = () => {
  const { signOut } = useClerk();
  return (
    <View>
      <Text>HomePage</Text>
      <Button onPress={() => signOut()} title='log out'></Button>
    </View>
  )
}

export default HomeScreen;