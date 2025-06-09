import React, { memo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import type { ProfessionalInfo } from '../types/consultant.types';

interface Props {
  defaultValues: ProfessionalInfo;
  onSubmit: (values: ProfessionalInfo) => void;
}

const ProfessionalInfoForm: React.FC<Props> = ({ defaultValues, onSubmit }) => {
  const { register, handleSubmit } = useForm<ProfessionalInfo>({ defaultValues });

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Informations professionnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('title')}
            placeholder="Titre"
            className="w-full border rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            {...register('level')}
            placeholder="Niveau"
            className="w-full border rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            type="number"
            {...register('experienceYears', { valueAsNumber: true })}
            placeholder="Années d'expérience"
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

export default memo(ProfessionalInfoForm);
