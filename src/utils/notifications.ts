"use client";

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const scheduleHabitReminder = (habitName: string, reminderTime: string) => {
  const [hours, minutes] = reminderTime.split(':').map(Number);
  const now = new Date();
  const reminderDate = new Date();
  reminderDate.setHours(hours, minutes, 0, 0);

  // If the time has already passed today, schedule for tomorrow
  if (reminderDate <= now) {
    reminderDate.setDate(reminderDate.getDate() + 1);
  }

  const timeUntilReminder = reminderDate.getTime() - now.getTime();

  setTimeout(() => {
    showHabitReminder(habitName);
    // Schedule the next reminder for the same time tomorrow
    scheduleHabitReminder(habitName, reminderTime);
  }, timeUntilReminder);
};

export const showHabitReminder = (habitName: string) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(`Lembrete de Hábito: ${habitName}`, {
      body: 'Não esqueça de completar seu hábito hoje!',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);
  }
};

export const loadAndScheduleReminders = (habits: Array<{ name: string; reminder_time?: string }>) => {
  habits.forEach(habit => {
    if (habit.reminder_time) {
      scheduleHabitReminder(habit.name, habit.reminder_time);
    }
  });
};