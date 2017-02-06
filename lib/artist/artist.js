import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Relay from 'react-relay'

class Artist extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.artist.name.toUpperCase()}</Text>
        <Text style={styles.subtitle}>{this.props.artist.years}</Text>
      </View>
    );
  }
}

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
    fontFamily: "TeXGyreAdventor-Bold"
  },
  subtitle: {
    textAlign: 'center',
    color: '#333333',
    fontFamily: 'EBGaramond12-Regular',
    marginBottom: 5,
  },
});

export default Relay.createContainer(Artist, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        _id
        id
        name
        years
      }
    `,
  }
})
