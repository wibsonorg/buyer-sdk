import React from "react";

import { storiesOf } from "@storybook/react";

import insideModal from "./insideModal";

const ModalStory = insideModal(() => <div>Inside a modal</div>);

storiesOf("Inisde Modal", module).add("Default", () => <ModalStory />);
