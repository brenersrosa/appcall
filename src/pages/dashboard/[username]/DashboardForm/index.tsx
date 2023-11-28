import { useState } from 'react'

import CalendarStep from './CalendarStep'
// import ConfirmStep from './ConfirmStep'

export default function DashboardForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>()

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null)
  }

  return (
    <>
      {selectedDateTime ? (
        // <ConfirmStep
        //   schedulingDate={selectedDateTime}
        //   onReturnToCalendar={handleClearSelectedDateTime}
        // />
        <></>
      ) : (
        <CalendarStep onSelectDateTime={setSelectedDateTime} />
      )}
    </>
  )
}
