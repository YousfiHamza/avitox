// app/market/FilterSidebar.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LOCATIONS } from '@/lib/constants';

const categories = ['CAT', 'DOG', 'BIRD'];
const sexOptions = ['MALE', 'FEMALE'];

type Filters = {
  category?: string;
  sex?: string;
  minAge?: string;
  maxAge?: string;
  keywords?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
};

export function FilterSidebar({ initialFilters }: { initialFilters: Filters }) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    router.push(`/market?${params.toString()}`);
  };

  return (
    <div className="w-fit space-y-6 rounded-lg bg-white p-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={filters.category}
          onValueChange={value =>
            handleFilterChange('category', value !== 'all' ? value : '')
          }
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sex">Sex</Label>
        <Select
          value={filters.sex}
          onValueChange={value =>
            handleFilterChange('sex', value !== 'all' ? value : '')
          }
        >
          <SelectTrigger id="sex">
            <SelectValue placeholder="Select sex" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {sexOptions.map(sex => (
              <SelectItem key={sex} value={sex}>
                {sex}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="keywords">Keywords</Label>
        <Input
          id="keywords"
          value={filters.keywords}
          onChange={e => handleFilterChange('keywords', e.target.value)}
          placeholder="Search in title or description"
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Select
          value={filters.location}
          onValueChange={value =>
            handleFilterChange('location', value !== 'all' ? value : '')
          }
        >
          <SelectTrigger id="location">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {LOCATIONS.map(location => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Price Range</Label>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={filters.minPrice}
            onChange={e => handleFilterChange('minPrice', e.target.value)}
            className="w-24"
            placeholder="Min"
          />
          <span>to</span>
          <Input
            type="number"
            value={filters.maxPrice}
            onChange={e => handleFilterChange('maxPrice', e.target.value)}
            className="w-24"
            placeholder="Max"
          />
        </div>
      </div>

      <Button onClick={applyFilters} className="w-full">
        Apply Filters
      </Button>
    </div>
  );
}
