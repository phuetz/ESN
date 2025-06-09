import React from 'react';
import { useForm } from 'react-hook-form';
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
    <form onSubmit={handleSubmit(submit)} className="flex items-center gap-2">
      <input {...register('name')} placeholder="Compétence" className="border p-2 rounded" />
      <input
        type="number"
        {...register('level', { valueAsNumber: true })}
        placeholder="Niveau"
        className="border p-2 rounded w-20"
      />
      <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">
        +
      </button>
    </form>
  );
};

export default SkillsForm;
