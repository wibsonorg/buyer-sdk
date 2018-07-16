import React, { Component } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Toast from "./Toast";

class Toast_Story extends Component {
  state = {
    open: false
  };

  render() {
    const { open } = this.state;

    return (
      <div>
        A Toast:
        <button onClick={() => this.setState({ open: !open })}>
          {open ? "Close" : "Open"}
        </button>
        <p>
          Lorem ipsum dolor sit amet, an tota facer mel, ad usu error causae
          graecis. Ei nam legere nominavi reformidans, pro et audire vivendum.
          Qui no aliquam admodum. Vim solum aliquid explicari ex, iudico persius
          quo in, choro accusamus similique qui ad. Et usu facilis oportere.
          Epicurei expetenda eos ut, impetus vocibus neglegentur has ad. Sit
          esse tritani reprehendunt ut. Nam partem qualisque ex, iudico verear
          quaestio no quo, duo saepe vivendo at. Tation dignissim eam at, an
          iudico convenire maiestatis eos. Sit eu lorem reprimique theophrastus,
          duo ea nostro pertinacia. Mel eu libris dissentias. Ius an impetus
          nonumes, sit graece repudiandae ea, vim ne nihil ocurreret
          delicatissimi. Brute semper iudicabit nam cu, qui et democritum
          adolescens assueverit. Ei malis aeque gubergren duo, has ad putant
          qualisque salutatus. Harum copiosae referrentur in quo, vel cu oratio
          partem. Solum oblique mnesarchum et sed, nec an error noster deleniti.
          No quo utroque perfecto. Mei integre offendit et, in labore posidonium
          qui, enim dissentiunt te sea. Ne agam homero duo, has ea saperet
          antiopam. Vero melius ei sed. Vix explicari euripidis ut, diceret
          pericula an vim. Nusquam perpetua est id, et viris animal ius, usu
          denique nominavi at. Graecis menandri ullamcorper an est, per assum
          incorrupte ex. Delectus scriptorem nam ei, tractatos omittantur cu
          mel. Eum no equidem comprehensam. Ut erat appetere invidunt est.
          Libris philosophia eu sit, te nobis dolore option vix. Lorem ipsum
          dolor sit amet, an tota facer mel, ad usu error causae graecis. Ei nam
          legere nominavi reformidans, pro et audire vivendum. Qui no aliquam
          admodum. Vim solum aliquid explicari ex, iudico persius quo in, choro
          accusamus similique qui ad. Et usu facilis oportere. Epicurei
          expetenda eos ut, impetus vocibus neglegentur has ad. Sit esse tritani
          reprehendunt ut. Nam partem qualisque ex, iudico verear quaestio no
          quo, duo saepe vivendo at. Tation dignissim eam at, an iudico
          convenire maiestatis eos. Sit eu lorem reprimique theophrastus, duo ea
          nostro pertinacia. Mel eu libris dissentias. Ius an impetus nonumes,
          sit graece repudiandae ea, vim ne nihil ocurreret delicatissimi. Brute
          semper iudicabit nam cu, qui et democritum adolescens assueverit. Ei
          malis aeque gubergren duo, has ad putant qualisque salutatus. Harum
          copiosae referrentur in quo, vel cu oratio partem. Solum oblique
          mnesarchum et sed, nec an error noster deleniti. No quo utroque
          perfecto. Mei integre offendit et, in labore posidonium qui, enim
          dissentiunt te sea. Ne agam homero duo, has ea saperet antiopam. Vero
          melius ei sed. Vix explicari euripidis ut, diceret pericula an vim.
          Nusquam perpetua est id, et viris animal ius, usu denique nominavi at.
          Graecis menandri ullamcorper an est, per assum incorrupte ex. Delectus
          scriptorem nam ei, tractatos omittantur cu mel. Eum no equidem
          comprehensam. Ut erat appetere invidunt est. Libris philosophia eu
          sit, te nobis dolore option vix. Lorem ipsum dolor sit amet, an tota
          facer mel, ad usu error causae graecis. Ei nam legere nominavi
          reformidans, pro et audire vivendum. Qui no aliquam admodum. Vim solum
          aliquid explicari ex, iudico persius quo in, choro accusamus similique
          qui ad. Et usu facilis oportere. Epicurei expetenda eos ut, impetus
          vocibus neglegentur has ad. Sit esse tritani reprehendunt ut. Nam
          partem qualisque ex, iudico verear quaestio no quo, duo saepe vivendo
          at. Tation dignissim eam at, an iudico convenire maiestatis eos. Sit
          eu lorem reprimique theophrastus, duo ea nostro pertinacia. Mel eu
          libris dissentias. Ius an impetus nonumes, sit graece repudiandae ea,
          vim ne nihil ocurreret delicatissimi. Brute semper iudicabit nam cu,
          qui et democritum adolescens assueverit. Ei malis aeque gubergren duo,
          has ad putant qualisque salutatus. Harum copiosae referrentur in quo,
          vel cu oratio partem. Solum oblique mnesarchum et sed, nec an error
          noster deleniti. No quo utroque perfecto. Mei integre offendit et, in
          labore posidonium qui, enim dissentiunt te sea. Ne agam homero duo,
          has ea saperet antiopam. Vero melius ei sed. Vix explicari euripidis
          ut, diceret pericula an vim. Nusquam perpetua est id, et viris animal
          ius, usu denique nominavi at. Graecis menandri ullamcorper an est, per
          assum incorrupte ex. Delectus scriptorem nam ei, tractatos omittantur
          cu mel. Eum no equidem comprehensam. Ut erat appetere invidunt est.
          Libris philosophia eu sit, te nobis dolore option vix.
        </p>
        {open && (
          <Toast onCloseRequested={() => this.setState({ open: false })}>
            Your data response have been sent. The Buyer is going to be
            notified.
          </Toast>
        )}
      </div>
    );
  }
}

storiesOf("Toast", module).add("Basic Toast", () => <Toast_Story />);
