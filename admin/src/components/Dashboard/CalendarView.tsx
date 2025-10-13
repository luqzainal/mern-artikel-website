import { useState } from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent extends Event {
  id: string;
  type?: 'article' | 'review' | 'meeting';
}

interface CalendarViewProps {
  events: CalendarEvent[];
  isLoading?: boolean;
}

export default function CalendarView({ events, isLoading = false }: CalendarViewProps) {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#007373'; // primary
    
    if (event.type === 'article') {
      backgroundColor = '#007373'; // primary
    } else if (event.type === 'review') {
      backgroundColor = '#ff9800'; // secondary
    } else if (event.type === 'meeting') {
      backgroundColor = '#8b5cf6'; // purple
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Content Calendar
          </h3>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Content Calendar
        </h3>
        <div className="h-96">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={(newView) => setView(newView as 'month' | 'week' | 'day')}
            eventPropGetter={eventStyleGetter}
            className="rounded-lg"
            style={{ height: '100%' }}
          />
        </div>
      </CardBody>
    </Card>
  );
}

