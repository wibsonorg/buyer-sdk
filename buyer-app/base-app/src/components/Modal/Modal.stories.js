import React, { Component } from "react";

import { storiesOf } from "@storybook/react";

import Modal, { ModalTitle, ModalContent } from "./Modal";

class ModalStory_Default extends Component {
  state = {
    open: false
  };
  render() {
    const { open } = this.state;
    return (
      <div>
        <button onClick={() => this.setState({ open: !open })}>
          Open modal
        </button>
        {open && (
          <Modal
            isOpen={open}
            onRequestClose={() => this.setState({ open: false })}
          >
            <ModalTitle>I am the modal title</ModalTitle>
            <ModalContent>
              Lorem ipsum dolor sit amet, dictas habemus laboramus has cu. An
              agam referrentur disputationi sit, ei per quem dignissim. In mei
              enim nihil tincidunt. In agam electram pri. Errem utroque lobortis
              pri at, ex mea quis recusabo. In debitis gubergren sea, id autem
              quando adversarium has, albucius consetetur cu sea. Ex euismod
              platonem vel, suas nulla nusquam mel id, per id dolorum facilisi.
              Ex usu sententiae cotidieque comprehensam, sonet zril molestie in
              per. Disputando persequeris no pro, te mei mundi debitis pericula,
              enim case indoctum ei his. Vim simul populo recusabo cu, magna
              justo maiorum id mel, cum atqui libris id. Eros evertitur
              complectitur vel id, ea legere legendos mei, has at oporteat
              legendos adversarium. Cibo antiopam reformidans pri in, blandit
              ullamcorper ius in. Cum primis dictas ei. Ut duo mutat adipisci,
              eum ut latine epicurei scriptorem. Affert fabulas meliore eu mei,
              justo saperet commune ei mel. Sea ne ubique neglegentur. Ei mea
              duis everti. Vim ex nisl suas virtute, nec populo qualisque
              forensibus ea. Has eu electram ocurreret reformidans, ea sed
              pericula moderatius signiferumque, mel ut malis tation facilis. Ei
              denique dolores usu, quo ad ancillae torquatos democritum, eam ea
              iudicabit scripserit. Qui ne quem bonorum, eu eum labitur aliquid
              accumsan. Pro ex quas natum, persius insolens antiopam cu vel. Cu
              facilis qualisque per. Ex eam rebum nonumy, odio nisl percipit duo
              ad. Nam an partiendo reprimique, ei zril omnesque tractatos est,
              sed ex nullam graecis. Erant sanctus luptatum ex nec, quod omnes
              laoreet sed ex. Sed no tota utinam, te sumo voluptaria vix, nam
              veri moderatius definitiones te. Ei eum diam legimus tacimates,
              ius ad natum vocent philosophia. Doctus mentitum his ad, nulla
              epicurei assentior in eum. Lorem ipsum dolor sit amet, dictas
              habemus laboramus has cu. An agam referrentur disputationi sit, ei
              per quem dignissim. In mei enim nihil tincidunt. In agam electram
              pri. Errem utroque lobortis pri at, ex mea quis recusabo. In
              debitis gubergren sea, id autem quando adversarium has, albucius
              consetetur cu sea. Ex euismod platonem vel, suas nulla nusquam mel
              id, per id dolorum facilisi. Ex usu sententiae cotidieque
              comprehensam, sonet zril molestie in per. Disputando persequeris
              no pro, te mei mundi debitis pericula, enim case indoctum ei his.
              Vim simul populo recusabo cu, magna justo maiorum id mel, cum
              atqui libris id. Eros evertitur complectitur vel id, ea legere
              legendos mei, has at oporteat legendos adversarium. Cibo antiopam
              reformidans pri in, blandit ullamcorper ius in. Cum primis dictas
              ei. Ut duo mutat adipisci, eum ut latine epicurei scriptorem.
              Affert fabulas meliore eu mei, justo saperet commune ei mel. Sea
              ne ubique neglegentur. Ei mea duis everti. Vim ex nisl suas
              virtute, nec populo qualisque forensibus ea. Has eu electram
              ocurreret reformidans, ea sed pericula moderatius signiferumque,
              mel ut malis tation facilis. Ei denique dolores usu, quo ad
              ancillae torquatos democritum, eam ea iudicabit scripserit. Qui ne
              quem bonorum, eu eum labitur aliquid accumsan. Pro ex quas natum,
              persius insolens antiopam cu vel. Cu facilis qualisque per. Ex eam
              rebum nonumy, odio nisl percipit duo ad. Nam an partiendo
              reprimique, ei zril omnesque tractatos est, sed ex nullam graecis.
              Erant sanctus luptatum ex nec, quod omnes laoreet sed ex. Sed no
              tota utinam, te sumo voluptaria vix, nam veri moderatius
              definitiones te. Ei eum diam legimus tacimates, ius ad natum
              vocent philosophia. Doctus mentitum his ad, nulla epicurei
              assentior in eum. Lorem ipsum dolor sit amet, dictas habemus
              laboramus has cu. An agam referrentur disputationi sit, ei per
              quem dignissim. In mei enim nihil tincidunt. In agam electram pri.
              Errem utroque lobortis pri at, ex mea quis recusabo. In debitis
              gubergren sea, id autem quando adversarium has, albucius
              consetetur cu sea. Ex euismod platonem vel, suas nulla nusquam mel
              id, per id dolorum facilisi. Ex usu sententiae cotidieque
              comprehensam, sonet zril molestie in per. Disputando persequeris
              no pro, te mei mundi debitis pericula, enim case indoctum ei his.
              Vim simul populo recusabo cu, magna justo maiorum id mel, cum
              atqui libris id. Eros evertitur complectitur vel id, ea legere
              legendos mei, has at oporteat legendos adversarium. Cibo antiopam
              reformidans pri in, blandit ullamcorper ius in. Cum primis dictas
              ei. Ut duo mutat adipisci, eum ut latine epicurei scriptorem.
              Affert fabulas meliore eu mei, justo saperet commune ei mel. Sea
              ne ubique neglegentur. Ei mea duis everti. Vim ex nisl suas
              virtute, nec populo qualisque forensibus ea. Has eu electram
              ocurreret reformidans, ea sed pericula moderatius signiferumque,
              mel ut malis tation facilis. Ei denique dolores usu, quo ad
              ancillae torquatos democritum, eam ea iudicabit scripserit. Qui ne
              quem bonorum, eu eum labitur aliquid accumsan. Pro ex quas natum,
              persius insolens antiopam cu vel. Cu facilis qualisque per. Ex eam
              rebum nonumy, odio nisl percipit duo ad. Nam an partiendo
              reprimique, ei zril omnesque tractatos est, sed ex nullam graecis.
              Erant sanctus luptatum ex nec, quod omnes laoreet sed ex. Sed no
              tota utinam, te sumo voluptaria vix, nam veri moderatius
              definitiones te. Ei eum diam legimus tacimates, ius ad natum
              vocent philosophia. Doctus mentitum his ad, nulla epicurei
              assentior in eum.
            </ModalContent>
          </Modal>
        )}
      </div>
    );
  }
}

storiesOf("Modal", module).add("Default", () => <ModalStory_Default />);
