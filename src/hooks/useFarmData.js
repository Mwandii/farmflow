import { useState, useEffect, useCallback } from 'react'
import { STORAGE_KEY } from '../data/siteData'

const DEFAULT_STATE = {
  activeSeason: null,
  pastSeasons: [],
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_STATE
  } catch {
    return DEFAULT_STATE
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Storage error', e)
  }
}

export function useFarmData() {
  const [data, setData] = useState(loadData)

  const persist = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveData(next)
      return next
    })
  }, [])

  // Start a new season
  const startSeason = useCallback((year) => {
    persist(prev => ({
      ...prev,
      activeSeason: {
        id: Date.now().toString(),
        year,
        startedAt: new Date().toISOString(),
        stages: {},
      },
    }))
  }, [persist])

  // Log a stage
  const logStage = useCallback((stageId, stageData) => {
    persist(prev => ({
      ...prev,
      activeSeason: {
        ...prev.activeSeason,
        stages: {
          ...prev.activeSeason.stages,
          [stageId]: stageData,
        },
      },
    }))
  }, [persist])

  // Complete season (move active -> past)
  const completeSeason = useCallback((sellPricePerSack) => {
    persist(prev => {
      if (!prev.activeSeason) return prev
      const completed = {
        ...prev.activeSeason,
        completedAt: new Date().toISOString(),
        sellPricePerSack,
      }
      return {
        activeSeason: null,
        pastSeasons: [completed, ...prev.pastSeasons],
      }
    })
  }, [persist])

  // Delete active season
  const deleteActiveSeason = useCallback(() => {
    persist(prev => ({ ...prev, activeSeason: null }))
  }, [persist])

  return {
    activeSeason: data.activeSeason,
    pastSeasons: data.pastSeasons,
    startSeason,
    logStage,
    completeSeason,
    deleteActiveSeason,
  }
}