import React, { Component, PropTypes } from 'react'

import MapInfoBox from './MapInfoBox'
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
    this.state = {}
  }

  componentDidMount() {
    window && window.addEventListener('resize', this.resize)
    this.resize()
  }

  componentDidUpdate(prevProps) {
    const oldMapId = prevProps.mapId
    const { mapId, endActiveMap, launchNewMap } = this.props
    if (!oldMapId && mapId) launchNewMap(mapId)
    else if (oldMapId && mapId && oldMapId !== mapId) {
      endActiveMap()
      launchNewMap(mapId)
    }
    else if (oldMapId && !mapId) endActiveMap()
  }

  componentWillUnmount() {
    window && window.removeEventListener('resize', this.resize)
  }

  resize = () => {

  }

  render = () => {
    const { mapIsStarred } = this.props
    const starclassName = mapIsStarred ? 'starred' : ''
    const tooltip = mapIsStarred ? 'Star' : 'Unstar'

    return <div className="mapWrapper">
      <div id="infovis" />
      <div className="showcard mapElement mapElementHidden" id="showcard">
        <TopicCard {...this.props} />
      </div>
      <div id="chat-box-wrapper">
        <MapChat {...this.props} />
      </div>
      <div className="mapControls mapElement">
      	<div className="zoomExtents mapControl"><div className="tooltips">Center View</div></div>
      	<div className="zoomIn mapControl"><div className="tooltips">Zoom In</div></div>
      	<div className="zoomOut mapControl"><div className="tooltips">Zoom Out</div></div>
      </div>
      <div className="infoAndHelp">
      	<MapInfoBox />
        <div className={`starMap infoElement mapElement ${starclassName}`}>
          <div className="tooltipsAbove">{tooltip}</div>
        </div>
        <div className="mapInfoIcon infoElement mapElement">
          <div className="tooltipsAbove">Map Info</div>
        </div>
        <div className="openCheatsheet openLightbox infoElement mapElement" data-open="cheatsheet">
          <div className="tooltipsAbove">Help</div>
        </div>
        <div className="clearfloat"></div>
      </div>
    </div>
  }
}

export default MapView

/*

<div className="showcard mapElement mapElementHidden" id="showcard"></div>
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
