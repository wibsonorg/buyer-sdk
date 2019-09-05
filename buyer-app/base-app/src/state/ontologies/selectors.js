const dataOntology = {
  options: [
    {
      value: "geolocation",
      label: "Geolocation"
    },
    {
      value: "facebook",
      label: "Facebook"
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
      value: "google-profile",
      label: "Google Profile"
    },
    {
      value: "linkedIn",
      label: "Linkedin"
    },
    {
      value: "strava",
      label: "Strava Fitness"
    }
  ]
};

const audienceOntology = {
  filters: [    
    {
      value: "country",
      label: "Country",
      categories: [
        {
          value: "ar",
          label: "Argentina"
        },
        {
          value: "uy",
          label: "Uruguay"
        },
        {
          value: "es",
          label: "Spain"
        },
        {
          value: "uk",
          label: "United Kingdom"
        }
      ]
    }
  ]
};

const getAudienceOntology = () => audienceOntology;

const getDataOntology = () => dataOntology;

export { getAudienceOntology, getDataOntology };
