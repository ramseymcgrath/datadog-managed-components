// index.js (no semicolons, ES module style)
export default async function (manager, settings) {
  // Pull 'service' from settings, or default if not provided
  const serviceName = settings?.service || 'indexerglue-frontend'

  manager.addEventListener('pageview', event => {
    // We'll create a template literal to inject the service name
    const rumSnippet = `
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
              service: '${serviceName}',
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

            console.log('[Datadog] RUM initialized in the browser with service: ${serviceName}')
          } else {
            console.warn('[Datadog] window.DD_RUM not available')
          }
        }
        document.head.appendChild(ddRumScript)
      })()
    `

    event.client.execute(rumSnippet)

    // Logs in the Managed Component server-side console
    console.log('[Datadog] RUM snippet injected. Service:', serviceName)
  })
}

