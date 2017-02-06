/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import Relay from "react-relay"

import "./relay/config"

import Artist from "./lib/artist/artist"
import ArtistRoute from "./lib/artist/route"

const glennRoute = new ArtistRoute({
  artistID: "glenn-brown"
})

export default class ArtistExample extends Component {
   render = () => <Relay.RootContainer Component={Artist} route={glennRoute} />
}

AppRegistry.registerComponent('ArtistExample', () => ArtistExample);


