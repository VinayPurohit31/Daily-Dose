import { Stack } from "expo-router";
import { useEffect } from 'react';


export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}> 
     <Stack.Screen name="(tabs)"/>
     <Stack.Screen name="login"/>
     <Stack.Screen name="action-model"
     options={{
      presentation: 'modal',
     }}
     />
    </Stack>
  )
}
