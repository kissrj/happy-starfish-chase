"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { format, isSameDay, sub<think>Initial files ranking:

src/components/DailySummary.tsx: 0.94

src/App.tsx: 0.94

src/components/HabitList.tsx: 0.94

src/pages/Index.tsx: 0.93

src/hooks/useDailySummary.ts: 0.83

src/components/HabitFilters.tsx: 0.78

src/pages/FinancePage.tsx: 0.74

src/components/QuickStart.tsx: 0.70

src/pages/FinanceTracker.tsx: 0.67

src/pages/Finance.tsx: 0.67

src/pages/Settings.tsx: 0.65

src/components/HabitFilter.tsx: 0.63

src/hooks/useHabitActions.ts: 0.62

src/hooks/useHabits.ts: 0.56

src/pages/Login.tsx: 0.56

src/components/DeleteHabitDialog.tsx: 0.50

src/components/StreakCounter.tsx: 0.50

src/components/ui/dialog.tsx: 0.48

src/components/AddHabitDialog.tsx: 0.46

src/components/HabitInfo.tsx: 0.43

src/components/NotificationSettings.tsx: 0.42

src/components/ui/label.tsx: 0.39

src/pages/HabitDetail.tsx: 0.39

src/components/__tests__/DailySummary.test.tsx: 0.37

src/pages/Calendar.tsx: 0.37

src/components/HabitTrendsChart.tsx: 0.36

src/components/ProfileForm.tsx: 0.36

src/components/EditHabitDialog.tsx: 0.35

src/components/HabitDetailStats.tsx: 0.34

AI_RULES.md: 0.34

src/pages/Notifications.tsx: 0.34

src/pages/Profile.tsx: 0.33

src/components/FinancialOverview.tsx: 0.33

src/components/AdvancedNotificationSettings.tsx: 0.33

src/pages/Insights.tsx: 0.32

src/hooks/useSettings.ts: 0.32

src/context/AuthProvider.tsx: 0.31

src/components/MonthlyStats.tsx: 0.31

src/components/ui/toaster.tsx: 0.31

src/components/ProtectedRoute.tsx: 0.31

src/pages/HabitInsights.tsx: 0.31

src/test/e2e/mobile-responsiveness.spec.tsx: 0.31

src/pages/Achievements.tsx: 0.31

src/hooks/useHabitTrends.ts: 0.31

src/components/AccountInformation.tsx: 0.31

index.html: 0.30

src/components/HabitHeader.tsx: 0.30

src/components/TransactionTable.tsx: 0.30

src/components/ui/form.tsx: 0.29

src/components/FinancialSummary.tsx: 0.29

src/components/HabitGoalProgress.tsx: 0.29

src/components/HabitInsightsCard.tsx: 0.29

src/components/HabitInsightsSummary.tsx: 0.28

src/components/ExpenseChart.tsx: 0.28

src/components/DataManagementSettings.tsx: 0.28

src/utils/toast.ts: 0.28

src/components/AddBudgetDialog.tsx: 0.28

src/components/TransactionManager.tsx: 0.27

src/components/AchievementsPanel.tsx: 0.27

src/components/HabitStreakDisplay.tsx: 0.27

src/hooks/__tests__/useDailySummary.test.tsx: 0.27

src/components/ui/input.tsx: 0.27

src/test/e2e/habit-management.spec.tsx: 0.27

src/components/AddTransactionDialog.tsx: 0.26

src/pages/NotFound.tsx: 0.25

src/components/__tests__/HabitList.test.tsx: 0.25

src/components/BudgetList.tsx: 0.25

src/components/HabitCompletionChart.tsx: 0.25

src/App.css: 0.24

src/components/ui/button.tsx: 0.24

src/hooks/useCalendar.ts: 0.24

src/components/HabitTemplateCard.tsx: 0.24

src/components/NotificationCenter.tsx: 0.24

src/components/HabitTemplatesGrid.tsx: 0.24

src/test/e2e/finance-tracking.spec.tsx: 0.24

src/components/ui/alert.tsx: 0.24

src/components/AppearanceSettings.tsx: 0.23

src/hooks/useHabitDetail.ts: 0.23

src/components/HabitTemplates.tsx: 0.23

src/components/CalendarGrid.tsx: 0.23

src/test/e2e/smoke-tests.spec.tsx: 0.23

