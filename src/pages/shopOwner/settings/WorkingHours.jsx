import { useState } from "react";
import {
  MdAccessTime,
  MdSchedule,
  MdEvent,
  MdToday,
  MdDateRange,
  MdNotifications,
  MdRepeat,
  MdClose,
  MdCheck,
  MdAdd,
  MdDelete,
  MdEdit,
  MdSave,
  MdRestaurant,
  MdShoppingCart,
  MdDeliveryDining,
  MdBusiness
} from "react-icons/md";

export default function WorkingHours() {
  const [workingHours, setWorkingHours] = useState({
    default: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: [
        { open: "09:00", close: "18:00", type: "regular" },
        { open: "09:00", close: "18:00", type: "regular" },
        { open: "09:00", close: "18:00", type: "regular" },
        { open: "09:00", close: "20:00", type: "extended" },
        { open: "09:00", close: "18:00", type: "regular" }
      ]
    },
    weekend: {
      days: ["Saturday", "Sunday"],
      hours: [
        { open: "10:00", close: "16:00", type: "reduced" },
        { open: "12:00", close: "15:00", type: "limited" }
      ]
    },
    special: [
      {
        id: 1,
        date: "2024-12-25",
        name: "Christmas Day",
        hours: { open: "12:00", close: "17:00" },
        status: "closed"  // Fixed: added status property
      },
      {
        id: 2,
        date: "2024-01-01",
        name: "New Year's Day",
        hours: { open: "11:00", close: "19:00" },
        status: "modified"  // Fixed: added status property
      }
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, open: "09:00", close: "13:00" },
    { id: 2, open: "14:00", close: "18:00" }
  ]);
  const [showSpecialForm, setShowSpecialForm] = useState(false);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Fixed: Added default case for undefined status
  const getHoursType = (status) => {
    const hoursTypes = {
      regular: { color: "bg-green-100 text-green-800", label: "Regular" },
      extended: { color: "bg-blue-100 text-blue-800", label: "Extended" },
      reduced: { color: "bg-yellow-100 text-yellow-800", label: "Reduced" },
      limited: { color: "bg-orange-100 text-orange-800", label: "Limited" },
      modified: { color: "bg-purple-100 text-purple-800", label: "Modified" },
      closed: { color: "bg-red-100 text-red-800", label: "Closed" }
    };
    return hoursTypes[status] || hoursTypes.regular; // Return regular as default if status not found
  };

  const handleTimeSlotAdd = () => {
    const newSlot = {
      id: timeSlots.length + 1,
      open: "09:00",
      close: "17:00"
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const handleTimeSlotRemove = (id) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const handleTimeSlotChange = (id, field, value) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const handleSave = () => {
    // In a real app, you would save to backend
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-6">
      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Working Hours
              </h1>
              <p className="text-amber-100 text-lg">
                Manage store hours, breaks, and special schedules
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-white text-orange-600 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg"
                  >
                    <MdSave className="text-xl" /> Save Schedule
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-white text-orange-600 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg"
                >
                  <MdEdit className="text-xl" /> Edit Hours
                </button>
              )}
            </div>
          </div>

          {/* Current Status */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-white">Store is OPEN</span>
            </div>
            <span className="text-amber-100">•</span>
            <span className="text-amber-100">Today: 9:00 AM - 6:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Weekly Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MdSchedule className="text-orange-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-800">Weekly Schedule</h2>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition">
                  <MdRepeat />
                </button>
                <button className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition">
                  <MdNotifications />
                </button>
              </div>
            </div>

            {/* Days Selection */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {daysOfWeek.map((day, index) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(index)}
                  className={`px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                    selectedDay === index
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Time Slots for Selected Day */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">
                  {daysOfWeek[selectedDay]} Schedule
                </h3>
                {isEditing && (
                  <button
                    onClick={handleTimeSlotAdd}
                    className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition flex items-center gap-2"
                  >
                    <MdAdd /> Add Time Slot
                  </button>
                )}
              </div>

              {timeSlots.map((slot) => (
                <div key={slot.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">Time Slot</span>
                    {isEditing && timeSlots.length > 1 && (
                      <button
                        onClick={() => handleTimeSlotRemove(slot.id)}
                        className="p-1 hover:bg-red-100 rounded transition text-red-500"
                      >
                        <MdClose />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Open Time</label>
                      {isEditing ? (
                        <input
                          type="time"
                          value={slot.open}
                          onChange={(e) => handleTimeSlotChange(slot.id, "open", e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                          {slot.open}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Close Time</label>
                      {isEditing ? (
                        <input
                          type="time"
                          value={slot.close}
                          onChange={(e) => handleTimeSlotChange(slot.id, "close", e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                          {slot.close}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Breaks Section */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MdRestaurant className="text-amber-600" />
                    <h4 className="font-medium text-gray-800">Breaks & Pauses</h4>
                  </div>
                  {isEditing && (
                    <button className="text-sm text-amber-600 hover:text-amber-700">
                      Add Break
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="time" defaultValue="13:00" className="px-3 py-1 border rounded" />
                        <span>to</span>
                        <input type="time" defaultValue="14:00" className="px-3 py-1 border rounded" />
                        <button className="ml-2 text-red-500">
                          <MdClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    "Lunch break: 1:00 PM - 2:00 PM"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Special Hours */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MdEvent className="text-orange-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-800">Special Hours</h2>
              </div>
              <button
                onClick={() => setShowSpecialForm(true)}
                className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition flex items-center gap-2"
              >
                <MdAdd /> Add Special Day
              </button>
            </div>

            <div className="space-y-4">
              {workingHours.special.map((special) => {
                const hoursType = getHoursType(special.status);
                return (
                  <div key={special.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">{special.name}</h4>
                        <p className="text-sm text-gray-600">
                          <MdDateRange className="inline mr-1" />
                          {new Date(special.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${hoursType.color}`}>
                        {hoursType.label}
                      </span>
                    </div>
                    {special.status !== "closed" && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <MdAccessTime className="text-gray-500" />
                          <span>{special.hours.open} - {special.hours.close}</span>
                        </div>
                        <span className="text-sm text-gray-500">Modified hours</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Overview & Actions */}
        <div className="space-y-6">
          {/* Current Week Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <MdToday className="text-orange-600" />
              <h3 className="font-bold text-gray-800">This Week</h3>
            </div>
            
            <div className="space-y-3">
              {daysOfWeek.map((day, index) => (
                <div key={day} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      index < 5 ? "bg-green-500" : "bg-blue-500"
                    }`}></div>
                    <span className={index === new Date().getDay() - 1 ? "font-bold text-orange-600" : "text-gray-700"}>
                      {day}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">9:00 AM - 6:00 PM</div>
                    <div className="text-xs text-gray-500">
                      {index < 5 ? "Regular hours" : "Weekend hours"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Status */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-6">Operating Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Store Hours</span>
                <span className="font-bold">54 hours/week</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Hours</span>
                <span className="font-bold">60 hours/week</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Support Hours</span>
                <span className="font-bold">24/7 Available</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-amber-100">Next Holiday</span>
                <span className="font-bold">Christmas Day</span>
              </div>
              <div className="text-sm text-amber-100 mt-1">Dec 25, 2024 - Reduced hours</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition flex items-center justify-center gap-2 font-medium text-gray-700">
                <MdBusiness /> Set Holiday Hours
              </button>
              <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition flex items-center justify-center gap-2 font-medium text-gray-700">
                <MdShoppingCart /> Shopping Hours
              </button>
              <button className="w-full py-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition flex items-center justify-center gap-2 font-medium text-orange-700">
                <MdDeliveryDining /> Delivery Hours
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Special Hours Modal */}
      {showSpecialForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Add Special Hours</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event Name (e.g., Christmas Day)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
              <input
                type="date"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  placeholder="Open Time"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <input
                  type="time"
                  placeholder="Close Time"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500">
                <option value="modified">Modified Hours</option>
                <option value="closed">Closed</option>
                <option value="extended">Extended Hours</option>
              </select>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowSpecialForm(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl transition text-white font-medium">
                  Add Special Day
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}