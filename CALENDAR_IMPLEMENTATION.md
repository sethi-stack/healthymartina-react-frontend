# Calendar Component Implementation

## Overview
This document describes the React calendar component implementation that replaces the Blade template `calendario-planificador.blade.php`.

## Structure

### Main Components

1. **Calendar.jsx** - Main page component
   - Manages calendar state and selection
   - Handles CRUD operations (create, update, delete, copy)
   - Renders calendar grid and modals

2. **CalendarGrid.jsx** - Calendar grid display
   - Renders days and meals in a grid layout
   - Parses calendar schedule data (main_schedule, sides_schedule)

3. **CalendarCell.jsx** - Individual calendar cell
   - Displays recipe information for a day+meal combination
   - Handles click to add/edit recipes

4. **CalendarOptions.jsx** - Action buttons and calendar selector
   - Create, copy, export, edit, delete buttons
   - Calendar selector dropdown

### Modal Components

- **CreateCalendarModal.jsx** - Create new calendar
- **EditCalendarModal.jsx** - Edit calendar name
- **DeleteCalendarModal.jsx** - Delete calendar confirmation
- **CopyCalendarModal.jsx** - Copy calendar with new name
- **ExportCalendarModal.jsx** - Export calendar PDF with lista tab
- **AddMealModal.jsx** - Add recipe to calendar (placeholder)
- **UpdateMealModal.jsx** - Update recipe in calendar (placeholder)
- **CalendarListaTab.jsx** - Display ingredient list (lista)

## API Integration

### Calendar API (`lib/api/calendars.js`)

All calendar API endpoints are defined in `lib/api/calendars.js`:

- `getCalendars()` - List user's calendars
- `getCalendar(id)` - Get single calendar
- `createCalendar(data)` - Create new calendar
- `updateCalendar(id, data)` - Update calendar
- `deleteCalendar(id)` - Delete calendar
- `copyCalendar(id, nombre)` - Copy calendar
- `getCalendarSchedules()` - Get calendar schedules for dropdown
- `addRecipeToCalendar(calendarId, data)` - Add recipe to calendar
- `updateRecipeInCalendar(calendarId, data)` - Update recipe in calendar
- `removeRecipeFromCalendar(calendarId, data)` - Remove recipe from calendar
- `updateCalendarLabels(calendarId, data)` - Update day/meal labels
- `getCalendarNutrition(calendarId, dayId)` - Get nutritional info
- `exportCalendarPdf(data)` - Export calendar as PDF
- `getCalendarLista(calendarId)` - Get ingredient list
- `exportListaPdf(calendarId)` - Export lista as PDF

## Data Structure

### Calendar Object
```javascript
{
  id: number,
  title: string, // or nombre
  labels: {
    days: { day_1: "Monday", day_2: "Tuesday", ... },
    meals: { meal_1: "Breakfast", meal_2: "Lunch", ... }
  },
  main_schedule: {
    day_1: { meal_1: recipeId, meal_2: recipeId, ... },
    day_2: { ... },
    ...
  },
  sides_schedule: { ... },
  main_servings: { day_1: { meal_1: 2, ... }, ... },
  sides_servings: { ... },
  main_leftovers: { day_1: { meal_1: false, ... }, ... },
  sides_leftovers: { ... }
}
```

## Features Implemented

✅ Calendar list and selection
✅ Create calendar
✅ Edit calendar name
✅ Delete calendar
✅ Copy calendar
✅ Export calendar PDF
✅ Lista (ingredient list) tab
✅ Calendar grid display
✅ Basic recipe display in cells

## Features Pending

⚠️ Add recipe to calendar (AddMealModal - placeholder)
⚠️ Update recipe in calendar (UpdateMealModal - placeholder)
⚠️ Remove recipe from calendar
⚠️ Drag and drop recipes
⚠️ Recipe search and selection
⚠️ Nutritional information display
⚠️ Update calendar labels (days/meals)
⚠️ Portion/ration management
⚠️ Leftover management

## Route

The calendar is accessible at `/calendario` and is protected by authentication.

## Styling

Calendar styles are imported from `assets/scss/componentes/_calendar.scss` which contains all the calendar-specific styles matching the original Blade template.

## Notes

1. **Recipe Data**: Currently, recipe details are not automatically fetched. The calendar stores recipe IDs, but recipe details (title, image) need to be fetched separately. This can be enhanced by:
   - Fetching all recipes used in the calendar when loading
   - Storing recipe data in the calendar response
   - Creating a recipe lookup service

2. **API Endpoints**: Some endpoints like `addRecipeToCalendar`, `updateRecipeInCalendar`, etc. may need to be created in the Laravel backend if they don't exist in the API routes yet.

3. **Lista Tab**: The lista tab displays ingredient lists. The toggle taken functionality needs to be implemented.

4. **Export**: PDF export functionality requires the backend endpoints to be properly configured.

## Next Steps

1. Implement AddMealModal with recipe search
2. Implement UpdateMealModal with recipe editing
3. Add drag and drop functionality
4. Fetch and display recipe details in calendar cells
5. Implement nutritional information display
6. Add label editing functionality
7. Complete lista functionality (toggle taken, custom items)

