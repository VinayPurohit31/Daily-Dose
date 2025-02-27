import { ScrollView } from 'react-native';
import React from 'react';
import AddMedHeader from '../../components/AddMedHeader';
import AddMedForm from '../../components/AddMedForm';

const AddMedicationScreen = () => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <AddMedHeader />
      <AddMedForm />
      
    </ScrollView>
  );
};

export default AddMedicationScreen;
