import React from 'react';
import { useForm } from 'react-hook-form';
import type { PersonalInfo } from '../types/CV.types';

interface Props {
  defaultValues: PersonalInfo;
  onChange: (values: PersonalInfo) => void;
}

const PersonalInfoForm: React.FC<Props> = ({ defaultValues, onChange }) => {
  const { register, handleSubmit } = useForm<PersonalInfo>({ defaultValues });

  return (
    <form onBlur={handleSubmit(onChange)} className="space-y-2">
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
        {...register('title')}
        placeholder="Titre"
        className="border p-2 rounded w-full"
      />
      <input
        {...register('email')}
        placeholder="Email"
        className="border p-2 rounded w-full"
      />
      <input
        {...register('phone')}
        placeholder="Téléphone"
        className="border p-2 rounded w-full"
      />
    </form>
  );
};

export default React.memo(PersonalInfoForm);
