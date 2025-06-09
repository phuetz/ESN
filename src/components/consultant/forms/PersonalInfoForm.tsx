import React, { memo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PersonalInfo } from '../types/consultant.types';

interface Props {
  defaultValues: PersonalInfo;
  onSubmit: (values: PersonalInfo) => void;
}

const PersonalInfoForm: React.FC<Props> = ({ defaultValues, onSubmit }) => {
  const { register, handleSubmit } = useForm<PersonalInfo>({ defaultValues });

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('firstName')}
            placeholder="Prénom"
            className="w-full border rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            {...register('lastName')}
            placeholder="Nom"
            className="w-full border rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            {...register('birthDate')}
            placeholder="Date de naissance"
            className="w-full border rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Enregistrer
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default memo(PersonalInfoForm);
