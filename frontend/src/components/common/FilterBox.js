import React, { Component, PropTypes } from 'react'

class FilterBox extends Component {
  static propTypes = {
    filterData: PropTypes.object,
    allForFiltering: PropTypes.object,
    visibleForFiltering: PropTypes.object,
    toggleMetacode: PropTypes.func,
    toggleMapper: PropTypes.func,
    toggleSynapse: PropTypes.func,
    filterAllMetacodes: PropTypes.func,
    filterAllMappers: PropTypes.func,
    filterAllSynapses: PropTypes.func
  }

  render () {
    const { filterData, allForFiltering, visibleForFiltering, toggleMetacode, toggleMapper, toggleSynapse,
            filterAllMetacodes, filterAllMappers, filterAllSynapses } = this.props

    const mapperAllClass = "showAll showAllMappers"
                              + (allForFiltering.mappers.length === visibleForFiltering.mappers.length ? ' active' : '')
    const mapperNoneClass = "hideAll hideAllMappers"
                              + (visibleForFiltering.mappers.length === 0 ? ' active' : '')
    const metacodeAllClass = "showAll showAllMetacodes"
                              + (allForFiltering.metacodes.length === visibleForFiltering.metacodes.length ? ' active' : '')
    const metacodeNoneClass = "hideAll hideAllMetacodes"
                              + (visibleForFiltering.metacodes.length === 0 ? ' active' : '')
    const synapseAllClass = "showAll showAllSynapses"
                              + (allForFiltering.synapses.length === visibleForFiltering.synapses.length ? ' active' : '')
    const synapseNoneClass = "hideAll hideAllSynapses"
                              + (visibleForFiltering.synapses.length === 0 ? ' active' : '')
    return <div className="sidebarFilterBox upperRightBox">
      <div className="filterBox">
        <h2>FILTER BY</h2>
        <div id="filter_by_mapper" className="filterBySection">
          <h3>MAPPERS</h3>
          <span className={mapperNoneClass} onClick={() => filterAllMappers()}>NONE</span>
          <span className={mapperAllClass} onClick={() => filterAllMappers(true)}>ALL</span>
          <div className="clearfloat"></div>
          <ul>
            {allForFiltering.mappers.map(m => {
              const data = filterData.mappers[m]
              const isVisible = visibleForFiltering.mappers.indexOf(m) > -1
              return <Mapper visible={isVisible} id={m} image={data.image} name={data.name} toggle={toggleMapper} />
            })}
          </ul>
          <div className="clearfloat"></div>
        </div>

        <div id="filter_by_metacode" className="filterBySection">
          <h3>METACODES</h3>
          <span className={metacodeNoneClass} onClick={() => filterAllMetacodes()}>NONE</span>
          <span className={metacodeAllClass} onClick={() => filterAllMetacodes(true)}>ALL</span>
          <div className="clearfloat"></div>
          <ul>
            {allForFiltering.metacodes.map(m => {
              const data = filterData.metacodes[m]
              const isVisible = visibleForFiltering.metacodes.indexOf(m) > -1
              return <Metacode visible={isVisible} id={m} icon={data.icon} name={data.name} toggle={toggleMetacode} />
            })}
          </ul>
          <div className="clearfloat"></div>
        </div>

        <div id="filter_by_synapse" className="filterBySection">
          <h3>SYNAPSES</h3>
          <span className={synapseNoneClass} onClick={() => filterAllSynapses()}>NONE</span>
          <span className={synapseAllClass} onClick={() => filterAllSynapses(true)}>ALL</span>
          <div className="clearfloat"></div>
          <ul>
            {allForFiltering.synapses.map(s => {
              const data = filterData.synapses[s]
              const isVisible = visibleForFiltering.synapses.indexOf(s) > -1
              return <Synapse visible={isVisible} desc={s} icon={data.icon} toggle={toggleSynapse} />
            })}
          </ul>
          <div className="clearfloat"></div>
        </div>
      </div>
    </div>
  }
}

function Mapper({ visible, name, id, image, toggle }) {
  return <li onClick={() => toggle(id)} key={id} className={visible ? '' : 'toggledOff'}>
    <img src={image} alt={name} />
    <p>{name}</p>
  </li>
}

function Metacode({ visible, name, id, icon, toggle }) {
  return <li onClick={() => toggle(id)} key={id} className={visible ? '' : 'toggledOff'}>
    <img src={icon} alt={name} />
    <p>{name.toLowerCase()}</p>
  </li>
}

function Synapse({ visible, desc, icon, toggle }) {
  return <li onClick={() => toggle(desc)} key={desc} className={visible ? '' : 'toggledOff'}>
    <img src={icon} alt="synapse icon" />
    <p>{desc}</p>
  </li>
}

export default FilterBox
