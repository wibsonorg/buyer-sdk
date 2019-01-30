// TODO: update this subscriber
import apicache from 'apicache';

const updateNotary = (event, { notary }) => {
  // fetch notaryUrl from blockchain
  // fetch notary info from url
  // store notary info
};

export const notarySubscriber = {
  name: 'NotaryCacheUpdater',
  NotaryRegistered: updateNotary,
  NotaryUpdated: updateNotary,
  NotaryUnregistered(event, { notary }) {
    // remove notary info
  },
};
