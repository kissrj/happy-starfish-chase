"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Quote } from 'lucide-react';

const motivationalQuotes = [
  {
    text: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    category: "Getting Started"
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    category: "Habits"
  },
  {
    text: "Small daily improvements are the key to staggering long-term results.",
    author: "James Clear",
    category: "Progress"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Motivation"
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Perseverance"
  },
  {
    text: "Your habits will determine your future.",
    author: "Jack Canfield",
    category: "Future"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    category: "Action"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "Consistency"
  },
  {
    text: "The difference between who you are and who you want to be is what you do.",
    author: "Unknown",
    category: "Growth"
  },
  {
    text: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun",
    category: "Habits"
  },
  {
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    category: "Action"
  },
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
    category: "Exercise"
  },
  {
    text: "Reading is to the mind what exercise is to the body.",
    author: "Joseph Addison",
    category: "Learning"
  },
  {
    text: "The secret of your success is determined by your daily agenda.",
    author: "John C. Maxwell",
    category: "Planning"
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
    category: "Consistency"
  }
];

const MotivationalQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  };

  useEffect(() => {
    // Set a random quote on component mount
    getRandomQuote();
  }, []);

  return (
    <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-800">
          <Quote className="mr-2 h-5 w-5" />
          Daily Inspiration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <blockquote className="text-lg font-medium text-gray-800 italic">
            "{currentQuote.text}"
          </blockquote>
          <div className="flex items-center justify-between">
            <cite className="text-sm text-gray-600">
              — {currentQuote.author}
            </cite>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {currentQuote.category}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={getRandomQuote}
                className="text-purple-600 hover:text-purple-800"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalQuotes;