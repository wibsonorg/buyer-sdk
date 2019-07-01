import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { default as ReactSelect } from 'react-select';

import * as OntologySelectors from "base-app-src/state/ontologies/selectors";

import * as NotariesSelectors from "state/entities/notaries/selectors";

import * as DataOrdersActions from "state/entities/createDataOrder/actions";
import * as DataOrdersSelectors from "state/entities/createDataOrder/selectors";

import {getBuyerInfos} from "lib/protocol-helpers/data-orders"

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

import "./DataOrderCreate.css";

class DataOrderCreate extends Component {
  constructor(opts) {
    super(opts);
    this.state = {
      buyerInfos: [],
      selectedBuyer: undefined,
      audience: { "age": 20 }, // Hardcoded value for audience
      requestedData: [],
      requestedNotaries: [],
      publicURL: Config.get("buyerPublicURL").api,
      errors: {},
      loading: false,
      creationError: undefined,
      price: 15,
    };
  }

  handleOnAudienceChange = audience => {
    this.setState({ audience });
  };

  handleRequestClose = () => {
    this.props.history.replace("/");
  };

  componentWillMount() {
    this.props.createDataOrderClear();
  }

  async componentDidMount() {
    try {
      const { availableNotaries } = this.props;
      const firstNotary = availableNotaries.list[0]
      const {infos} = await getBuyerInfos();
      this.setState({
        buyerInfos: infos,
        requestedNotaries: firstNotary ? [firstNotary] : []
      });
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
      requestedNotaries,
      publicURL,
      price,
      selectedBuyer
    } = this.state;

    this.props.createDataOrder(
      audience,
      requestedData.map(d => d.value),
      requestedNotaries.map(n => n.value),
      publicURL,
      price,
      selectedBuyer.id,
    );
  };

  shouldDisableSubmitButton() {
    const {
      requestedNotaries,
      publicURL,
      requestedData
    } = this.state;

    return (
      !publicURL
      || !requestedNotaries || !requestedNotaries.length
      || !requestedData || !requestedData.length
    );
  }

  renderCreateForm() {
    const { dataOntology, availableNotaries } = this.props;
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
          <InfoItem>
            <Label color="light-dark">Notary</Label>
            <ReactSelect
              options={availableNotaries.list}
              value={this.state.requestedNotaries}
              onChange={requestedNotaries => this.setState({ requestedNotaries })}
              isMulti={true}
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
