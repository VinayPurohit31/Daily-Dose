// service/PushNotification.js
import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

// Initialize notification channel (call this once when app starts)
export const initializeNotifications = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION RECEIVED:", notification);
    },
    requestPermissions: Platform.OS === 'ios',
  });

  // Create notification channel (Android only)
  PushNotification.createChannel(
    {
      channelId: "medication-channel",
      channelName: "Medication Reminders",
      channelDescription: "Channel for medication reminders",
      soundName: "default",
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`Notification channel created: ${created}`)
  );
};

// Schedule a medication reminder
export const scheduleMedicationReminder = (medication) => {
  const { id, name, dosage, time, instructions } = medication;
  const [hours, minutes] = time.split(':').map(Number);
  
  const reminderDate = new Date();
  reminderDate.setHours(hours);
  reminderDate.setMinutes(minutes);
  
  PushNotification.localNotificationSchedule({
    channelId: "medication-channel",
    title: `💊 ${name}`,
    message: `Time to take ${dosage} (${instructions})`,
    date: reminderDate,
    repeatType: 'day',
    repeatTime: 24 * 60 * 60 * 1000, // Repeat every 24 hours
    allowWhileIdle: true,
    data: { medId: id }
  });
};

// Cancel all reminders for a medication
export const cancelMedicationReminders = (medId) => {
  PushNotification.cancelAllLocalNotifications({ id: medId });
};