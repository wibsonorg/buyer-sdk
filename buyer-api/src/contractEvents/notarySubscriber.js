// TODO: update this subscriber
const updateNotary = () => {
  // fetch notaryUrl from blockchain
  // fetch notary info from url
  // store notary info
};

export const notarySubscriber = {
  name: 'NotaryUpdater',
  NotaryRegistered: updateNotary,
  NotaryUpdated: updateNotary,
  NotaryUnregistered() {
    // remove notary info
  },
};
