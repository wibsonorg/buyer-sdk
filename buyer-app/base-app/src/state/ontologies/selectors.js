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
  filters: [
    {
      value: "age",
      label: "Age",
      categories: [
        {
          value: "between_21_and_30_years_old",
          label: "Between 21 and 30 years old"
        },
        {
          value: "between_31_and_40_years_old",
          label: "Between 31 and 40 years old"
        },
        {
          value: "between_41_and_50_years_old",
          label: "Between 41 and 50 years old"
        },
        {
          value: "between_51_and_60_years_old",
          label: "Between 51 and 60 years old"
        },
        {
          value: "61_plus_years_old",
          label: "61+ years old"
        }
      ]
    },
    {
      value: "gender",
      label: "Gender",
      categories: [
        {
          value: "male",
          label: "Male"
        },
        {
          value: "female",
          label: "Female"
        }
      ]
    },
    {
      value: "annual_income",
      label: "Annual Income",
      categories: [
        {
          value: "between_0_and_15_k",
          label: "$0 - $15,000"
        },
        {
          value: "between_15_k_and_30_k",
          label: "$15,001 - $30,000"
        },
        {
          value: "between_30_k_and_50_k",
          label: "$30,001 - $50,000"
        },
        {
          value: "between_50_k_and_75_k",
          label: "$50,001 - $75,000"
        },
        {
          value: "between_75_k_and_100_k",
          label: "$75,001 - $100,000"
        },
        {
          value: "100_k_plus",
          label: "$100,001+"
        }
      ]
    }
  ]
};

const getAudienceOntology = () => audienceOntology;

const getDataOntology = () => dataOntology;

export { getAudienceOntology, getDataOntology };
