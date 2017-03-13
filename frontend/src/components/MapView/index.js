import React, { Component, PropTypes } from 'react'

import DataVis from './DataVis'
import MapButtons from './MapButtons'
import InfoAndHelp from './InfoAndHelp'
import Instructions from './Instructions'
import MapControls from './MapControls'
import MapChat from './MapChat'
import TopicCard from '../TopicCard'

class MapView extends Component {

  static propTypes = {
    mobile: PropTypes.bool,
    mapId: PropTypes.string,
    map: PropTypes.object,
    mapIsStarred: PropTypes.bool,
    onMapStar: PropTypes.func,
    onMapUnstar: PropTypes.func,
    toggleFilterBox: PropTypes.func,
    filterBoxHtml: PropTypes.string,
    toggleMapInfoBox: PropTypes.func,
    infoBoxHtml: PropTypes.string,
    currentUser: PropTypes.object,
    endActiveMap: PropTypes.func,
    launchNewMap: PropTypes.func,
    openImportLightbox: PropTypes.func,
    forkMap: PropTypes.func,
    openHelpLightbox: PropTypes.func,
    onZoomExtents: PropTypes.func,
    onZoomIn: PropTypes.func,
    onZoomOut: PropTypes.func,
    hasLearnedTopicCreation: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      chatOpen: false
    }
  }

  endMap() {
    this.setState({
      chatOpen: false
    })
    this.mapChat.reset()
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
    const { mobile, map, currentUser, onOpen, onClose,
            toggleMapInfoBox, toggleFilterBox, infoBoxHtml, filterBoxHtml,
            openImportLightbox, forkMap, openHelpLightbox,
            mapIsStarred, onMapStar, onMapUnstar,
            onZoomExtents, onZoomIn, onZoomOut, hasLearnedTopicCreation } = this.props
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
      {currentUser && <Instructions mobile={mobile} hasLearnedTopicCreation={hasLearnedTopicCreation} />}
      {currentUser && <MapChat {...this.props} onOpen={onChatOpen} onClose={onChatClose} chatOpen={chatOpen} ref={x => this.mapChat = x} />}
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
