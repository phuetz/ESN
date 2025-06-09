import React, { memo } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Skill } from '../types/consultant.types';

interface Props {
  defaultValues: Skill;
  onAdd: (skill: Skill) => void;
}

const SkillsForm: React.FC<Props> = ({ defaultValues, onAdd }) => {
  const { register, handleSubmit, reset } = useForm<Skill>({ defaultValues });

  const submit = (data: Skill) => {
    onAdd(data);
    reset();
  };

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Compétences</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap items-end gap-2">
          <input
            {...register('name')}
            placeholder="Compétence"
            className="flex-1 border rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            type="number"
            {...register('level', { valueAsNumber: true })}
            placeholder="Niveau"
            className="w-24 border rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            +
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default memo(SkillsForm);
