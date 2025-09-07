"use client";

// Generate a shareable image of progress (placeholder for future implementation)
export const generateProgressImage = async (progressData: any): Promise<string> => {
  // In a real implementation, you would use a library like html2canvas or a server-side solution
  // For now, return a placeholder
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    }, 1000);
  });
};

// Create a shareable text message
export const createShareMessage = (progressData: any): string => {
  const { completed, total, streak, userName } = progressData;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return `${userName || 'I'} just completed ${completed}/${total} habits today (${completionRate}% completion rate) with a ${streak}-day streak! Building better habits every day. #HabitTracker #PersonalGrowth`;
};

// Get the current app URL
export const getAppUrl = (): string => {
  return typeof window !== 'undefined' ? window.location.origin : '';
};

// Create a shareable URL with encoded data
export const createShareableUrl = (progressData: any): string => {
  const encodedData = btoa(JSON.stringify(progressData));
  return `${getAppUrl()}/share/${encodedData}`;
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Share using Web Share API if available
export const shareUsingWebAPI = async (data: ShareData): Promise<boolean> => {
  if (!navigator.share) {
    return false;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    console.error('Error sharing:', error);
    return false;
  }
};