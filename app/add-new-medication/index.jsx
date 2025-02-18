import { View, Text } from 'react-native'
import React from 'react'
import AddMedHeader from '../../components/AddMedHeader'
import AddMedForm from '../../components/AddMedForm'

const AddMedicationScreen = () => {
  return (
    <View>
      <AddMedHeader />
      <AddMedForm />
    </View>
  )
}

export default AddMedicationScreen