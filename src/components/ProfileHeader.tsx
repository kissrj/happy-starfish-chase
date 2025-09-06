"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
        <Button asChild variant="outline" size="sm">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default ProfileHeader;