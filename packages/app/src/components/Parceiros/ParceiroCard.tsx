import React from 'react';
import './ParceiroCard.css';

interface ParceiroCardProps {
  logo: string;
  nome: string;
  descricao: string;
}

const ParceiroCard: React.FC<ParceiroCardProps> = ({ logo, nome, descricao }) => {
  return (
    <div className="parceiro-card">
      <img src={logo} alt={`Logo de ${nome}`} className="parceiro-logo" />
      <div className="parceiro-info">
        <h3>{nome}</h3>
        <p>{descricao}</p>
      </div>
    </div>
  );
};

export default ParceiroCard;
