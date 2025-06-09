import React from 'react';
import type { ContactInfo } from '../types/consultant.types';

interface Props {
  contact: ContactInfo;
}

const ContactSection: React.FC<Props> = ({ contact }) => (
  <div className="space-y-1">
    <p>{contact.email}</p>
    <p>{contact.phone}</p>
    <p>{contact.address}</p>
  </div>
);

export default ContactSection;
