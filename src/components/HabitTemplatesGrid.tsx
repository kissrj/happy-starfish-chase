"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, Clock, Target, TrendingUp } from 'lucide-react';
import { HabitTemplate } from '@/hooks/useHabitTemplates';
import HabitTemplateCard from '@/components/HabitTemplateCard';

interface HabitTemplatesGridProps {
  templates: HabitTemplate[];
  onSelectTemplate: (template: HabitTemplate) => void;
  selectedTemplate?: HabitTemplate | null;
}

const HabitTemplatesGrid = ({ templates, onSelectTemplate, selectedTemplate }: HabitTemplatesGridProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(templates.map(t => t.category)));
    return ['all', ...cats];
  }, [templates]);

  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
      const matchesPopular = !showPopularOnly || template.is_popular;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesPopular;
    });
  }, [templates, searchQuery, selectedCategory, selectedDifficulty, showPopularOnly]);

  const popularTemplates = templates.filter(t => t.is_popular);
  const avgSuccessRate = Math.round<think>Initial files ranking:

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

</think><dyad-codebase-context files="src/components/DailySummary.tsx,src/components/FinancialOverview.tsx,src/components/FinancialSummary.tsx,src/pages/FinanceTracker.tsx,src/components/TransactionManager.tsx,src/components/TransactionTable.tsx,src/components/AddTransactionDialog.tsx,src/components/BudgetManager.tsx,src/components/BudgetList.tsx,src/components/AddBudgetDialog.tsx,src/components/EditBudgetDialog.tsx,src/components/ExpenseChart.tsx,src/hooks/useTransactions.ts,src/hooks/useBudgets.ts,src/hooks/useExpenseChart.ts,src/utils/exportData.ts,src/utils/notifications.ts,src/components/HabitCompletionChart.tsx,src/components/EditHabitDialog.tsx,src/components/HabitTemplates.tsx,src/hooks/useHabits.ts,src/components/HabitFilters.tsx,src/components/HabitList.tsx,src/components/QuickStart.tsx,src/components/DeleteHabitDialog.tsx,src/utils/habitExport.ts,src/hooks/useHabitActions.ts,src/hooks/useHabitDetail.ts,src/components/HabitStreakDisplay.tsx,src/components/HabitCalendar.tsx,src/components/HabitHeader.tsx,src/components/HabitInfo.tsx,src/components/HabitGoalProgress.tsx,src/pages/HabitDetail.tsx,src/hooks/useSettings.ts,src/components/NotificationSettings.tsx,src/components/AppearanceSettings.tsx,src/components/AccountInformation.tsx,src/components/DataManagementSettings.tsx,src/pages/Settings.tsx,src/hooks/useCalendar.ts,src/components/CalendarHeader.tsx,src/components/HabitFilter.tsx,src/components/MonthlyStats.tsx,src/components/CalendarGrid.tsx,src/components/CalendarLegend.tsx,src/pages/Calendar.tsx,src/hooks/useProfile.ts,src/components/ProfileForm.tsx,src/components/ProfileHeader.tsx,src/pages/Profile.tsx,src/hooks/useHabitInsights.ts,src/components/HabitInsightsCard.tsx,src/components/HabitInsightsSummary.tsx,src/hooks/useHabitTemplates.ts,src/hooks/useNotifications.ts,src/components/NotificationCenter.tsx,src/components/AdvancedNotificationSettings.tsx,src/components/HabitTemplateCard.tsx,src/pages/HabitInsights.tsx,src/pages/Notifications.tsx,src/components/HabitTemplatesGrid.tsx,src/components/AddHabitDialog.tsx,src/pages/Login.tsx,src/pages/Achievements.tsx,src/services/achievementService.ts,src/types/achievements.ts,src/hooks/useAchievements.ts,src/components/AchievementCard.tsx,src/hooks/useStreak.ts,src/components/AchievementsPanel.tsx,src/components/Icon.tsx,src/utils/achievementChecker.ts,src/hooks/useHabitTrends.ts,src/components/StreakCounter.tsx,src/components/HabitTrendsChart.tsx,src/pages/Index.tsx,src/App.tsx,src/pages/NotFound.tsx,src/context/AuthProvider.tsx,src/integrations/supabase/client.ts,src/utils/toast.ts,src/components/made-with-dyad.tsx,src/hooks/useDailySummary.ts,src/components/ui/card.tsx,src/components/ui/button.tsx,src/components/ui/skeleton.tsx,src/components/ui/badge.tsx,src/components/ui/tabs.tsx,src/components/ui/input.tsx,src/components/ui/checkbox.tsx,src/components/ui/alert-dialog.tsx,src/components/ui/form.tsx,src/components/ui/textarea.tsx,src/components/ui/select.tsx,src/components/ui/progress.tsx,src/components/ui/table.tsx,src/components/ui/radio-group.tsx,src/components/ui/label.tsx,src/components/ui/separator.tsx,src/components/ui/switch.tsx,src/components/ui/calendar.tsx,src/components/ui/scroll-area.tsx,src/components/ui/tooltip.tsx,src/components/ui/sonner.tsx,src/components/ui/toaster.tsx,src/components/ProtectedRoute.tsx"></dyad-codebase-context><think>dyad-token-savings?original-tokens=141430.5&smart-context-tokens=77533</think>(templates.reduce((sum, t) => sum + t.success_rate, 0) / templates.length);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{popularTemplates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSuccessRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(templates.reduce((sum, t) => sum + t.estimated_time, 0) / templates.length)}min
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white text-sm"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white text-sm"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="popular-only"
              checked={showPopularOnly}
              onChange={(e) => setShowPopularOnly(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="popular-only" className="text-sm flex items-center gap-1">
              <Star className="h-4 w-4" />
              Show popular only
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Available Templates ({filteredTemplates.length})
          </h3>
          {selectedTemplate && (
            <Badge variant="default" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Selected: {selectedTemplate.name}
            </Badge>
          )}
        </div>

        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search term.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <HabitTemplateCard
                key={template.id}
                template={template}
                onSelect={onSelectTemplate}
                isSelected={selectedTemplate?.id === template.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitTemplatesGrid;