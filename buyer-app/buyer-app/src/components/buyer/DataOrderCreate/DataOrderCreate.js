import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import * as OntologySelectors from "base-app-src/state/ontologies/selectors";

import * as NotariesSelectors from "base-app-src/state/notaries/selectors";

import * as DataOrdersActions from "state/entities/createDataOrder/actions";
import * as DataOrdersSelectors from "state/entities/createDataOrder/selectors";

import { compose } from "recompose";

import Modal, { ModalTitle, ModalContent } from "base-app-src/components/Modal";
import {
  InfoItem,
  FormSection,
  InlineItem,
  Form
} from "base-app-src/components/form";
import Button from "base-app-src/components/Button";
import NumberInput from "base-app-src/components/NumberInput";

import Checkbox from "base-app-src/components/Checkbox";
import Select, { SelectItem } from "base-app-src/components/Select";
import Label from "base-app-src/components/Label";

import Text from "base-app-src/components/Text";
import Subtitle from "base-app-src/components/Subtitle";

import Loading from "base-app-src/components/Loading";

import AudiencePicker from "./AudiencePicker";
import Config from "../../../config";

import "./DataOrderCreate.css";

const BUYERS = [
  {
    label: "Wibson & UC3M - Global Warming Project",
    value: "wibson-global-warming"
  },
  {
    label: "Wibson & UC Berkeley - Reduce Traffic Congestion",
    value: "wibson-berkeley-traffic"
  }
];

const NotariesSelect = ({ availableNotaries, value, onNotarySelected }) => {
  const notaries =
    !availableNotaries || availableNotaries.pending || availableNotaries.error
      ? []
      : availableNotaries.list;

  return (
    <Select value={value}>
      {notaries.map(({ value, label }) => (
        <SelectItem
          key={value}
          value={value}
          label={label}
          onClick={() => onNotarySelected(value)}
        />
      ))}
    </Select>
  );
};

class DataOrderCreate extends Component {
  constructor(opts) {
    super(opts);

    const { dataOntology } = this.props;

    this.state = {
      buyerId: "wibson-global-warming",
      audience: [],
      requestedData: dataOntology.options[0].value,
      notarizeData: false,
      // TODO: allow multiple notaries.
      // requestedNotaries: [],
      requestedNotary: null,
      publicURL: Config.get("minio"),
      conditions: "www.wibson.org/buying/terms_and_conditions",
      errors: {},
      loading: false,
      creationError: undefined,
      maxPrice: 15,
      useMaxPrice: true
    };
  }

  handleOnAudienceChange = audience => {
    this.setState({ audience });
  };

  handleRequestClose = () => {
    const { history } = this.props;
    history.replace("/");
  };

  componentWillMount() {
    this.props.createDataOrderClear();
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
      requestedNotary,
      notarizeData,
      publicURL,
      conditions,
      maxPrice,
      useMaxPrice,
      buyerId
    } = this.state;

    const { createDataOrder } = this.props;

    const selectedAudience = audience.map(filter => {
      return {
        filter: filter.variable,
        values: [filter.value]
      };
    });

    const data = requestedData ? requestedData : undefined;

    const notaries = [requestedNotary];

    createDataOrder(
      selectedAudience,
      data,
      notarizeData,
      notaries,
      publicURL,
      conditions,
      useMaxPrice ? maxPrice : null,
      buyerId
    );
  };

  shouldDisableSubmitButton() {
    const {
      audience,
      requestedNotary,
      publicURL,
      requestedData
    } = this.state;

    return (
      audience.length === 0 ||
      !requestedNotary ||
      !publicURL ||
      !requestedData
    );
  }

  renderCreateForm() {
    const { audienceOntology, dataOntology, availableNotaries } = this.props;

    return (
      <Form>
        <FormSection>
          <Subtitle>Buyer info</Subtitle>
          <InfoItem>
            <Label color="light-dark">Buyer name</Label>

            <Select value={this.state.buyerId}>
              {BUYERS.map(({ value, label }) => (
                <SelectItem
                  key={value}
                  value={value}
                  label={label}
                  onClick={() => this.setState({ buyerId: value })}
                />
              ))}
            </Select>
          </InfoItem>
        </FormSection>
        <FormSection>
          <Subtitle>Audience</Subtitle>
          <AudiencePicker
            requestableAudience={audienceOntology.filters}
            audience={this.state.audience}
            onChange={this.handleOnAudienceChange}
            errors={this.state.errors.audience}
          />
        </FormSection>
        <FormSection>
          <Subtitle>Orders settings</Subtitle>
          <InfoItem>
            <Label color="light-dark">Data to request</Label>

            <Select value={this.state.requestedData}>
              {dataOntology.options.map(({ value, label }) => (
                <SelectItem
                  key={value}
                  value={value}
                  label={label}
                  onClick={() => this.setState({ requestedData: value })}
                />
              ))}
            </Select>
          </InfoItem>

          <InfoItem>
            <Label color="light-dark">Maximum price</Label>
            <NumberInput
              min={1}
              step={1}
              value={this.state.maxPrice}
              disabled={!this.state.useMaxPrice}
              onChange={value => this.setState({ maxPrice: value })}
            />
            <InlineItem>
              <Checkbox
                value={!this.state.useMaxPrice}
                onChange={value => this.setState({ useMaxPrice: !value })}
              />
              <Text size="sm" color="light-dark">
                Set price later
              </Text>
            </InlineItem>
          </InfoItem>
          <InfoItem>
            <Label color="light-dark">Notary</Label>
            <NotariesSelect
              availableNotaries={availableNotaries}
              value={this.state.requestedNotary}
              onNotarySelected={requestedNotary =>
                this.setState({ requestedNotary })
              }
            />
          </InfoItem>
          <InfoItem>
            <InlineItem>
              <Checkbox
                value={this.state.notarizeData}
                onChange={value => this.setState({ notarizeData: value })}
              />
              <Text size="sm" color="light-dark">
                Audit data upfront
              </Text>
            </InlineItem>
          </InfoItem>
          <InfoItem>
            <Label color="light-dark">URL to receive responses and data</Label>

            <Text size="sm" color="regular">
              {this.state.publicURL}
            </Text>
          </InfoItem>

          <InfoItem>
            <Label color="light-dark">Terms and conditions</Label>

            <Text size="sm" color="regular">
              {this.state.conditions}
            </Text>
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
  availableNotaries: NotariesSelectors.getNotaries(state)
});

const mapDispatchToProps = dispatch => ({
  createDataOrderClear: () => {
    dispatch(DataOrdersActions.createDataOrderClear());
  },
  createDataOrder: (
    audience,
    requestedData,
    notarizeData,
    requestedNotaries,
    publicURL,
    conditions,
    maxPrice,
    buyerId
  ) => {
    dispatch(
      DataOrdersActions.createDataOrder({
        audience,
        requestedData,
        notarizeData,
        requestedNotaries,
        publicURL,
        conditions,
        maxPrice,
        buyerId
      })
    );
  }
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(DataOrderCreate);
