import React, { Component, PropTypes } from 'react'

import DataVis from './DataVis'
import MapButtons from './MapButtons'
import InfoAndHelp from './InfoAndHelp'
import MapControls from './MapControls'
import MapChat from './MapChat'
import TopicCard from '../TopicCard'

class MapView extends Component {

  static propTypes = {
    mapId: PropTypes.string,
    map: PropTypes.object,
    mapIsStarred: PropTypes.bool,
    currentUser: PropTypes.object,
    endActiveMap: PropTypes.func,
    launchNewMap: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      infoBoxOpen: false,
      filterBoxOpen: false,
      chatOpen: false
    }
  }

  componentDidMount() {
    window && window.addEventListener('resize', this.resize)
    this.resize()
  }

  endMap() {
    this.setState({
      infoBoxOpen: false,
      filterBoxOpen: false,
      chatOpen: false
    })
    this.props.endActiveMap()
  }

  componentDidUpdate(prevProps) {
    const oldMapId = prevProps.mapId
    const { mapId, launchNewMap } = this.props
    if (!oldMapId && mapId) launchNewMap(mapId)
    else if (oldMapId && mapId && oldMapId !== mapId) {
      this.endMap()
      launchNewMap(mapId)
    }
    else if (oldMapId && !mapId) this.endMap()
  }

  componentWillUnmount() {
    window && window.removeEventListener('resize', this.resize)
  }

  resize = () => {

  }

  render = () => {
    const { map, mapIsStarred, currentUser, onOpen, onClose } = this.props
    const { infoBoxOpen, filterBoxOpen, chatOpen } = this.state
    const onChatOpen = () => {
      this.setState({chatOpen: true})
      onOpen()
    }
    const onChatClose = () => {
      this.setState({chatOpen: false})
      onClose()
    }
    // TODO: stop using {...this.props} and make explicit
    return <div className="mapWrapper">
      <MapButtons currentUser={currentUser} filterBoxOpen={filterBoxOpen} />
      <DataVis />
      <TopicCard {...this.props} />
      <MapChat {...this.props} onOpen={onChatOpen} onClose={onChatClose} chatOpen={chatOpen} />
      <MapControls />
      <InfoAndHelp infoBoxOpen={infoBoxOpen} mapIsStarred={mapIsStarred} currentUser={currentUser} map={map} />
    </div>
  }
}

export default MapView

/*

<% if authenticated? %>
    <% # for creating and pulling in topics and synapses %>
    <% if controller_name == 'maps' && action_name == "conversation" %>
      <%= render :partial => 'maps/newtopicsecret' %>
    <% else %>
      <%= render :partial => 'maps/newtopic' %>
    <% end %>
    <%= render :partial => 'maps/newsynapse' %>
    <% # for populating the change metacode list on the topic card %>
    <%= render :partial => 'shared/metacodeoptions' %>
<% end %>
<%= render :partial => 'layouts/lowermapelements' %>

<div id="loading"></div>

<div id="instructions">
  <div className="addTopic">
    Double-click to<br>add a topic
  </div>
  <div className="tabKey">
    Use Tab & Shift+Tab to select a metacode
  </div>
  <div className="enterKey">
    Press Enter to add the topic
  </div>
</div>

*/
