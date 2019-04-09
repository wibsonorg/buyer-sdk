import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { default as ReactSelect } from 'react-select';

import * as OntologySelectors from "base-app-src/state/ontologies/selectors";

import * as NotariesSelectors from "state/entities/notaries/selectors";

import * as DataOrdersActions from "state/entities/createDataOrder/actions";
import * as DataOrdersSelectors from "state/entities/createDataOrder/selectors";

import { compose } from "recompose";

import Modal, { ModalTitle, ModalContent } from "base-app-src/components/Modal";
import {
  InfoItem,
  FormSection,
  Form
} from "base-app-src/components/form";
import Button from "base-app-src/components/Button";
import NumberInput from "base-app-src/components/NumberInput";

import Label from "base-app-src/components/Label";

import Subtitle from "base-app-src/components/Subtitle";

import Loading from "base-app-src/components/Loading";

import Config from "../../../config";

import authorization from "../../../utils/headers";

import { getNotariesFromAudience } from "../../../lib/protocol-helpers/notaries";

import "./DataOrderCreate.css";

const apiUrl = Config.get("api.url");

class DataOrderCreate extends Component {
  constructor(opts) {
    super(opts);
    this.state = {
      buyerInfos: [],
      selectedBuyer: undefined,
      audience: undefined,
      requestedData: [],
      errors: {},
      loading: false,
      creationError: undefined,
      price: 15,
    };
  }

  handleRequestClose = () => {
    this.props.history.replace("/");
  };

  componentWillMount() {
    this.props.createDataOrderClear();
  }

  async componentDidMount() {
    try {
      const res = await fetch(`${apiUrl}/infos`, {
        headers: { Authorization: authorization() }
      });
      const result = await res.json();
      this.setState({ buyerInfos: result.infos });
    } catch (error) {
      console.log(error);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.createdDataOrder && nextProps.createdDataOrder.fulfilled) {
      this.handleRequestClose();
    }
  }

  handleSubmit = ev => {
    const {
      audience,
      requestedData,
      price,
      selectedBuyer
    } = this.state;

    const notaries = getNotariesFromAudience(audience, this.props.availableNotaries.list);

    this.props.createDataOrder(
      [audience.value],
      requestedData.map(d => d.value),
      notaries.map(d => d.value),
      Config.get("buyerPublicURL"),
      price,
      selectedBuyer.id,
    );
  };

  shouldDisableSubmitButton() {
    const {
      audience,
      requestedData
    } = this.state;

    return (
      !audience || !requestedData || !requestedData.length
    );
  }

  renderCreateForm() {
    const { audienceOntology, dataOntology } = this.props;
    return (
      <Form>
        <FormSection>
          <Subtitle>Buyer info</Subtitle>
          <InfoItem>
            <Label color="light-dark">Buyer name</Label>
            <ReactSelect
              options={this.state.buyerInfos}
              value={this.state.selectedBuyer}
              onChange={selectedBuyer => this.setState({ selectedBuyer })}
            />
          </InfoItem>
        </FormSection>
        <FormSection>
          <Subtitle>Audience</Subtitle>
          <InfoItem>
            <ReactSelect
              options={audienceOntology.options}
              value={this.state.audience}
              onChange={audience => this.setState({ audience })}
            />
          </InfoItem>
        </FormSection>
        <FormSection>
          <Subtitle>Orders settings</Subtitle>
          <InfoItem>
            <Label color="light-dark">Data to request</Label>
            <ReactSelect
              options={dataOntology.options}
              value={this.state.requestedData}
              onChange={requestedData => this.setState({ requestedData })}
              isMulti={true}
            />
          </InfoItem>

          <InfoItem>
            <Label color="light-dark">Price</Label>
            <NumberInput
              min={1}
              step={1}
              value={this.state.price}
              onChange={value => this.setState({ price: value })}
            />
          </InfoItem>
        </FormSection>
        <FormSection>
          <Button
            disabled={this.shouldDisableSubmitButton()}
            onClick={this.handleSubmit}
          >
            Submit order
          </Button>
        </FormSection>
      </Form>
    );
  }

  dataCreationIsPending() {
    const { createdDataOrder } = this.props;
    return createdDataOrder.pending;
  }

  renderLoading() {
    return <Loading label="Waiting for confirmation..." />;
  }

  render() {
    return (
      <Modal
        className="wibson-buyer-create-data-order-modal"
        onRequestClose={this.handleRequestClose}
      >
        <ModalTitle>Create an order</ModalTitle>
        <ModalContent>
          {this.dataCreationIsPending()
            ? this.renderLoading()
            : this.renderCreateForm()}
        </ModalContent>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  createdDataOrder: DataOrdersSelectors.getCreatedDataOrder(state),
  dataOntology: OntologySelectors.getDataOntology(state),
  audienceOntology: OntologySelectors.getAudienceOntology(state),
  availableNotaries: NotariesSelectors.getNotaries(state),
});

const mapDispatchToProps = dispatch => ({
  createDataOrderClear: () => {
    dispatch(DataOrdersActions.createDataOrderClear());
  },
  createDataOrder: (
    audience,
    requestedData,
    notaries,
    publicURL,
    price,
    buyerId
  ) => {
    dispatch(
      DataOrdersActions.createDataOrder({
        audience,
        requestedData,
        notaries,
        publicURL,
        price,
        buyerId
      })
    );
  }
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(DataOrderCreate);