src/test＜dyad-problem-report summary=: 0.23

src/components/HabitCalendar.tsx: 0.22

src/components/ui/card.tsx: 0.22

src/components/ui/select.tsx: 0.22

src/hooks/use-toast.ts: 0.22

src/components/BudgetManager.tsx: 0.22

src/hooks/useNotifications.ts: 0.22

src/hooks/__tests__/useHabitActions.test.tsx: 0.22

src/test/e2e/user-authentication.spec.tsx: 0.22

src/components/__tests__/AddHabitDialog.test.tsx: 0.22

src/test/e2e/insights-analytics.spec.tsx: 0.22

src/components/CalendarLegend.tsx: 0.21

src/hooks/__tests__/useHabits.test.tsx: 0.21

ios/App/App/Base.lproj/Main.storyboard: 0.21

src/services/achievementService.ts: 0.21

src/components/ui/navigation-menu.tsx: 0.21

src/test/integration/auth-flow.spec.tsx: 0.21

src/components/EditBudgetDialog.tsx: 0.20

src/test/setup.tsx: 0.20

src/components/ui/toast.tsx: 0.20

ios/App/App.xcodeproj/project.pbxproj: 0.20

src/main.tsx: 0.20

src/components/ui/progress.tsx: 0.20

src/utils/notifications.ts: 0.20

src/components/AchievementCard.tsx: 0.20

ios/App/App/Base.lproj/LaunchScreen.storyboard: 0.20

src/components/ui/sonner.tsx: 0.20

src/components/__tests__/HabitInsightsSummary.test.tsx: 0.20

src/components/made-with-dyad.tsx: 0.20

src/components/ProfileHeader.tsx: 0.20

src/hooks/useTransactions.ts: 0.19

src/hooks/useProfile.ts: 0.19

src/test/e2e/performance.spec.tsx: 0.19

src/utils/achievementChecker.ts: 0.19

src/hooks/useAchievements.ts: 0.19

src/types/achievements.ts: 0.19

src/components/CalendarHeader.tsx: 0.19

src/hooks/useHabitTemplates.ts: 0.19

src/components/ui/textarea.tsx: 0.18

src/hooks/useHabitInsights.ts: 0.18

src/components/__tests__/HabitInsightsCard.test.tsx: 0.18

src/hooks/useStreak.ts: 0.18

src/utils/habitExport.ts: 0.18

src/components/ui/alert-dialog.tsx: 0.17

src/components/ui/badge.tsx: 0.17

src/components/ui/sidebar/main.tsx: 0.17

src/test/e2e/README.md: 0.16

src/components/ui/calendar.tsx: 0.16

src/hooks/useExpenseChart.ts: 0.16

src/utils/exportData.ts: 0.16

src/components/ui/tabs.tsx: 0.16

src/components/ui/sidebar/index.tsx: 0.16

src/components/ui/command.tsx: 0.15

src/hooks/__tests__/useHabitInsights.test.tsx: 0.15

android/app/src/main/res/values/strings.xml: 0.15

src/hooks/useBudgets.ts: 0.15

src/hooks/__tests__/useHabitTemplates.test.tsx: 0.15

src/test/e2e/accessibility.spec.tsx: 0.14

src/components/ui/use-toast.ts: 0.14

src/components/ui/sidebar.tsx: 0.14

src/integrations/supabase/client.ts: 0.14

src/test/utils.tsx: 0.13

src/components/ui/sidebar/submenu.tsx: 0.13

src/components/ui/radio-group.tsx: 0.13

src/components/ui/sidebar/menu.tsx: 0.12

vercel.json: 0.12

tailwind.config.ts: 0.12

src/components/ui/dropdown-menu.tsx: 0.12

src/components/ui/sidebar/group.tsx: 0.12

public/robots.txt: 0.11

src/components/ui/pagination.tsx: 0.11

android/app/src/main/AndroidManifest.xml: 0.11

src/components/ui/switch.tsx: 0.11

README.md: 0.11

vite.config.ts: 0.11

src/test/README.md: 0.11

ios/App/Podfile: 0.10

android/app/proguard-rules.pro: 0.10

src/components/ui/sidebar/context.tsx: 0.10

src/hooks/use-mobile.tsx: 0.10

src/components/ui/sidebar/parts.tsx: 0.10

