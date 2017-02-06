import Relay from 'react-relay'

const metaphysicsURL = 'https://metaphysics-staging.artsy.net'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(metaphysicsURL, {
    headers: {
      'X-XAPP-Token': "[go to staging.artsy.net and pull sd.ARTSY_XAPP_TOKEN from the web inspector]",
    }
  })
)
