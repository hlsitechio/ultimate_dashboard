import React from 'react';
import { Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, RefreshCw } from "lucide-react";
import { format, addWeeks, subWeeks } from "date-fns";
import { useCalendarStore } from '../store/calendarStore';
import WeekView from "../components/calendar/WeekView";
import EventModal from "../components/calendar/EventModal";
import LoadingSpinner from '../components/LoadingSpinner';

const Calendar = () => {
  const { 
    selectedDate, 
    setSelectedDate, 
    view, 
    setView,
    loading,
    error,
    clearError,
    connectCalendar,
    fetchEvents
  } = useCalendarStore();
  const [isEventModalOpen, setIsEventModalOpen] = React.useState(false);

  React.useEffect(() => {
    fetchEvents().catch(() => {});
  }, [fetchEvents]);

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handlePrevWeek = () => {
    setSelectedDate(subWeeks(selectedDate, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate(addWeeks(selectedDate, 1));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <CalIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-sm text-gray-400">
              Manage your schedule and events
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {error ? (
            <Button
              color="primary"
              variant="flat"
              onPress={() => connectCalendar()}
            >
              Connect Google Calendar
            </Button>
          ) : (
            <Button
              variant="flat"
              startContent={<RefreshCw className="h-4 w-4" />}
              onPress={() => fetchEvents()}
            >
              Sync Calendar
            </Button>
          )}

          <Button
            color="primary"
            startContent={<Plus className="h-5 w-5" />}
            onPress={() => setIsEventModalOpen(true)}
          >
            Add Event
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger/20 border border-danger rounded-lg text-danger">
          {error}
        </div>
      )}

      <WeekView />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </div>
  );
};

export default Calendar;