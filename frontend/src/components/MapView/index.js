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
    toggleFilterBox: PropTypes.func,
    filterBoxHtml: PropTypes.string,
    toggleMapInfoBox: PropTypes.func,
    infoBoxHtml: PropTypes.string,
    currentUser: PropTypes.object,
    endActiveMap: PropTypes.func,
    launchNewMap: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      chatOpen: false
    }
  }

  endMap() {
    this.setState({
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

  render = () => {
    const { map, currentUser, onOpen, onClose,
            toggleMapInfoBox, toggleFilterBox, infoBoxHtml, filterBoxHtml,
            openImportLightbox, forkMap, openHelpLightbox,
            mapIsStarred, onMapStar, onMapUnstar,
            onZoomExtents, onZoomIn, onZoomOut } = this.props
    const { chatOpen } = this.state
    const onChatOpen = () => {
      this.setState({chatOpen: true})
      onOpen()
    }
    const onChatClose = () => {
      this.setState({chatOpen: false})
      onClose()
    }
    const canEditMap = map && map.authorizeToEdit(currentUser)
    // TODO: stop using {...this.props} and make explicit
    return <div className="mapWrapper">
      <MapButtons currentUser={currentUser}
                  onImportClick={openImportLightbox}
                  onFilterClick={toggleFilterBox}
                  onForkClick={forkMap}
                  canEditMap={canEditMap}
                  filterBoxHtml={filterBoxHtml} />
      <DataVis />
      <TopicCard {...this.props} />
      <MapChat {...this.props} onOpen={onChatOpen} onClose={onChatClose} chatOpen={chatOpen} />
      <MapControls onClickZoomExtents={onZoomExtents}
                   onClickZoomIn={onZoomIn}
                   onClickZoomOut={onZoomOut} />
      <InfoAndHelp mapIsStarred={mapIsStarred}
                   currentUser={currentUser}
                   map={map}
                   onInfoClick={toggleMapInfoBox}
                   onMapStar={onMapStar}
                   onMapUnstar={onMapUnstar}
                   onHelpClick={openHelpLightbox}
                   infoBoxHtml={infoBoxHtml} />
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
