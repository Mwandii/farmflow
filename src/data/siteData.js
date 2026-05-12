// Kiriku Farm Tracker — central data config

export const FARM_INFO = {
  name: 'Kiriku Shamba',
  location: 'Kiriku, Kwale County',
  size: '6 acres',
  crop: 'Maize',
}

// Days after planting date for each suggestion
export const STAGE_SCHEDULE = {
  firstWeeding: 21,   // ~3 weeks
  secondWeeding: 49,  // ~7 weeks
  harvest: 100,       // ~100 days
}

export const STAGES = [
  {
    id: 'landPrep',
    label: 'Land Preparation',
    icon: '⛏️',
    description: 'Digging and preparing the soil for planting',
    fields: ['date', 'cost'],
    hint: null,
  },
  {
    id: 'planting',
    label: 'Planting',
    icon: '🌱',
    description: 'Seed planting and fertiliser application',
    fields: ['date', 'cost'],
    hint: 'Planting date sets the schedule for weeding and harvest.',
  },
  {
    id: 'firstWeeding',
    label: 'First Weeding',
    icon: '🌿',
    description: 'First palilia — clearing weeds around young plants',
    fields: ['date', 'cost'],
    hint: 'Recommended 3 weeks after planting.',
    scheduleDays: 21,
  },
  {
    id: 'secondWeeding',
    label: 'Second Weeding',
    icon: '🌾',
    description: 'Second palilia — before maize stalks close canopy',
    fields: ['date', 'cost'],
    hint: 'Recommended 7 weeks after planting.',
    scheduleDays: 49,
  },
  {
    id: 'harvesting',
    label: 'Harvesting',
    icon: '🌽',
    description: 'Harvest, shelling, bagging and transport costs',
    fields: ['date', 'cost', 'sacks'],
    hint: 'Expected around 100 days after planting.',
    scheduleDays: 100,
  },
]

export const STORAGE_KEY = 'kiriku_farm_data'