src/components/ui/table.tsx: 0.10

ios/App/App/Info.plist: 0.10

src/components/ui/popover.tsx: 0.10

src/components/ui/skeleton.tsx: 0.10

src/components/__tests__/Button.test.tsx: 0.10

vitest.config.ts: 0.10

public/placeholder.svg: 0.09

android/app/src/main/res/values/styles.xml: 0.09

src/components/ui/input-otp.tsx: 0.09

src/components/ui/avatar.tsx: 0.09

src/components/Icon.tsx: 0.09

ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json: 0.09

src/components/ui/separator.tsx: 0.09

src/components/ui/accordion.tsx: 0.09

src/components/ui/scroll-area.tsx: 0.09

src/components/ui/checkbox.tsx: 0.09

tsconfig.app.json: 0.09

src/components/ui/sheet.tsx: 0.09

src/components/ui/tooltip.tsx: 0.09

android/app/src/main/res/drawable-land-xxxhdpi/splash.png: 0.08

src/components/ui/slider.tsx: 0.08

src/components/ui/collapsible.tsx: 0.08

android/app/src/main/res/drawable-land-xxhdpi/splash.png: 0.08

android/app/src/main/res/drawable-port-xxhdpi/splash.png: 0.08

android/app/src/main/res/drawable-port-xxxhdpi/splash.png: 0.08

src/components/ui/breadcrumb.tsx: 0.08

src/components/ui/drawer.tsx: 0.08

android/app/src/main/res/drawable-port-xhdpi/splash.png: 0.08

android/app/src/main/res/drawable-land-xhdpi/splash.png: 0.08

android/app/src/main/res/layout/activity_main.xml: 0.08

android/app/src/main/res/drawable/splash.png: 0.07

android/app/src/main/res/drawable-land-mdpi/splash.png: 0.07

android/app/src/main/res/drawable-port-hdpi/splash.png: 0.07

src/globals.css: 0.07

public/favicon.ico: 0.07

src/components/ui/toggle-group.tsx: 0.07

src/components/ui/toggle.tsx: 0.07

ios/.gitignore: 0.07

android/app/src/main/res/drawable-port-mdpi/splash.png: 0.07

android/app/src/main/res/drawable-land-hdpi/splash.png: 0.07

src/components/ui/resizable.tsx: 0.07

src/components/ui/hover-card.tsx: 0.07

src/lib/utils.ts: 0.06

src/components/ui/menubar.tsx: 0.06

android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png: 0.06

android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png: 0.06

android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png: 0.06

android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png: 0.06

android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png: 0.06

android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png: 0.06

android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png: 0.06

ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png: 0.06

src/components/ui/carousel.tsx: 0.06

tsconfig.json: 0.06

android/app/src/main/res/mipmap-mdpi/ic_launcher.png: 0.06

android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png: 0.06

android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png: 0.06

android/app/src/main/res/mipmap-xhdpi/ic_launcher.png: 0.06

android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png: 0.06

android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png: 0.06

ios/App/App/Assets.xcassets/Contents.json: 0.06

android/gradlew.bat: 0.05

android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png: 0.05

src/components/ui/context-menu.tsx: 0.05

ios/App/App/Assets.xcassets/Splash.imageset/Contents.json: 0.05

ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732-2.png: 0.05

postcss.config.js: 0.05

android/gradlew: 0.05

android/gradle/wrapper/gradle-wrapper.jar: 0.05

android/app/src/main/res/mipmap-hdpi/ic_launcher.png: 0.05

android/app/src/main/res/xml/file_paths.xml: 0.05

src/components/ui/chart.tsx: 0.05

ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732.png: 0.05

android/gradle.properties: 0.05

android/app/src/main/res/values/ic_launcher_background.xml: 0.05

ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732-1.png: 0.05

ios/App/App/AppDelegate.swift: 0.05

android/gradle/wrapper/gradle-wrapper.properties: 0.05

eslint.config.js: 0.05

package.json: 0.04

android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml: 0.04

android/settings.gradle: 0.04</think><think>Re-ranking the files. Please wait a moment...

