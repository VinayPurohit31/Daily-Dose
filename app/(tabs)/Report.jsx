import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/FireBaseConfig';
import { getLocalStorage } from '../../service/Storage';
import { PieChart } from 'react-native-chart-kit';
import Colors from '../../constant/Colors';

export default function Report() {
  const [illnesses, setIllnesses] = useState([]);
  const [selectedIllness, setSelectedIllness] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    fetchIllnesses();
  }, []);

  const fetchIllnesses = async () => {
    try {
      const user = await getLocalStorage('userDetail');
      if (!user?.email) return;

      const q = query(collection(db, 'medication'), where('userEmail', '==', user.email));
      const querySnapshot = await getDocs(q);

      const illnessMap = {};
      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.illnessName) {
          illnessMap[data.illnessName] = true;
        }
      });

      setIllnesses(Object.keys(illnessMap));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching illnesses:', error);
      setLoading(false);
    }
  };

  const fetchMedicationsForIllness = async (illness) => {
    setReportLoading(true);
    setSelectedIllness(illness);
    
    try {
        const user = await getLocalStorage('userDetail');
        if (!user?.email) return;

        const q = query(
            collection(db, 'medication'),
            where('userEmail', '==', user.email),
            where('illnessName', '==', illness)
        );

        const querySnapshot = await getDocs(q);
        const meds = querySnapshot.docs.map(doc => {
            const data = doc.data();
            console.log("Raw Firestore Data:", data); // 🔍 Debugging log

            return {
                id: doc.id,
                ...data,
                status: data.status ? data.status.toLowerCase() : 'pending', // Ensure status exists
            };
        });

        console.log("Processed Medications:", meds); // 🔍 Debugging log

        setMedications(meds);
    } catch (error) {
        console.error('Error fetching medications:', error);
    } finally {
        setReportLoading(false);
    }
};

  const calculateReportStats = () => {
    if (medications.length === 0) return null;

    const takenCount = medications.filter(med => med.status === 'taken').length;
    const missedCount = medications.filter(med => med.status === 'missed').length;
    const pendingCount = medications.filter(med => med.status === 'pending').length;
    const totalMeds = takenCount + missedCount + pendingCount;

    return {
      totalMeds,
      takenCount,
      missedCount,
      pendingCount,
      complianceRate: totalMeds ? Math.round((takenCount / totalMeds) * 100) : 0
    };
  };

  const renderIllnessList = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
    }

    if (illnesses.length === 0) {
      return <Text style={styles.noDataText}>No illnesses found</Text>;
    }

    return (
      <View style={styles.illnessContainer}>
        <Text style={styles.sectionTitle}>Your Medical Conditions</Text>
        {illnesses.map((illness, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.illnessCard,
              selectedIllness === illness && styles.selectedIllnessCard
            ]}
            onPress={() => fetchMedicationsForIllness(illness)}
          >
            <Text style={styles.illnessText}>{illness}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReport = () => {
    if (!selectedIllness) return null;
    if (reportLoading) return <ActivityIndicator size="large" color={Colors.PRIMARY} />;

    const stats = calculateReportStats();
    if (!stats) return <Text style={styles.noDataText}>No medication data for this illness</Text>;

    const chartData = [
      { name: 'Taken', population: stats.takenCount, color: Colors.SUCCESS, legendFontColor: Colors.BLACK, legendFontSize: 15 },
      { name: 'Missed', population: stats.missedCount, color: Colors.DANGER, legendFontColor: Colors.BLACK, legendFontSize: 15 },
      { name: 'Pending', population: stats.pendingCount, color: Colors.WARNING, legendFontColor: Colors.BLACK, legendFontSize: 15 },
    ];

    return (
      <View style={styles.reportContainer}>
        <Text style={styles.reportTitle}>{selectedIllness} Report</Text>

        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={300}
            height={200}
            chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        <Text style={styles.medicationsTitle}>Medications for {selectedIllness}:</Text>
        {medications.map((med, index) => (
          <View key={index} style={styles.medicationItem}>
            <Text style={styles.medName}>{med.medName}</Text>
            <Text style={styles.medDosage}>Dosage: {med.dose}</Text>
            <Text style={[
              styles.medStatus,
              med.status === 'taken' && { color: Colors.SUCCESS },
              med.status === 'missed' && { color: Colors.DANGER },
            ]}>
              Status: {med.status}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderIllnessList()}
      {renderReport()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({   
  container: {     
    flex: 1,     
    padding: 20,     
    backgroundColor: '#F8F9FA',   
  },   
  illnessContainer: {     
    marginBottom: 20,   
  },   
  sectionTitle: {     
    fontSize: 22,     
    fontWeight: 'bold',     
    marginBottom: 15,     
    color: Colors.PRIMARY,     
    textAlign: 'center',   
  },   
  illnessCard: {     
    backgroundColor: 'white',     
    padding: 15,     
    marginBottom: 10,     
    borderRadius: 12,     
    elevation: 4,     
    shadowColor: '#000',     
    shadowOffset: { width: 0, height: 2 },     
    shadowOpacity: 0.2,     
    shadowRadius: 3,     
    flexDirection: 'row',     
    alignItems: 'center',     
    justifyContent: 'space-between',   
  },   
  selectedIllnessCard: {     
    borderWidth: 2,     
    borderColor: Colors.PRIMARY,     
    backgroundColor: Colors.LIGHT_BACKGROUND,   
  },   
  illnessText: {     
    fontSize: 18,     
    color: Colors.BLACK,     
    fontWeight: 'bold',   
  },   
  noDataText: {     
    textAlign: 'center',     
    marginVertical: 20,     
    fontSize: 16,     
    color: Colors.GRAY,   
  },   
  reportContainer: {     
    marginTop: 20,     
    backgroundColor: 'white',     
    padding: 18,     
    borderRadius: 12,     
    elevation: 4,     
    shadowColor: '#000',     
    shadowOffset: { width: 0, height: 2 },     
    shadowOpacity: 0.2,     
    shadowRadius: 3,   
  },   
  reportTitle: {     
    fontSize: 22,     
    fontWeight: 'bold',     
    marginBottom: 15,     
    color: Colors.PRIMARY,     
    textAlign: 'center',   
  },   
  chartContainer: {     
    alignItems: 'center',     
    marginVertical: 15,   
  },   
  statsContainer: {     
    marginVertical: 15,   
  },   
  statItem: {     
    flexDirection: 'row',     
    justifyContent: 'space-between',     
    marginBottom: 10,     
    paddingBottom: 8,     
    borderBottomWidth: 1,     
    borderBottomColor: Colors.LIGHT_GRAY,   
  },   
  statLabel: {     
    fontSize: 18,     
    color: Colors.BLACK,   
  },   
  statValue: {     
    fontSize: 18,     
    fontWeight: 'bold',   
  },   
  medicationsTitle: {     
    fontSize: 20,     
    fontWeight: 'bold',     
    marginTop: 20,     
    marginBottom: 10,     
    color: Colors.PRIMARY,     
    textAlign: 'center',   
  },   
  medicationItem: {     
    backgroundColor: '#FFF5E1',     
    padding: 14,     
    marginBottom: 10,     
    borderRadius: 10,     
    flexDirection: 'row',     
    alignItems: 'center',     
    justifyContent: 'space-between',   
  },   
  medName: {     
    fontSize: 16,     
    fontWeight: 'bold',     
    color: Colors.BLACK,   
  },   
  medDosage: {     
    fontSize: 14,     
    color: Colors.GRAY,     
    marginTop: 4,   
  },   
  medStatus: {     
    fontSize: 14,     
    marginTop: 4,     
    fontStyle: 'italic',   
  }, 
});
