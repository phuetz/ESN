import React, { memo } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContactInfo } from '../types/consultant.types';

interface Props {
  defaultValues: ContactInfo;
  onSubmit: (values: ContactInfo) => void;
}

const ContactForm: React.FC<Props> = ({ defaultValues, onSubmit }) => {
  const { register, handleSubmit } = useForm<ContactInfo>({ defaultValues });

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('email')}
            placeholder="Email"
            className="w-full border rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            {...register('phone')}
            placeholder="Téléphone"
            className="w-full border rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            {...register('address')}
            placeholder="Adresse"
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

export default memo(ContactForm);
