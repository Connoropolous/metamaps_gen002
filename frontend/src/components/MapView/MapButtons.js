import React, { Component, PropTypes } from 'react'

import FilterBox from './FilterBox'

class MapButtons extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    filterBoxOpen: PropTypes.bool
  }

  render () {
    const { currentUser, filterBoxOpen } = this.props
    return <div className="mapElement upperRightEl upperRightMapButtons">
      {currentUser && <div className="importDialog upperRightEl upperRightIcon mapElement openLightbox" data-open="import-dialog-lightbox">
        <div className="tooltipsUnder">
          Import Data
        </div>
      </div>}
      <div className="sidebarFilter upperRightEl">
        <div className="sidebarFilterIcon upperRightIcon"><div className="tooltipsUnder">Filter</div></div>
        {filterBoxOpen && <div className="sidebarFilterBox upperRightBox">
          <FilterBox />
        </div>}
      </div>
      {currentUser && <div className="sidebarFork upperRightEl">
        <div className="sidebarForkIcon upperRightIcon"><div className="tooltipsUnder">Save To New Map</div></div>
      </div>}
      <div className="clearfloat"></div>
    </div>
  }
}

export default MapButtons
