import React from 'react';
import { useForm } from 'react-hook-form';
import type { ContactInfo } from '../types/consultant.types';

interface Props {
  defaultValues: ContactInfo;
  onSubmit: (values: ContactInfo) => void;
}

const ContactForm: React.FC<Props> = ({ defaultValues, onSubmit }) => {
  const { register, handleSubmit } = useForm<ContactInfo>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input {...register('email')} placeholder="Email" className="border p-2 rounded w-full" />
      <input {...register('phone')} placeholder="Téléphone" className="border p-2 rounded w-full" />
      <input {...register('address')} placeholder="Adresse" className="border p-2 rounded w-full" />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Enregistrer
      </button>
    </form>
  );
};

export default ContactForm;
