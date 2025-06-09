import React from 'react';
import { useForm } from 'react-hook-form';
import type { PersonalInfo } from '../types/consultant.types';

interface Props {
  defaultValues: PersonalInfo;
  onSubmit: (values: PersonalInfo) => void;
}

const PersonalInfoForm: React.FC<Props> = ({ defaultValues, onSubmit }) => {
  const { register, handleSubmit } = useForm<PersonalInfo>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input
        {...register('firstName')}
        placeholder="Prénom"
        className="border p-2 rounded w-full"
      />
      <input
        {...register('lastName')}
        placeholder="Nom"
        className="border p-2 rounded w-full"
      />
      <input
        {...register('birthDate')}
        placeholder="Date de naissance"
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Enregistrer
      </button>
    </form>
  );
};

export default PersonalInfoForm;