</think><dyad-codebase-context files="src/pages/Index.tsx,src/components/DailySummary.tsx,src/components/HabitList.tsx,src/components/DeleteHabitDialog.tsx,src/components/QuickStart.tsx,src/components/HabitFilters.tsx,src/hooks/useHabits.ts,src/hooks/useHabitActions.ts,src/utils/habitExport.ts,src/pages/Login.tsx,src/components/AddHabitDialog.tsx,src/components/HabitTemplatesGrid.tsx,src/components/HabitTemplateCard.tsx,src/hooks/useHabitTemplates.ts,src/components/EditHabitDialog.tsx,src/pages/FinanceTracker.tsx,src/components/TransactionManager.tsx,src/components/TransactionTable.tsx,src/components/AddTransactionDialog.tsx,src/components/BudgetManager.tsx,src/components/BudgetList.tsx,src/components/AddBudgetDialog.tsx,src/components/EditBudgetDialog.tsx,src/components/ExpenseChart.tsx,src/hooks/useTransactions.ts,src/hooks/useBudgets.ts,src/hooks/useExpenseChart.ts,src/utils/exportData.ts,src/utils/notifications.ts,src/components/HabitCompletionChart.tsx,src/hooks/useHabitDetail.ts,src/pages/HabitDetail.tsx,src/components/HabitStreakDisplay.tsx,src/components/HabitCalendar.tsx,src/components/HabitHeader.tsx,src/components/HabitInfo.tsx,src/components/HabitGoalProgress.tsx,src/hooks/useSettings.ts,src/components/NotificationSettings.tsx,src/components/AppearanceSettings.tsx,src/components/DataManagementSettings.tsx,src/components/AccountInformation.tsx,src/pages/Settings.tsx,src/pages/Profile.tsx,src/components/ProfileForm.tsx,src/components/ProfileHeader.tsx,src/hooks/useCalendar.ts,src/components/CalendarHeader.tsx,src/components/HabitFilter.tsx,src/components/MonthlyStats.tsx,src/components/CalendarGrid.tsx,src/components/CalendarLegend.tsx,src/pages/Calendar.tsx,src/hooks/useHabitInsights.ts,src/components/HabitInsightsCard.tsx,src/components/HabitInsightsSummary.tsx,src/pages/HabitInsights.tsx,src/hooks/useNotifications.ts,src/components/NotificationCenter.tsx,src/components/AdvancedNotificationSettings.tsx,src/pages/Notifications.tsx,src/services/achievementService.ts,src/types/achievements.ts,src/hooks/useAchievements.ts,src/pages/Achievements.tsx,src/components/AchievementCard.tsx,src/hooks/useStreak.ts,src/components/AchievementsPanel.tsx,src/components/Icon.tsx,src/utils/achievementChecker.ts,src/hooks/useHabitTrends.ts,src/components/StreakCounter.tsx,src/components/HabitTrendsChart.tsx,src/components/FinancialSummary.tsx,src/components/FinancialOverview.tsx,src/App.tsx,src/pages/NotFound.tsx,src/utils/toast.ts,src/context/AuthProvider.tsx,src/hooks/useDailySummary.ts,src/components/made-with-dyad.tsx,src/integrations/supabase/client.ts,src/components/ui/card.tsx,src/components/ui/button.tsx,src/components/ui/input.tsx,src/components/ui/dialog.tsx,src/components/ui/alert-dialog.tsx,src/components/ui/form.tsx,src/components/ui/textarea.tsx,src/components/ui/select.tsx,src/components/ui/tabs.tsx,src/components/ui/badge.tsx,src/components/ui/skeleton.tsx,src/components/ui/checkbox.tsx,src/components/ui/table.tsx,src/components/ui/radio-group.tsx,src/components/ui/progress.tsx,src/components/ui/label.tsx,src/components/ui/switch.tsx,src/components/ui/separator.tsx,src/components/ui/scroll-area.tsx,src/components/ui/tooltip.tsx,src/components/ui/sonner.tsx,src/components/ui/toaster.tsx"></dyad-codebase-context><think>dyad-token-savings?original-tokens=141430.5&smart-context-tokens=74414</think>Days, addDays, isFuture } from 'date-fns';

export interface HabitDetail {
  id: string;
  name: string;
  description: string | null;
  goal_type?: string;
  goal_target?: number;
  category?: string;
}

