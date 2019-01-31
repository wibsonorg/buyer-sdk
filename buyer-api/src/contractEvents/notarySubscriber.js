// TODO: update this subscriber
import apicache from 'apicache';

const updateNotary = ({ notary }) => {
  // fetch notaryUrl from blockchain
  // fetch notary info from url
  // store notary info
};

export const notarySubscriber = {
  name: 'NotaryUpdater',
  NotaryRegistered: updateNotary,
  NotaryUpdated: updateNotary,
  NotaryUnregistered({ notary }) {
    // remove notary info
  },
};
