import { ComponentSettings, Manager } from '@managed-components/types'

export default async function (manager: Manager, _settings: ComponentSettings) {
  manager.addEventListener('pageview', event => {
    event.client.execute(`
      (function() {
        var ddRumScript = document.createElement('script')
        ddRumScript.src = 'https://www.datadoghq-browser-agent.com/datadog-rum-us.js'
        ddRumScript.async = true
        ddRumScript.onload = function() {
          if (window.DD_RUM && typeof window.DD_RUM.init === 'function') {
            window.DD_RUM.init({
              applicationId: '${applicationId}',
              clientToken: '${clientToken}',
              site: 'datadoghq.com',
              service: '${service}',
              env: 'production',
              version: '1.0.1',
              sessionSampleRate: 100,
              sessionReplaySampleRate: 20,
              trackUserInteractions: true,
              trackResources: true,
              trackLongTasks: true,
              defaultPrivacyLevel: 'mask-user-input'
            })

            if (typeof window.DD_RUM.startSessionReplayRecording === 'function') {
              window.DD_RUM.startSessionReplayRecording()
            }

            console.log('[Datadog] RUM initialized in the browser.')
          } else {
            console.warn('[Datadog] window.DD_RUM not available')
          }
        }
        document.head.appendChild(ddRumScript)
      })()
    `)

    console.log('[Datadog] RUM snippet injected')
  })
}
