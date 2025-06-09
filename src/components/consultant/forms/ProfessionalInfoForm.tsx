import React from 'react';
import { useForm } from 'react-hook-form';
import type { ProfessionalInfo } from '../types/consultant.types';

interface Props {
  defaultValues: ProfessionalInfo;
  onSubmit: (values: ProfessionalInfo) => void;
}

const ProfessionalInfoForm: React.FC<Props> = ({ defaultValues, onSubmit }) => {
  const { register, handleSubmit } = useForm<ProfessionalInfo>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input {...register('title')} placeholder="Titre" className="border p-2 rounded w-full" />
      <input {...register('level')} placeholder="Niveau" className="border p-2 rounded w-full" />
      <input
        type="number"
        {...register('experienceYears', { valueAsNumber: true })}
        placeholder="Années d'expérience"
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Enregistrer
      </button>
    </form>
  );
};

export default ProfessionalInfoForm;
