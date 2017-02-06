  import Relay from 'react-relay'

  export default class ArtistRoute extends Relay.Route {
    static queries = {
      artist: (component, params) => Relay.QL`
        query {
          artist(id: $artistID) {
            ${component.getFragment('artist', params)}
          }
        }
      `,
    };

    static paramDefinitions = {
      artistID: { required: true },
    };

    static routeName = 'ArtistRoute';
  }
