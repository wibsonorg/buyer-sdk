const dataOntology = {
  options: [
    {
      value: "browsing_history",
      label: "Browsing History"
    },
    {
      value: "geolocation",
      label: "Geolocation"
    },
    {
      value: "facebook",
      label: "Facebook"
    },
    {
      value: "bbva",
      label: "BBVA Banking"
    },
    {
      value: "device-info",
      label: "Device Information"
    },
    {
      value: "google-fitness",
      label: "Google Fitness"
    },
    {
      value: "google-plus",
      label: "Google Plus"
    },
    {
      value: "google-profile",
      label: "Google Profile"
    },
    {
      value: "linkedin",
      label: "Linkedin"
    },
    {
      value: "strava",
      label: "Strava Fitness"
    }
  ]
};

const audienceOntology = {
  options: [
    {
      value: { users: "all" },
      label: "All Users",
    },
    {
      value: { users: "telefonica" },
      label: "ONLY Telefónica Users",
      notaries: [/(movistar)|(telef(ó|o)nica)/img]
    },
  ]
};

const getAudienceOntology = () => audienceOntology;

const getDataOntology = () => dataOntology;

export { getAudienceOntology, getDataOntology };
