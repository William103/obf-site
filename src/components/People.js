//Package imports
import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "gatsby";
//Local imports
import Layout from "./Layout";
import RelativeCard from "./RelativeCard";
import Network from './Network'
import "../assets/styles/styles.scss";
import Fox from "../assets/images/george_fox.jpeg";

//Modify any of these properties to alter the naming of the labels. 
const bioDataLabels = {
  id: "",
  ark: "",
  nameEntries: "Other Names",
  entityType: "",
  biogHists: "",
  dates: "Relevant Dates",
  places: "Relevant Places",
  occupations: "Occupations",
  subjects: "Things interested of",
  relations: "Relative and acquaintances",
  genders: "Identity",
  sameAsRelations: "External Links for other relevant resources",
};
/**
 * 
 * @param {*} props properties for this component, including the data comping from Page Creation of
 * gatsby-node.js. This component has been passed for those page creations
 * @returns the page for each entity with curated data
 */
const People = (props) => {
  const {
    id,
    ark,
    nameEntries,
    entityType,
    biogHists,
    dates,
    places,
    occupations,
    subjects,
    relations,
    genders,
    sameAsRelations,
  } = props.pageContext;

 

  /**
   * Extracts the bio of the @biogHist and renders it
   * @returns an article containing the biography of each entity
   */
  const renderBio = () => {
    let bio = '';
    if (biogHists) {
      let isXML =
        biogHists[0]?.text?.includes("xmlns") ||
        biogHists[0]?.text?.includes("<biogHists>"); 
      if(isXML){
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(biogHists[0].text, "text/xml");
        const paragraphs =  xmlDoc.getElementsByTagName("p")
        const citation = xmlDoc.getElementsByTagName("citation")

        for(const p of paragraphs){
          bio += `${p.innerHTML} \n`
        }
        console.log(paragraphs)
        console.log(citation)
      }
      else{
        bio = biogHists[0].text;
      }
      return (
        <article id="bio">
          {bio}
          <br />
          <br />
          <figcaption>
            <small>{/* {citation[0].innerHTML} */}</small>
          </figcaption>
        </article>
      );
    }
  };

  /**
   *
   * @param {*} entity the entity whose alternatives names to be rendered
   * @param {*} _ ignored the index
   * @returns A list element containing the a single alternative name
   */
  function renderNameVariant(entity, _) {
    if (entity.original && entity.original !== nameEntries[0].original) {
      const pieces = entity.original.split(",");
      const names = pieces.filter(
        (dep, index) => index !== pieces.length - 1 && dep
      );
      return <li>{` ${names.join()}; `}</li>;
    }
  }

  /**
   * @returns An unordered list containing all the alternative names
   */
  const renderNameVariants = () => {
    if (nameEntries.length > 1) {
      return (
        <h6>
          {`${bioDataLabels.nameEntries}: `}:
          <ul>{nameEntries.map(renderNameVariant)}</ul>
        </h6>
      );
    } else {
      return;
    }
  };

  /**
   * Extracts the data from the @dates object
   * @returns The birth and decease death of the current entity
   */
  const renderDates = () => {
    if (dates.length > 1) {
      return (
        <h6>
          {`${bioDataLabels.dates}: `}
          <ul>
            <li>{`Born: ${dates[0].fromDate}`}</li>
            <li>{`Decease: ${dates[1].toDate}`}</li>
          </ul>
        </h6>
      );
    } else {
      return (
        <h6>
          {`${bioDataLabels.dates}: `}
          <ul>
            <li>{`Born: ${dates[0].fromDate}`}</li>
            <li>{`Decease: ${dates[0].toDate}`}</li>
          </ul>
        </h6>
      );
    }
  };

  /**
   * renders a single place of the @places visited by the current entity
   * @param {*} place the place to be rendered
   * @param {*} _ the index is ignored
   * @returns returns a single place name in the form of city/town, state, country
   */

  const renderPlace = (place, _) => {
    if (place) {
      let placeName = place.geoplace?.name ? place.geoplace.name : null;
      let country = place.geoplace?.countryCode
        ? place.geoplace.countryCode
        : null;
      let state = place.geoplace?.administrationCode
        ? place.geoplace.administrationCode
        : null;
      let map = place.geoplace?.uri ? place.geoplace.uri : null;

      if (placeName && state && country) {
        if (map) {
          return (
            <li>
              {`${placeName},${state},${country}  `}
              <span>{map ? <a href={map}>map</a> : ""}</span>
            </li>
          );
        } else {
          return <li>{`${placeName},${state},${country}  `}</li>;
        }
      } else {
        return;
      }
    } else {
      return;
    }
  };

  /**
   * renders all the places from the @places visited by the current entity
   * @returns returns all places' name in the form of city/town, state, country
   */
  const renderPlaces = () => {
    if (places) {
      return (
        <h6>
          {`${bioDataLabels.places}: `}
          <ul>{places.map(renderPlace)}</ul>
        </h6>
      );
    }
  };

  /**
   * renders a single occupation from the @occupations done by the current entity
   * @param {*} occupation the occupation to be rendered
   * @param {*} _ the index is ignored
   * @returns the @occupation
   */
  const renderOccupation = (occupation, _) => {
    if (occupation) {
      let occupationName = occupation.term?.term ? occupation.term.term : null;
      if (occupationName) {
        return (
          <li>
            {occupationName}
            {"; "}
          </li>
        );
      }
    }
  };
  /**
   * renders all the occupations from the @occupations done by the current entity
   * @returns all the occupations
   */
  const renderOccupations = () => {
    if (occupations) {
      return (
        <h6>
          {`${bioDataLabels.occupations}: `}
          <ul>{occupations.map(renderOccupation)}</ul>
        </h6>
      );
    }
  };

  /**
   * Render a single subject from the @subjects
   * @param {*} subject the subject to be rendered
   * @param {*} _ the index is ignored
   * @returns the @subject
   */
  const renderSubject = (subject, _) => {
    if (subject) {
      let subjectName = subject.term?.term ? subject.term.term : null;
      if (subjectName) {
        return <li>{subjectName}</li>;
      }
    }
  };
  /**
   * Render all the subjects from the @subjects
   * @returns all the subjects
   */
  const renderSubjects = () => {
    if (subjects) {
      return (
        <h6>
          {`${bioDataLabels.subjects}: `}
          <ul>{subjects.map(renderSubject)}</ul>
        </h6>
      );
    }
  };

  /**
   * Render a single sameAsRelation uri from the @sameAsRelations
   * @param {*} sameAsRelation the sameAsRelation to be returned
   * @param {*} _ the index is ignored
   * @returns a uri of the sameAsRelation
   */
  const renderSameAsRelation = (sameAsRelation, _) => {
    if (sameAsRelation) {
      let sameAsRelationName = sameAsRelation.uri ? sameAsRelation.uri : null;
      if (sameAsRelationName) {
        return (
          <li>
            <a href={sameAsRelationName}>{sameAsRelationName}</a>
          </li>
        );
      }
    }
  };
  /**
   * Render a uri for each of @sameAsRelations
   * @returns the uri for each of @sameAsRelations
   */
  const renderSameAsRelations = () => {
    if (sameAsRelations) {
      return (
        <h6>
          {`${bioDataLabels.sameAsRelations}`}
          <ul>
            <li>
              <a href={"https://snaccooperative.org/view/" + id}>
                snaccooperative.org
              </a>
            </li>
            {sameAsRelations.map(renderSameAsRelation)}
          </ul>
        </h6>
      );
    }
  };

  /**
   * Render a single relation from the @relations with the component of RelativeCard
   * @param {*} relation the relation to be rendered
   * @param {*} _ the index is ignored
   * @returns the relation from the @relations with the component of RelativeCard
   */
  const renderRelative = (relation, _) => {
    return <RelativeCard relation={relation}></RelativeCard>;
  };

  /**
   * Render all relation from the @relations with the component of RelativeCard
   * @returns all the relation from the @relations with the component of RelativeCard
   */
  const renderRelatives = () => {
    if (relations) {
      return <Row>{relations.map(renderRelative)}</Row>;
    }
  };

  /**
   * creates a paragraph @p containing the gender type of the entity
   * @returns the @p
   */
  const renderGender = () =>{
    if(genders){
      let label = genders[0].term.term
      return <p>{`Gender: ${label}`}</p>
    }
  }
  /**
   * Constructs nodes and links from the @relations
   * The @nodes contains an object for each relation, INCLUDING the self
   * Each object in the @nodes contains an @id and a @label (name) of the entity
   *
   * The @links contains an object for each relation
   * Each object in the @links contains a @source a @label (name) and a @target
   * 
   * @returns the @nodes and the @links
   */
  const createRelationData = () => {
    let nodes = [];
    let links = [];
    //Insert self first
    let self = {
      id: id,
      label: nameEntries[0].original,
    };
    nodes.push(self);

    //Insert the relatives to the nodes and construct the links
    for (const relation of relations) {
      //For nodes
      let contentParts = relation.content.split(",");
      let node = {
        id: relation.id,
        label: relation.content,
      };
      nodes.push(node);

      // for links
      const link = {
        source: id,
        label: relation.type.term,
        target: relation.id,
      };
      links.push(link);
    }
    return [nodes, links];
  };

  const [nodes, links] = createRelationData();

  return (
    <Layout>
      <Row>
        <Col>
          <div>
            <img id="bio-image" src={Fox} alt="" />
          </div>
          <h3>{nameEntries[0].original}</h3>
          {renderNameVariants()}
          {renderDates()}
          {renderPlaces()}
          {renderOccupations()}
          {renderSubjects()}
          {renderSameAsRelations()}
          {renderGender()}
        </Col>
        <Col>{renderBio()}</Col>
      </Row>
      <h4>{`${bioDataLabels.relations}: `}</h4>
      {renderRelatives()}
      <Network
        nodesInJSON={nodes}
        linksInJSON={links}
        centralFigure={id}
      ></Network>
    </Layout>
  );
};
export default People;