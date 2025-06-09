import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContactInfo } from '../types/consultant.types';

interface Props {
  contact: ContactInfo;
}

const ContactSection: React.FC<Props> = ({ contact }) => (
  <Card className="bg-white">
    <CardHeader className="pb-2">
      <CardTitle className="text-md">Contact</CardTitle>
    </CardHeader>
    <CardContent className="space-y-1 text-sm">
      <p>{contact.email}</p>
      <p>{contact.phone}</p>
      <p>{contact.address}</p>
    </CardContent>
  </Card>
);

export default ContactSection;
