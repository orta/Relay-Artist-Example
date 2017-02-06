# Setup  (aka pre-requisites)

- Install Yarn
- Install React Native - https://facebook.github.io/react-native/docs/getting-started.html
- Create a new project via `react-native init ArtistExample`

# Verifying your install

- `cd ArtistExample`
- Run `yarn run jest` to verify specs

# Starting out

- Run `yarn start`

* Explain packager
* What is going on with the Transpile and Compile ?
* What parts are iOS compiled, and what is JS transpiled?

- Run `react-native run-ios` to launch the project

### Tada - it's your 1st RN app

That's it. Let's look at some real code. Browse the source code.

### Relay

[Emission Relay Setup](https://github.com/artsy/emission/commit/c6660fe505f38491f4a1d23dc7f41a2baec5657d)

We're using Relay, this will take a bit of setup.

- Add relay - `yarn add react-relay@https://github.com/alloy/relay/releases/download/v0.9.3/react-relay-0.9.3.tgz`
- Add babel-relay-plugin - `yarn add babel-relay-plugin@https://github.com/alloy/relay/releases/download/v0.9.3/babel-relay-plugin-0.9.3.tgz`

Then the schema into a data folder:

- `mkdir data`
- `curl https://raw.githubusercontent.com/artsy/emission/master/data/schema.graphql > data/schema.graphql` 
- `curl https://raw.githubusercontent.com/artsy/emission/master/data/schema.js > data/schema.js` 
- `curl https://raw.githubusercontent.com/artsy/emission/master/data/schema.json > data/schema.json` 

Then hook up the plugin:
- Add `"plugins": ["./data/schema"],` to `.babelrc`.

### First edit

- Turn on Live Reloading and HMR
- Turn BG white

Magic, it does it in real-time.

### Making components

- Make `lib`, `lib/artists` and `lib/artists/artist.js`
- Move `ArtistExample` Component from `index.ios.js` to `lib/artists/artist.js`
- Change the class to `Artist`, and edit the title to reflect a different component
- Go back and nuke most of the `index.ios.js` make it just refer to `Artist``

  ```js
  import Artist from "./lib/artist/artist"

  export default class ArtistExample extends Component {
    render() {
      return (
        <Artist />
      );
    }
  }
  ```

### Relay Setup

Explain there are three useful bits parts of Relay:

- Routes
- Root Container
- createContainer

We will talk about them as we go on, but first we need to tell Relay where Metaphysics is. So we need to set up a network layer:

```js
import Relay from 'react-relay'

const metaphysicsURL = 'https://metaphysics-staging.artsy.net'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(metaphysicsURL, {
    headers: {
      'X-XAPP-Token': "[go to staging.artsy.net and do `sd.ARTSY_XAPP_TOKEN` in console]",
    }
  })
)
```

Next we need to create a Relay Route, this _doesnt_ directly represent a URL representation, but it often can/does. 
E.g. in our case this will represent `/artist/:artistID`.

 - create `lib/artist/route.js` add 

  ```js
  import Relay from 'react-relay'

  export default  class ArtistRoute extends Relay.Route {
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
  ```

- Hook this up inside `index.ios.js`, add an import, and create instance of Route:

  ```js
  import ArtistRoute from "./lib/artist/route"

  const glennRoute = new ArtistRoute({
    artistID: "glenn-brown"
  })
  ```

  Then change the components render function:

  ```js
  export default class ArtistExample extends Component {
     render = () => <Relay.RootContainer Component={Artist} route={glennRoute} />
  }
  ```

See error, that means it's trying to access a Relay Component, and we have a React component. Let's make it a Relay Component:

- Remove the `export default` from the `Artist` class in `lib/artist/artist.js`

- Add Relay fragment

```js
export default Relay.createContainer(Artist, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        _id
        id
        name
      }
    `,
  }
})
```

```js
class Artist extends Component {
  render() {
    const title = `Hello, I am ${this.props.artist.name}`
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{title}</Text>
      </View>
    );
  }
}
```

Tada! :tada:

---

Prove the Relay concept by adding `years` to GraphQL and add this to the render function:

```js
class Artist extends Component {
  render() {
    const title = `Hey ${this.props.artist.name}`
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{title}</Text>
        <Text style={styles.welcome}>{this.props.artist.years}</Text>
      </View>
    );
  }
}
```

### Looking Stylish!

OK, we now have the minimum we need - we got API data coming in as props. Now we want to make it look pretty.

- Add `mkdir assets`, and `mkdir assets/fonts`

```sh
curl -L https://github.com/artsy/Artsy-OSSUIFonts/raw/master/Pod/Assets/EBGaramond12-Italic.ttf > assets/EBGaramond12-Italic.ttf
curl -L https://github.com/artsy/Artsy-OSSUIFonts/raw/master/Pod/Assets/EBGaramond12-Regular.ttf > assets/EBGaramond12-Regular.ttf
curl -L https://github.com/artsy/Artsy-OSSUIFonts/raw/master/Pod/Assets/texgyreadventor-bold.ttf > assets/texgyreadventor-bold.ttf
```

- edit `package.json` 

```
 "rnpm": {
    "assets": ["./assets"]
  }
```

- run `react-native link`, restart iOS app, by killing it. 
- run `react-native run-ios`

- Add custom styles to the two bits of info on screen:

```jsx
<Text style={styles.title}>{this.props.artist.name.toUpperCase()}</Text>
<Text style={styles.subtitle}>{this.props.artist.years}</Text>
```

```js
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontFamily: "TeXGyreAdventor-Regular"
  },
  subtitle: {
    textAlign: 'center',
    color: '#333333',
    fontFamily: 'EBGaramond12-Regular',
    marginBottom: 5,
  },
});
```

And that is our styles. Covering all of the major use cases of React Native for us.