export const useHabitDetail = (habitId: string | undefined) => {
  const { user } = useAuth();
  const [habit, setHabit] = useState<HabitDetail | null>(null);
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const calculateStreaks = useCallback((dates: Date[]) => {
    if (dates.length === 0) {
      setCurrentStreak(0);
      setLongestStreak(0);
      return;
    }

    const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    // Calculate current streak
    let checkDateForCurrentStreak = today;
    const isTodayCompleted = sortedDates.some(d => isSameDay(d, today));
    const isYesterdayCompleted = sortedDates.some(d => isSameDay(d, subDays(today, 1)));

    if (isTodayCompleted) {
      current = 1;
      checkDateForCurrentStreak = subDays(today, 1);
    } else if (isYesterdayCompleted) {
      current = 1; // Streak continues from yesterday if today is not completed
      checkDateForCurrentStreak = subDays(today, 2);
    } else {
      current = 0;
    }

    if (current > 0) {
      let i = 0;
      while (true) {
        const targetDate = subDays(checkDateForCurrentStreak, i);
        const isCompleted = sortedDates.some(d => isSameDay(d, targetDate));
        if (isCompleted) {
          current++;
          i++;
        } else {
          break;
        }
      }
    }
    setCurrentStreak(current);

    // Calculate longest streak
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = sortedDates[i - 1];
        const currentDate = sortedDates[i];
        // Check if current date is exactly one day after previous date
        if (isSameDay(currentDate, addDays(prevDate, 1))) {
          tempStreak++;
        } else if (!isSameDay(currentDate, prevDate)) { // If not consecutive and not same day, reset
          tempStreak = 1;
        }
      }
      if (tempStreak > longest) {
        longest = tempStreak;
      }
    }
    setLongestStreak(longest);
  }, []);

  const fetchHabitDetails = useCallback(async () => {
    if (!habitId) return;
    setLoading(true);

    const { data: habitData, error: habitError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .single();

    if (habitError || !habitData) {
      showError('Failed to load habit details.');
      setLoading(false);
      return;
    }
    setHabit(habitData);

    const { data: completionsData, error: completionsError } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .eq('habit_id', habitId);

    if (completionsError) {
      showError('Failed to load habit history.');
    } else {
      const dates = completionsData.map(c => new Date(c.completed_at + 'T00:00:00'));
      setCompletedDates(dates);
      calculateStreaks(dates); // Calculate streaks after fetching dates
    }

    setLoading(false);
  }, [habitId, calculateStreaks]);

  useEffect(() => {
    fetchHabitDetails();
  }, [fetchHabitDetails]);

  const handleMarkDate = async (selectedCalendarDate: Date) => {
    if (!selectedCalendarDate || !user || !habit) return;

    const formattedDate = format(selectedCalendarDate, 'yyyy-MM-dd');
    const isAlreadyCompleted = completedDates.some(d => isSameDay(d, selectedCalendarDate));

    if (isAlreadyCompleted) {
      showError('Habit already marked as completed on this date.');
      return;
    }

    const { error } = await supabase.from('habit_completions').insert({
      habit_id: habit.id,
      user_id: user.id,
      completed_at: formattedDate,
    });

    if (error) {
      showError('Error marking habit on this date.');
      console.error(error);
    } else {
      showSuccess('Habit marked as completed on this date!');
      const newCompletedDates = [...completedDates, selectedCalendarDate];
      setCompletedDates(newCompletedDates);
      calculateStreaks(newCompletedDates);
    }
  };

  const handleUnmarkDate = async (selectedCalendarDate: Date) => {
    if (!selectedCalendarDate || !user || !habit) return;

    const formattedDate = format(selectedCalendarDate, 'yyyy-MM-dd');
    const isAlreadyCompleted = completedDates.some(d => isSameDay(d, selectedCalendarDate));

    if (!isAlreadyCompleted) {
      showError('Habit is not marked as completed on this date.');
      return;
    }

    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .match({ habit_id: habit.id, completed_at: formattedDate });

    if (error) {
      showError('Error unmarking habit on this date.');
      console.error(error);
    } else {
      showSuccess('Habit unmarked on this date!');
      const newCompletedDates = completedDates.filter(d => !isSameDay(d, selectedCalendarDate));
      setCompletedDates(newCompletedDates);
      calculateStreaks(newCompletedDates);
    }
  };

  return {
    habit,
    completedDates,
    loading,
    currentStreak,
    longestStreak,
    handleMarkDate,
    handleUnmarkDate,
    fetchHabitDetails,
  };
};