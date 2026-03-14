"use client"

import { useState, useEffect } from "react"
import { DataSync } from "@/lib/data-sync"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

export default function SyncIndicator() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    // Écouter les événements de synchronisation
    const handleSync = (event: CustomEvent) => {
      setSyncStatus('syncing')
      console.log('🔄 Synchronisation en cours...')
      
      // Simuler une courte synchronisation
      setTimeout(() => {
        setSyncStatus('synced')
        setLastSync(new Date())
        console.log('✅ Synchronisation terminée')
        
        // Revenir à l'état idle après 2 secondes
        setTimeout(() => {
          setSyncStatus('idle')
        }, 2000)
      }, 500)
    }
    
    DataSync.onSync(handleSync)
    
    return () => {
      DataSync.cleanup(handleSync)
    }
  }, [])

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <RefreshCw className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Synchronisation...'
      case 'synced':
        return 'Synchronisé'
      case 'error':
        return 'Erreur de sync'
      default:
        return lastSync ? `Dernière sync: ${lastSync.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : 'Prêt'
    }
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
      {getStatusIcon()}
      <span className="text-sm text-gray-600">{getStatusText()}</span>
    </div>
  )
}
