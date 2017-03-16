import React, { Component, PropTypes } from 'react'

import FilterBox from '../common/FilterBox'

class MapButtons extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    canEditMap: PropTypes.bool,
    onImportClick: PropTypes.func,
    onForkClick: PropTypes.func,
    onFilterClick: PropTypes.func,
    filterData: PropTypes.object,
    allForFiltering: PropTypes.object,
    visibleForFiltering: PropTypes.object,
    toggleMetacode: PropTypes.func,
    toggleMapper: PropTypes.func,
    toggleSynapse: PropTypes.func,
    filterAllMetacodes: PropTypes.func,
    filterAllMappers: PropTypes.func,
    filterAllSynapses: PropTypes.func,
  }

  render () {
    const { currentUser, canEditMap, filterBoxHtml, onFilterClick, onImportClick, onForkClick,
            filterData, allForFiltering, visibleForFiltering, toggleMetacode, toggleMapper, toggleSynapse,
            filterAllMetacodes, filterAllMappers, filterAllSynapses } = this.props
    return <div className="mapElement upperRightEl upperRightMapButtons upperRightUI">
      {canEditMap && <div className="importDialog upperRightEl upperRightIcon mapElement" onClick={onImportClick}>
        <div className="tooltipsUnder">
          Import Data
        </div>
      </div>}
      <div className="sidebarFilter upperRightEl">
        <div className="sidebarFilterIcon upperRightIcon" onClick={onFilterClick}>
          <div className="tooltipsUnder">Filter</div>
        </div>
        <FilterBox filterData={filterData}
                   allForFiltering={allForFiltering}
                   visibleForFiltering={visibleForFiltering}
                   toggleMetacode={toggleMetacode}
                   toggleMapper={toggleMapper}
                   toggleSynapse={toggleSynapse}
                   filterAllMetacodes={filterAllMetacodes}
                   filterAllMappers={filterAllMappers}
                   filterAllSynapses={filterAllSynapses} />
      </div>
      {currentUser && <div className="sidebarFork upperRightEl">
        <div className="sidebarForkIcon upperRightIcon" onClick={onForkClick}>
          <div className="tooltipsUnder">Save To New Map</div>
        </div>
      </div>}
      <div className="clearfloat"></div>
    </div>
  }
}

export default MapButtons
