"use client";

import { Input } from '@/components/ui/input';
import AddHabitDialog from '@/components/AddHabitDialog';

interface HabitFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  onHabitAdded: () => void;
}

const HabitFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  onHabitAdded
}: HabitFiltersProps) => {
  return (
    <div className="flex gap-4 w-full sm:w-auto">
      <Input
        type="text"
        placeholder="Search habits..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-3 py-2 border rounded-md bg-white"
      >
        <option value="all">All Categories</option>
        {categories.filter(cat => cat !== 'all').map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <AddHabitDialog onHabitAdded={onHabitAdded} />
    </div>
  );
};

export default HabitFilters;