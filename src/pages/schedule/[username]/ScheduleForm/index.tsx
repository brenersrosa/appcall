import { useState } from 'react'

import CalendarStep from './CalendarStep'
import ConfirmStep from './ConfirmStep'

interface UserLoggedInProps {
  id: string
  name: string
  email: string
}

export default function ScheduleForm(userLoggedIn: UserLoggedInProps) {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>()

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null)
  }

  return (
    <>
      {selectedDateTime ? (
        <ConfirmStep
          schedulingDate={selectedDateTime}
          onReturnToCalendar={handleClearSelectedDateTime}
          userLoggedIn={userLoggedIn}
        />
      ) : (
        <CalendarStep onSelectDateTime={setSelectedDateTime} />
      )}
    </>
  )
}
