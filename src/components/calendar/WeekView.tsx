import React from 'react';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import { Card } from '@nextui-org/react';

const WeekView: React.FC = () => {
  const { selectedDate, events } = useCalendarStore();
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-hidden">
      <div className="flex border-b border-gray-700">
        <div className="w-20" /> {/* Time column spacer */}
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className="flex-1 text-center py-2 border-l border-gray-700"
          >
            <div className="text-sm font-medium">
              {format(day, 'EEE')}
            </div>
            <div className="text-xs text-gray-400">
              {format(day, 'd MMM')}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-1 overflow-y-auto">
        <div className="w-20 flex-shrink-0">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-20 border-b border-gray-700 text-xs text-gray-400 text-right pr-2"
            >
              {format(new Date().setHours(hour), 'ha')}
            </div>
          ))}
        </div>

        <div className="flex flex-1">
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className="flex-1 border-l border-gray-700"
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-20 border-b border-gray-700 relative"
                >
                  {events
                    .filter((event) => isSameDay(event.start, day))
                    .map((event) => (
                      <Card
                        key={event.id}
                        className={`absolute left-1 right-1 ${
                          event.color || 'bg-primary'
                        } p-1 text-xs rounded overflow-hidden cursor-pointer`}
                        style={{
                          top: `${(event.start.getHours() * 60 + event.start.getMinutes()) * (100 / 60)}%`,
                          height: `${
                            ((event.end.getTime() - event.start.getTime()) / (1000 * 60)) * (100 / 60)
                          }%`,
                        }}
                      >
                        {event.title}
                      </Card>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;