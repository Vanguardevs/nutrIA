import React from 'react';
import CardCustomCalendar from '../CustomCardCalendar';

interface Agenda {
  id: string;
  horario?: string;
  hora?: string;
  alimentos?: string[];
  refeicao?: string;
  [key: string]: any;
}

interface DiaryAgendaListProps {
  agendas: Agenda[];
  onEdit: (agenda: Agenda) => void;
  onConcluido: (id: string) => void;
}

const DiaryAgendaList: React.FC<DiaryAgendaListProps> = ({ agendas, onEdit, onConcluido }) => {
  return (
    <>
      {agendas.map((agenda) => (
        <CardCustomCalendar
          key={agenda.id}
          horario={agenda.horario || agenda.hora}
          alimentos={Array.isArray(agenda.alimentos) ? agenda.alimentos : (agenda.refeicao ? [agenda.refeicao] : [])}
          onPressEdit={() => onEdit(agenda)}
          onPressConcluido={() => onConcluido(agenda.id)}
        />
      ))}
    </>
  );
};

export default DiaryAgendaList;
