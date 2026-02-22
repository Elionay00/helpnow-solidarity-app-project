import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';

interface Parceiro {
  _id: string;
  nome: string;
  logoUrl: string;
  descricao: string;
  siteUrl?: string;
}

interface ParceiroCardProps {
  parceiro: Parceiro;
}

const ParceiroCard: React.FC<ParceiroCardProps> = ({ parceiro }) => {
  const isClickable = !!parceiro.siteUrl;

  return (
    <IonCard
      style={{ width: '100%' }}
      button={isClickable}
      href={parceiro.siteUrl}
      target={isClickable ? '_blank' : undefined}
      rel={isClickable ? 'noopener noreferrer' : undefined}
      disabled={!isClickable}
    >
      <img alt={parceiro.nome} src={parceiro.logoUrl} style={{ width: '100%', height: '150px', objectFit: 'contain', padding: '10px' }} />
      <IonCardHeader>
        <IonCardTitle>{parceiro.nome}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>{parceiro.descricao}</IonCardContent>
    </IonCard>
  );
};

export default ParceiroCard;