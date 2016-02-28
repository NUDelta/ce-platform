YelpCategories = new Mongo.Collection('yelpCategories');

if (YelpCategories.find().count() === 0) {
  [
    {
        "alias": "3dprinting",
        "parents": [
            "localservices"
        ],
        "title": "3D Printing"
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Abruzzese",
        "parents": [
            "italian"
        ],
        "alias": "abruzzese"
    },
    {
        "country_whitelist": [
            "CZ"
        ],
        "title": "Absinthe Bars",
        "parents": [
            "bars"
        ],
        "alias": "absinthebars"
    },
    {
        "alias": "accessories",
        "parents": [
            "fashion"
        ],
        "title": "Accessories"
    },
    {
        "alias": "accountants",
        "parents": [
            "professional"
        ],
        "title": "Accountants"
    },
    {
        "alias": "active",
        "parents": [],
        "title": "Active Life"
    },
    {
        "alias": "acupuncture",
        "parents": [
            "health"
        ],
        "title": "Acupuncture"
    },
    {
        "alias": "adoptionservices",
        "parents": [
            "localservices"
        ],
        "title": "Adoption Services"
    },
    {
        "alias": "adult",
        "parents": [
            "shopping"
        ],
        "title": "Adult"
    },
    {
        "alias": "adultedu",
        "parents": [
            "education"
        ],
        "title": "Adult Education"
    },
    {
        "alias": "adultentertainment",
        "parents": [
            "nightlife"
        ],
        "title": "Adult Entertainment"
    },
    {
        "alias": "advertising",
        "parents": [
            "professional"
        ],
        "title": "Advertising"
    },
    {
        "alias": "afghani",
        "title": "Afghan",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "TR",
            "MX",
            "ES",
            "PT"
        ]
    },
    {
        "alias": "african",
        "title": "African",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "TR"
        ]
    },
    {
        "country_whitelist": [
            "BR"
        ],
        "title": "Afro-Brazilian",
        "parents": [
            "religiousorgs"
        ],
        "alias": "afrobrazilian"
    },
    {
        "country_whitelist": [
            "CZ",
            "FR",
            "IT",
            "CL"
        ],
        "title": "Agriturismi",
        "parents": [
            "hotels"
        ],
        "alias": "agriturismi"
    },
    {
        "country_whitelist": [
            "CZ",
            "PT",
            "US"
        ],
        "title": "Aircraft Dealers",
        "parents": [
            "auto"
        ],
        "alias": "aircraftdealers"
    },
    {
        "country_whitelist": [
            "ES",
            "IT",
            "US"
        ],
        "title": "Air Duct Cleaning",
        "parents": [
            "localservices"
        ],
        "alias": "airductcleaning"
    },
    {
        "alias": "airlines",
        "parents": [
            "transport"
        ],
        "title": "Airlines"
    },
    {
        "alias": "airport_shuttles",
        "parents": [
            "transport"
        ],
        "title": "Airport Shuttles"
    },
    {
        "alias": "airportlounges",
        "parents": [
            "bars"
        ],
        "title": "Airport Lounges"
    },
    {
        "alias": "airports",
        "parents": [
            "hotelstravel"
        ],
        "title": "Airports"
    },
    {
        "alias": "airportterminals",
        "parents": [
            "airports"
        ],
        "title": "Airport Terminals"
    },
    {
        "country_whitelist": [
            "PT"
        ],
        "title": "Alentejo",
        "parents": [
            "portuguese"
        ],
        "alias": "alentejo"
    },
    {
        "country_whitelist": [
            "PT"
        ],
        "title": "Algarve",
        "parents": [
            "portuguese"
        ],
        "alias": "algarve"
    },
    {
        "alias": "allergist",
        "parents": [
            "physicians"
        ],
        "title": "Allergists"
    },
    {
        "country_whitelist": [
            "FR",
            "DE"
        ],
        "title": "Alsatian",
        "parents": [
            "french"
        ],
        "alias": "alsatian"
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Altoatesine",
        "parents": [
            "italian"
        ],
        "alias": "altoatesine"
    },
    {
        "alias": "amateursportsteams",
        "title": "Amateur Sports Teams",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "amusementparks",
        "parents": [
            "active"
        ],
        "title": "Amusement Parks"
    },
    {
        "country_whitelist": [
            "IT",
            "ES"
        ],
        "title": "Andalusian",
        "parents": [
            "restaurants"
        ],
        "alias": "andalusian"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "AU",
            "SE",
            "PT",
            "IT",
            "US"
        ],
        "title": "Anesthesiologists",
        "parents": [
            "physicians"
        ],
        "alias": "anesthesiologists"
    },
    {
        "alias": "animalshelters",
        "parents": [
            "pets"
        ],
        "title": "Animal Shelters"
    },
    {
        "alias": "antiques",
        "parents": [
            "shopping"
        ],
        "title": "Antiques"
    },
    {
        "alias": "apartments",
        "parents": [
            "realestate"
        ],
        "title": "Apartments"
    },
    {
        "alias": "appliances",
        "parents": [
            "homeandgarden"
        ],
        "title": "Appliances"
    },
    {
        "alias": "appraisalservices",
        "parents": [
            "localservices"
        ],
        "title": "Appraisal Services"
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Apulian",
        "parents": [
            "italian"
        ],
        "alias": "apulian"
    },
    {
        "alias": "aquariums",
        "parents": [
            "active"
        ],
        "title": "Aquariums"
    },
    {
        "alias": "aquariumservices",
        "title": "Aquarium Services",
        "parents": [
            "petservices"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "JP",
            "MX",
            "CL"
        ]
    },
    {
        "alias": "arabian",
        "title": "Arabian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "DK"
        ]
    },
    {
        "country_whitelist": [
            "BR"
        ],
        "title": "Arab Pizza",
        "parents": [
            "arabian"
        ],
        "alias": "arabpizza"
    },
    {
        "alias": "arcades",
        "parents": [
            "arts"
        ],
        "title": "Arcades"
    },
    {
        "alias": "archery",
        "parents": [
            "active"
        ],
        "title": "Archery"
    },
    {
        "alias": "architects",
        "parents": [
            "professional"
        ],
        "title": "Architects"
    },
    {
        "alias": "architecturaltours",
        "parents": [
            "tours"
        ],
        "title": "Architectural Tours"
    },
    {
        "alias": "argentine",
        "title": "Argentine",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "FI"
        ]
    },
    {
        "country_whitelist": [
            "ES",
            "BE",
            "FR",
            "TR",
            "IT",
            "US",
            "CZ",
            "AR",
            "GB",
            "PL"
        ],
        "title": "Armenian",
        "parents": [
            "restaurants"
        ],
        "alias": "armenian"
    },
    {
        "country_whitelist": [
            "ES"
        ],
        "title": "Arroceria / Paella",
        "parents": [
            "spanish"
        ],
        "alias": "arroceria_paella"
    },
    {
        "alias": "artclasses",
        "title": "Art Classes",
        "parents": [
            "education"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "JP",
            "MX",
            "CL"
        ]
    },
    {
        "alias": "artrestoration",
        "parents": [
            "localservices"
        ],
        "title": "Art Restoration"
    },
    {
        "alias": "arts",
        "parents": [],
        "title": "Arts & Entertainment"
    },
    {
        "alias": "artsandcrafts",
        "parents": [
            "shopping"
        ],
        "title": "Arts & Crafts"
    },
    {
        "alias": "artschools",
        "parents": [
            "specialtyschools"
        ],
        "title": "Art Schools"
    },
    {
        "country_whitelist": [
            "HK",
            "SE",
            "SG",
            "JP",
            "IT",
            "US"
        ],
        "title": "Art Space Rentals",
        "parents": [
            "realestate"
        ],
        "alias": "artspacerentals"
    },
    {
        "alias": "artsupplies",
        "parents": [
            "artsandcrafts"
        ],
        "title": "Art Supplies"
    },
    {
        "alias": "arttours",
        "parents": [
            "tours"
        ],
        "title": "Art Tours"
    },
    {
        "alias": "asianfusion",
        "parents": [
            "restaurants"
        ],
        "title": "Asian Fusion"
    },
    {
        "alias": "assistedliving",
        "parents": [
            "health"
        ],
        "title": "Assisted Living Facilities"
    },
    {
        "country_whitelist": [
            "ES"
        ],
        "title": "Asturian",
        "parents": [
            "restaurants"
        ],
        "alias": "asturian"
    },
    {
        "country_whitelist": [
            "ES",
            "CH",
            "DK",
            "NO",
            "DE",
            "IT",
            "US",
            "AT",
            "SE"
        ],
        "title": "Attraction Farms",
        "parents": [
            "farms"
        ],
        "alias": "attractionfarms"
    },
    {
        "country_whitelist": [
            "FI",
            "SE",
            "US",
            "NO"
        ],
        "title": "ATV Rentals/Tours",
        "parents": [
            "active"
        ],
        "alias": "atvrentals"
    },
    {
        "alias": "auctionhouses",
        "title": "Auction Houses",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "CH",
            "CL",
            "CA",
            "DE",
            "JP",
            "HK",
            "AR",
            "AT",
            "SG",
            "IE",
            "TW",
            "TR",
            "NZ",
            "PH",
            "MY",
            "PL"
        ]
    },
    {
        "alias": "audiologist",
        "title": "Audiologist",
        "parents": [
            "physicians"
        ],
        "country_blacklist": [
            "CZ",
            "CH",
            "DE",
            "AT"
        ]
    },
    {
        "alias": "australian",
        "title": "Australian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "DK",
            "ES",
            "PT"
        ]
    },
    {
        "alias": "austrian",
        "title": "Austrian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "DK",
            "ES"
        ]
    },
    {
        "country_whitelist": [
            "SE",
            "NO"
        ],
        "title": "Authorized Postal Representative",
        "parents": [
            "publicservicesgovt"
        ],
        "alias": "authorized_postal_representative"
    },
    {
        "alias": "auto",
        "parents": [],
        "title": "Automotive"
    },
    {
        "alias": "auto_detailing",
        "title": "Auto Detailing",
        "parents": [
            "auto"
        ],
        "country_blacklist": [
            "AU",
            "BR",
            "ES"
        ]
    },
    {
        "country_whitelist": [
            "CZ",
            "SG",
            "PT",
            "US"
        ],
        "title": "Auto Customization",
        "parents": [
            "auto"
        ],
        "alias": "autocustomization"
    },
    {
        "country_whitelist": [
            "DE",
            "DK",
            "SE",
            "NO"
        ],
        "title": "Car Inspectors",
        "parents": [
            "auto"
        ],
        "alias": "autodamageassessment"
    },
    {
        "country_whitelist": [
            "CZ",
            "IT",
            "BR"
        ],
        "title": "Auto Electric Services",
        "parents": [
            "auto"
        ],
        "alias": "autoelectric"
    },
    {
        "alias": "autoglass",
        "title": "Auto Glass Services",
        "parents": [
            "auto"
        ],
        "country_blacklist": [
            "DK",
            "ES"
        ]
    },
    {
        "country_whitelist": [
            "BE",
            "NL",
            "DK",
            "NO",
            "JP",
            "TR",
            "IT",
            "US",
            "CZ",
            "AU",
            "ES",
            "BR",
            "SE"
        ],
        "title": "Auto Insurance",
        "parents": [
            "insurance"
        ],
        "alias": "autoinsurance"
    },
    {
        "country_whitelist": [
            "PT",
            "CA",
            "TR",
            "IT",
            "US",
            "CZ",
            "AU",
            "SG"
        ],
        "title": "Auto Loan Providers",
        "parents": [
            "auto"
        ],
        "alias": "autoloanproviders"
    },
    {
        "alias": "autopartssupplies",
        "parents": [
            "auto"
        ],
        "title": "Auto Parts & Supplies"
    },
    {
        "alias": "autorepair",
        "parents": [
            "auto"
        ],
        "title": "Auto Repair"
    },
    {
        "alias": "autoupholstery",
        "parents": [
            "auto"
        ],
        "title": "Auto Upholstery"
    },
    {
        "country_whitelist": [
            "FR"
        ],
        "title": "Auvergnat",
        "parents": [
            "french"
        ],
        "alias": "auvergnat"
    },
    {
        "alias": "ayurveda",
        "parents": [
            "health"
        ],
        "title": "Ayurveda"
    },
    {
        "country_whitelist": [
            "PT"
        ],
        "title": "Azores",
        "parents": [
            "portuguese"
        ],
        "alias": "azores"
    },
    {
        "alias": "baby_gear",
        "parents": [
            "shopping"
        ],
        "title": "Baby Gear & Furniture"
    },
    {
        "country_whitelist": [
            "DE"
        ],
        "title": "Backshop",
        "parents": [
            "food"
        ],
        "alias": "backshop"
    },
    {
        "country_whitelist": [
            "DE"
        ],
        "title": "Baden",
        "parents": [
            "german"
        ],
        "alias": "baden"
    },
    {
        "alias": "badminton",
        "title": "Badminton",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "NZ",
            "SG",
            "BR",
            "ES",
            "PL"
        ]
    },
    {
        "alias": "bagels",
        "title": "Bagels",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "AU",
            "ES"
        ]
    },
    {
        "country_whitelist": [
            "PT",
            "NO",
            "DE",
            "TR",
            "IT",
            "CZ",
            "MX",
            "SE"
        ],
        "title": "Baguettes",
        "parents": [
            "restaurants"
        ],
        "alias": "baguettes"
    },
    {
        "country_whitelist": [
            "PT",
            "US"
        ],
        "title": "Bail Bondsmen",
        "parents": [
            "localservices"
        ],
        "alias": "bailbondsmen"
    },
    {
        "alias": "bakeries",
        "parents": [
            "food"
        ],
        "title": "Bakeries"
    },
    {
        "alias": "bangladeshi",
        "title": "Bangladeshi",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "ES",
            "TR",
            "DK",
            "PT",
            "MX"
        ]
    },
    {
        "alias": "bankruptcy",
        "parents": [
            "lawyers"
        ],
        "title": "Bankruptcy Law"
    },
    {
        "alias": "banks",
        "parents": [
            "financialservices"
        ],
        "title": "Banks & Credit Unions"
    },
    {
        "alias": "barbers",
        "parents": [
            "beautysvc"
        ],
        "title": "Barbers"
    },
    {
        "country_whitelist": [
            "CZ",
            "AU",
            "PT",
            "US"
        ],
        "title": "Barre Classes",
        "parents": [
            "fitness"
        ],
        "alias": "barreclasses"
    },
    {
        "alias": "bars",
        "parents": [
            "nightlife"
        ],
        "title": "Bars"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "DK",
            "PT",
            "CA",
            "DE",
            "IT",
            "US",
            "CZ",
            "AU"
        ],
        "title": "Bartenders",
        "parents": [
            "eventservices"
        ],
        "alias": "bartenders"
    },
    {
        "alias": "bartendingschools",
        "parents": [
            "specialtyschools"
        ],
        "title": "Bartending Schools"
    },
    {
        "alias": "baseballfields",
        "title": "Baseball Fields",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "FR"
        ]
    },
    {
        "alias": "basketballcourts",
        "title": "Basketball Courts",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "NL",
            "GB",
            "BR",
            "CA",
            "IE",
            "SE",
            "PL"
        ]
    },
    {
        "alias": "basque",
        "title": "Basque",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "AU",
            "DK",
            "PT",
            "SG",
            "TR"
        ]
    },
    {
        "country_whitelist": [
            "CZ",
            "PT",
            "NO",
            "FI",
            "DE",
            "JP",
            "SE"
        ],
        "title": "Bathing Area",
        "parents": [
            "active"
        ],
        "alias": "bathing_area"
    },
    {
        "alias": "batterystores",
        "title": "Battery Stores",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "country_whitelist": [
            "JP",
            "SG",
            "US",
            "TW"
        ],
        "title": "Batting Cages",
        "parents": [
            "active"
        ],
        "alias": "battingcages"
    },
    {
        "country_whitelist": [
            "CH",
            "DE",
            "AT"
        ],
        "title": "Bavarian",
        "parents": [
            "restaurants"
        ],
        "alias": "bavarian"
    },
    {
        "alias": "bbq",
        "title": "Barbeque",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "AU",
            "BR"
        ]
    },
    {
        "country_whitelist": [
            "FR",
            "CH",
            "NL",
            "PT",
            "NO",
            "DE",
            "IT",
            "AU",
            "AT",
            "SG",
            "SE"
        ],
        "title": "Beach Bars",
        "parents": [
            "bars"
        ],
        "alias": "beachbars"
    },
    {
        "alias": "beaches",
        "parents": [
            "active"
        ],
        "title": "Beaches"
    },
    {
        "country_whitelist": [
            "DK",
            "NO",
            "DE",
            "JP",
            "CZ",
            "AU",
            "AT",
            "BR",
            "FI",
            "SG",
            "SE"
        ],
        "title": "Beach Volleyball",
        "parents": [
            "active"
        ],
        "alias": "beachvolleyball"
    },
    {
        "alias": "beautysvc",
        "parents": [],
        "title": "Beauty & Spas"
    },
    {
        "alias": "bedbreakfast",
        "title": "Bed & Breakfast",
        "parents": [
            "hotelstravel"
        ],
        "country_blacklist": [
            "SG"
        ]
    },
    {
        "alias": "beer_and_wine",
        "parents": [
            "food"
        ],
        "title": "Beer, Wine & Spirits"
    },
    {
        "alias": "beerbar",
        "title": "Beer Bar",
        "parents": [
            "bars"
        ],
        "country_blacklist": [
            "CH",
            "NL",
            "IE",
            "TW",
            "CA",
            "DE",
            "TR",
            "IT",
            "AT",
            "PH",
            "MY",
            "PL",
            "GB"
        ]
    },
    {
        "country_whitelist": [
            "CZ",
            "CH",
            "DE",
            "AT"
        ],
        "title": "Beer Garden",
        "parents": [
            "restaurants"
        ],
        "alias": "beergarden"
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "NO",
            "JP",
            "IT",
            "US",
            "PL",
            "CZ",
            "AU",
            "GB",
            "IE",
            "MX",
            "SE"
        ],
        "title": "Beer Gardens",
        "parents": [
            "nightlife"
        ],
        "alias": "beergardens"
    },
    {
        "country_whitelist": [
            "CH",
            "DE",
            "AT"
        ],
        "title": "Beer Hall",
        "parents": [
            "restaurants"
        ],
        "alias": "beerhall"
    },
    {
        "country_whitelist": [
            "PT"
        ],
        "title": "Beira",
        "parents": [
            "portuguese"
        ],
        "alias": "beira"
    },
    {
        "country_whitelist": [
            "AT"
        ],
        "title": "Beisl",
        "parents": [
            "restaurants"
        ],
        "alias": "beisl"
    },
    {
        "alias": "belgian",
        "title": "Belgian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "ES",
            "PT"
        ]
    },
    {
        "country_whitelist": [
            "FR"
        ],
        "title": "Berrichon",
        "parents": [
            "french"
        ],
        "alias": "berrichon"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "DK",
            "PT",
            "NO",
            "DE",
            "IT",
            "US",
            "CZ",
            "AT",
            "SG",
            "ES"
        ],
        "title": "Bespoke Clothing",
        "parents": [
            "shopping"
        ],
        "alias": "bespoke"
    },
    {
        "alias": "bettingcenters",
        "title": "Betting Centers",
        "parents": [
            "arts"
        ],
        "country_blacklist": [
            "FR",
            "NO",
            "CA",
            "US",
            "NZ",
            "BR",
            "FI",
            "SG"
        ]
    },
    {
        "country_whitelist": [
            "ES",
            "CH",
            "PT",
            "CL",
            "DE",
            "TR",
            "IT",
            "AU",
            "AT",
            "SE"
        ],
        "title": "Beverage Store",
        "parents": [
            "food"
        ],
        "alias": "beverage_stores"
    },
    {
        "country_whitelist": [
            "DK",
            "PT",
            "CL",
            "IE",
            "NO",
            "CZ",
            "NZ",
            "AR",
            "AU",
            "GB",
            "FI",
            "SG",
            "MX",
            "SE"
        ],
        "title": "Bicycle Paths",
        "parents": [
            "active"
        ],
        "alias": "bicyclepaths"
    },
    {
        "country_whitelist": [
            "DK"
        ],
        "title": "Bicycles",
        "parents": [],
        "alias": "bicycles"
    },
    {
        "alias": "bike_repair_maintenance",
        "parents": [
            "localservices"
        ],
        "title": "Bike Repair/Maintenance"
    },
    {
        "country_whitelist": [
            "DK",
            "PT"
        ],
        "title": "Bike Associations",
        "parents": [
            "bicycles"
        ],
        "alias": "bikeassociations"
    },
    {
        "alias": "bikerentals",
        "parents": [
            "active"
        ],
        "title": "Bike Rentals"
    },
    {
        "country_whitelist": [
            "DK",
            "PT"
        ],
        "title": "Bike Repair",
        "parents": [
            "bicycles"
        ],
        "alias": "bikerepair"
    },
    {
        "alias": "bikes",
        "parents": [
            "sportgoods"
        ],
        "title": "Bikes"
    },
    {
        "alias": "bikesharing",
        "parents": [
            "transport"
        ],
        "title": "Bike Sharing"
    },
    {
        "country_whitelist": [
            "DK",
            "PT"
        ],
        "title": "Bike Shop",
        "parents": [
            "bicycles"
        ],
        "alias": "bikeshop"
    },
    {
        "country_whitelist": [
            "ES",
            "DK",
            "CL",
            "NO",
            "IT",
            "US",
            "NZ",
            "AR",
            "AU",
            "GB",
            "BR",
            "FI",
            "IE",
            "MX",
            "SE"
        ],
        "title": "Bingo Halls",
        "parents": [
            "arts"
        ],
        "alias": "bingo"
    },
    {
        "country_whitelist": [
            "BE",
            "NL",
            "DK",
            "NO",
            "DE",
            "IT",
            "US",
            "ES",
            "SG",
            "SE"
        ],
        "title": "Bird Shops",
        "parents": [
            "petstore"
        ],
        "alias": "birdshops"
    },
    {
        "alias": "bistros",
        "title": "Bistros",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "ES",
            "CA",
            "DK",
            "US"
        ]
    },
    {
        "country_whitelist": [
            "TR"
        ],
        "title": "Black Sea",
        "parents": [
            "restaurants"
        ],
        "alias": "blacksea"
    },
    {
        "alias": "blinds",
        "parents": [
            "homeservices"
        ],
        "title": "Shades & Blinds"
    },
    {
        "alias": "blooddonation",
        "title": "Blood & Plasma Donation Centers",
        "parents": [
            "health"
        ],
        "country_blacklist": [
            "BE",
            "NL",
            "PT",
            "IE",
            "SG",
            "CA",
            "HK",
            "GB",
            "TW",
            "FI",
            "PH",
            "MY",
            "PL"
        ]
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Blowfish",
        "parents": [
            "japanese"
        ],
        "alias": "blowfish"
    },
    {
        "country_whitelist": [
            "FR",
            "PT",
            "CA",
            "TR",
            "US",
            "CZ",
            "AU",
            "GB",
            "IE"
        ],
        "title": "Blow Dry/Out Services",
        "parents": [
            "hair"
        ],
        "alias": "blowoutservices"
    },
    {
        "alias": "boatcharters",
        "title": "Boat Charters",
        "parents": [
            "eventservices"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "country_whitelist": [
            "ES",
            "DK",
            "PT",
            "NO",
            "IE",
            "US",
            "CZ",
            "GB",
            "SG",
            "MX",
            "SE"
        ],
        "title": "Boat Dealers",
        "parents": [
            "auto"
        ],
        "alias": "boatdealers"
    },
    {
        "alias": "boating",
        "parents": [
            "active"
        ],
        "title": "Boating"
    },
    {
        "alias": "boatrepair",
        "title": "Boat Repair",
        "parents": [
            "professional"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "bodyshops",
        "title": "Body Shops",
        "parents": [
            "auto"
        ],
        "country_blacklist": [
            "CH",
            "DE",
            "AT"
        ]
    },
    {
        "alias": "bookbinding",
        "parents": [
            "localservices"
        ],
        "title": "Bookbinding"
    },
    {
        "alias": "bookstores",
        "parents": [
            "media"
        ],
        "title": "Bookstores"
    },
    {
        "country_whitelist": [
            "NZ",
            "AU",
            "ES",
            "PT",
            "SE",
            "IT",
            "US"
        ],
        "title": "Boot Camps",
        "parents": [
            "fitness"
        ],
        "alias": "bootcamps"
    },
    {
        "country_whitelist": [
            "FR"
        ],
        "title": "Bourguignon",
        "parents": [
            "french"
        ],
        "alias": "bourguignon"
    },
    {
        "alias": "bowling",
        "parents": [
            "active"
        ],
        "title": "Bowling"
    },
    {
        "alias": "boxing",
        "title": "Boxing",
        "parents": [
            "fitness"
        ],
        "country_blacklist": [
            "ES",
            "DK",
            "NO",
            "TR",
            "AU",
            "PL",
            "BR",
            "FI",
            "SG",
            "SE"
        ]
    },
    {
        "alias": "brasseries",
        "title": "Brasseries",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "AR",
            "MX"
        ]
    },
    {
        "alias": "brazilian",
        "parents": [
            "restaurants"
        ],
        "title": "Brazilian"
    },
    {
        "country_whitelist": [
            "BR"
        ],
        "title": "Brazilian Empanadas",
        "parents": [
            "brazilian"
        ],
        "alias": "brazilianempanadas"
    },
    {
        "alias": "breakfast_brunch",
        "parents": [
            "restaurants"
        ],
        "title": "Breakfast & Brunch"
    },
    {
        "alias": "breweries",
        "parents": [
            "food"
        ],
        "title": "Breweries"
    },
    {
        "alias": "brewingsupplies",
        "title": "Brewing Supplies",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "JP",
            "MX",
            "CL"
        ]
    },
    {
        "alias": "bridal",
        "parents": [
            "shopping"
        ],
        "title": "Bridal"
    },
    {
        "alias": "british",
        "title": "British",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "FI"
        ]
    },
    {
        "alias": "bubbletea",
        "title": "Bubble Tea",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "CH",
            "NL",
            "PT",
            "CA",
            "TR",
            "IT",
            "NZ",
            "AR",
            "AT",
            "BR",
            "MX",
            "ES"
        ]
    },
    {
        "alias": "buddhist_temples",
        "parents": [
            "religiousorgs"
        ],
        "title": "Buddhist Temples"
    },
    {
        "alias": "buffets",
        "parents": [
            "restaurants"
        ],
        "title": "Buffets"
    },
    {
        "alias": "buildingsupplies",
        "parents": [
            "homeservices"
        ],
        "title": "Building Supplies"
    },
    {
        "alias": "bulgarian",
        "title": "Bulgarian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "NL",
            "DK",
            "PT",
            "NO",
            "CA",
            "TR",
            "US",
            "NZ",
            "BR",
            "SG",
            "ES"
        ]
    },
    {
        "country_whitelist": [
            "AU"
        ],
        "title": "Bulk Billing",
        "parents": [
            "medcenters"
        ],
        "alias": "bulkbilling"
    },
    {
        "country_whitelist": [
            "CZ",
            "NZ",
            "PT"
        ],
        "title": "Bungee Jumping",
        "parents": [
            "active"
        ],
        "alias": "bungeejumping"
    },
    {
        "alias": "burgers",
        "parents": [
            "restaurants"
        ],
        "title": "Burgers"
    },
    {
        "alias": "burmese",
        "title": "Burmese",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "DK",
            "PT",
            "FI",
            "TR",
            "ES"
        ]
    },
    {
        "alias": "buses",
        "parents": [
            "transport"
        ],
        "title": "Buses"
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "NO",
            "CA",
            "JP",
            "IT",
            "US",
            "AU",
            "ES",
            "BR",
            "SE"
        ],
        "title": "Business Consulting",
        "parents": [
            "professional"
        ],
        "alias": "businessconsulting"
    },
    {
        "country_whitelist": [
            "CZ",
            "GB",
            "PT",
            "CA",
            "IE",
            "US"
        ],
        "title": "Business Law",
        "parents": [
            "lawyers"
        ],
        "alias": "businesslawyers"
    },
    {
        "country_whitelist": [
            "DK",
            "CL",
            "NO",
            "IT",
            "AR",
            "BR",
            "MX",
            "ES"
        ],
        "title": "Bus Rental",
        "parents": [
            "localservices"
        ],
        "alias": "busrental"
    },
    {
        "alias": "bustours",
        "parents": [
            "tours"
        ],
        "title": "Bus Tours"
    },
    {
        "alias": "butcher",
        "title": "Butcher",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "CH",
            "DE",
            "AT"
        ]
    },
    {
        "alias": "c_and_mh",
        "parents": [
            "health"
        ],
        "title": "Counseling & Mental Health"
    },
    {
        "alias": "cabaret",
        "title": "Cabaret",
        "parents": [
            "arts"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "JP",
            "MX",
            "CL"
        ]
    },
    {
        "alias": "cabinetry",
        "title": "Cabinetry",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "JP",
            "MX",
            "CL"
        ]
    },
    {
        "country_whitelist": [
            "FR",
            "CH",
            "JP",
            "DE",
            "TR",
            "IT",
            "US",
            "CZ",
            "NZ",
            "AT",
            "BR"
        ],
        "title": "Cable Cars",
        "parents": [
            "transport"
        ],
        "alias": "cablecars"
    },
    {
        "alias": "cafes",
        "title": "Cafes",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "AR",
            "MX",
            "ES"
        ]
    },
    {
        "alias": "cafeteria",
        "title": "Cafeteria",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "FR",
            "IE",
            "CA",
            "CZ",
            "NZ",
            "BR",
            "FI",
            "SG",
            "SE"
        ]
    },
    {
        "alias": "cajun",
        "title": "Cajun/Creole",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "AU",
            "SG",
            "ES",
            "PT"
        ]
    },
    {
        "alias": "cakeshop",
        "title": "Patisserie/Cake Shop",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "CL",
            "CA",
            "TR",
            "US",
            "HK",
            "AR",
            "ES",
            "FI",
            "PL"
        ]
    },
    {
        "country_whitelist": [
            "IT",
            "US"
        ],
        "title": "Calabrian",
        "parents": [
            "italian"
        ],
        "alias": "calabrian"
    },
    {
        "alias": "cambodian",
        "title": "Cambodian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "DK",
            "PT",
            "FI",
            "TR",
            "ES"
        ]
    },
    {
        "alias": "campgrounds",
        "parents": [
            "hotelstravel"
        ],
        "title": "Campgrounds"
    },
    {
        "alias": "candy",
        "parents": [
            "gourmet"
        ],
        "title": "Candy Stores"
    },
    {
        "country_whitelist": [
            "NL",
            "GB",
            "IE",
            "CA",
            "TR",
            "US",
            "PL"
        ],
        "title": "Cannabis Clinics",
        "parents": [
            "health"
        ],
        "alias": "cannabis_clinics"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Cannabis Tours",
        "parents": [
            "cannabis_clinics"
        ],
        "alias": "cannabistours"
    },
    {
        "country_whitelist": [
            "CH",
            "DK",
            "NO",
            "DE",
            "JP",
            "IT",
            "CZ",
            "AT",
            "PL"
        ],
        "title": "Canteen",
        "parents": [
            "restaurants"
        ],
        "alias": "canteen"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "MY",
            "TW",
            "JP",
            "IT",
            "US",
            "HK",
            "NZ",
            "AR",
            "AU",
            "GB",
            "SG",
            "SE"
        ],
        "title": "Cantonese",
        "parents": [
            "chinese"
        ],
        "alias": "cantonese"
    },
    {
        "alias": "car_dealers",
        "parents": [
            "auto"
        ],
        "title": "Car Dealers"
    },
    {
        "country_whitelist": [
            "NZ",
            "AR",
            "AU",
            "US"
        ],
        "title": "Car Brokers",
        "parents": [
            "auto"
        ],
        "alias": "carbrokers"
    },
    {
        "country_whitelist": [
            "CZ",
            "NZ",
            "AU",
            "BR",
            "SG",
            "US"
        ],
        "title": "Car Buyers",
        "parents": [
            "auto"
        ],
        "alias": "carbuyers"
    },
    {
        "alias": "cardioclasses",
        "parents": [
            "fitness"
        ],
        "title": "Cardio Classes"
    },
    {
        "alias": "cardiology",
        "parents": [
            "physicians"
        ],
        "title": "Cardiologists"
    },
    {
        "alias": "careercounseling",
        "parents": [
            "professional"
        ],
        "title": "Career Counseling"
    },
    {
        "alias": "caribbean",
        "title": "Caribbean",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "FI",
            "TR",
            "PT"
        ]
    },
    {
        "country_whitelist": [
            "ES",
            "DK",
            "SE",
            "NO",
            "SG",
            "IT",
            "US"
        ],
        "title": "Caricatures",
        "parents": [
            "eventservices"
        ],
        "alias": "caricatures"
    },
    {
        "alias": "carousels",
        "parents": [
            "active"
        ],
        "title": "Carousels"
    },
    {
        "alias": "carpenters",
        "title": "Carpenters",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "TR"
        ]
    },
    {
        "alias": "carpet_cleaning",
        "parents": [
            "localservices"
        ],
        "title": "Carpet Cleaning"
    },
    {
        "alias": "carpeting",
        "parents": [
            "homeservices"
        ],
        "title": "Carpeting"
    },
    {
        "alias": "carpetinstallation",
        "parents": [
            "homeservices"
        ],
        "title": "Carpet Installation"
    },
    {
        "alias": "carrental",
        "parents": [
            "hotelstravel"
        ],
        "title": "Car Rental"
    },
    {
        "alias": "carshares",
        "title": "Car Share Services",
        "parents": [
            "auto"
        ],
        "country_blacklist": [
            "BE",
            "NL",
            "PT",
            "HK",
            "JP",
            "TR",
            "CZ",
            "MY",
            "BR",
            "TW",
            "FI",
            "PH",
            "SG",
            "PL"
        ]
    },
    {
        "alias": "carwash",
        "parents": [
            "auto"
        ],
        "title": "Car Wash"
    },
    {
        "alias": "casinos",
        "title": "Casinos",
        "parents": [
            "arts"
        ],
        "country_blacklist": [
            "HK",
            "JP"
        ]
    },
    {
        "country_whitelist": [
            "ES",
            "BE",
            "FR",
            "CH",
            "PT",
            "NO",
            "DE",
            "JP",
            "IT",
            "CZ",
            "AT",
            "FI",
            "SE",
            "GB"
        ],
        "title": "Castles",
        "parents": [
            "arts"
        ],
        "alias": "castles"
    },
    {
        "country_whitelist": [
            "ES",
            "FR",
            "TR",
            "IT",
            "US"
        ],
        "title": "Catalan",
        "parents": [
            "restaurants"
        ],
        "alias": "catalan"
    },
    {
        "alias": "catering",
        "parents": [
            "eventservices"
        ],
        "title": "Caterers"
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "NO",
            "TW",
            "JP",
            "IT",
            "US",
            "HK",
            "AU",
            "ES",
            "BR",
            "CZ",
            "SG",
            "SE"
        ],
        "title": "Mobile Phone Accessories",
        "parents": [
            "shopping"
        ],
        "alias": "cellphoneaccessories"
    },
    {
        "country_whitelist": [
            "BR"
        ],
        "title": "Central Brazilian",
        "parents": [
            "brazilian"
        ],
        "alias": "centralbrazilian"
    },
    {
        "country_whitelist": [
            "FR",
            "CH",
            "DK",
            "CZ",
            "CA",
            "DE",
            "US",
            "PL",
            "HK",
            "NZ",
            "AT",
            "NO",
            "SG",
            "SE"
        ],
        "title": "Challenge Courses",
        "parents": [
            "active"
        ],
        "alias": "challengecourses"
    },
    {
        "alias": "champagne_bars",
        "title": "Champagne Bars",
        "parents": [
            "bars"
        ],
        "country_blacklist": [
            "AU"
        ]
    },
    {
        "country_whitelist": [
            "TR"
        ],
        "title": "Chee Kufta",
        "parents": [
            "turkish"
        ],
        "alias": "cheekufta"
    },
    {
        "alias": "cheese",
        "parents": [
            "gourmet"
        ],
        "title": "Cheese Shops"
    },
    {
        "country_whitelist": [
            "NL",
            "GB",
            "AU",
            "CA",
            "IE",
            "US",
            "PL"
        ],
        "title": "Cheesesteaks",
        "parents": [
            "restaurants"
        ],
        "alias": "cheesesteaks"
    },
    {
        "alias": "cheesetastingclasses",
        "parents": [
            "tastingclasses"
        ],
        "title": "Cheese Tasting Classes"
    },
    {
        "country_whitelist": [
            "IE",
            "TW",
            "CA",
            "DE",
            "TR",
            "US",
            "PL",
            "HK",
            "AR",
            "AT",
            "BR",
            "SG",
            "MX",
            "SE",
            "GB"
        ],
        "title": "Chicken Wings",
        "parents": [
            "restaurants"
        ],
        "alias": "chicken_wings"
    },
    {
        "alias": "chickenshop",
        "title": "Chicken Shop",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "MX",
            "CL"
        ]
    },
    {
        "country_whitelist": [
            "ES",
            "FR",
            "DK",
            "NO",
            "IT",
            "US",
            "AU",
            "GB",
            "BR",
            "IE",
            "SE"
        ],
        "title": "Childbirth Education",
        "parents": [
            "specialtyschools"
        ],
        "alias": "childbirthedu"
    },
    {
        "alias": "childcare",
        "parents": [
            "localservices"
        ],
        "title": "Child Care & Day Care"
    },
    {
        "alias": "childcloth",
        "parents": [
            "fashion"
        ],
        "title": "Children's Clothing"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Childproofing",
        "parents": [
            "homeservices"
        ],
        "alias": "childproofing"
    },
    {
        "country_whitelist": [
            "FI",
            "FR",
            "BR",
            "CL"
        ],
        "title": "Chilean",
        "parents": [
            "restaurants"
        ],
        "alias": "chilean"
    },
    {
        "alias": "chimneysweeps",
        "title": "Chimney Sweeps",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "AR",
            "MX"
        ]
    },
    {
        "alias": "chinese",
        "parents": [
            "restaurants"
        ],
        "title": "Chinese"
    },
    {
        "country_whitelist": [
            "ES",
            "PT"
        ],
        "title": "Chinese Bazaar",
        "parents": [
            "shopping"
        ],
        "alias": "chinesebazaar"
    },
    {
        "alias": "chiropractors",
        "parents": [
            "health"
        ],
        "title": "Chiropractors"
    },
    {
        "alias": "chocolate",
        "parents": [
            "gourmet"
        ],
        "title": "Chocolatiers & Shops"
    },
    {
        "alias": "choirs",
        "title": "Choirs",
        "parents": [
            "arts"
        ],
        "country_blacklist": [
            "BE",
            "NL",
            "CA",
            "US",
            "CZ",
            "NZ",
            "BR",
            "SG",
            "PL"
        ]
    },
    {
        "alias": "christmastrees",
        "parents": [
            "homeandgarden"
        ],
        "title": "Christmas Trees"
    },
    {
        "alias": "churches",
        "parents": [
            "religiousorgs"
        ],
        "title": "Churches"
    },
    {
        "country_whitelist": [
            "ES",
            "AR",
            "MX",
            "PT",
            "CL"
        ],
        "title": "Churros",
        "parents": [
            "food"
        ],
        "alias": "churros"
    },
    {
        "alias": "cideries",
        "title": "Cideries",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "BE",
            "FR",
            "NL",
            "DK",
            "NO",
            "JP",
            "TR",
            "IT"
        ]
    },
    {
        "country_whitelist": [
            "FI",
            "FR",
            "MX",
            "PT"
        ],
        "title": "Circus Schools",
        "parents": [
            "specialtyschools"
        ],
        "alias": "circusschools"
    },
    {
        "alias": "climbing",
        "parents": [
            "active"
        ],
        "title": "Climbing"
    },
    {
        "alias": "clockrepair",
        "title": "Clock Repair",
        "parents": [
            "localservices"
        ],
        "country_blacklist": [
            "CL",
            "AR",
            "JP",
            "MX",
            "IT"
        ]
    },
    {
        "alias": "clothingrental",
        "parents": [
            "fashion"
        ],
        "title": "Clothing Rental"
    },
    {
        "alias": "clowns",
        "title": "Clowns",
        "parents": [
            "eventservices"
        ],
        "country_blacklist": [
            "NO",
            "TR",
            "CZ",
            "PL",
            "SE",
            "FI",
            "SG",
            "ES"
        ]
    },
    {
        "alias": "cocktailbars",
        "parents": [
            "bars"
        ],
        "title": "Cocktail Bars"
    },
    {
        "alias": "coffee",
        "parents": [
            "food"
        ],
        "title": "Coffee & Tea"
    },
    {
        "country_whitelist": [
            "NL",
            "PT"
        ],
        "title": "Coffeeshops",
        "parents": [
            "nightlife"
        ],
        "alias": "coffeeshops"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "CH",
            "NL",
            "DK",
            "NO",
            "IE",
            "DE",
            "TR",
            "PL",
            "AT",
            "SG",
            "SE",
            "GB"
        ],
        "title": "Coffee & Tea Supplies",
        "parents": [
            "food"
        ],
        "alias": "coffeeteasupplies"
    },
    {
        "country_whitelist": [
            "PT",
            "US"
        ],
        "title": "College Counseling",
        "parents": [
            "education"
        ],
        "alias": "collegecounseling"
    },
    {
        "alias": "collegeuniv",
        "parents": [
            "education"
        ],
        "title": "Colleges & Universities"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "CL",
            "FI",
            "CA",
            "MX",
            "US"
        ],
        "title": "Colombian",
        "parents": [
            "latin"
        ],
        "alias": "colombian"
    },
    {
        "country_whitelist": [
            "AU",
            "US"
        ],
        "title": "Colonics",
        "parents": [
            "health"
        ],
        "alias": "colonics"
    },
    {
        "alias": "comedyclubs",
        "title": "Comedy Clubs",
        "parents": [
            "nightlife"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "country_whitelist": [
            "AR",
            "DK",
            "FI",
            "CA",
            "JP",
            "MX",
            "US"
        ],
        "title": "Comfort Food",
        "parents": [
            "restaurants"
        ],
        "alias": "comfortfood"
    },
    {
        "alias": "comicbooks",
        "parents": [
            "media"
        ],
        "title": "Comic Books"
    },
    {
        "country_whitelist": [
            "BE",
            "NL",
            "PT",
            "CA",
            "DE",
            "US",
            "AU",
            "BR"
        ],
        "title": "Commercial Real Estate",
        "parents": [
            "realestate"
        ],
        "alias": "commercialrealestate"
    },
    {
        "country_whitelist": [
            "DK",
            "PT",
            "NO",
            "CA",
            "US",
            "CZ",
            "GB",
            "BR",
            "IE",
            "SE"
        ],
        "title": "Community Centers",
        "parents": [
            "publicservicesgovt"
        ],
        "alias": "communitycenters"
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "NO",
            "DE",
            "US",
            "AU",
            "ES",
            "SG",
            "SE"
        ],
        "title": "Community Gardens",
        "parents": [
            "localservices"
        ],
        "alias": "communitygardens"
    },
    {
        "alias": "computers",
        "parents": [
            "shopping"
        ],
        "title": "Computers"
    },
    {
        "alias": "concept_shops",
        "title": "Concept Shops",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "ES",
            "CL",
            "JP",
            "CA",
            "TR",
            "IT",
            "US",
            "HK",
            "NZ",
            "AR",
            "PL",
            "BR",
            "SG",
            "SE"
        ]
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Concierge Medicine",
        "parents": [
            "health"
        ],
        "alias": "conciergemedicine"
    },
    {
        "country_whitelist": [
            "HK",
            "SG",
            "MY",
            "TW"
        ],
        "title": "Congee",
        "parents": [
            "chinese"
        ],
        "alias": "congee"
    },
    {
        "alias": "contractlaw",
        "title": "Contract Law",
        "parents": [
            "lawyers"
        ],
        "country_blacklist": [
            "FR"
        ]
    },
    {
        "alias": "contractors",
        "parents": [
            "homeservices"
        ],
        "title": "Contractors"
    },
    {
        "alias": "convenience",
        "title": "Convenience Stores",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "FI"
        ]
    },
    {
        "country_whitelist": [
            "HK",
            "SG",
            "JP",
            "TW"
        ],
        "title": "Conveyor Belt Sushi",
        "parents": [
            "japanese"
        ],
        "alias": "conveyorsushi"
    },
    {
        "alias": "cookingclasses",
        "parents": [
            "artsandcrafts"
        ],
        "title": "Cooking Classes"
    },
    {
        "alias": "cookingschools",
        "parents": [
            "specialtyschools"
        ],
        "title": "Cooking Schools"
    },
    {
        "alias": "copyshops",
        "parents": [
            "localservices"
        ],
        "title": "Printing Services"
    },
    {
        "country_whitelist": [
            "BE",
            "FR"
        ],
        "title": "Corsican",
        "parents": [
            "restaurants"
        ],
        "alias": "corsican"
    },
    {
        "alias": "cosmeticdentists",
        "title": "Cosmetic Dentists",
        "parents": [
            "dentists"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "cosmetics",
        "parents": [
            "shopping",
            "beautysvc"
        ],
        "title": "Cosmetics & Beauty Supply"
    },
    {
        "alias": "cosmeticsurgeons",
        "parents": [
            "physicians"
        ],
        "title": "Cosmetic Surgeons"
    },
    {
        "alias": "cosmetology_schools",
        "parents": [
            "specialtyschools"
        ],
        "title": "Cosmetology Schools"
    },
    {
        "alias": "costumes",
        "parents": [
            "artsandcrafts"
        ],
        "title": "Costumes"
    },
    {
        "alias": "countertopinstall",
        "title": "Countertop Installation",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "CZ",
            "FR",
            "CH",
            "AT",
            "DE",
            "IT"
        ]
    },
    {
        "country_whitelist": [
            "CL",
            "TW",
            "JP",
            "IT",
            "US",
            "HK",
            "AR",
            "BR",
            "SG",
            "MX",
            "ES"
        ],
        "title": "Country Clubs",
        "parents": [
            "arts"
        ],
        "alias": "countryclubs"
    },
    {
        "country_whitelist": [
            "SE",
            "US"
        ],
        "title": "Country Dance Halls",
        "parents": [
            "nightlife"
        ],
        "alias": "countrydancehalls"
    },
    {
        "alias": "couriers",
        "parents": [
            "localservices"
        ],
        "title": "Couriers & Delivery Services"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "CH",
            "NL",
            "PT",
            "NO",
            "DE",
            "IT",
            "US",
            "CZ",
            "AU",
            "AT"
        ],
        "title": "Courthouses",
        "parents": [
            "publicservicesgovt"
        ],
        "alias": "courthouses"
    },
    {
        "country_whitelist": [
            "AU",
            "SE",
            "US",
            "PT"
        ],
        "title": "CPR Classes",
        "parents": [
            "specialtyschools"
        ],
        "alias": "cprclasses"
    },
    {
        "alias": "creperies",
        "parents": [
            "restaurants"
        ],
        "title": "Creperies"
    },
    {
        "alias": "criminaldefense",
        "parents": [
            "lawyers"
        ],
        "title": "Criminal Defense Law"
    },
    {
        "country_whitelist": [
            "FR",
            "CH",
            "DE",
            "AT",
            "US"
        ],
        "title": "CSA",
        "parents": [
            "food"
        ],
        "alias": "csa"
    },
    {
        "alias": "cuban",
        "title": "Cuban",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "SG",
            "TR",
            "DK"
        ]
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Cucina campana",
        "parents": [
            "italian"
        ],
        "alias": "cucinacampana"
    },
    {
        "alias": "culturalcenter",
        "title": "Cultural Center",
        "parents": [
            "arts"
        ],
        "country_blacklist": [
            "CH",
            "NL",
            "CA",
            "DE",
            "TR",
            "NZ",
            "AT",
            "BR",
            "IE"
        ]
    },
    {
        "alias": "cupcakes",
        "title": "Cupcakes",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "CZ",
            "CA",
            "TR",
            "BR",
            "ES"
        ]
    },
    {
        "alias": "currencyexchange",
        "parents": [
            "financialservices"
        ],
        "title": "Currency Exchange"
    },
    {
        "country_whitelist": [
            "CH",
            "DE",
            "AT"
        ],
        "title": "Curry Sausage",
        "parents": [
            "restaurants"
        ],
        "alias": "currysausage"
    },
    {
        "alias": "custommerchandise",
        "parents": [
            "shopping"
        ],
        "title": "Customized Merchandise"
    },
    {
        "alias": "cyclingclasses",
        "title": "Cycling Classes",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "NZ",
            "AR",
            "BR",
            "PT",
            "CA",
            "IE",
            "MX"
        ]
    },
    {
        "country_whitelist": [
            "CH",
            "DE",
            "AT"
        ],
        "title": "Cypriot",
        "parents": [
            "restaurants"
        ],
        "alias": "cypriot"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "DK",
            "NO",
            "CA",
            "DE",
            "IT",
            "US",
            "PL",
            "CZ",
            "AU",
            "GB",
            "FI",
            "IE",
            "SE"
        ],
        "title": "Czech",
        "parents": [
            "restaurants"
        ],
        "alias": "czech"
    },
    {
        "country_whitelist": [
            "AR",
            "MX",
            "PT"
        ],
        "title": "Czech/Slovakian",
        "parents": [
            "restaurants"
        ],
        "alias": "czechslovakian"
    },
    {
        "country_whitelist": [
            "NZ",
            "AU",
            "PT",
            "SG",
            "TR",
            "US"
        ],
        "title": "Damage Restoration",
        "parents": [
            "homeservices"
        ],
        "alias": "damagerestoration"
    },
    {
        "alias": "dance_schools",
        "parents": [
            "specialtyschools"
        ],
        "title": "Dance Schools"
    },
    {
        "alias": "danceclubs",
        "parents": [
            "nightlife"
        ],
        "title": "Dance Clubs"
    },
    {
        "country_whitelist": [
            "FI"
        ],
        "title": "Dance Restaurants",
        "parents": [
            "nightlife"
        ],
        "alias": "dancerestaurants"
    },
    {
        "alias": "dancestudio",
        "parents": [
            "fitness"
        ],
        "title": "Dance Studios"
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "SE",
            "NO"
        ],
        "title": "Danish",
        "parents": [
            "restaurants"
        ],
        "alias": "danish"
    },
    {
        "country_whitelist": [
            "ES",
            "BE",
            "FR",
            "CH",
            "DK",
            "PT",
            "NO",
            "CA",
            "DE",
            "IT",
            "US",
            "CZ",
            "AU",
            "AT",
            "SE"
        ],
        "title": "Data Recovery",
        "parents": [
            "itservices"
        ],
        "alias": "datarecovery"
    },
    {
        "alias": "daycamps",
        "title": "Day Camps",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "JP",
            "MX",
            "CL"
        ]
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Debt Relief Services",
        "parents": [
            "financialservices"
        ],
        "alias": "debtrelief"
    },
    {
        "alias": "decksrailing",
        "parents": [
            "homeservices"
        ],
        "title": "Decks & Railing"
    },
    {
        "alias": "delicatessen",
        "title": "Delicatessen",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "IT",
            "US"
        ]
    },
    {
        "alias": "delis",
        "title": "Delis",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CH",
            "AT",
            "PT",
            "CL",
            "DE",
            "IT",
            "SE"
        ]
    },
    {
        "country_whitelist": [
            "ES",
            "AU",
            "IT",
            "US"
        ],
        "title": "Demolition Services",
        "parents": [
            "homeservices"
        ],
        "alias": "demolitionservices"
    },
    {
        "country_whitelist": [
            "CA"
        ],
        "title": "Storefront Clinics",
        "parents": [
            "dentalhygienists"
        ],
        "alias": "dentalhygeiniststorefront"
    },
    {
        "country_whitelist": [
            "CA",
            "DE",
            "PT"
        ],
        "title": "Dental Hygienists",
        "parents": [
            "health"
        ],
        "alias": "dentalhygienists"
    },
    {
        "country_whitelist": [
            "CA"
        ],
        "title": "Mobile Clinics",
        "parents": [
            "dentalhygienists"
        ],
        "alias": "dentalhygienistsmobile"
    },
    {
        "alias": "dentists",
        "parents": [
            "health"
        ],
        "title": "Dentists"
    },
    {
        "alias": "departmentsofmotorvehicles",
        "title": "Departments of Motor Vehicles",
        "parents": [
            "publicservicesgovt"
        ],
        "country_blacklist": [
            "BE",
            "FR"
        ]
    },
    {
        "alias": "deptstores",
        "parents": [
            "fashion",
            "shopping"
        ],
        "title": "Department Stores"
    },
    {
        "alias": "dermatology",
        "parents": [
            "physicians"
        ],
        "title": "Dermatologists"
    },
    {
        "alias": "desserts",
        "parents": [
            "food"
        ],
        "title": "Desserts"
    },
    {
        "country_whitelist": [
            "FR",
            "PT",
            "CA",
            "US",
            "AU",
            "GB",
            "BR",
            "IE",
            "MX"
        ],
        "title": "Diagnostic Imaging",
        "parents": [
            "diagnosticservices"
        ],
        "alias": "diagnosticimaging"
    },
    {
        "alias": "diagnosticservices",
        "parents": [
            "health"
        ],
        "title": "Diagnostic Services"
    },
    {
        "country_whitelist": [
            "AR",
            "ES",
            "CL",
            "TR",
            "IT",
            "US",
            "MX"
        ],
        "title": "Dialysis Clinics",
        "parents": [
            "health"
        ],
        "alias": "dialysisclinics"
    },
    {
        "alias": "dimsum",
        "title": "Dim Sum",
        "parents": [
            "chinese"
        ],
        "country_blacklist": [
            "TR",
            "BR",
            "PT"
        ]
    },
    {
        "alias": "diners",
        "title": "Diners",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "AU",
            "SE",
            "FI"
        ]
    },
    {
        "alias": "discgolf",
        "title": "Disc Golf",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "CZ",
            "AU",
            "SG",
            "DK"
        ]
    },
    {
        "alias": "discountstore",
        "parents": [
            "shopping"
        ],
        "title": "Discount Store"
    },
    {
        "alias": "distilleries",
        "parents": [
            "food"
        ],
        "title": "Distilleries"
    },
    {
        "alias": "divebars",
        "title": "Dive Bars",
        "parents": [
            "bars"
        ],
        "country_blacklist": [
            "CZ",
            "FR",
            "AU"
        ]
    },
    {
        "country_whitelist": [
            "CH",
            "CL",
            "DE",
            "JP",
            "IT",
            "US",
            "NZ",
            "AR",
            "AU",
            "AT",
            "BR",
            "MX",
            "ES"
        ],
        "title": "Dive Shops",
        "parents": [
            "sportgoods"
        ],
        "alias": "diveshops"
    },
    {
        "alias": "diving",
        "parents": [
            "active"
        ],
        "title": "Diving"
    },
    {
        "alias": "divorce",
        "parents": [
            "lawyers"
        ],
        "title": "Divorce & Family Law"
    },
    {
        "alias": "diyfood",
        "title": "Do-It-Yourself Food",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "ES",
            "FR",
            "CH",
            "CL",
            "NO",
            "DE",
            "IT",
            "CZ",
            "NZ",
            "AT",
            "FI",
            "SE"
        ]
    },
    {
        "alias": "djs",
        "parents": [
            "eventservices"
        ],
        "title": "DJs"
    },
    {
        "alias": "dog_parks",
        "parents": [
            "parks"
        ],
        "title": "Dog Parks"
    },
    {
        "alias": "dogwalkers",
        "parents": [
            "petservices"
        ],
        "title": "Dog Walkers"
    },
    {
        "country_whitelist": [
            "TR"
        ],
        "title": "Dolmus Station",
        "parents": [
            "transport"
        ],
        "alias": "dolmusstation"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Dominican",
        "parents": [
            "caribbean"
        ],
        "alias": "dominican"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "DK",
            "CZ",
            "CA",
            "TR",
            "PL"
        ],
        "title": "Donairs",
        "parents": [
            "food"
        ],
        "alias": "donairs"
    },
    {
        "country_whitelist": [
            "TW",
            "JP"
        ],
        "title": "Donburi",
        "parents": [
            "japanese"
        ],
        "alias": "donburi"
    },
    {
        "alias": "donuts",
        "title": "Donuts",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "ES"
        ]
    },
    {
        "country_whitelist": [
            "CZ",
            "NZ",
            "BR",
            "PT",
            "IT",
            "US"
        ],
        "title": "Door Sales/Installation",
        "parents": [
            "homeservices"
        ],
        "alias": "doorsales"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "IT",
            "PT",
            "US"
        ],
        "title": "Doulas",
        "parents": [
            "health"
        ],
        "alias": "doulas"
    },
    {
        "country_whitelist": [
            "ES",
            "BE",
            "FR",
            "CH",
            "DK",
            "NO",
            "DE",
            "JP",
            "IT",
            "AT",
            "SG",
            "SE"
        ],
        "title": "Drama Schools",
        "parents": [
            "specialtyschools"
        ],
        "alias": "dramaschools"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Drive-Thru Bars",
        "parents": [
            "bars"
        ],
        "alias": "drivethrubars"
    },
    {
        "alias": "driving_schools",
        "parents": [
            "specialtyschools"
        ],
        "title": "Driving Schools"
    },
    {
        "alias": "drugstores",
        "title": "Drugstores",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "FR",
            "AR",
            "NO",
            "CL",
            "TR",
            "MX",
            "SE"
        ]
    },
    {
        "alias": "drycleaninglaundry",
        "parents": [
            "localservices"
        ],
        "title": "Dry Cleaning & Laundry"
    },
    {
        "alias": "drywall",
        "title": "Drywall Installation & Repair",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "JP",
            "MX",
            "CL"
        ]
    },
    {
        "country_whitelist": [
            "CA",
            "DE",
            "US"
        ],
        "title": "DUI Law",
        "parents": [
            "lawyers"
        ],
        "alias": "duilawyers"
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Dumplings",
        "parents": [
            "restaurants"
        ],
        "alias": "dumplings"
    },
    {
        "alias": "dutyfreeshops",
        "parents": [
            "shopping"
        ],
        "title": "Duty-Free Shops"
    },
    {
        "alias": "earnosethroat",
        "parents": [
            "physicians"
        ],
        "title": "Ear Nose & Throat"
    },
    {
        "country_whitelist": [
            "FR",
            "AU"
        ],
        "title": "Eastern European",
        "parents": [
            "restaurants"
        ],
        "alias": "eastern_european"
    },
    {
        "country_whitelist": [
            "DE"
        ],
        "title": "Eastern German",
        "parents": [
            "german"
        ],
        "alias": "easterngerman"
    },
    {
        "country_whitelist": [
            "MX"
        ],
        "title": "Eastern Mexican",
        "parents": [
            "mexican"
        ],
        "alias": "easternmexican"
    },
    {
        "country_whitelist": [
            "BE",
            "NL",
            "PT",
            "CL",
            "DE",
            "IT",
            "US",
            "AR",
            "BR",
            "MX"
        ],
        "title": "Editorial Services",
        "parents": [
            "professional"
        ],
        "alias": "editorialservices"
    },
    {
        "alias": "education",
        "parents": [],
        "title": "Education"
    },
    {
        "alias": "educationservices",
        "title": "Educational Services",
        "parents": [
            "education"
        ],
        "country_blacklist": [
            "BR"
        ]
    },
    {
        "country_whitelist": [
            "BE",
            "CA",
            "FR",
            "US",
            "IT"
        ],
        "title": "Egyptian",
        "parents": [
            "mideastern"
        ],
        "alias": "egyptian"
    },
    {
        "alias": "eldercareplanning",
        "parents": [
            "localservices"
        ],
        "title": "Elder Care Planning"
    },
    {
        "alias": "electricians",
        "parents": [
            "homeservices"
        ],
        "title": "Electricians"
    },
    {
        "alias": "electronics",
        "parents": [
            "shopping"
        ],
        "title": "Electronics"
    },
    {
        "alias": "electronicsrepair",
        "parents": [
            "localservices"
        ],
        "title": "Electronics Repair"
    },
    {
        "alias": "elementaryschools",
        "parents": [
            "education"
        ],
        "title": "Elementary Schools"
    },
    {
        "country_whitelist": [
            "CH",
            "DE",
            "AT"
        ],
        "title": "Parent Cafes",
        "parents": [
            "food",
            "restaurants"
        ],
        "alias": "eltern_cafes"
    },
    {
        "alias": "embassy",
        "title": "Embassy",
        "parents": [
            "publicservicesgovt"
        ],
        "country_blacklist": [
            "TR"
        ]
    },
    {
        "country_whitelist": [
            "DK",
            "PT",
            "NO",
            "IT",
            "US",
            "CZ",
            "BR",
            "MX",
            "SE"
        ],
        "title": "Embroidery & Crochet",
        "parents": [
            "artsandcrafts"
        ],
        "alias": "embroideryandcrochet"
    },
    {
        "country_whitelist": [
            "SE",
            "US"
        ],
        "title": "Emergency Rooms",
        "parents": [
            "health"
        ],
        "alias": "emergencyrooms"
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Emilian",
        "parents": [
            "italian"
        ],
        "alias": "emilian"
    },
    {
        "country_whitelist": [
            "AR",
            "ES",
            "US",
            "CL"
        ],
        "title": "Empanadas",
        "parents": [
            "food"
        ],
        "alias": "empanadas"
    },
    {
        "alias": "employmentagencies",
        "parents": [
            "professional"
        ],
        "title": "Employment Agencies"
    },
    {
        "alias": "employmentlawyers",
        "parents": [
            "lawyers"
        ],
        "title": "Employment Law"
    },
    {
        "country_whitelist": [
            "CH",
            "DE",
            "AT",
            "ES",
            "SE"
        ],
        "title": "EMS Training",
        "parents": [
            "fitness"
        ],
        "alias": "emstraining"
    },
    {
        "country_whitelist": [
            "FR",
            "CL",
            "TR",
            "IT",
            "US",
            "CZ",
            "BR",
            "ES"
        ],
        "title": "Endocrinologists",
        "parents": [
            "physicians"
        ],
        "alias": "endocrinologists"
    },
    {
        "alias": "endodontists",
        "title": "Endodontists",
        "parents": [
            "dentists"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "engraving",
        "parents": [
            "localservices"
        ],
        "title": "Engraving"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Entertainment Law",
        "parents": [
            "lawyers"
        ],
        "alias": "entertainmentlaw"
    },
    {
        "alias": "eroticmassage",
        "title": "Erotic Massage",
        "parents": [
            "beautysvc"
        ],
        "country_blacklist": [
            "DK",
            "CL",
            "JP",
            "NO",
            "TR",
            "US",
            "HK",
            "TW",
            "FI",
            "PH",
            "MY",
            "SE"
        ]
    },
    {
        "alias": "escapegames",
        "parents": [
            "active"
        ],
        "title": "Escape Games"
    },
    {
        "alias": "estateliquidation",
        "title": "Estate Liquidation",
        "parents": [
            "realestate"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "estateplanning",
        "title": "Estate Planning Law",
        "parents": [
            "lawyers"
        ],
        "country_blacklist": [
            "SE",
            "NO"
        ]
    },
    {
        "alias": "ethicgrocery",
        "title": "Ethic Grocery",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "CZ",
            "CH",
            "AT",
            "DE",
            "IE",
            "US",
            "GB"
        ]
    },
    {
        "alias": "ethiopian",
        "title": "Ethiopian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "DK",
            "PT",
            "SG",
            "TR",
            "MX",
            "ES"
        ]
    },
    {
        "alias": "ethnicgrocery",
        "parents": [
            "food"
        ],
        "title": "Ethnic Grocery"
    },
    {
        "alias": "ethnicmarkets",
        "title": "Ethnic Food",
        "parents": [
            "gourmet"
        ],
        "country_blacklist": [
            "CH",
            "DE",
            "AT"
        ]
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "PT",
            "DE",
            "JP",
            "IT",
            "US",
            "AR",
            "AU"
        ],
        "title": "Event Photography",
        "parents": [
            "photographers"
        ],
        "alias": "eventphotography"
    },
    {
        "alias": "eventplanning",
        "parents": [
            "eventservices"
        ],
        "title": "Party & Event Planning"
    },
    {
        "alias": "eventservices",
        "parents": [],
        "title": "Event Planning & Services"
    },
    {
        "country_whitelist": [
            "DE",
            "PT",
            "SE",
            "NO"
        ],
        "title": "Experiences",
        "parents": [
            "active"
        ],
        "alias": "experiences"
    },
    {
        "alias": "eyelashservice",
        "title": "Eyelash Service",
        "parents": [
            "beautysvc"
        ],
        "country_blacklist": [
            "BR",
            "ES",
            "IT"
        ]
    },
    {
        "alias": "fabricstores",
        "parents": [
            "artsandcrafts"
        ],
        "title": "Fabric Stores"
    },
    {
        "country_whitelist": [
            "CZ",
            "NZ",
            "AU",
            "BR",
            "US"
        ],
        "title": "Face Painting",
        "parents": [
            "eventservices"
        ],
        "alias": "facepainting"
    },
    {
        "country_whitelist": [
            "PT"
        ],
        "title": "Fado Houses",
        "parents": [
            "portuguese"
        ],
        "alias": "fado_houses"
    },
    {
        "alias": "falafel",
        "title": "Falafel",
        "parents": [
            "mediterranean"
        ],
        "country_blacklist": [
            "AR",
            "MX",
            "PT"
        ]
    },
    {
        "alias": "familydr",
        "title": "Family Practice",
        "parents": [
            "physicians"
        ],
        "country_blacklist": [
            "BR"
        ]
    },
    {
        "alias": "farmequipmentrepair",
        "parents": [
            "localservices"
        ],
        "title": "Farm Equipment Repair"
    },
    {
        "alias": "farmersmarket",
        "parents": [
            "food"
        ],
        "title": "Farmers Market"
    },
    {
        "alias": "farmingequipment",
        "parents": [
            "shopping"
        ],
        "title": "Farming Equipment"
    },
    {
        "alias": "farms",
        "parents": [
            "arts"
        ],
        "title": "Farms"
    },
    {
        "alias": "fashion",
        "parents": [
            "shopping"
        ],
        "title": "Fashion"
    },
    {
        "country_whitelist": [
            "TR"
        ],
        "title": "Fasil Music",
        "parents": [
            "nightlife"
        ],
        "alias": "fasil"
    },
    {
        "country_whitelist": [
            "DK",
            "PT",
            "CL",
            "NO",
            "IT",
            "US",
            "CZ",
            "NZ",
            "AR",
            "BR",
            "FI",
            "SG",
            "MX"
        ],
        "title": "Fences & Gates",
        "parents": [
            "homeservices"
        ],
        "alias": "fencesgates"
    },
    {
        "alias": "fencing",
        "parents": [
            "active"
        ],
        "title": "Fencing Clubs"
    },
    {
        "country_whitelist": [
            "DK",
            "PT",
            "NO",
            "JP",
            "DE",
            "TR",
            "IT",
            "HK",
            "NZ",
            "ES",
            "FI",
            "SG",
            "SE"
        ],
        "title": "Ferries",
        "parents": [
            "transport"
        ],
        "alias": "ferries"
    },
    {
        "alias": "fertility",
        "parents": [
            "physicians"
        ],
        "title": "Fertility"
    },
    {
        "alias": "festivals",
        "parents": [
            "arts"
        ],
        "title": "Festivals"
    },
    {
        "alias": "filipino",
        "title": "Filipino",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "TR",
            "DK",
            "FI"
        ]
    },
    {
        "alias": "financialadvising",
        "parents": [
            "financialservices"
        ],
        "title": "Financial Advising"
    },
    {
        "alias": "financialservices",
        "parents": [],
        "title": "Financial Services"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Firearm Training",
        "parents": [
            "specialtyschools"
        ],
        "alias": "firearmtraining"
    },
    {
        "alias": "firedepartments",
        "title": "Fire Departments",
        "parents": [
            "publicservicesgovt"
        ],
        "country_blacklist": [
            "NZ",
            "GB",
            "BR",
            "SG",
            "CA",
            "IE"
        ]
    },
    {
        "alias": "fireplace",
        "parents": [
            "homeservices"
        ],
        "title": "Fireplace Services"
    },
    {
        "alias": "fireprotection",
        "parents": [
            "homeservices"
        ],
        "title": "Fire Protection Services"
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "SE",
            "NO",
            "FI",
            "US"
        ],
        "title": "Firewood",
        "parents": [
            "homeservices"
        ],
        "alias": "firewood"
    },
    {
        "country_whitelist": [
            "CZ",
            "PT",
            "US"
        ],
        "title": "Fireworks",
        "parents": [
            "shopping"
        ],
        "alias": "fireworks"
    },
    {
        "alias": "firstaidclasses",
        "title": "First Aid Classes",
        "parents": [
            "specialtyschools"
        ],
        "country_blacklist": [
            "BE",
            "FR",
            "NL",
            "BR",
            "IE",
            "SG",
            "NZ"
        ]
    },
    {
        "country_whitelist": [
            "DE"
        ],
        "title": "Fischbroetchen",
        "parents": [
            "restaurants"
        ],
        "alias": "fischbroetchen"
    },
    {
        "alias": "fishing",
        "parents": [
            "active"
        ],
        "title": "Fishing"
    },
    {
        "country_whitelist": [
            "AU",
            "DK",
            "PT",
            "NO",
            "FI",
            "DE",
            "SE"
        ],
        "title": "Fishmonger",
        "parents": [
            "food"
        ],
        "alias": "fishmonger"
    },
    {
        "alias": "fishnchips",
        "title": "Fish & Chips",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "BR",
            "PT"
        ]
    },
    {
        "alias": "fitness",
        "parents": [
            "active"
        ],
        "title": "Fitness & Instruction"
    },
    {
        "alias": "fitnessequipment",
        "parents": [
            "shopping"
        ],
        "title": "Fitness/Exercise Equipment"
    },
    {
        "country_whitelist": [
            "CH",
            "DE",
            "AT",
            "PL",
            "DK"
        ],
        "title": "Flatbread",
        "parents": [
            "restaurants"
        ],
        "alias": "flatbread"
    },
    {
        "alias": "fleamarkets",
        "parents": [
            "shopping"
        ],
        "title": "Flea Markets"
    },
    {
        "country_whitelist": [
            "FR"
        ],
        "title": "Flemish",
        "parents": [
            "belgian"
        ],
        "alias": "flemish"
    },
    {
        "alias": "flightinstruction",
        "parents": [
            "specialtyschools"
        ],
        "title": "Flight Instruction"
    },
    {
        "alias": "flooring",
        "parents": [
            "homeservices"
        ],
        "title": "Flooring"
    },
    {
        "alias": "florists",
        "parents": [
            "flowers"
        ],
        "title": "Florists"
    },
    {
        "alias": "flowers",
        "parents": [
            "shopping"
        ],
        "title": "Flowers & Gifts"
    },
    {
        "alias": "flyboarding",
        "parents": [
            "active"
        ],
        "title": "Flyboarding"
    },
    {
        "alias": "fondue",
        "title": "Fondue",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "DK",
            "ES"
        ]
    },
    {
        "alias": "food",
        "parents": [],
        "title": "Food"
    },
    {
        "country_whitelist": [
            "DK",
            "NO",
            "IE",
            "SG",
            "CA",
            "JP",
            "US",
            "CZ",
            "NZ",
            "AU",
            "GB",
            "HK",
            "PH",
            "MY",
            "SE"
        ],
        "title": "Food Court",
        "parents": [
            "restaurants"
        ],
        "alias": "food_court"
    },
    {
        "alias": "foodbanks",
        "parents": [
            "nonprofit"
        ],
        "title": "Food Banks"
    },
    {
        "alias": "fooddeliveryservices",
        "parents": [
            "food"
        ],
        "title": "Food Delivery Services"
    },
    {
        "country_whitelist": [
            "SG",
            "PT",
            "US"
        ],
        "title": "Food Safety Training",
        "parents": [
            "specialtyschools"
        ],
        "alias": "foodsafety"
    },
    {
        "alias": "foodstands",
        "parents": [
            "restaurants"
        ],
        "title": "Food Stands"
    },
    {
        "alias": "foodtours",
        "parents": [
            "tours"
        ],
        "title": "Food Tours"
    },
    {
        "alias": "foodtrucks",
        "title": "Food Trucks",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "SG"
        ]
    },
    {
        "alias": "football",
        "parents": [
            "active"
        ],
        "title": "Soccer"
    },
    {
        "country_whitelist": [
            "FR",
            "PT",
            "CA",
            "DE",
            "US",
            "CZ",
            "NZ",
            "AU",
            "AT",
            "BR",
            "SG"
        ],
        "title": "Formal Wear",
        "parents": [
            "fashion"
        ],
        "alias": "formalwear"
    },
    {
        "alias": "framing",
        "parents": [
            "artsandcrafts"
        ],
        "title": "Framing"
    },
    {
        "alias": "freediving",
        "parents": [
            "diving"
        ],
        "title": "Free Diving"
    },
    {
        "alias": "french",
        "parents": [
            "restaurants"
        ],
        "title": "French"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "AU",
            "IT",
            "PL"
        ],
        "title": "Friterie",
        "parents": [
            "food"
        ],
        "alias": "friterie"
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Friulan",
        "parents": [
            "italian"
        ],
        "alias": "friulan"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "GB",
            "SG",
            "IT",
            "ES"
        ],
        "title": "Frozen Food",
        "parents": [
            "gourmet"
        ],
        "alias": "frozenfood"
    },
    {
        "country_whitelist": [
            "ES",
            "DK",
            "SE",
            "NO",
            "MX",
            "US"
        ],
        "title": "Fuel Docks",
        "parents": [
            "auto"
        ],
        "alias": "fueldocks"
    },
    {
        "alias": "funeralservices",
        "parents": [
            "localservices"
        ],
        "title": "Funeral Services & Cemeteries"
    },
    {
        "country_whitelist": [
            "CZ",
            "CH",
            "DE",
            "AT",
            "PT"
        ],
        "title": "Fun Fair",
        "parents": [
            "festivals"
        ],
        "alias": "funfair"
    },
    {
        "alias": "furniture",
        "parents": [
            "homeandgarden"
        ],
        "title": "Furniture Stores"
    },
    {
        "alias": "furnitureassembly",
        "title": "Furniture Assembly",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "furniturerepair",
        "parents": [
            "localservices"
        ],
        "title": "Furniture Repair"
    },
    {
        "country_whitelist": [
            "HK",
            "SG",
            "MY",
            "TW"
        ],
        "title": "Fuzhou",
        "parents": [
            "chinese"
        ],
        "alias": "fuzhou"
    },
    {
        "country_whitelist": [
            "ES",
            "PT"
        ],
        "title": "Galician",
        "parents": [
            "restaurants"
        ],
        "alias": "galician"
    },
    {
        "alias": "galleries",
        "parents": [
            "arts",
            "shopping"
        ],
        "title": "Art Galleries"
    },
    {
        "country_whitelist": [
            "CA",
            "AR",
            "MX",
            "US",
            "CL"
        ],
        "title": "Game Truck Rental",
        "parents": [
            "eventservices"
        ],
        "alias": "gametruckrental"
    },
    {
        "alias": "garage_door_services",
        "title": "Garage Door Services",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "CH",
            "PT",
            "CL",
            "JP",
            "DE",
            "TR",
            "MY",
            "PL",
            "HK",
            "AR",
            "AT",
            "TW",
            "PH",
            "SG",
            "SE"
        ]
    },
    {
        "alias": "gardeners",
        "parents": [
            "homeservices"
        ],
        "title": "Gardeners"
    },
    {
        "alias": "gardening",
        "parents": [
            "homeandgarden"
        ],
        "title": "Nurseries & Gardening"
    },
    {
        "alias": "gardens",
        "parents": [
            "arts"
        ],
        "title": "Botanical Gardens"
    },
    {
        "alias": "gastroenterologist",
        "parents": [
            "physicians"
        ],
        "title": "Gastroenterologist"
    },
    {
        "alias": "gastropubs",
        "title": "Gastropubs",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "gaybars",
        "parents": [
            "bars"
        ],
        "title": "Gay Bars"
    },
    {
        "country_whitelist": [
            "DK",
            "PT",
            "NO",
            "IT",
            "US",
            "AU",
            "PH",
            "SG",
            "SE"
        ],
        "title": "Gelato",
        "parents": [
            "food"
        ],
        "alias": "gelato"
    },
    {
        "alias": "general_litigation",
        "parents": [
            "lawyers"
        ],
        "title": "General Litigation"
    },
    {
        "alias": "generaldentistry",
        "title": "General Dentistry",
        "parents": [
            "dentists"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "country_whitelist": [
            "CH",
            "DE",
            "AT",
            "PT"
        ],
        "title": "General Festivals",
        "parents": [
            "festivals"
        ],
        "alias": "generalfestivals"
    },
    {
        "country_whitelist": [
            "CZ",
            "GB",
            "PL"
        ],
        "title": "Georgian",
        "parents": [
            "restaurants"
        ],
        "alias": "georgian"
    },
    {
        "alias": "german",
        "parents": [
            "restaurants"
        ],
        "title": "German"
    },
    {
        "alias": "gerontologist",
        "parents": [
            "physicians"
        ],
        "title": "Gerontologists"
    },
    {
        "country_whitelist": [
            "TR"
        ],
        "title": "Giblets",
        "parents": [
            "restaurants"
        ],
        "alias": "giblets"
    },
    {
        "alias": "giftshops",
        "title": "Gift Shops",
        "parents": [
            "flowers"
        ],
        "country_blacklist": [
            "SG",
            "TR",
            "PL"
        ]
    },
    {
        "alias": "glassandmirrors",
        "title": "Glass & Mirrors",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "TR",
            "AU",
            "IE",
            "GB",
            "PL"
        ]
    },
    {
        "country_whitelist": [
            "CH",
            "AT",
            "PT",
            "NO",
            "DE",
            "SE"
        ],
        "title": "Gliding",
        "parents": [
            "active"
        ],
        "alias": "gliding"
    },
    {
        "country_whitelist": [
            "CZ",
            "CH",
            "DE",
            "AT",
            "SE"
        ],
        "title": "Mulled Wine",
        "parents": [
            "food"
        ],
        "alias": "gluhwein"
    },
    {
        "alias": "gluten_free",
        "parents": [
            "restaurants"
        ],
        "title": "Gluten-Free"
    },
    {
        "alias": "gokarts",
        "parents": [
            "active"
        ],
        "title": "Go Karts"
    },
    {
        "country_whitelist": [
            "ES",
            "BE",
            "FR",
            "CH",
            "NL",
            "PT",
            "CA",
            "DE",
            "IT",
            "US",
            "AT",
            "BR",
            "SE"
        ],
        "title": "Gold Buyers",
        "parents": [
            "shopping"
        ],
        "alias": "goldbuyers"
    },
    {
        "alias": "golf",
        "parents": [
            "active"
        ],
        "title": "Golf"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Golf Cart Rentals",
        "parents": [
            "eventservices"
        ],
        "alias": "golfcartrentals"
    },
    {
        "country_whitelist": [
            "BE",
            "NL",
            "AU",
            "CA",
            "DE",
            "US"
        ],
        "title": "Golf Equipment",
        "parents": [
            "sportgoods"
        ],
        "alias": "golfequipment"
    },
    {
        "country_whitelist": [
            "ES",
            "BE",
            "FR",
            "NL",
            "DK",
            "NO",
            "JP",
            "IT",
            "US",
            "NZ",
            "AU",
            "GB",
            "SE"
        ],
        "title": "Golf Lessons",
        "parents": [
            "fitness"
        ],
        "alias": "golflessons"
    },
    {
        "alias": "golfshops",
        "title": "Golf Equipment Shops",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "IE",
            "CA",
            "SG",
            "NZ",
            "BR"
        ]
    },
    {
        "alias": "gourmet",
        "parents": [
            "food"
        ],
        "title": "Specialty Food"
    },
    {
        "country_whitelist": [
            "TR"
        ],
        "title": "Gozleme",
        "parents": [
            "turkish"
        ],
        "alias": "gozleme"
    },
    {
        "alias": "graphicdesign",
        "parents": [
            "professional"
        ],
        "title": "Graphic Design"
    },
    {
        "alias": "greek",
        "parents": [
            "restaurants"
        ],
        "title": "Greek"
    },
    {
        "alias": "grocery",
        "parents": [
            "food"
        ],
        "title": "Grocery"
    },
    {
        "alias": "groomer",
        "parents": [
            "petservices"
        ],
        "title": "Pet Groomers"
    },
    {
        "alias": "guesthouses",
        "title": "Guest Houses",
        "parents": [
            "hotelstravel"
        ],
        "country_blacklist": [
            "SG",
            "DK"
        ]
    },
    {
        "alias": "guitarstores",
        "parents": [
            "musicinstrumentservices"
        ],
        "title": "Guitar Stores"
    },
    {
        "alias": "gun_ranges",
        "title": "Gun/Rifle Ranges",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "BE",
            "FR",
            "CH",
            "AT",
            "BR",
            "SG"
        ]
    },
    {
        "country_whitelist": [
            "CH",
            "PT",
            "CL",
            "DE",
            "US",
            "AR",
            "AT",
            "MX"
        ],
        "title": "Guns & Ammo",
        "parents": [
            "shopping"
        ],
        "alias": "guns_and_ammo"
    },
    {
        "alias": "gutterservices",
        "title": "Gutter Services",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "AR",
            "MX",
            "PT"
        ]
    },
    {
        "country_whitelist": [
            "DK",
            "PT",
            "NO",
            "CA",
            "US",
            "CZ",
            "NZ",
            "BR",
            "MX"
        ],
        "title": "Gymnastics",
        "parents": [
            "active"
        ],
        "alias": "gymnastics"
    },
    {
        "alias": "gyms",
        "parents": [
            "fitness"
        ],
        "title": "Gyms"
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Gyudon",
        "parents": [
            "donburi"
        ],
        "alias": "gyudon"
    },
    {
        "alias": "habilitativeservices",
        "parents": [
            "health"
        ],
        "title": "Habilitative Services"
    },
    {
        "alias": "hair",
        "parents": [
            "beautysvc"
        ],
        "title": "Hair Salons"
    },
    {
        "alias": "hair_extensions",
        "title": "Hair Extensions",
        "parents": [
            "hair",
            "beautysvc"
        ],
        "country_blacklist": [
            "BE",
            "NL",
            "CL",
            "TR",
            "IT",
            "HK",
            "AR",
            "ES",
            "PL"
        ]
    },
    {
        "alias": "hairloss",
        "parents": [
            "beautysvc"
        ],
        "title": "Hair Loss Centers"
    },
    {
        "alias": "hairremoval",
        "parents": [
            "beautysvc"
        ],
        "title": "Hair Removal"
    },
    {
        "country_whitelist": [
            "CZ",
            "AU",
            "SE",
            "PT",
            "SG",
            "US"
        ],
        "title": "Hair Stylists",
        "parents": [
            "hair"
        ],
        "alias": "hairstylists"
    },
    {
        "country_whitelist": [
            "CA",
            "US"
        ],
        "title": "Haitian",
        "parents": [
            "caribbean"
        ],
        "alias": "haitian"
    },
    {
        "country_whitelist": [
            "HK",
            "TW",
            "CA",
            "SG",
            "MY",
            "PH"
        ],
        "title": "Hakka",
        "parents": [
            "chinese"
        ],
        "alias": "hakka"
    },
    {
        "alias": "halal",
        "title": "Halal",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "TR",
            "PT"
        ]
    },
    {
        "alias": "halotherapy",
        "title": "Halotherapy",
        "parents": [
            "health"
        ],
        "country_blacklist": [
            "FR"
        ]
    },
    {
        "alias": "handball",
        "title": "Handball",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "CA",
            "DE",
            "HK",
            "AU",
            "GB",
            "SG",
            "IE",
            "PT",
            "CZ",
            "TW",
            "TR",
            "US",
            "NZ",
            "PH",
            "MY",
            "MX"
        ]
    },
    {
        "country_whitelist": [
            "TW",
            "BR"
        ],
        "title": "Hand Rolls",
        "parents": [
            "japanese"
        ],
        "alias": "handrolls"
    },
    {
        "alias": "handyman",
        "parents": [
            "homeservices"
        ],
        "title": "Handyman"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "PT",
            "IT",
            "US",
            "NZ",
            "AU",
            "SE"
        ],
        "title": "Hang Gliding",
        "parents": [
            "active"
        ],
        "alias": "hanggliding"
    },
    {
        "alias": "hardware",
        "parents": [
            "homeandgarden"
        ],
        "title": "Hardware Stores"
    },
    {
        "alias": "hats",
        "title": "Hats",
        "parents": [
            "fashion"
        ],
        "country_blacklist": [
            "CH",
            "NL",
            "CL",
            "JP",
            "TR",
            "PL",
            "HK",
            "AR",
            "AT",
            "IE",
            "SE",
            "GB"
        ]
    },
    {
        "alias": "hauntedhouses",
        "parents": [
            "arts"
        ],
        "title": "Haunted Houses"
    },
    {
        "alias": "hawaiian",
        "title": "Hawaiian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "AU",
            "TR",
            "DK",
            "PT"
        ]
    },
    {
        "country_whitelist": [
            "HK",
            "PH",
            "SG",
            "MY",
            "TW"
        ],
        "title": "Hawker Centre",
        "parents": [
            "food"
        ],
        "alias": "hawkercentre"
    },
    {
        "alias": "headshops",
        "parents": [
            "shopping"
        ],
        "title": "Head Shops"
    },
    {
        "alias": "health",
        "parents": [],
        "title": "Health & Medical"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "PT",
            "DE",
            "US",
            "CZ",
            "NZ",
            "AU",
            "BR",
            "SG",
            "MX"
        ],
        "title": "Health Insurance Offices",
        "parents": [
            "health"
        ],
        "alias": "healthinsurance"
    },
    {
        "alias": "healthmarkets",
        "parents": [
            "gourmet"
        ],
        "title": "Health Markets"
    },
    {
        "alias": "healthretreats",
        "title": "Health Retreats",
        "parents": [
            "hotelstravel"
        ],
        "country_blacklist": [
            "CZ",
            "AR",
            "MX"
        ]
    },
    {
        "alias": "healthtrainers",
        "parents": [
            "fitness"
        ],
        "title": "Trainers"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "CH",
            "DK",
            "PT",
            "NO",
            "DE",
            "AT",
            "BR",
            "FI"
        ],
        "title": "Hearing Aids",
        "parents": [
            "health"
        ],
        "alias": "hearing_aids"
    },
    {
        "alias": "hearingaidproviders",
        "title": "Hearing Aid Providers",
        "parents": [
            "health"
        ],
        "country_blacklist": [
            "ES",
            "NL",
            "DK",
            "HK",
            "JP",
            "TR",
            "CZ",
            "NZ",
            "AU",
            "GB",
            "SE",
            "IE",
            "PL"
        ]
    },
    {
        "country_whitelist": [
            "HK",
            "SG",
            "MY",
            "TW"
        ],
        "title": "Henghwa",
        "parents": [
            "chinese"
        ],
        "alias": "henghwa"
    },
    {
        "country_whitelist": [
            "FR",
            "AU",
            "BR",
            "NZ",
            "IT",
            "US"
        ],
        "title": "Henna Artists",
        "parents": [
            "eventservices"
        ],
        "alias": "hennaartists"
    },
    {
        "alias": "herbsandspices",
        "parents": [
            "gourmet"
        ],
        "title": "Herbs & Spices"
    },
    {
        "country_whitelist": [
            "DE"
        ],
        "title": "Hessian",
        "parents": [
            "german"
        ],
        "alias": "hessian"
    },
    {
        "country_whitelist": [
            "AT"
        ],
        "title": "Heuriger",
        "parents": [
            "restaurants"
        ],
        "alias": "heuriger"
    },
    {
        "alias": "hifi",
        "title": "High Fidelity Audio Equipment",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "highschools",
        "parents": [
            "education"
        ],
        "title": "Middle Schools & High Schools"
    },
    {
        "alias": "hiking",
        "parents": [
            "active"
        ],
        "title": "Hiking"
    },
    {
        "alias": "himalayan",
        "parents": [
            "restaurants"
        ],
        "title": "Himalayan/Nepalese"
    },
    {
        "alias": "hindu_temples",
        "parents": [
            "religiousorgs"
        ],
        "title": "Hindu Temples"
    },
    {
        "alias": "historicaltours",
        "parents": [
            "tours"
        ],
        "title": "Historical Tours"
    },
    {
        "country_whitelist": [
            "HK"
        ],
        "title": "Hong Kong Style Cafe",
        "parents": [
            "restaurants"
        ],
        "alias": "hkcafe"
    },
    {
        "alias": "hobbyshops",
        "parents": [
            "shopping"
        ],
        "title": "Hobby Shops"
    },
    {
        "country_whitelist": [
            "HK",
            "SG",
            "MY",
            "TW"
        ],
        "title": "Hokkien",
        "parents": [
            "chinese"
        ],
        "alias": "hokkien"
    },
    {
        "alias": "holidaydecorations",
        "parents": [
            "homeandgarden"
        ],
        "title": "Holiday Decorations"
    },
    {
        "alias": "home_inspectors",
        "parents": [
            "homeservices"
        ],
        "title": "Home Inspectors"
    },
    {
        "country_whitelist": [
            "CA",
            "US"
        ],
        "title": "Home Organization",
        "parents": [
            "homeservices"
        ],
        "alias": "home_organization"
    },
    {
        "alias": "homeandgarden",
        "parents": [
            "shopping"
        ],
        "title": "Home & Garden"
    },
    {
        "alias": "homeappliancerepair",
        "parents": [
            "localservices"
        ],
        "title": "Appliances & Repair"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Home Automation",
        "parents": [
            "homeservices"
        ],
        "alias": "homeautomation"
    },
    {
        "alias": "homecleaning",
        "parents": [
            "homeservices"
        ],
        "title": "Home Cleaning"
    },
    {
        "alias": "homedecor",
        "parents": [
            "homeandgarden"
        ],
        "title": "Home Decor"
    },
    {
        "alias": "homehealthcare",
        "title": "Home Health Care",
        "parents": [
            "health"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "homeinsurance",
        "parents": [
            "insurance"
        ],
        "title": "Home & Rental Insurance"
    },
    {
        "country_whitelist": [
            "TR"
        ],
        "title": "Homemade Food",
        "parents": [
            "turkish"
        ],
        "alias": "homemadefood"
    },
    {
        "country_whitelist": [
            "ES",
            "NO",
            "SE",
            "US",
            "DK"
        ],
        "title": "Home Network Installation",
        "parents": [
            "homeservices"
        ],
        "alias": "homenetworkinstall"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "DK",
            "NO",
            "JP",
            "IT",
            "ES",
            "FI",
            "SE"
        ],
        "title": "Homeopathic",
        "parents": [
            "physicians"
        ],
        "alias": "homeopathic"
    },
    {
        "alias": "homeservices",
        "parents": [],
        "title": "Home Services"
    },
    {
        "alias": "homestaging",
        "title": "Home Staging",
        "parents": [
            "realestate"
        ],
        "country_blacklist": [
            "CH",
            "PT",
            "DE",
            "IT",
            "CZ",
            "AT",
            "BR",
            "ES"
        ]
    },
    {
        "alias": "hometheatreinstallation",
        "title": "Home Theatre Installation",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "CZ",
            "DK"
        ]
    },
    {
        "country_whitelist": [
            "PT",
            "US"
        ],
        "title": "Home Window Tinting",
        "parents": [
            "homeservices"
        ],
        "alias": "homewindowtinting"
    },
    {
        "country_whitelist": [
            "FR",
            "FI",
            "DE",
            "TR",
            "IT",
            "SE"
        ],
        "title": "Honey",
        "parents": [
            "food"
        ],
        "alias": "honey"
    },
    {
        "alias": "hookah_bars",
        "title": "Hookah Bars",
        "parents": [
            "bars"
        ],
        "country_blacklist": [
            "AU",
            "PT",
            "CL"
        ]
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "NO",
            "CA",
            "DE",
            "US",
            "CZ",
            "SE"
        ],
        "title": "Horse Boarding",
        "parents": [
            "pets"
        ],
        "alias": "horse_boarding"
    },
    {
        "alias": "horsebackriding",
        "parents": [
            "active"
        ],
        "title": "Horseback Riding"
    },
    {
        "country_whitelist": [
            "FR",
            "NL",
            "DK",
            "NO",
            "DE",
            "IT",
            "US",
            "CZ",
            "ES",
            "BR",
            "FI",
            "SG",
            "SE"
        ],
        "title": "Horse Equipment Shops",
        "parents": [
            "shopping"
        ],
        "alias": "horsequipment"
    },
    {
        "alias": "horseracing",
        "title": "Horse Racing",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "BE",
            "FR",
            "CA",
            "IT",
            "HK",
            "GB",
            "BR",
            "SG",
            "IE",
            "ES",
            "NL",
            "TW",
            "NZ",
            "PH",
            "MY",
            "PL"
        ]
    },
    {
        "country_whitelist": [
            "TW",
            "JP"
        ],
        "title": "Horumon",
        "parents": [
            "japanese"
        ],
        "alias": "horumon"
    },
    {
        "alias": "hospice",
        "parents": [
            "health"
        ],
        "title": "Hospice"
    },
    {
        "alias": "hospitals",
        "parents": [
            "health"
        ],
        "title": "Hospitals"
    },
    {
        "alias": "hostels",
        "parents": [
            "hotelstravel"
        ],
        "title": "Hostels"
    },
    {
        "alias": "hot_air_balloons",
        "title": "Hot Air Balloons",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "CA",
            "SG",
            "NZ",
            "BR"
        ]
    },
    {
        "alias": "hotdog",
        "parents": [
            "restaurants"
        ],
        "title": "Hot Dogs"
    },
    {
        "alias": "hotdogs",
        "parents": [
            "restaurants"
        ],
        "title": "Fast Food"
    },
    {
        "country_whitelist": [
            "DK",
            "PT",
            "NO",
            "FI",
            "BR",
            "SE"
        ],
        "title": "Hotel bar",
        "parents": [
            "bars"
        ],
        "alias": "hotel_bar"
    },
    {
        "alias": "hotels",
        "parents": [
            "hotelstravel",
            "eventservices"
        ],
        "title": "Hotels"
    },
    {
        "alias": "hotelstravel",
        "parents": [],
        "title": "Hotels & Travel"
    },
    {
        "country_whitelist": [
            "FR",
            "TW",
            "CA",
            "JP",
            "US",
            "HK",
            "MY",
            "BR",
            "PH",
            "SG",
            "SE"
        ],
        "title": "Hot Pot",
        "parents": [
            "restaurants"
        ],
        "alias": "hotpot"
    },
    {
        "country_whitelist": [
            "AU",
            "NZ",
            "JP",
            "BR",
            "TW"
        ],
        "title": "Hot Springs",
        "parents": [
            "beautysvc"
        ],
        "alias": "hotsprings"
    },
    {
        "alias": "hottubandpool",
        "parents": [
            "homeandgarden"
        ],
        "title": "Hot Tub & Pool"
    },
    {
        "country_whitelist": [
            "AU",
            "IT",
            "US"
        ],
        "title": "House Sitters",
        "parents": [
            "homeservices"
        ],
        "alias": "housesitters"
    },
    {
        "country_whitelist": [
            "HK",
            "FR",
            "SG",
            "MY",
            "TW"
        ],
        "title": "Hunan",
        "parents": [
            "chinese"
        ],
        "alias": "hunan"
    },
    {
        "alias": "hungarian",
        "title": "Hungarian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "DK",
            "ES",
            "PT"
        ]
    },
    {
        "alias": "hvac",
        "parents": [
            "homeservices"
        ],
        "title": "Heating & Air Conditioning/HVAC"
    },
    {
        "alias": "hypnosis",
        "title": "Hypnosis/Hypnotherapy",
        "parents": [
            "health"
        ],
        "country_blacklist": [
            "ES",
            "NL",
            "CZ",
            "TR",
            "HK",
            "GB",
            "IE",
            "PL"
        ]
    },
    {
        "country_whitelist": [
            "CA",
            "PT",
            "US"
        ],
        "title": "Iberian",
        "parents": [
            "restaurants"
        ],
        "alias": "iberian"
    },
    {
        "alias": "icecream",
        "parents": [
            "food"
        ],
        "title": "Ice Cream & Frozen Yogurt"
    },
    {
        "alias": "immigrationlawyers",
        "parents": [
            "lawyers"
        ],
        "title": "Immigration Law"
    },
    {
        "alias": "indonesian",
        "title": "Indonesian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "MX",
            "ES"
        ]
    },
    {
        "country_whitelist": [
            "DK",
            "PT",
            "NO",
            "DE",
            "JP",
            "IT",
            "CZ",
            "NZ",
            "AU",
            "ES",
            "SE"
        ],
        "title": "Indoor Playcentre",
        "parents": [
            "active"
        ],
        "alias": "indoor_playcenter"
    },
    {
        "alias": "indpak",
        "parents": [
            "restaurants"
        ],
        "title": "Indian"
    },
    {
        "alias": "insulationinstallation",
        "parents": [
            "homeservices"
        ],
        "title": "Insulation Installation"
    },
    {
        "alias": "insurance",
        "parents": [
            "financialservices"
        ],
        "title": "Insurance"
    },
    {
        "alias": "interiordesign",
        "parents": [
            "homeservices"
        ],
        "title": "Interior Design"
    },
    {
        "alias": "internalmed",
        "title": "Internal Medicine",
        "parents": [
            "physicians"
        ],
        "country_blacklist": [
            "BR"
        ]
    },
    {
        "country_whitelist": [
            "FR",
            "CH",
            "DK",
            "PT",
            "CL",
            "TW",
            "DE",
            "JP",
            "HK",
            "AR",
            "AT",
            "BR",
            "NO",
            "SG",
            "MX"
        ],
        "title": "International",
        "parents": [
            "restaurants"
        ],
        "alias": "international"
    },
    {
        "country_whitelist": [
            "AR",
            "BR",
            "CL",
            "IT",
            "ES",
            "MX"
        ],
        "title": "Internet Booths & Calling Centers",
        "parents": [
            "localservices"
        ],
        "alias": "internetbooth"
    },
    {
        "alias": "internetcafe",
        "parents": [
            "food"
        ],
        "title": "Internet Cafes"
    },
    {
        "alias": "investing",
        "parents": [
            "financialservices"
        ],
        "title": "Investing"
    },
    {
        "country_whitelist": [
            "CZ",
            "US"
        ],
        "title": "IP & Internet Law",
        "parents": [
            "lawyers"
        ],
        "alias": "iplaw"
    },
    {
        "alias": "irish",
        "parents": [
            "restaurants"
        ],
        "title": "Irish"
    },
    {
        "alias": "irish_pubs",
        "parents": [
            "bars"
        ],
        "title": "Irish Pub"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Irrigation",
        "parents": [
            "homeservices"
        ],
        "alias": "irrigation"
    },
    {
        "country_whitelist": [
            "SE"
        ],
        "title": "Island Pub",
        "parents": [
            "restaurants"
        ],
        "alias": "island_pub"
    },
    {
        "alias": "isps",
        "parents": [
            "professional",
            "homeservices"
        ],
        "title": "Internet Service Providers"
    },
    {
        "country_whitelist": [
            "CZ",
            "CH",
            "DE",
            "AT"
        ],
        "title": "Israeli",
        "parents": [
            "restaurants"
        ],
        "alias": "israeli"
    },
    {
        "alias": "italian",
        "parents": [
            "restaurants"
        ],
        "title": "Italian"
    },
    {
        "alias": "itservices",
        "parents": [
            "localservices"
        ],
        "title": "IT Services & Computer Repair"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "IV Hydration",
        "parents": [
            "health"
        ],
        "alias": "ivhydration"
    },
    {
        "country_whitelist": [
            "NZ",
            "AU",
            "BR",
            "TW",
            "SG",
            "JP",
            "MX"
        ],
        "title": "Izakaya",
        "parents": [
            "japanese"
        ],
        "alias": "izakaya"
    },
    {
        "country_whitelist": [
            "MX"
        ],
        "title": "Jaliscan",
        "parents": [
            "mexican"
        ],
        "alias": "jaliscan"
    },
    {
        "country_whitelist": [
            "HK",
            "SG",
            "JP",
            "TW"
        ],
        "title": "Japanese Curry",
        "parents": [
            "japanese"
        ],
        "alias": "japacurry"
    },
    {
        "alias": "japanese",
        "parents": [
            "restaurants"
        ],
        "title": "Japanese"
    },
    {
        "alias": "jazzandblues",
        "parents": [
            "arts",
            "nightlife"
        ],
        "title": "Jazz & Blues"
    },
    {
        "alias": "jetskis",
        "parents": [
            "active"
        ],
        "title": "Jet Skis"
    },
    {
        "alias": "jewelry",
        "parents": [
            "shopping"
        ],
        "title": "Jewelry"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "PT",
            "JP",
            "CA",
            "TR",
            "IT",
            "US",
            "CZ",
            "AU",
            "ES",
            "PL"
        ],
        "title": "Jewelry Repair",
        "parents": [
            "localservices"
        ],
        "alias": "jewelryrepair"
    },
    {
        "country_whitelist": [
            "DE",
            "IT",
            "PL"
        ],
        "title": "Jewish",
        "parents": [
            "restaurants"
        ],
        "alias": "jewish"
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Japanese Sweets",
        "parents": [
            "food"
        ],
        "alias": "jpsweets"
    },
    {
        "alias": "juicebars",
        "parents": [
            "food"
        ],
        "title": "Juice Bars & Smoothies"
    },
    {
        "alias": "junkremovalandhauling",
        "parents": [
            "localservices"
        ],
        "title": "Junk Removal & Hauling"
    },
    {
        "country_whitelist": [
            "TW",
            "JP"
        ],
        "title": "Kaiseki",
        "parents": [
            "japanese"
        ],
        "alias": "kaiseki"
    },
    {
        "alias": "karaoke",
        "parents": [
            "nightlife"
        ],
        "title": "Karaoke"
    },
    {
        "alias": "kebab",
        "title": "Kebab",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CA",
            "NL",
            "GB",
            "US",
            "PT"
        ]
    },
    {
        "alias": "kids_activities",
        "title": "Kids Activities",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "CA",
            "SG"
        ]
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Kimonos",
        "parents": [
            "fashion"
        ],
        "alias": "kimonos"
    },
    {
        "alias": "kiosk",
        "title": "Kiosk",
        "parents": [
            "food",
            "shopping"
        ],
        "country_blacklist": [
            "BE",
            "FR",
            "NL",
            "CL",
            "IE",
            "CA",
            "IT",
            "US",
            "HK",
            "NZ",
            "GB",
            "BR",
            "SG",
            "MX"
        ]
    },
    {
        "alias": "kitchenandbath",
        "parents": [
            "homeandgarden"
        ],
        "title": "Kitchen & Bath"
    },
    {
        "country_whitelist": [
            "GB",
            "US"
        ],
        "title": "Kitchen Incubators",
        "parents": [
            "realestate"
        ],
        "alias": "kitchenincubators"
    },
    {
        "alias": "kiteboarding",
        "title": "Kiteboarding",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "ES",
            "BE",
            "CH",
            "CL",
            "CA",
            "IT",
            "CZ",
            "AR",
            "AT",
            "HK",
            "PL",
            "GB"
        ]
    },
    {
        "country_whitelist": [
            "ES",
            "CL",
            "IT",
            "US",
            "CZ",
            "AU",
            "GB",
            "BR",
            "SE"
        ],
        "title": "Knife Sharpening",
        "parents": [
            "localservices"
        ],
        "alias": "knifesharpening"
    },
    {
        "alias": "knittingsupplies",
        "parents": [
            "shopping"
        ],
        "title": "Knitting Supplies"
    },
    {
        "country_whitelist": [
            "MY",
            "SG"
        ],
        "title": "Kopitiam",
        "parents": [
            "restaurants"
        ],
        "alias": "kopitiam"
    },
    {
        "alias": "korean",
        "parents": [
            "restaurants"
        ],
        "title": "Korean"
    },
    {
        "alias": "kosher",
        "title": "Kosher",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "TR",
            "PT"
        ]
    },
    {
        "country_whitelist": [
            "SE",
            "NO"
        ],
        "title": "Kurdish",
        "parents": [
            "restaurants"
        ],
        "alias": "kurdish"
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Kushikatsu",
        "parents": [
            "japanese"
        ],
        "alias": "kushikatsu"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "PT",
            "IT",
            "US",
            "AU",
            "BR",
            "MX"
        ],
        "title": "Laboratory Testing",
        "parents": [
            "diagnosticservices"
        ],
        "alias": "laboratorytesting"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "IT",
            "PT",
            "US"
        ],
        "title": "Lactation Services",
        "parents": [
            "health"
        ],
        "alias": "lactationservices"
    },
    {
        "country_whitelist": [
            "TR"
        ],
        "title": "Lahmacun",
        "parents": [
            "turkish"
        ],
        "alias": "lahmacun"
    },
    {
        "alias": "lakes",
        "parents": [
            "active"
        ],
        "title": "Lakes"
    },
    {
        "alias": "lancenters",
        "title": "LAN Centers",
        "parents": [
            "arts"
        ],
        "country_blacklist": [
            "PH",
            "MY",
            "IT"
        ]
    },
    {
        "alias": "landmarks",
        "parents": [
            "publicservicesgovt"
        ],
        "title": "Landmarks & Historical Buildings"
    },
    {
        "alias": "landscapearchitects",
        "parents": [
            "homeservices"
        ],
        "title": "Landscape Architects"
    },
    {
        "alias": "landscaping",
        "title": "Landscaping",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "DK",
            "ES"
        ]
    },
    {
        "alias": "language_schools",
        "parents": [
            "specialtyschools"
        ],
        "title": "Language Schools"
    },
    {
        "country_whitelist": [
            "AU"
        ],
        "title": "Laos",
        "parents": [
            "restaurants"
        ],
        "alias": "laos"
    },
    {
        "alias": "laotian",
        "title": "Laotian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "laser_hair_removal",
        "title": "Laser Hair Removal",
        "parents": [
            "hairremoval"
        ],
        "country_blacklist": [
            "DK",
            "ES"
        ]
    },
    {
        "alias": "laserlasikeyes",
        "parents": [
            "health"
        ],
        "title": "Laser Eye Surgery/Lasik"
    },
    {
        "alias": "lasertag",
        "title": "Laser Tag",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "IE",
            "BR"
        ]
    },
    {
        "alias": "latin",
        "parents": [
            "restaurants"
        ],
        "title": "Latin American"
    },
    {
        "country_whitelist": [
            "NZ",
            "AU",
            "PT",
            "NO",
            "FI",
            "SE"
        ],
        "title": "Lawn Bowling",
        "parents": [
            "active"
        ],
        "alias": "lawn_bowling"
    },
    {
        "alias": "lawyers",
        "parents": [
            "professional"
        ],
        "title": "Lawyers"
    },
    {
        "alias": "leather",
        "parents": [
            "fashion"
        ],
        "title": "Leather Goods"
    },
    {
        "alias": "lebanese",
        "title": "Lebanese",
        "parents": [
            "mideastern"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "JP"
        ]
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "PT",
            "CA",
            "TR",
            "IT",
            "US",
            "CZ",
            "NZ",
            "AU",
            "BR",
            "SG"
        ],
        "title": "Legal Services",
        "parents": [
            "professional"
        ],
        "alias": "legalservices"
    },
    {
        "alias": "leisure_centers",
        "title": "Leisure Centers",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "DK"
        ]
    },
    {
        "alias": "libraries",
        "parents": [
            "publicservicesgovt"
        ],
        "title": "Libraries"
    },
    {
        "alias": "liceservices",
        "title": "Lice Services",
        "parents": [
            "health"
        ],
        "country_blacklist": [
            "CL",
            "DE",
            "JP",
            "CZ",
            "AR",
            "HK",
            "FI",
            "MX"
        ]
    },
    {
        "alias": "lifecoach",
        "parents": [
            "professional"
        ],
        "title": "Life Coach"
    },
    {
        "country_whitelist": [
            "ES",
            "DK",
            "NO",
            "IE",
            "TR",
            "JP",
            "IT",
            "US",
            "CZ",
            "NZ",
            "AU",
            "GB",
            "BR",
            "SG",
            "SE"
        ],
        "title": "Life Insurance",
        "parents": [
            "insurance"
        ],
        "alias": "lifeinsurance"
    },
    {
        "alias": "lighting",
        "parents": [
            "homeservices"
        ],
        "title": "Lighting Fixtures & Equipment"
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Ligurian",
        "parents": [
            "italian"
        ],
        "alias": "ligurian"
    },
    {
        "alias": "limos",
        "parents": [
            "transport"
        ],
        "title": "Limos"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "CH",
            "PT",
            "DE",
            "IT",
            "CZ",
            "AT"
        ],
        "title": "Linens",
        "parents": [
            "homeandgarden"
        ],
        "alias": "linens"
    },
    {
        "alias": "lingerie",
        "parents": [
            "fashion"
        ],
        "title": "Lingerie"
    },
    {
        "alias": "livestocksupply",
        "parents": [
            "shopping"
        ],
        "title": "Livestock Feed & Supply"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "DK",
            "NO",
            "DE",
            "JP",
            "IT",
            "US",
            "ES",
            "SG",
            "SE"
        ],
        "title": "Local Fish Stores",
        "parents": [
            "petstore"
        ],
        "alias": "localfishstores"
    },
    {
        "alias": "localflavor",
        "parents": [],
        "title": "Local Flavor"
    },
    {
        "alias": "localservices",
        "parents": [],
        "title": "Local Services"
    },
    {
        "alias": "locksmiths",
        "parents": [
            "homeservices"
        ],
        "title": "Keys & Locksmiths"
    },
    {
        "alias": "lounges",
        "parents": [
            "bars"
        ],
        "title": "Lounges"
    },
    {
        "alias": "luggage",
        "parents": [
            "shopping"
        ],
        "title": "Luggage"
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Lumbard",
        "parents": [
            "italian"
        ],
        "alias": "lumbard"
    },
    {
        "country_whitelist": [
            "BE",
            "FR"
        ],
        "title": "Lyonnais",
        "parents": [
            "restaurants"
        ],
        "alias": "lyonnais"
    },
    {
        "alias": "macarons",
        "title": "Macarons",
        "parents": [
            "gourmet"
        ],
        "country_blacklist": [
            "PH",
            "MY",
            "IT"
        ]
    },
    {
        "alias": "machinerental",
        "parents": [
            "localservices"
        ],
        "title": "Machine & Tool Rental"
    },
    {
        "country_whitelist": [
            "PT"
        ],
        "title": "Madeira",
        "parents": [
            "portuguese"
        ],
        "alias": "madeira"
    },
    {
        "alias": "magicians",
        "title": "Magicians",
        "parents": [
            "eventservices"
        ],
        "country_blacklist": [
            "PL",
            "SE",
            "NO",
            "FI",
            "SG",
            "TR",
            "ES"
        ]
    },
    {
        "alias": "mags",
        "parents": [
            "media"
        ],
        "title": "Newspapers & Magazines"
    },
    {
        "country_whitelist": [
            "HK",
            "JP"
        ],
        "title": "Mah Jong Halls",
        "parents": [
            "arts"
        ],
        "alias": "mahjong"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Mailbox Centers",
        "parents": [
            "localservices"
        ],
        "alias": "mailboxcenters"
    },
    {
        "alias": "makeupartists",
        "parents": [
            "beautysvc"
        ],
        "title": "Makeup Artists"
    },
    {
        "alias": "malaysian",
        "title": "Malaysian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "TR",
            "ES",
            "PT"
        ]
    },
    {
        "country_whitelist": [
            "AU",
            "MY"
        ],
        "title": "Mamak",
        "parents": [
            "malaysian"
        ],
        "alias": "mamak"
    },
    {
        "country_whitelist": [
            "CH",
            "PT",
            "NO",
            "DE",
            "TR",
            "AT",
            "SE",
            "GB"
        ],
        "title": "Marching Bands",
        "parents": [
            "arts"
        ],
        "alias": "marchingbands"
    },
    {
        "country_whitelist": [
            "ES",
            "FR",
            "DK",
            "CL",
            "NO",
            "TR",
            "IT",
            "US",
            "NZ",
            "AR",
            "GB",
            "BR",
            "IE",
            "MX",
            "SE"
        ],
        "title": "Marinas",
        "parents": [
            "auto"
        ],
        "alias": "marinas"
    },
    {
        "alias": "marketing",
        "parents": [
            "professional"
        ],
        "title": "Marketing"
    },
    {
        "alias": "markets",
        "parents": [
            "gourmet"
        ],
        "title": "Fruits & Veggies"
    },
    {
        "country_whitelist": [
            "CH",
            "DK",
            "PT",
            "NO",
            "DE",
            "IT",
            "CZ",
            "AT",
            "IE",
            "GB"
        ],
        "title": "Market Stalls",
        "parents": [
            "shopping"
        ],
        "alias": "marketstalls"
    },
    {
        "alias": "martialarts",
        "parents": [
            "fitness"
        ],
        "title": "Martial Arts"
    },
    {
        "alias": "masonry_concrete",
        "title": "Masonry/Concrete",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "BE",
            "NZ",
            "NL",
            "GB",
            "BR",
            "IE",
            "SG"
        ]
    },
    {
        "alias": "massage",
        "parents": [
            "beautysvc"
        ],
        "title": "Massage"
    },
    {
        "alias": "massage_schools",
        "parents": [
            "specialtyschools"
        ],
        "title": "Massage Schools"
    },
    {
        "country_whitelist": [
            "DK",
            "PT",
            "NO",
            "CA",
            "JP",
            "IT",
            "US",
            "BR"
        ],
        "title": "Massage Therapy",
        "parents": [
            "health"
        ],
        "alias": "massage_therapy"
    },
    {
        "alias": "massmedia",
        "parents": [],
        "title": "Mass Media"
    },
    {
        "country_whitelist": [
            "US",
            "FR",
            "CA",
            "PT",
            "DK"
        ],
        "title": "Matchmakers",
        "parents": [
            "professional"
        ],
        "alias": "matchmakers"
    },
    {
        "country_whitelist": [
            "CL",
            "AR",
            "MX",
            "ES",
            "IT"
        ],
        "title": "Materiale elettrico",
        "parents": [
            "homeandgarden"
        ],
        "alias": "materialeelettrico"
    },
    {
        "alias": "maternity",
        "parents": [
            "fashion"
        ],
        "title": "Maternity Wear"
    },
    {
        "alias": "mattresses",
        "parents": [
            "homeandgarden"
        ],
        "title": "Mattresses"
    },
    {
        "country_whitelist": [
            "TR"
        ],
        "title": "Meatballs",
        "parents": [
            "restaurants"
        ],
        "alias": "meatballs"
    },
    {
        "alias": "meats",
        "parents": [
            "gourmet"
        ],
        "title": "Meat Shops"
    },
    {
        "alias": "medcenters",
        "parents": [
            "health"
        ],
        "title": "Medical Centers"
    },
    {
        "alias": "media",
        "parents": [
            "shopping"
        ],
        "title": "Books, Mags, Music & Video"
    },
    {
        "country_whitelist": [
            "CH",
            "DE",
            "AT",
            "US",
            "IT"
        ],
        "title": "Mediators",
        "parents": [
            "professional"
        ],
        "alias": "mediators"
    },
    {
        "country_whitelist": [
            "CH",
            "AU",
            "AT",
            "NO",
            "DE",
            "SE"
        ],
        "title": "Medical Foot Care",
        "parents": [
            "health"
        ],
        "alias": "medicalfoot"
    },
    {
        "alias": "medicalspa",
        "parents": [
            "health",
            "beautysvc"
        ],
        "title": "Medical Spas"
    },
    {
        "country_whitelist": [
            "CH",
            "DK",
            "PT",
            "CZ",
            "TW",
            "CA",
            "DE",
            "JP",
            "IT",
            "US",
            "HK",
            "AT",
            "BR",
            "NO",
            "ES"
        ],
        "title": "Medical Supplies",
        "parents": [
            "shopping"
        ],
        "alias": "medicalsupplies"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "PT",
            "IT",
            "US",
            "AU",
            "BR",
            "SG"
        ],
        "title": "Medical Transportation",
        "parents": [
            "health"
        ],
        "alias": "medicaltransportation"
    },
    {
        "alias": "meditationcenters",
        "title": "Meditation Centers",
        "parents": [
            "fitness"
        ],
        "country_blacklist": [
            "AR",
            "MX"
        ]
    },
    {
        "alias": "mediterranean",
        "parents": [
            "restaurants"
        ],
        "title": "Mediterranean"
    },
    {
        "alias": "menscloth",
        "parents": [
            "fashion"
        ],
        "title": "Men's Clothing"
    },
    {
        "country_whitelist": [
            "CZ",
            "AU",
            "DK",
            "PT",
            "NO",
            "CL",
            "US"
        ],
        "title": "Men's Hair Salons",
        "parents": [
            "hair"
        ],
        "alias": "menshair"
    },
    {
        "alias": "metalfabricators",
        "title": "Metal Fabricators",
        "parents": [
            "localservices"
        ],
        "country_blacklist": [
            "AR",
            "MX",
            "SE"
        ]
    },
    {
        "alias": "mexican",
        "parents": [
            "restaurants"
        ],
        "title": "Mexican"
    },
    {
        "alias": "mideastern",
        "title": "Middle Eastern",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "BR"
        ]
    },
    {
        "alias": "midwives",
        "parents": [
            "health"
        ],
        "title": "Midwives"
    },
    {
        "country_whitelist": [
            "AU",
            "PL"
        ],
        "title": "Milk Bars",
        "parents": [
            "restaurants"
        ],
        "alias": "milkbars"
    },
    {
        "country_whitelist": [
            "GB"
        ],
        "title": "Milkshake Bars",
        "parents": [
            "food"
        ],
        "alias": "milkshakebars"
    },
    {
        "country_whitelist": [
            "PT"
        ],
        "title": "Minho",
        "parents": [
            "portuguese"
        ],
        "alias": "minho"
    },
    {
        "alias": "mini_golf",
        "title": "Mini Golf",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "IT"
        ]
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Mobile Dent Repair",
        "parents": [
            "auto"
        ],
        "alias": "mobiledentrepair"
    },
    {
        "alias": "mobilehomes",
        "title": "Mobile Home Dealers",
        "parents": [
            "realestate"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Mobile Home Parks",
        "parents": [
            "realestate"
        ],
        "alias": "mobileparks"
    },
    {
        "alias": "mobilephonerepair",
        "parents": [
            "itservices"
        ],
        "title": "Mobile Phone Repair"
    },
    {
        "alias": "mobilephones",
        "parents": [
            "shopping"
        ],
        "title": "Mobile Phones"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Mobility Equipment Sales & Services",
        "parents": [
            "auto"
        ],
        "alias": "mobilityequipment"
    },
    {
        "country_whitelist": [
            "AU"
        ],
        "title": "Modern Australian",
        "parents": [
            "restaurants"
        ],
        "alias": "modern_australian"
    },
    {
        "alias": "modern_european",
        "title": "Modern European",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Mohels",
        "parents": [
            "eventservices"
        ],
        "alias": "mohels"
    },
    {
        "alias": "mongolian",
        "title": "Mongolian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "FI",
            "TR",
            "DK",
            "ES",
            "PT"
        ]
    },
    {
        "alias": "moroccan",
        "title": "Moroccan",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "TR"
        ]
    },
    {
        "alias": "mortgagebrokers",
        "title": "Mortgage Brokers",
        "parents": [
            "realestate"
        ],
        "country_blacklist": [
            "BR",
            "DK",
            "ES"
        ]
    },
    {
        "alias": "mosques",
        "parents": [
            "religiousorgs"
        ],
        "title": "Mosques"
    },
    {
        "country_whitelist": [
            "ES",
            "TW",
            "IT",
            "US",
            "SE"
        ],
        "title": "Motorsport Vehicle Dealers",
        "parents": [
            "auto"
        ],
        "alias": "motodealers"
    },
    {
        "country_whitelist": [
            "FR",
            "PT",
            "NO",
            "DE",
            "IT",
            "US",
            "CZ",
            "NZ",
            "AU",
            "BR",
            "FI",
            "SG",
            "MX",
            "ES"
        ],
        "title": "Motorcycle Rental",
        "parents": [
            "hotelstravel"
        ],
        "alias": "motorcycle_rental"
    },
    {
        "alias": "motorcycledealers",
        "title": "Motorcycle Dealers",
        "parents": [
            "auto"
        ],
        "country_blacklist": [
            "BR"
        ]
    },
    {
        "alias": "motorcyclerepair",
        "parents": [
            "auto"
        ],
        "title": "Motorcycle Repair"
    },
    {
        "alias": "motorcyclinggear",
        "title": "Motorcycle Gear",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "CA",
            "IE",
            "NZ",
            "BR",
            "GB"
        ]
    },
    {
        "country_whitelist": [
            "ES",
            "TW",
            "IT",
            "US",
            "SE"
        ],
        "title": "Motorsport Vehicle Repairs",
        "parents": [
            "auto"
        ],
        "alias": "motorepairs"
    },
    {
        "alias": "mountainbiking",
        "parents": [
            "active"
        ],
        "title": "Mountain Biking"
    },
    {
        "country_whitelist": [
            "FR",
            "CH",
            "CL",
            "DE",
            "IT",
            "US",
            "PL",
            "CZ",
            "NZ",
            "AR",
            "AT",
            "NO",
            "SE"
        ],
        "title": "Mountain Huts",
        "parents": [
            "hotels"
        ],
        "alias": "mountainhuts"
    },
    {
        "alias": "movers",
        "parents": [
            "homeservices"
        ],
        "title": "Movers"
    },
    {
        "alias": "movietheaters",
        "parents": [
            "arts"
        ],
        "title": "Cinema"
    },
    {
        "alias": "museums",
        "parents": [
            "arts"
        ],
        "title": "Museums"
    },
    {
        "alias": "musicalinstrumentsandteachers",
        "parents": [
            "shopping"
        ],
        "title": "Musical Instruments & Teachers"
    },
    {
        "alias": "musicians",
        "title": "Musicians",
        "parents": [
            "eventservices"
        ],
        "country_blacklist": [
            "TR",
            "ES",
            "PL"
        ]
    },
    {
        "alias": "musicinstrumentservices",
        "parents": [
            "localservices"
        ],
        "title": "Musical Instrument Services"
    },
    {
        "alias": "musicproduction",
        "parents": [
            "professional"
        ],
        "title": "Music Production Services"
    },
    {
        "alias": "musicvenues",
        "parents": [
            "arts",
            "nightlife"
        ],
        "title": "Music Venues"
    },
    {
        "alias": "musicvideo",
        "parents": [
            "media"
        ],
        "title": "Music & DVDs"
    },
    {
        "alias": "nailtechnicians",
        "title": "Nail Technicians",
        "parents": [
            "othersalons"
        ],
        "country_blacklist": [
            "FR",
            "CH",
            "AT",
            "BR",
            "JP",
            "DE",
            "TR"
        ]
    },
    {
        "alias": "nannys",
        "title": "Nanny Services",
        "parents": [
            "localservices"
        ],
        "country_blacklist": [
            "ES",
            "CA",
            "PL",
            "BR",
            "FI",
            "IE",
            "SE",
            "GB"
        ]
    },
    {
        "country_whitelist": [
            "FR",
            "IT"
        ],
        "title": "Napoletana",
        "parents": [
            "italian"
        ],
        "alias": "napoletana"
    },
    {
        "country_whitelist": [
            "MY",
            "SG"
        ],
        "title": "Nasi Lemak",
        "parents": [
            "food"
        ],
        "alias": "nasilemak"
    },
    {
        "alias": "naturopathic",
        "parents": [
            "physicians"
        ],
        "title": "Naturopathic/Holistic"
    },
    {
        "alias": "nephrologists",
        "title": "Nephrologists",
        "parents": [
            "physicians"
        ],
        "country_blacklist": [
            "CH",
            "DE",
            "AT"
        ]
    },
    {
        "alias": "neurologist",
        "parents": [
            "physicians"
        ],
        "title": "Neurologist"
    },
    {
        "country_whitelist": [
            "DK",
            "SE",
            "NO",
            "IE",
            "US",
            "GB"
        ],
        "title": "American (New)",
        "parents": [
            "restaurants"
        ],
        "alias": "newamerican"
    },
    {
        "country_whitelist": [
            "CA"
        ],
        "title": "Canadian (New)",
        "parents": [
            "restaurants"
        ],
        "alias": "newcanadian"
    },
    {
        "country_whitelist": [
            "NZ"
        ],
        "title": "New Zealand",
        "parents": [
            "restaurants"
        ],
        "alias": "newzealand"
    },
    {
        "country_whitelist": [
            "FR"
        ],
        "title": "Nicoise",
        "parents": [
            "french"
        ],
        "alias": "nicois"
    },
    {
        "country_whitelist": [
            "NO",
            "TR",
            "DK",
            "SE",
            "PL"
        ],
        "title": "Night Food",
        "parents": [
            "restaurants"
        ],
        "alias": "nightfood"
    },
    {
        "alias": "nightlife",
        "parents": [],
        "title": "Nightlife"
    },
    {
        "alias": "nonprofit",
        "parents": [
            "localservices"
        ],
        "title": "Community Service/Non-Profit"
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Norcinerie",
        "parents": [
            "restaurants"
        ],
        "alias": "norcinerie"
    },
    {
        "country_whitelist": [
            "BR"
        ],
        "title": "Northeastern Brazilian",
        "parents": [
            "brazilian"
        ],
        "alias": "northeasternbrazilian"
    },
    {
        "country_whitelist": [
            "BR"
        ],
        "title": "Northern Brazilian",
        "parents": [
            "brazilian"
        ],
        "alias": "northernbrazilian"
    },
    {
        "country_whitelist": [
            "DE"
        ],
        "title": "Northern German",
        "parents": [
            "german"
        ],
        "alias": "northerngerman"
    },
    {
        "country_whitelist": [
            "MX"
        ],
        "title": "Northern Mexican",
        "parents": [
            "mexican"
        ],
        "alias": "northernmexican"
    },
    {
        "country_whitelist": [
            "FR",
            "NO"
        ],
        "title": "Traditional Norwegian",
        "parents": [
            "restaurants"
        ],
        "alias": "norwegian"
    },
    {
        "alias": "notaries",
        "title": "Notaries",
        "parents": [
            "localservices"
        ],
        "country_blacklist": [
            "NO"
        ]
    },
    {
        "country_whitelist": [
            "DK",
            "PT",
            "NO",
            "DE",
            "CZ",
            "BR",
            "FI",
            "SE"
        ],
        "title": "Nudist",
        "parents": [
            "active"
        ],
        "alias": "nudist"
    },
    {
        "alias": "nursepractitioner",
        "parents": [
            "health"
        ],
        "title": "Nurse Practitioner"
    },
    {
        "alias": "nursingschools",
        "parents": [
            "specialtyschools"
        ],
        "title": "Nursing Schools"
    },
    {
        "alias": "nutritionists",
        "parents": [
            "health"
        ],
        "title": "Nutritionists"
    },
    {
        "country_whitelist": [
            "AU",
            "MY"
        ],
        "title": "Nyonya",
        "parents": [
            "malaysian"
        ],
        "alias": "nyonya"
    },
    {
        "country_whitelist": [
            "MX"
        ],
        "title": "Oaxacan",
        "parents": [
            "mexican"
        ],
        "alias": "oaxacan"
    },
    {
        "alias": "obgyn",
        "parents": [
            "physicians"
        ],
        "title": "Obstetricians & Gynecologists"
    },
    {
        "alias": "observatories",
        "parents": [
            "arts"
        ],
        "title": "Observatories"
    },
    {
        "country_whitelist": [
            "AU",
            "GB",
            "PT",
            "CA",
            "DE",
            "IE",
            "US"
        ],
        "title": "Occupational Therapy",
        "parents": [
            "health"
        ],
        "alias": "occupationaltherapy"
    },
    {
        "country_whitelist": [
            "TW",
            "JP"
        ],
        "title": "Oden",
        "parents": [
            "japanese"
        ],
        "alias": "oden"
    },
    {
        "alias": "officecleaning",
        "parents": [
            "professional"
        ],
        "title": "Office Cleaning"
    },
    {
        "alias": "officeequipment",
        "parents": [
            "shopping"
        ],
        "title": "Office Equipment"
    },
    {
        "alias": "officiants",
        "parents": [
            "eventservices"
        ],
        "title": "Officiants"
    },
    {
        "alias": "oilchange",
        "title": "Oil Change Stations",
        "parents": [
            "auto"
        ],
        "country_blacklist": [
            "CZ",
            "CH",
            "AT",
            "BR",
            "NO",
            "DE",
            "SE"
        ]
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Okinawan",
        "parents": [
            "japanese"
        ],
        "alias": "okinawan"
    },
    {
        "country_whitelist": [
            "TW",
            "JP"
        ],
        "title": "Okonomiyaki",
        "parents": [
            "japanese"
        ],
        "alias": "okonomiyaki"
    },
    {
        "alias": "oncologist",
        "parents": [
            "physicians"
        ],
        "title": "Oncologist"
    },
    {
        "country_whitelist": [
            "TW",
            "JP"
        ],
        "title": "Onigiri",
        "parents": [
            "japanese"
        ],
        "alias": "onigiri"
    },
    {
        "country_whitelist": [
            "TR",
            "DK",
            "SE",
            "NO"
        ],
        "title": "Open Sandwiches",
        "parents": [
            "restaurants"
        ],
        "alias": "opensandwiches"
    },
    {
        "alias": "opera",
        "parents": [
            "arts"
        ],
        "title": "Opera & Ballet"
    },
    {
        "alias": "opthamalogists",
        "parents": [
            "physicians"
        ],
        "title": "Ophthalmologists"
    },
    {
        "alias": "opticians",
        "parents": [
            "shopping"
        ],
        "title": "Eyewear & Opticians"
    },
    {
        "alias": "optometrists",
        "parents": [
            "health"
        ],
        "title": "Optometrists"
    },
    {
        "alias": "oralsurgeons",
        "parents": [
            "dentists"
        ],
        "title": "Oral Surgeons"
    },
    {
        "alias": "organic_stores",
        "parents": [
            "food"
        ],
        "title": "Organic Stores"
    },
    {
        "country_whitelist": [
            "FR",
            "CH",
            "DE",
            "AT",
            "PT"
        ],
        "title": "Oriental",
        "parents": [
            "restaurants"
        ],
        "alias": "oriental"
    },
    {
        "alias": "orthodontists",
        "parents": [
            "dentists"
        ],
        "title": "Orthodontists"
    },
    {
        "alias": "orthopedists",
        "parents": [
            "physicians"
        ],
        "title": "Orthopedists"
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "NO",
            "IE",
            "IT",
            "US",
            "CZ",
            "NZ",
            "AU",
            "GB",
            "BR",
            "FI",
            "SG",
            "ES"
        ],
        "title": "Orthotics",
        "parents": [
            "health"
        ],
        "alias": "orthotics"
    },
    {
        "alias": "osteopathicphysicians",
        "parents": [
            "physicians"
        ],
        "title": "Osteopathic Physicians"
    },
    {
        "country_whitelist": [
            "AU"
        ],
        "title": "Osteopaths",
        "parents": [
            "medcenters"
        ],
        "alias": "osteopaths"
    },
    {
        "alias": "othersalons",
        "parents": [
            "beautysvc"
        ],
        "title": "Nail Salons"
    },
    {
        "alias": "outdoorfurniture",
        "parents": [
            "homeandgarden"
        ],
        "title": "Outdoor Furniture Stores"
    },
    {
        "alias": "outdoorgear",
        "parents": [
            "sportgoods"
        ],
        "title": "Outdoor Gear"
    },
    {
        "alias": "outlet_stores",
        "parents": [
            "shopping"
        ],
        "title": "Outlet Stores"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Oxygen Bars",
        "parents": [
            "health"
        ],
        "alias": "oxygenbars"
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Oyakodon",
        "parents": [
            "donburi"
        ],
        "alias": "oyakodon"
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Pachinko",
        "parents": [
            "arts"
        ],
        "alias": "pachinko"
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "PT",
            "NO",
            "IE",
            "US",
            "NZ",
            "AU",
            "FI",
            "SG",
            "ES"
        ],
        "title": "Paddleboarding",
        "parents": [
            "active"
        ],
        "alias": "paddleboarding"
    },
    {
        "country_whitelist": [
            "HK",
            "US"
        ],
        "title": "Paint & Sip",
        "parents": [
            "arts"
        ],
        "alias": "paintandsip"
    },
    {
        "alias": "paintball",
        "title": "Paintball",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "SG"
        ]
    },
    {
        "alias": "painters",
        "parents": [
            "homeservices"
        ],
        "title": "Painters"
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "CL",
            "NO",
            "JP",
            "IT",
            "US",
            "CZ",
            "NZ",
            "AR",
            "AU",
            "ES",
            "BR",
            "MX",
            "SE"
        ],
        "title": "Paint Stores",
        "parents": [
            "homeandgarden"
        ],
        "alias": "paintstores"
    },
    {
        "alias": "pakistani",
        "parents": [
            "restaurants"
        ],
        "title": "Pakistani"
    },
    {
        "country_whitelist": [
            "DE"
        ],
        "title": "Palatine",
        "parents": [
            "german"
        ],
        "alias": "palatine"
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Panzerotti",
        "parents": [
            "food"
        ],
        "alias": "panzerotti"
    },
    {
        "alias": "parentingclasses",
        "parents": [
            "specialtyschools"
        ],
        "title": "Parenting Classes"
    },
    {
        "alias": "parking",
        "parents": [
            "auto"
        ],
        "title": "Parking"
    },
    {
        "alias": "parks",
        "parents": [
            "active"
        ],
        "title": "Parks"
    },
    {
        "country_whitelist": [
            "AU"
        ],
        "title": "Parma",
        "parents": [
            "restaurants"
        ],
        "alias": "parma"
    },
    {
        "country_whitelist": [
            "BE",
            "NL",
            "ES",
            "DE",
            "IE",
            "US"
        ],
        "title": "Party Bike Rentals",
        "parents": [
            "eventservices"
        ],
        "alias": "partybikerentals"
    },
    {
        "alias": "partybusrentals",
        "title": "Party Bus Rentals",
        "parents": [
            "eventservices"
        ],
        "country_blacklist": [
            "FR",
            "PT",
            "CZ",
            "IE",
            "TW",
            "CA",
            "JP",
            "IT",
            "HK",
            "ES",
            "PH",
            "MY",
            "MX",
            "PL"
        ]
    },
    {
        "alias": "partycharacters",
        "parents": [
            "eventservices"
        ],
        "title": "Party Characters"
    },
    {
        "alias": "partyequipmentrentals",
        "title": "Party Equipment Rentals",
        "parents": [
            "eventservices"
        ],
        "country_blacklist": [
            "CH",
            "NL",
            "CZ",
            "TW",
            "CA",
            "DE",
            "JP",
            "HK",
            "NZ",
            "AT",
            "FI",
            "PH",
            "MY",
            "PL"
        ]
    },
    {
        "alias": "partysupplies",
        "parents": [
            "eventservices"
        ],
        "title": "Party Supplies"
    },
    {
        "country_whitelist": [
            "CZ",
            "AR",
            "IT",
            "US",
            "CL"
        ],
        "title": "Pasta Shops",
        "parents": [
            "gourmet"
        ],
        "alias": "pastashops"
    },
    {
        "alias": "patentlaw",
        "parents": [
            "professional"
        ],
        "title": "Patent Law"
    },
    {
        "country_whitelist": [
            "BR",
            "IT",
            "US"
        ],
        "title": "Patio Coverings",
        "parents": [
            "homeservices"
        ],
        "alias": "patiocoverings"
    },
    {
        "alias": "pawn",
        "title": "Pawn Shops",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "TR",
            "BR"
        ]
    },
    {
        "alias": "paydayloans",
        "title": "Check Cashing/Pay-day Loans",
        "parents": [
            "financialservices"
        ],
        "country_blacklist": [
            "CH",
            "DK",
            "DE",
            "IT",
            "CZ",
            "NZ",
            "AT",
            "ES"
        ]
    },
    {
        "country_whitelist": [
            "BE",
            "NL",
            "TR",
            "US",
            "CZ",
            "NZ",
            "AU",
            "SG"
        ],
        "title": "Payroll Services",
        "parents": [
            "professional"
        ],
        "alias": "payroll"
    },
    {
        "alias": "pediatric_dentists",
        "parents": [
            "dentists"
        ],
        "title": "Pediatric Dentists"
    },
    {
        "alias": "pediatricians",
        "parents": [
            "physicians"
        ],
        "title": "Pediatricians"
    },
    {
        "country_whitelist": [
            "DK",
            "US",
            "SE"
        ],
        "title": "Pedicabs",
        "parents": [
            "transport"
        ],
        "alias": "pedicabs"
    },
    {
        "country_whitelist": [
            "HK",
            "FR",
            "TW",
            "JP",
            "SG",
            "MY",
            "IT"
        ],
        "title": "Pekinese",
        "parents": [
            "chinese"
        ],
        "alias": "pekinese"
    },
    {
        "country_whitelist": [
            "CZ",
            "AT",
            "BR",
            "DE",
            "JP",
            "ES"
        ],
        "title": "Pensions",
        "parents": [
            "hotels"
        ],
        "alias": "pensions"
    },
    {
        "alias": "perfume",
        "title": "Perfume",
        "parents": [
            "shopping",
            "beautysvc"
        ],
        "country_blacklist": [
            "NL",
            "CA",
            "TR",
            "US",
            "BR",
            "FI",
            "SG",
            "PL"
        ]
    },
    {
        "alias": "periodontists",
        "parents": [
            "dentists"
        ],
        "title": "Periodontists"
    },
    {
        "alias": "permanentmakeup",
        "title": "Permanent Makeup",
        "parents": [
            "beautysvc"
        ],
        "country_blacklist": [
            "DK",
            "NO",
            "IE",
            "CA",
            "NZ",
            "PL",
            "BR",
            "FI",
            "SG",
            "SE"
        ]
    },
    {
        "alias": "persian",
        "parents": [
            "restaurants"
        ],
        "title": "Persian/Iranian"
    },
    {
        "alias": "personal_injury",
        "title": "Personal Injury Law",
        "parents": [
            "lawyers"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "personal_shopping",
        "title": "Personal Shopping",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "CZ",
            "BR"
        ]
    },
    {
        "country_whitelist": [
            "CZ",
            "PT",
            "US"
        ],
        "title": "Personal Assistants",
        "parents": [
            "professional"
        ],
        "alias": "personalassistants"
    },
    {
        "country_whitelist": [
            "FR",
            "AU",
            "BR",
            "US"
        ],
        "title": "Personal Care Services",
        "parents": [
            "health"
        ],
        "alias": "personalcare"
    },
    {
        "alias": "personalchefs",
        "parents": [
            "eventservices"
        ],
        "title": "Personal Chefs"
    },
    {
        "alias": "peruvian",
        "title": "Peruvian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "SG",
            "TR",
            "PT"
        ]
    },
    {
        "alias": "pest_control",
        "parents": [
            "localservices"
        ],
        "title": "Pest Control"
    },
    {
        "alias": "pet_sitting",
        "parents": [
            "petservices"
        ],
        "title": "Pet Boarding/Pet Sitting"
    },
    {
        "alias": "pet_training",
        "parents": [
            "petservices"
        ],
        "title": "Pet Training"
    },
    {
        "alias": "petadoption",
        "title": "Pet Adoption",
        "parents": [
            "pets"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "JP",
            "MX",
            "CL"
        ]
    },
    {
        "country_whitelist": [
            "ES",
            "BE",
            "FR",
            "CH",
            "NL",
            "DK",
            "NO",
            "DE",
            "JP",
            "IT",
            "US",
            "AT",
            "SE",
            "PL"
        ],
        "title": "Pet Breeders",
        "parents": [
            "petservices"
        ],
        "alias": "petbreeders"
    },
    {
        "alias": "pets",
        "parents": [],
        "title": "Pets"
    },
    {
        "alias": "petservices",
        "parents": [
            "pets"
        ],
        "title": "Pet Services"
    },
    {
        "alias": "petstore",
        "parents": [
            "pets"
        ],
        "title": "Pet Stores"
    },
    {
        "country_whitelist": [
            "BR"
        ],
        "title": "PF/Comercial",
        "parents": [
            "restaurants"
        ],
        "alias": "pfcomercial"
    },
    {
        "alias": "pharmacy",
        "title": "Pharmacy",
        "parents": [
            "health"
        ],
        "country_blacklist": [
            "FI",
            "US"
        ]
    },
    {
        "alias": "photoboothrentals",
        "title": "Photo Booth Rentals",
        "parents": [
            "eventservices"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "CL",
            "FI",
            "JP",
            "MX"
        ]
    },
    {
        "alias": "photographers",
        "parents": [
            "eventservices"
        ],
        "title": "Photographers"
    },
    {
        "alias": "photographystores",
        "parents": [
            "shopping"
        ],
        "title": "Photography Stores & Services"
    },
    {
        "alias": "physicaltherapy",
        "parents": [
            "health"
        ],
        "title": "Physical Therapy"
    },
    {
        "alias": "physicians",
        "parents": [
            "health"
        ],
        "title": "Doctors"
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Piadina",
        "parents": [
            "food"
        ],
        "alias": "piadina"
    },
    {
        "alias": "pianobars",
        "title": "Piano Bars",
        "parents": [
            "nightlife"
        ],
        "country_blacklist": [
            "ES",
            "CH",
            "IE",
            "CZ",
            "NZ",
            "AU",
            "AT",
            "BR",
            "FI",
            "SG",
            "PL"
        ]
    },
    {
        "alias": "pianoservices",
        "parents": [
            "musicinstrumentservices"
        ],
        "title": "Piano Services"
    },
    {
        "alias": "pianostores",
        "parents": [
            "musicinstrumentservices"
        ],
        "title": "Piano Stores"
    },
    {
        "country_whitelist": [
            "CH",
            "JP",
            "AT",
            "US",
            "DE"
        ],
        "title": "Pick Your Own Farms",
        "parents": [
            "farms"
        ],
        "alias": "pickyourown"
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Piemonte",
        "parents": [
            "italian"
        ],
        "alias": "piemonte"
    },
    {
        "alias": "piercing",
        "parents": [
            "beautysvc"
        ],
        "title": "Piercing"
    },
    {
        "country_whitelist": [
            "PL"
        ],
        "title": "Pierogis",
        "parents": [
            "polish"
        ],
        "alias": "pierogis"
    },
    {
        "alias": "pilates",
        "parents": [
            "fitness"
        ],
        "title": "Pilates"
    },
    {
        "country_whitelist": [
            "TR"
        ],
        "title": "Pita",
        "parents": [
            "restaurants"
        ],
        "alias": "pita"
    },
    {
        "alias": "pizza",
        "parents": [
            "restaurants"
        ],
        "title": "Pizza"
    },
    {
        "alias": "placentaencapsulation",
        "title": "Placenta Encapsulations",
        "parents": [
            "health"
        ],
        "country_blacklist": [
            "CZ",
            "FR",
            "CH",
            "AT",
            "DE",
            "TR",
            "PL"
        ]
    },
    {
        "alias": "planetarium",
        "parents": [
            "arts"
        ],
        "title": "Planetarium"
    },
    {
        "alias": "playgrounds",
        "parents": [
            "active"
        ],
        "title": "Playgrounds"
    },
    {
        "alias": "plumbing",
        "parents": [
            "homeservices"
        ],
        "title": "Plumbing"
    },
    {
        "alias": "plus_size_fashion",
        "title": "Plus Size Fashion",
        "parents": [
            "fashion"
        ],
        "country_blacklist": [
            "CH",
            "CL",
            "IE",
            "JP",
            "CA",
            "TR",
            "HK",
            "AR",
            "AT",
            "SG",
            "MX",
            "PL",
            "GB"
        ]
    },
    {
        "alias": "podiatrists",
        "parents": [
            "physicians"
        ],
        "title": "Podiatrists"
    },
    {
        "alias": "poledancingclasses",
        "title": "Pole Dancing Classes",
        "parents": [
            "specialtyschools"
        ],
        "country_blacklist": [
            "ES",
            "BE",
            "CH",
            "PT",
            "CL",
            "CA",
            "TR",
            "AR",
            "AT",
            "IE",
            "MX",
            "PL",
            "GB"
        ]
    },
    {
        "alias": "policedepartments",
        "parents": [
            "publicservicesgovt"
        ],
        "title": "Police Departments"
    },
    {
        "alias": "polish",
        "title": "Polish",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "FI",
            "SG",
            "DK",
            "ES",
            "PT"
        ]
    },
    {
        "alias": "poolbilliards",
        "title": "Pool & Billiards",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "ES",
            "CH",
            "NO",
            "DE",
            "CZ",
            "AT",
            "SE",
            "FI",
            "PL"
        ]
    },
    {
        "alias": "poolcleaners",
        "title": "Pool Cleaners",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "DK",
            "NO"
        ]
    },
    {
        "alias": "poolhalls",
        "parents": [
            "nightlife"
        ],
        "title": "Pool Halls"
    },
    {
        "alias": "poolservice",
        "parents": [
            "homeservices"
        ],
        "title": "Pool & Hot Tub Service"
    },
    {
        "country_whitelist": [
            "JP",
            "GB",
            "US"
        ],
        "title": "Popcorn Shops",
        "parents": [
            "gourmet"
        ],
        "alias": "popcorn"
    },
    {
        "alias": "popupshops",
        "title": "Pop-up Shops",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "PT"
        ]
    },
    {
        "alias": "portuguese",
        "title": "Portuguese",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "FI"
        ]
    },
    {
        "alias": "postoffices",
        "parents": [
            "publicservicesgovt"
        ],
        "title": "Post Offices"
    },
    {
        "country_whitelist": [
            "AU"
        ],
        "title": "Potatoes",
        "parents": [
            "restaurants"
        ],
        "alias": "potatoes"
    },
    {
        "country_whitelist": [
            "CA",
            "US"
        ],
        "title": "Poutineries",
        "parents": [
            "restaurants"
        ],
        "alias": "poutineries"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Powder Coating",
        "parents": [
            "localservices"
        ],
        "alias": "powdercoating"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "DK",
            "NO",
            "IT",
            "US",
            "CZ",
            "NZ",
            "AU",
            "ES",
            "BR",
            "SE"
        ],
        "title": "Prenatal/Perinatal Care",
        "parents": [
            "health"
        ],
        "alias": "prenatal"
    },
    {
        "alias": "preschools",
        "title": "Preschools",
        "parents": [
            "education"
        ],
        "country_blacklist": [
            "DK"
        ]
    },
    {
        "alias": "pressurewashers",
        "title": "Pressure Washers",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "JP",
            "MX",
            "CL"
        ]
    },
    {
        "country_whitelist": [
            "DE",
            "PT",
            "US"
        ],
        "title": "Pretzels",
        "parents": [
            "food"
        ],
        "alias": "pretzels"
    },
    {
        "alias": "printmedia",
        "parents": [
            "massmedia"
        ],
        "title": "Print Media"
    },
    {
        "alias": "privateinvestigation",
        "parents": [
            "professional"
        ],
        "title": "Private Investigation"
    },
    {
        "country_whitelist": [
            "PT",
            "NO",
            "CZ",
            "NZ",
            "AU",
            "BR",
            "MX",
            "SE"
        ],
        "title": "Private Schools",
        "parents": [
            "education"
        ],
        "alias": "privateschools"
    },
    {
        "alias": "privatetutors",
        "parents": [
            "education"
        ],
        "title": "Private Tutors"
    },
    {
        "alias": "proctologist",
        "parents": [
            "physicians"
        ],
        "title": "Proctologists"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "US"
        ],
        "title": "Product Design",
        "parents": [
            "professional"
        ],
        "alias": "productdesign"
    },
    {
        "alias": "professional",
        "parents": [],
        "title": "Professional Services"
    },
    {
        "alias": "propane",
        "title": "Propane",
        "parents": [
            "localservices"
        ],
        "country_blacklist": [
            "CZ",
            "NZ",
            "AR",
            "MX"
        ]
    },
    {
        "alias": "propertymgmt",
        "parents": [
            "realestate"
        ],
        "title": "Property Management"
    },
    {
        "country_whitelist": [
            "ES",
            "AU",
            "IT",
            "US"
        ],
        "title": "Prosthetics",
        "parents": [
            "health"
        ],
        "alias": "prosthetics"
    },
    {
        "country_whitelist": [
            "ES",
            "IT",
            "US"
        ],
        "title": "Prosthodontists",
        "parents": [
            "health"
        ],
        "alias": "prosthodontists"
    },
    {
        "country_whitelist": [
            "FR"
        ],
        "title": "Provencal",
        "parents": [
            "french"
        ],
        "alias": "provencal"
    },
    {
        "alias": "psychiatrists",
        "parents": [
            "physicians"
        ],
        "title": "Psychiatrists"
    },
    {
        "alias": "psychic_astrology",
        "parents": [
            "arts"
        ],
        "title": "Psychics & Astrologers"
    },
    {
        "country_whitelist": [
            "CZ",
            "FR"
        ],
        "title": "Psychoanalysts",
        "parents": [
            "c_and_mh"
        ],
        "alias": "psychoanalysts"
    },
    {
        "alias": "psychologists",
        "title": "Psychologists",
        "parents": [
            "c_and_mh"
        ],
        "country_blacklist": [
            "PT",
            "CL",
            "IE",
            "CA",
            "JP",
            "HK",
            "AR",
            "GB",
            "SG",
            "MX",
            "PL"
        ]
    },
    {
        "country_whitelist": [
            "FR",
            "CH",
            "DK",
            "NO",
            "DE",
            "CZ",
            "AT",
            "BR",
            "FI",
            "SG"
        ],
        "title": "Psychotherapists",
        "parents": [
            "c_and_mh"
        ],
        "alias": "psychotherapists"
    },
    {
        "country_whitelist": [
            "AU"
        ],
        "title": "Pub Food",
        "parents": [
            "restaurants"
        ],
        "alias": "pubfood"
    },
    {
        "alias": "publicplazas",
        "title": "Public Plazas",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "BE",
            "NL",
            "CA",
            "US",
            "NZ",
            "AU",
            "GB",
            "BR",
            "IE"
        ]
    },
    {
        "alias": "publicrelations",
        "parents": [
            "professional"
        ],
        "title": "Public Relations"
    },
    {
        "alias": "publicservicesgovt",
        "parents": [],
        "title": "Public Services & Government"
    },
    {
        "alias": "publictransport",
        "parents": [
            "transport"
        ],
        "title": "Public Transportation"
    },
    {
        "alias": "pubs",
        "parents": [
            "bars"
        ],
        "title": "Pubs"
    },
    {
        "country_whitelist": [
            "MX"
        ],
        "title": "Pueblan",
        "parents": [
            "mexican"
        ],
        "alias": "pueblan"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Puerto Rican",
        "parents": [
            "caribbean"
        ],
        "alias": "puertorican"
    },
    {
        "alias": "pulmonologist",
        "parents": [
            "physicians"
        ],
        "title": "Pulmonologist"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Pumpkin Patches",
        "parents": [
            "homeandgarden"
        ],
        "alias": "pumpkinpatches"
    },
    {
        "alias": "qigong",
        "parents": [
            "fitness"
        ],
        "title": "Qi Gong"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "DK",
            "NO",
            "US",
            "NZ",
            "AU",
            "BR",
            "SG",
            "SE"
        ],
        "title": "Races & Competitions",
        "parents": [
            "active"
        ],
        "alias": "races"
    },
    {
        "alias": "racetracks",
        "title": "Race Tracks",
        "parents": [
            "arts"
        ],
        "country_blacklist": [
            "CH",
            "AT",
            "BR",
            "IE",
            "CA",
            "DE",
            "SG"
        ]
    },
    {
        "alias": "radiologists",
        "parents": [
            "physicians"
        ],
        "title": "Radiologists"
    },
    {
        "alias": "radiostations",
        "parents": [
            "massmedia"
        ],
        "title": "Radio Stations"
    },
    {
        "alias": "rafting",
        "parents": [
            "active"
        ],
        "title": "Rafting/Kayaking"
    },
    {
        "alias": "ramen",
        "parents": [
            "japanese"
        ],
        "title": "Ramen"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Ranches",
        "parents": [
            "farms"
        ],
        "alias": "ranches"
    },
    {
        "alias": "raw_food",
        "parents": [
            "restaurants"
        ],
        "title": "Live/Raw Food"
    },
    {
        "alias": "realestate",
        "parents": [
            "homeservices"
        ],
        "title": "Real Estate"
    },
    {
        "alias": "realestateagents",
        "parents": [
            "realestate"
        ],
        "title": "Real Estate Agents"
    },
    {
        "alias": "realestatelawyers",
        "parents": [
            "lawyers"
        ],
        "title": "Real Estate Law"
    },
    {
        "alias": "realestatesvcs",
        "title": "Real Estate Services",
        "parents": [
            "realestate"
        ],
        "country_blacklist": [
            "CZ",
            "CH",
            "DE",
            "AT"
        ]
    },
    {
        "country_whitelist": [
            "CH",
            "DE",
            "AT",
            "PT"
        ],
        "title": "Record Labels",
        "parents": [
            "localservices"
        ],
        "alias": "record_labels"
    },
    {
        "alias": "recording_studios",
        "parents": [
            "localservices"
        ],
        "title": "Recording & Rehearsal Studios"
    },
    {
        "alias": "recreation",
        "parents": [
            "active"
        ],
        "title": "Recreation Centers"
    },
    {
        "alias": "recyclingcenter",
        "parents": [
            "localservices"
        ],
        "title": "Recycling Center"
    },
    {
        "alias": "refinishing",
        "parents": [
            "homeservices"
        ],
        "title": "Refinishing Services"
    },
    {
        "alias": "reflexology",
        "title": "Reflexology",
        "parents": [
            "health"
        ],
        "country_blacklist": [
            "DK",
            "SE",
            "NO",
            "FI",
            "TR",
            "ES",
            "PL"
        ]
    },
    {
        "country_whitelist": [
            "BR",
            "IT",
            "US",
            "PT"
        ],
        "title": "Registration Services",
        "parents": [
            "auto"
        ],
        "alias": "registrationservices"
    },
    {
        "country_whitelist": [
            "CH",
            "DK",
            "PT",
            "DE",
            "IT",
            "CZ",
            "AT",
            "FI"
        ],
        "title": "Registry Office",
        "parents": [
            "publicservicesgovt"
        ],
        "alias": "registry_office"
    },
    {
        "country_whitelist": [
            "PT",
            "DE",
            "JP",
            "IT",
            "US",
            "CZ",
            "ES",
            "FI",
            "SE"
        ],
        "title": "Rehabilitation Center",
        "parents": [
            "health"
        ],
        "alias": "rehabilitation_center"
    },
    {
        "alias": "reiki",
        "title": "Reiki",
        "parents": [
            "health"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "JP",
            "MX",
            "CL"
        ]
    },
    {
        "alias": "religiousorgs",
        "parents": [],
        "title": "Religious Organizations"
    },
    {
        "country_whitelist": [
            "CZ",
            "NZ",
            "AU",
            "BR",
            "PT",
            "MX",
            "US"
        ],
        "title": "Religious Schools",
        "parents": [
            "education"
        ],
        "alias": "religiousschools"
    },
    {
        "country_whitelist": [
            "AU",
            "JP",
            "US"
        ],
        "title": "Furniture Rental",
        "parents": [
            "localservices"
        ],
        "alias": "rentfurniture"
    },
    {
        "country_whitelist": [
            "BE",
            "NL",
            "DK",
            "NO",
            "DE",
            "JP",
            "IT",
            "US",
            "ES",
            "SE"
        ],
        "title": "Reptile Shops",
        "parents": [
            "petstore"
        ],
        "alias": "reptileshops"
    },
    {
        "country_whitelist": [
            "SG",
            "IT",
            "ES"
        ],
        "title": "Residences",
        "parents": [
            "hotels"
        ],
        "alias": "residences"
    },
    {
        "alias": "resorts",
        "parents": [
            "hotelstravel"
        ],
        "title": "Resorts"
    },
    {
        "alias": "restaurants",
        "parents": [],
        "title": "Restaurants"
    },
    {
        "alias": "reststops",
        "title": "Rest Stops",
        "parents": [
            "hotels"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "retirement_homes",
        "parents": [
            "health"
        ],
        "title": "Retirement Homes"
    },
    {
        "alias": "reupholstery",
        "parents": [
            "localservices"
        ],
        "title": "Furniture Reupholstery"
    },
    {
        "country_whitelist": [
            "CZ",
            "FR",
            "IT",
            "ES",
            "US"
        ],
        "title": "Rheumatologists",
        "parents": [
            "physicians"
        ],
        "alias": "rhematologists"
    },
    {
        "country_whitelist": [
            "DE"
        ],
        "title": "Rhinelandian",
        "parents": [
            "german"
        ],
        "alias": "rhinelandian"
    },
    {
        "country_whitelist": [
            "PT"
        ],
        "title": "Ribatejo",
        "parents": [
            "portuguese"
        ],
        "alias": "ribatejo"
    },
    {
        "country_whitelist": [
            "JP",
            "TR"
        ],
        "title": "Rice",
        "parents": [
            "restaurants"
        ],
        "alias": "riceshop"
    },
    {
        "country_whitelist": [
            "BE",
            "NL",
            "CL",
            "CA",
            "JP",
            "IT",
            "US",
            "AR",
            "AU",
            "MX",
            "ES"
        ],
        "title": "Roadside Assistance",
        "parents": [
            "auto"
        ],
        "alias": "roadsideassist"
    },
    {
        "country_whitelist": [
            "HK",
            "JP",
            "TW"
        ],
        "title": "Robatayaki",
        "parents": [
            "japanese"
        ],
        "alias": "robatayaki"
    },
    {
        "country_whitelist": [
            "PT",
            "NO",
            "JP",
            "US",
            "CZ",
            "NZ",
            "AR",
            "AU",
            "ES",
            "FI",
            "SE"
        ],
        "title": "Rock Climbing",
        "parents": [
            "active"
        ],
        "alias": "rock_climbing"
    },
    {
        "country_whitelist": [
            "AR",
            "BR",
            "PT"
        ],
        "title": "Rodizios",
        "parents": [
            "brazilian"
        ],
        "alias": "rodizios"
    },
    {
        "country_whitelist": [
            "CA",
            "PT",
            "US"
        ],
        "title": "Rolfing",
        "parents": [
            "beautysvc"
        ],
        "alias": "rolfing"
    },
    {
        "country_whitelist": [
            "JP",
            "IT"
        ],
        "title": "Roman",
        "parents": [
            "italian"
        ],
        "alias": "roman"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "CZ"
        ],
        "title": "Romanian",
        "parents": [
            "restaurants"
        ],
        "alias": "romanian"
    },
    {
        "alias": "roofing",
        "parents": [
            "homeservices"
        ],
        "title": "Roofing"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Roof Inspectors",
        "parents": [
            "homeservices"
        ],
        "alias": "roofinspectors"
    },
    {
        "country_whitelist": [
            "FR",
            "CL",
            "IT",
            "NZ",
            "AR",
            "AU",
            "BR",
            "MX",
            "ES"
        ],
        "title": "Rotisserie Chicken",
        "parents": [
            "restaurants"
        ],
        "alias": "rotisserie_chicken"
    },
    {
        "alias": "rugs",
        "title": "Rugs",
        "parents": [
            "homeandgarden"
        ],
        "country_blacklist": [
            "CH",
            "NL",
            "CL",
            "CA",
            "DE",
            "JP",
            "CZ",
            "AR",
            "AT",
            "HK",
            "IE",
            "MX",
            "PL"
        ]
    },
    {
        "country_whitelist": [
            "CH",
            "DE",
            "AT"
        ],
        "title": "Rumanian",
        "parents": [
            "restaurants"
        ],
        "alias": "rumanian"
    },
    {
        "alias": "russian",
        "parents": [
            "restaurants"
        ],
        "title": "Russian"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "DK",
            "NO",
            "CA",
            "IT",
            "US",
            "ES",
            "BR",
            "FI",
            "SE"
        ],
        "title": "RV Dealers",
        "parents": [
            "auto"
        ],
        "alias": "rv_dealers"
    },
    {
        "country_whitelist": [
            "ES",
            "FR",
            "NO",
            "DE",
            "TR",
            "IT",
            "US",
            "CZ",
            "SE",
            "FI",
            "PL"
        ],
        "title": "RV Parks",
        "parents": [
            "hotelstravel"
        ],
        "alias": "rvparks"
    },
    {
        "alias": "rvrental",
        "title": "RV Rental",
        "parents": [
            "hotelstravel"
        ],
        "country_blacklist": [
            "SG",
            "DK",
            "BR"
        ]
    },
    {
        "country_whitelist": [
            "CA",
            "US"
        ],
        "title": "RV Repair",
        "parents": [
            "auto"
        ],
        "alias": "rvrepair"
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Ryokan",
        "parents": [
            "hotels"
        ],
        "alias": "ryokan"
    },
    {
        "alias": "sailing",
        "title": "Sailing",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "TR",
            "PL",
            "US"
        ]
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Sake Bars",
        "parents": [
            "bars"
        ],
        "alias": "sakebars"
    },
    {
        "alias": "salad",
        "parents": [
            "restaurants"
        ],
        "title": "Salad"
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Salumerie",
        "parents": [
            "food"
        ],
        "alias": "salumerie"
    },
    {
        "country_whitelist": [
            "CA",
            "US"
        ],
        "title": "Salvadoran",
        "parents": [
            "latin"
        ],
        "alias": "salvadoran"
    },
    {
        "country_whitelist": [
            "FI",
            "IT",
            "BR",
            "SE"
        ],
        "title": "Samba Schools",
        "parents": [
            "specialtyschools"
        ],
        "alias": "sambaschools"
    },
    {
        "alias": "sandwiches",
        "parents": [
            "restaurants"
        ],
        "title": "Sandwiches"
    },
    {
        "country_whitelist": [
            "IT",
            "US"
        ],
        "title": "Sardinian",
        "parents": [
            "italian"
        ],
        "alias": "sardinian"
    },
    {
        "alias": "saunas",
        "title": "Saunas",
        "parents": [
            "health"
        ],
        "country_blacklist": [
            "NL",
            "MY",
            "CA",
            "NZ",
            "AU",
            "ES",
            "BR",
            "PH",
            "SG",
            "PL"
        ]
    },
    {
        "alias": "scandinavian",
        "title": "Scandinavian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "ES",
            "PT"
        ]
    },
    {
        "country_whitelist": [
            "FI",
            "DK",
            "SE",
            "NO"
        ],
        "title": "Scandinavian Design",
        "parents": [
            "shopping"
        ],
        "alias": "scandinaviandesign"
    },
    {
        "country_whitelist": [
            "CH",
            "AT",
            "CA",
            "DE",
            "IE",
            "US",
            "GB"
        ],
        "title": "Scottish",
        "parents": [
            "restaurants"
        ],
        "alias": "scottish"
    },
    {
        "country_whitelist": [
            "BE",
            "CH",
            "NL",
            "DK",
            "PT",
            "NO",
            "DE",
            "JP",
            "US",
            "AU",
            "AT",
            "BR",
            "SE"
        ],
        "title": "Screen Printing/T-Shirt Printing",
        "parents": [
            "localservices"
        ],
        "alias": "screen_printing_tshirt_printing"
    },
    {
        "alias": "screenprinting",
        "parents": [
            "localservices"
        ],
        "title": "Screen Printing"
    },
    {
        "alias": "scuba",
        "parents": [
            "diving"
        ],
        "title": "Scuba Diving"
    },
    {
        "alias": "seafood",
        "parents": [
            "restaurants"
        ],
        "title": "Seafood"
    },
    {
        "alias": "seafoodmarkets",
        "parents": [
            "gourmet"
        ],
        "title": "Seafood Markets"
    },
    {
        "alias": "seasonaldecorservices",
        "title": "Holiday Decorating Services",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "BE",
            "FR",
            "CH",
            "NL",
            "DK",
            "NO",
            "JP",
            "DE",
            "TR",
            "IT",
            "AT"
        ]
    },
    {
        "alias": "security",
        "title": "Security Services",
        "parents": [
            "professional"
        ],
        "country_blacklist": [
            "BE",
            "CA",
            "NZ",
            "BR"
        ]
    },
    {
        "alias": "securitysystems",
        "parents": [
            "homeservices"
        ],
        "title": "Security Systems"
    },
    {
        "alias": "selfstorage",
        "parents": [
            "localservices"
        ],
        "title": "Self Storage"
    },
    {
        "country_whitelist": [
            "BE",
            "CA",
            "FR",
            "US",
            "IT"
        ],
        "title": "Senegalese",
        "parents": [
            "african"
        ],
        "alias": "senegalese"
    },
    {
        "country_whitelist": [
            "CA",
            "US"
        ],
        "title": "Septic Services",
        "parents": [
            "localservices"
        ],
        "alias": "septicservices"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "CH",
            "CL",
            "DE",
            "IT",
            "PL",
            "CZ",
            "AR",
            "AT",
            "SE"
        ],
        "title": "Serbo Croatian",
        "parents": [
            "restaurants"
        ],
        "alias": "serbocroatian"
    },
    {
        "alias": "servicestations",
        "parents": [
            "auto"
        ],
        "title": "Gas & Service Stations"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "PT",
            "DE",
            "IT",
            "US",
            "AU"
        ],
        "title": "Session Photography",
        "parents": [
            "photographers"
        ],
        "alias": "sessionphotography"
    },
    {
        "alias": "sewingalterations",
        "parents": [
            "localservices"
        ],
        "title": "Sewing & Alterations"
    },
    {
        "alias": "sextherapists",
        "parents": [
            "c_and_mh"
        ],
        "title": "Sex Therapists"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "TW",
            "JP",
            "IT",
            "US",
            "HK",
            "AU",
            "MY",
            "SG",
            "SE"
        ],
        "title": "Shanghainese",
        "parents": [
            "chinese"
        ],
        "alias": "shanghainese"
    },
    {
        "alias": "sharedofficespaces",
        "parents": [
            "realestate"
        ],
        "title": "Shared Office Spaces"
    },
    {
        "country_whitelist": [
            "DK",
            "BR",
            "NO",
            "PH",
            "TR",
            "SE"
        ],
        "title": "Shared Taxis",
        "parents": [
            "transport"
        ],
        "alias": "sharedtaxis"
    },
    {
        "country_whitelist": [
            "CL",
            "TW",
            "JP",
            "IT",
            "US",
            "CZ",
            "AR",
            "SG",
            "MX"
        ],
        "title": "Shaved Ice",
        "parents": [
            "food"
        ],
        "alias": "shavedice"
    },
    {
        "alias": "shipping_centers",
        "title": "Shipping Centers",
        "parents": [
            "localservices"
        ],
        "country_blacklist": [
            "SE",
            "NO"
        ]
    },
    {
        "alias": "shoerepair",
        "parents": [
            "localservices"
        ],
        "title": "Shoe Repair"
    },
    {
        "alias": "shoes",
        "parents": [
            "fashion"
        ],
        "title": "Shoe Stores"
    },
    {
        "alias": "shopping",
        "parents": [],
        "title": "Shopping"
    },
    {
        "alias": "shoppingcenters",
        "parents": [
            "shopping"
        ],
        "title": "Shopping Centers"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Shredding Services",
        "parents": [
            "professional"
        ],
        "alias": "shredding"
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Shrines",
        "parents": [
            "religiousorgs"
        ],
        "alias": "shrines"
    },
    {
        "alias": "shutters",
        "title": "Shutters",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Sicilian",
        "parents": [
            "italian"
        ],
        "alias": "sicilian"
    },
    {
        "country_whitelist": [
            "ES",
            "AR",
            "PT",
            "SE",
            "NO"
        ],
        "title": "Signature Cuisine",
        "parents": [
            "restaurants"
        ],
        "alias": "signature_cuisine"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "DK",
            "NO",
            "IT",
            "US",
            "NZ",
            "BR",
            "FI",
            "SG",
            "SE"
        ],
        "title": "Signmaking",
        "parents": [
            "professional"
        ],
        "alias": "signmaking"
    },
    {
        "alias": "singaporean",
        "title": "Singaporean",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "DK",
            "PT",
            "FI",
            "TR",
            "ES"
        ]
    },
    {
        "alias": "skate_parks",
        "parents": [
            "parks"
        ],
        "title": "Skate Parks"
    },
    {
        "alias": "skateshops",
        "parents": [
            "sportgoods"
        ],
        "title": "Skate Shops"
    },
    {
        "alias": "skatingrinks",
        "parents": [
            "active"
        ],
        "title": "Skating Rinks"
    },
    {
        "country_whitelist": [
            "ES",
            "CH",
            "DK",
            "PT",
            "CL",
            "CA",
            "DE",
            "JP",
            "CZ",
            "NZ",
            "AR",
            "AT",
            "FI",
            "NO",
            "SE"
        ],
        "title": "Skiing",
        "parents": [
            "active"
        ],
        "alias": "skiing"
    },
    {
        "alias": "skincare",
        "parents": [
            "beautysvc"
        ],
        "title": "Skin Care"
    },
    {
        "alias": "skiresorts",
        "title": "Ski Resorts",
        "parents": [
            "hotelstravel"
        ],
        "country_blacklist": [
            "SG",
            "DK",
            "BR",
            "MX"
        ]
    },
    {
        "alias": "skischools",
        "parents": [
            "specialtyschools"
        ],
        "title": "Ski Schools"
    },
    {
        "alias": "skishops",
        "title": "Ski & Snowboard Shops",
        "parents": [
            "sportgoods"
        ],
        "country_blacklist": [
            "DK",
            "PT",
            "TW",
            "TR",
            "HK",
            "MY",
            "BR",
            "PH",
            "SG",
            "MX"
        ]
    },
    {
        "alias": "skydiving",
        "parents": [
            "active"
        ],
        "title": "Skydiving"
    },
    {
        "country_whitelist": [
            "CH",
            "PT",
            "NO",
            "CA",
            "DE",
            "TR",
            "IT",
            "US",
            "CZ",
            "NZ",
            "AT",
            "FI"
        ],
        "title": "Sledding",
        "parents": [
            "active"
        ],
        "alias": "sledding"
    },
    {
        "alias": "sleepspecialists",
        "parents": [
            "health"
        ],
        "title": "Sleep Specialists"
    },
    {
        "country_whitelist": [
            "AU",
            "PT"
        ],
        "title": "Sleepwear",
        "parents": [
            "fashion"
        ],
        "alias": "sleepwear"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "CA",
            "IT",
            "US",
            "CZ",
            "AU",
            "GB",
            "IE",
            "PL"
        ],
        "title": "Slovakian",
        "parents": [
            "restaurants"
        ],
        "alias": "slovakian"
    },
    {
        "alias": "smog_check_stations",
        "title": "Smog Check Stations",
        "parents": [
            "auto"
        ],
        "country_blacklist": [
            "FI",
            "DK",
            "SE",
            "NO"
        ]
    },
    {
        "alias": "snorkeling",
        "title": "Snorkeling",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "CH",
            "DE",
            "AT"
        ]
    },
    {
        "alias": "snowremoval",
        "title": "Snow Removal",
        "parents": [
            "localservices"
        ],
        "country_blacklist": [
            "HK",
            "NZ",
            "MX",
            "BR"
        ]
    },
    {
        "country_whitelist": [
            "TW",
            "JP"
        ],
        "title": "Soba",
        "parents": [
            "japanese"
        ],
        "alias": "soba"
    },
    {
        "alias": "social_clubs",
        "parents": [
            "arts"
        ],
        "title": "Social Clubs"
    },
    {
        "alias": "softwaredevelopment",
        "parents": [
            "professional"
        ],
        "title": "Software Development"
    },
    {
        "alias": "solarinstallation",
        "parents": [
            "homeservices"
        ],
        "title": "Solar Installation"
    },
    {
        "country_whitelist": [
            "ES",
            "NL",
            "NO",
            "CA",
            "US",
            "GB",
            "SE",
            "IE",
            "PL"
        ],
        "title": "Soul Food",
        "parents": [
            "restaurants"
        ],
        "alias": "soulfood"
    },
    {
        "alias": "soup",
        "parents": [
            "restaurants"
        ],
        "title": "Soup"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "AU",
            "CA",
            "IT",
            "US"
        ],
        "title": "South African",
        "parents": [
            "african"
        ],
        "alias": "southafrican"
    },
    {
        "country_whitelist": [
            "NL",
            "CA",
            "TR",
            "US",
            "PL",
            "NZ",
            "GB",
            "IE",
            "SE"
        ],
        "title": "Southern",
        "parents": [
            "restaurants"
        ],
        "alias": "southern"
    },
    {
        "alias": "souvenirs",
        "title": "Souvenir Shops",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "CA",
            "SG",
            "PL"
        ]
    },
    {
        "alias": "spanish",
        "parents": [
            "restaurants"
        ],
        "title": "Spanish"
    },
    {
        "alias": "spas",
        "parents": [
            "beautysvc"
        ],
        "title": "Day Spas"
    },
    {
        "country_whitelist": [
            "DK",
            "PT"
        ],
        "title": "Special Bikes",
        "parents": [
            "bicycles"
        ],
        "alias": "specialbikes"
    },
    {
        "alias": "specialed",
        "title": "Special Education",
        "parents": [
            "education"
        ],
        "country_blacklist": [
            "FI"
        ]
    },
    {
        "alias": "specialtyschools",
        "parents": [
            "education"
        ],
        "title": "Specialty Schools"
    },
    {
        "alias": "speech_therapists",
        "parents": [
            "health"
        ],
        "title": "Speech Therapists"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "NL",
            "DK",
            "NO",
            "DE",
            "IT",
            "US",
            "ES"
        ],
        "title": "Sperm Clinic",
        "parents": [
            "health"
        ],
        "alias": "spermclinic"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Spine Surgeons",
        "parents": [
            "physicians"
        ],
        "alias": "spinesurgeons"
    },
    {
        "country_whitelist": [
            "BR"
        ],
        "title": "Spiritism",
        "parents": [
            "religiousorgs"
        ],
        "alias": "spiritism"
    },
    {
        "alias": "spiritual_shop",
        "parents": [
            "shopping"
        ],
        "title": "Spiritual Shop"
    },
    {
        "country_whitelist": [
            "CZ",
            "AU",
            "PT",
            "NO"
        ],
        "title": "Sport Equipment Hire",
        "parents": [
            "active"
        ],
        "alias": "sport_equipment_hire"
    },
    {
        "alias": "sportgoods",
        "parents": [
            "shopping"
        ],
        "title": "Sporting Goods"
    },
    {
        "alias": "sports_clubs",
        "parents": [
            "active"
        ],
        "title": "Sports Clubs"
    },
    {
        "alias": "sportsbars",
        "title": "Sports Bars",
        "parents": [
            "bars"
        ],
        "country_blacklist": [
            "CH",
            "AT"
        ]
    },
    {
        "alias": "sportsmed",
        "parents": [
            "physicians"
        ],
        "title": "Sports Medicine"
    },
    {
        "country_whitelist": [
            "NZ",
            "SG",
            "IT",
            "US"
        ],
        "title": "Sports Psychologists",
        "parents": [
            "c_and_mh"
        ],
        "alias": "sportspsychologists"
    },
    {
        "alias": "sportsteams",
        "parents": [
            "arts"
        ],
        "title": "Professional Sports Teams"
    },
    {
        "alias": "sportswear",
        "parents": [
            "sportgoods",
            "fashion"
        ],
        "title": "Sports Wear"
    },
    {
        "alias": "spraytanning",
        "title": "Spray Tanning",
        "parents": [
            "tanning"
        ],
        "country_blacklist": [
            "CA",
            "IE",
            "BR",
            "PL",
            "SE"
        ]
    },
    {
        "alias": "squash",
        "title": "Squash",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "NZ",
            "SG",
            "BR",
            "PT"
        ]
    },
    {
        "alias": "srilankan",
        "title": "Sri Lankan",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "stadiumsarenas",
        "parents": [
            "arts"
        ],
        "title": "Stadiums & Arenas"
    },
    {
        "alias": "stationery",
        "parents": [
            "artsandcrafts",
            "flowers",
            "eventservices"
        ],
        "title": "Cards & Stationery"
    },
    {
        "alias": "steak",
        "parents": [
            "restaurants"
        ],
        "title": "Steakhouses"
    },
    {
        "alias": "stereo_installation",
        "title": "Car Stereo Installation",
        "parents": [
            "auto"
        ],
        "country_blacklist": [
            "CH",
            "AT",
            "DK"
        ]
    },
    {
        "country_whitelist": [
            "CZ",
            "PT"
        ],
        "title": "Stockings",
        "parents": [
            "fashion"
        ],
        "alias": "stockings"
    },
    {
        "alias": "streetart",
        "title": "Street Art",
        "parents": [
            "arts"
        ],
        "country_blacklist": [
            "BE",
            "FR",
            "CH",
            "NL",
            "IE",
            "SG",
            "CA",
            "TR",
            "US",
            "AT",
            "FI",
            "MY",
            "ES",
            "GB"
        ]
    },
    {
        "alias": "streetvendors",
        "title": "Street Vendors",
        "parents": [
            "food"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "structuralengineers",
        "parents": [
            "homeservices"
        ],
        "title": "Structural Engineers"
    },
    {
        "alias": "stucco",
        "parents": [
            "homeservices"
        ],
        "title": "Stucco Services"
    },
    {
        "country_whitelist": [
            "BE",
            "FR"
        ],
        "title": "French Southwest",
        "parents": [
            "restaurants"
        ],
        "alias": "sud_ouest"
    },
    {
        "country_whitelist": [
            "CZ",
            "US"
        ],
        "title": "Sugaring",
        "parents": [
            "hairremoval"
        ],
        "alias": "sugaring"
    },
    {
        "country_whitelist": [
            "TW",
            "JP"
        ],
        "title": "Sukiyaki",
        "parents": [
            "japanese"
        ],
        "alias": "sukiyaki"
    },
    {
        "alias": "summer_camps",
        "parents": [
            "active"
        ],
        "title": "Summer Camps"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Supper Clubs",
        "parents": [
            "restaurants"
        ],
        "alias": "supperclubs"
    },
    {
        "country_whitelist": [
            "FR",
            "NL",
            "DK",
            "PT",
            "CL",
            "DE",
            "JP",
            "IT",
            "US",
            "NZ",
            "ES",
            "BR",
            "MX",
            "SE"
        ],
        "title": "Surfing",
        "parents": [
            "active"
        ],
        "alias": "surfing"
    },
    {
        "country_whitelist": [
            "NZ",
            "AU",
            "BR",
            "PT"
        ],
        "title": "Surf Lifesaving",
        "parents": [
            "active"
        ],
        "alias": "surflifesaving"
    },
    {
        "alias": "surfshop",
        "title": "Surf Shop",
        "parents": [
            "fashion"
        ],
        "country_blacklist": [
            "BE",
            "FR",
            "NL",
            "NO",
            "IE",
            "CA",
            "CZ",
            "BR",
            "FI",
            "SG",
            "SE"
        ]
    },
    {
        "country_whitelist": [
            "CH",
            "PT",
            "DE",
            "IT",
            "US",
            "CZ",
            "AT",
            "ES"
        ],
        "title": "Surgeons",
        "parents": [
            "physicians"
        ],
        "alias": "surgeons"
    },
    {
        "alias": "sushi",
        "parents": [
            "restaurants"
        ],
        "title": "Sushi Bars"
    },
    {
        "country_whitelist": [
            "CH",
            "DE",
            "AT"
        ],
        "title": "Swabian",
        "parents": [
            "restaurants"
        ],
        "alias": "swabian"
    },
    {
        "country_whitelist": [
            "SE"
        ],
        "title": "Swedish",
        "parents": [
            "restaurants"
        ],
        "alias": "swedish"
    },
    {
        "alias": "swimminglessons",
        "parents": [
            "specialtyschools",
            "fitness"
        ],
        "title": "Swimming Lessons/Schools"
    },
    {
        "alias": "swimmingpools",
        "parents": [
            "active"
        ],
        "title": "Swimming Pools"
    },
    {
        "alias": "swimwear",
        "parents": [
            "fashion"
        ],
        "title": "Swimwear"
    },
    {
        "country_whitelist": [
            "CZ",
            "CH",
            "DE"
        ],
        "title": "Swiss Food",
        "parents": [
            "restaurants"
        ],
        "alias": "swissfood"
    },
    {
        "alias": "synagogues",
        "parents": [
            "religiousorgs"
        ],
        "title": "Synagogues"
    },
    {
        "alias": "syrian",
        "parents": [
            "restaurants"
        ],
        "title": "Syrian"
    },
    {
        "country_whitelist": [
            "FR",
            "IE",
            "TW",
            "JP",
            "US",
            "HK",
            "NZ",
            "AU",
            "GB",
            "SG",
            "MY"
        ],
        "title": "Szechuan",
        "parents": [
            "chinese"
        ],
        "alias": "szechuan"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "IT",
            "ES",
            "CZ"
        ],
        "title": "Tabac",
        "parents": [
            "bars"
        ],
        "alias": "tabac"
    },
    {
        "country_whitelist": [
            "TR",
            "ES",
            "PT"
        ],
        "title": "Tabernas",
        "parents": [
            "restaurants"
        ],
        "alias": "tabernas"
    },
    {
        "country_whitelist": [
            "ES",
            "PT"
        ],
        "title": "Tablao Flamenco",
        "parents": [
            "arts"
        ],
        "alias": "tablaoflamenco"
    },
    {
        "alias": "tabletopgames",
        "parents": [
            "shopping"
        ],
        "title": "Tabletop Games"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "CH",
            "PT",
            "DE",
            "CZ",
            "AT",
            "BR"
        ],
        "title": "Tableware",
        "parents": [
            "homeandgarden"
        ],
        "alias": "tableware"
    },
    {
        "country_whitelist": [
            "MX"
        ],
        "title": "Tacos",
        "parents": [
            "mexican"
        ],
        "alias": "tacos"
    },
    {
        "alias": "taichi",
        "parents": [
            "fitness"
        ],
        "title": "Tai Chi"
    },
    {
        "alias": "taiwanese",
        "title": "Taiwanese",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "TR",
            "ES",
            "PT",
            "FI"
        ]
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Taiyaki",
        "parents": [
            "jpsweets"
        ],
        "alias": "taiyaki"
    },
    {
        "country_whitelist": [
            "TW",
            "JP"
        ],
        "title": "Takoyaki",
        "parents": [
            "japanese"
        ],
        "alias": "takoyaki"
    },
    {
        "alias": "talentagencies",
        "title": "Talent Agencies",
        "parents": [
            "professional"
        ],
        "country_blacklist": [
            "ES",
            "CH",
            "CL",
            "IE",
            "CA",
            "TR",
            "CZ",
            "NZ",
            "AU",
            "AT",
            "HK",
            "SG",
            "PL",
            "GB"
        ]
    },
    {
        "country_whitelist": [
            "MX"
        ],
        "title": "Tamales",
        "parents": [
            "mexican"
        ],
        "alias": "tamales"
    },
    {
        "alias": "tanning",
        "parents": [
            "beautysvc"
        ],
        "title": "Tanning"
    },
    {
        "alias": "tanningbeds",
        "title": "Tanning Beds",
        "parents": [
            "tanning"
        ],
        "country_blacklist": [
            "FI",
            "BR",
            "PL",
            "SE"
        ]
    },
    {
        "country_whitelist": [
            "TW"
        ],
        "title": "Taoist Temples",
        "parents": [
            "religiousorgs"
        ],
        "alias": "taoisttemples"
    },
    {
        "alias": "tapas",
        "title": "Tapas Bars",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "CZ",
            "AU",
            "SG",
            "FI"
        ]
    },
    {
        "alias": "tapasmallplates",
        "parents": [
            "restaurants"
        ],
        "title": "Tapas/Small Plates"
    },
    {
        "alias": "tastingclasses",
        "parents": [
            "education"
        ],
        "title": "Tasting Classes"
    },
    {
        "alias": "tattoo",
        "parents": [
            "beautysvc"
        ],
        "title": "Tattoo"
    },
    {
        "alias": "tattooremoval",
        "parents": [
            "physicians"
        ],
        "title": "Tattoo Removal"
    },
    {
        "alias": "taxidermy",
        "title": "Taxidermy",
        "parents": [
            "professional"
        ],
        "country_blacklist": [
            "NL",
            "DK",
            "NO",
            "IE",
            "CA",
            "CZ",
            "NZ",
            "BR",
            "FI",
            "SG",
            "SE"
        ]
    },
    {
        "alias": "taxis",
        "parents": [
            "transport"
        ],
        "title": "Taxis"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "DE",
            "US",
            "CZ",
            "AU",
            "BR",
            "SG"
        ],
        "title": "Tax Law",
        "parents": [
            "lawyers"
        ],
        "alias": "taxlaw"
    },
    {
        "alias": "taxoffice",
        "title": "Tax Office",
        "parents": [
            "publicservicesgovt"
        ],
        "country_blacklist": [
            "ES",
            "CA",
            "SG",
            "PL",
            "US"
        ]
    },
    {
        "alias": "taxservices",
        "parents": [
            "financialservices"
        ],
        "title": "Tax Services"
    },
    {
        "alias": "tcm",
        "title": "Traditional Chinese Medicine",
        "parents": [
            "health"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "tea",
        "parents": [
            "food"
        ],
        "title": "Tea Rooms"
    },
    {
        "alias": "teethwhitening",
        "title": "Teeth Whitening",
        "parents": [
            "beautysvc"
        ],
        "country_blacklist": [
            "CH",
            "DE",
            "AT"
        ]
    },
    {
        "alias": "telecommunications",
        "title": "Telecommunications",
        "parents": [
            "itservices"
        ],
        "country_blacklist": [
            "HK",
            "AR",
            "JP",
            "MX",
            "CL"
        ]
    },
    {
        "alias": "televisionserviceproviders",
        "parents": [
            "homeservices"
        ],
        "title": "Television Service Providers"
    },
    {
        "alias": "televisionstations",
        "parents": [
            "massmedia"
        ],
        "title": "Television Stations"
    },
    {
        "country_whitelist": [
            "JP",
            "SG",
            "TW"
        ],
        "title": "Tempura",
        "parents": [
            "japanese"
        ],
        "alias": "tempura"
    },
    {
        "alias": "tenantlaw",
        "title": "Tenant and Eviction Law",
        "parents": [
            "professional"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "tennis",
        "parents": [
            "active"
        ],
        "title": "Tennis"
    },
    {
        "country_whitelist": [
            "HK",
            "SG",
            "MY",
            "TW"
        ],
        "title": "Teochew",
        "parents": [
            "chinese"
        ],
        "alias": "teochew"
    },
    {
        "country_whitelist": [
            "TW",
            "JP",
            "US",
            "HK",
            "NZ",
            "AU",
            "SG",
            "MX"
        ],
        "title": "Teppanyaki",
        "parents": [
            "japanese"
        ],
        "alias": "teppanyaki"
    },
    {
        "alias": "testprep",
        "parents": [
            "education"
        ],
        "title": "Test Preparation"
    },
    {
        "alias": "tex-mex",
        "title": "Tex-Mex",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "AU",
            "DK",
            "ES",
            "PT"
        ]
    },
    {
        "alias": "thai",
        "parents": [
            "restaurants"
        ],
        "title": "Thai"
    },
    {
        "alias": "theater",
        "parents": [
            "arts"
        ],
        "title": "Performing Arts"
    },
    {
        "alias": "threadingservices",
        "parents": [
            "hairremoval"
        ],
        "title": "Threading Services"
    },
    {
        "alias": "thrift_stores",
        "title": "Thrift Stores",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "FI"
        ]
    },
    {
        "country_whitelist": [
            "SE",
            "PT",
            "NO",
            "FI",
            "CL",
            "PL"
        ],
        "title": "Tickets",
        "parents": [
            "shopping"
        ],
        "alias": "tickets"
    },
    {
        "alias": "ticketsales",
        "title": "Ticket Sales",
        "parents": [
            "arts"
        ],
        "country_blacklist": [
            "ES",
            "NL",
            "IE",
            "TR",
            "NZ",
            "PL",
            "BR",
            "FI",
            "SG",
            "SE",
            "GB"
        ]
    },
    {
        "alias": "tiling",
        "title": "Tiling",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "BE",
            "NL",
            "PT",
            "IE",
            "JP",
            "CA",
            "TR",
            "HK",
            "GB",
            "BR",
            "TW",
            "FI",
            "PH",
            "MY",
            "PL"
        ]
    },
    {
        "alias": "tires",
        "parents": [
            "auto"
        ],
        "title": "Tires"
    },
    {
        "alias": "tobaccoshops",
        "parents": [
            "shopping"
        ],
        "title": "Tobacco Shops"
    },
    {
        "country_whitelist": [
            "JP"
        ],
        "title": "Tofu Shops",
        "parents": [
            "gourmet"
        ],
        "alias": "tofu"
    },
    {
        "country_whitelist": [
            "JP",
            "SG",
            "TW"
        ],
        "title": "Tonkatsu",
        "parents": [
            "japanese"
        ],
        "alias": "tonkatsu"
    },
    {
        "country_whitelist": [
            "TR"
        ],
        "title": "Torshi",
        "parents": [
            "food"
        ],
        "alias": "torshi"
    },
    {
        "country_whitelist": [
            "MX"
        ],
        "title": "Tortillas",
        "parents": [
            "food"
        ],
        "alias": "tortillas"
    },
    {
        "alias": "tours",
        "parents": [
            "hotelstravel"
        ],
        "title": "Tours"
    },
    {
        "alias": "towing",
        "parents": [
            "auto"
        ],
        "title": "Towing"
    },
    {
        "alias": "toys",
        "parents": [
            "shopping"
        ],
        "title": "Toy Stores"
    },
    {
        "alias": "tradamerican",
        "parents": [
            "restaurants"
        ],
        "title": "American (Traditional)"
    },
    {
        "country_whitelist": [
            "CH",
            "NL",
            "PT",
            "NO",
            "JP",
            "DE",
            "TR",
            "IT",
            "CZ",
            "NZ",
            "AT",
            "FI",
            "MX"
        ],
        "title": "Trade Fairs",
        "parents": [
            "festivals"
        ],
        "alias": "tradefairs"
    },
    {
        "country_whitelist": [
            "SE"
        ],
        "title": "Traditional Swedish",
        "parents": [
            "restaurants"
        ],
        "alias": "traditional_swedish"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Trailer Dealers",
        "parents": [
            "auto"
        ],
        "alias": "trailerdealers"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Trailer Repair",
        "parents": [
            "auto"
        ],
        "alias": "trailerrepair"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "DK",
            "NO",
            "DE",
            "US",
            "CZ",
            "AU",
            "BR",
            "SE"
        ],
        "title": "Trains",
        "parents": [
            "transport"
        ],
        "alias": "trains"
    },
    {
        "alias": "trainstations",
        "parents": [
            "hotelstravel"
        ],
        "title": "Train Stations"
    },
    {
        "country_whitelist": [
            "DK",
            "CA",
            "TR",
            "IT",
            "US",
            "CZ",
            "AU",
            "PL"
        ],
        "title": "Trampoline Parks",
        "parents": [
            "active"
        ],
        "alias": "trampoline"
    },
    {
        "alias": "translationservices",
        "title": "Translation Services",
        "parents": [
            "professional"
        ],
        "country_blacklist": [
            "SE"
        ]
    },
    {
        "alias": "transmissionrepair",
        "title": "Transmission Repair",
        "parents": [
            "auto"
        ],
        "country_blacklist": [
            "CH",
            "AT",
            "PH",
            "DE",
            "MY",
            "IT"
        ]
    },
    {
        "alias": "transport",
        "parents": [
            "hotelstravel"
        ],
        "title": "Transportation"
    },
    {
        "country_whitelist": [
            "PT"
        ],
        "title": "Tras-os-Montes",
        "parents": [
            "portuguese"
        ],
        "alias": "tras_os_montes"
    },
    {
        "country_whitelist": [
            "FR",
            "IT"
        ],
        "title": "Trattorie",
        "parents": [
            "restaurants"
        ],
        "alias": "trattorie"
    },
    {
        "alias": "travelservices",
        "parents": [
            "hotelstravel"
        ],
        "title": "Travel Services"
    },
    {
        "alias": "treeservices",
        "parents": [
            "homeservices"
        ],
        "title": "Tree Services"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Trinidadian",
        "parents": [
            "caribbean"
        ],
        "alias": "trinidadian"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Trivia Hosts",
        "parents": [
            "eventservices"
        ],
        "alias": "triviahosts"
    },
    {
        "alias": "trophyshops",
        "title": "Trophy Shops",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "DK",
            "NO",
            "CA",
            "TR",
            "CZ",
            "NZ",
            "BR",
            "FI",
            "SG",
            "SE"
        ]
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "PT",
            "CL",
            "CA",
            "DE",
            "IT",
            "US",
            "NO",
            "AR",
            "AU",
            "MX",
            "PL"
        ],
        "title": "Truck Rental",
        "parents": [
            "auto"
        ],
        "alias": "truck_rental"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "CH",
            "DK",
            "CL",
            "DE",
            "IT",
            "US",
            "NO",
            "AR",
            "AT",
            "BR",
            "MX",
            "ES"
        ],
        "title": "Commercial Truck Dealers",
        "parents": [
            "auto"
        ],
        "alias": "truckdealers"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "CH",
            "CL",
            "DE",
            "IT",
            "US",
            "AR",
            "AT",
            "BR",
            "MX",
            "ES"
        ],
        "title": "Commercial Truck Repair",
        "parents": [
            "auto"
        ],
        "alias": "truckrepair"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Tubing",
        "parents": [
            "active"
        ],
        "alias": "tubing"
    },
    {
        "alias": "tuina",
        "parents": [
            "tcm"
        ],
        "title": "Tui Na"
    },
    {
        "alias": "turkish",
        "title": "Turkish",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "ES"
        ]
    },
    {
        "country_whitelist": [
            "TR"
        ],
        "title": "Turkish Ravioli",
        "parents": [
            "turkish"
        ],
        "alias": "turkishravioli"
    },
    {
        "country_whitelist": [
            "FR",
            "IT",
            "US"
        ],
        "title": "Tuscan",
        "parents": [
            "italian"
        ],
        "alias": "tuscan"
    },
    {
        "alias": "tutoring",
        "parents": [
            "education"
        ],
        "title": "Tutoring Centers"
    },
    {
        "country_whitelist": [
            "HK",
            "FI",
            "DK",
            "NO",
            "TW",
            "JP",
            "SE"
        ],
        "title": "Udon",
        "parents": [
            "japanese"
        ],
        "alias": "udon"
    },
    {
        "alias": "ukrainian",
        "title": "Ukrainian",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "TR",
            "DK",
            "ES"
        ]
    },
    {
        "country_whitelist": [
            "TW",
            "JP"
        ],
        "title": "Unagi",
        "parents": [
            "japanese"
        ],
        "alias": "unagi"
    },
    {
        "alias": "uniforms",
        "title": "Uniforms",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "CH",
            "NL",
            "DK",
            "CL",
            "JP",
            "TR",
            "PL",
            "CZ",
            "AR",
            "AT",
            "IE",
            "SE"
        ]
    },
    {
        "alias": "university_housing",
        "parents": [
            "realestate"
        ],
        "title": "University Housing"
    },
    {
        "alias": "unofficialyelpevents",
        "parents": [
            "localflavor"
        ],
        "title": "Unofficial Yelp Events"
    },
    {
        "alias": "urgent_care",
        "parents": [
            "health"
        ],
        "title": "Urgent Care"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "CH",
            "PT",
            "CA",
            "DE",
            "JP",
            "IT",
            "US",
            "CZ",
            "AT",
            "FI",
            "IE",
            "GB"
        ],
        "title": "Urologists",
        "parents": [
            "physicians"
        ],
        "alias": "urologists"
    },
    {
        "alias": "usedbooks",
        "title": "Used Bookstore",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "BE",
            "NL",
            "CL",
            "JP",
            "CA",
            "TR",
            "AR",
            "AU"
        ]
    },
    {
        "country_whitelist": [
            "AU",
            "GB",
            "PT",
            "SG",
            "IT",
            "US"
        ],
        "title": "Utilities",
        "parents": [
            "homeservices"
        ],
        "alias": "utilities"
    },
    {
        "country_whitelist": [
            "CZ",
            "US"
        ],
        "title": "Uzbek",
        "parents": [
            "restaurants"
        ],
        "alias": "uzbek"
    },
    {
        "alias": "vacation_rentals",
        "title": "Vacation Rentals",
        "parents": [
            "hotelstravel"
        ],
        "country_blacklist": [
            "SG",
            "AT"
        ]
    },
    {
        "alias": "vacationrentalagents",
        "title": "Vacation Rental Agents",
        "parents": [
            "hotelstravel"
        ],
        "country_blacklist": [
            "SG",
            "ES"
        ]
    },
    {
        "country_whitelist": [
            "TR",
            "BR",
            "US"
        ],
        "title": "Valet Services",
        "parents": [
            "eventservices"
        ],
        "alias": "valetservices"
    },
    {
        "alias": "vapeshops",
        "title": "Vape Shops",
        "parents": [
            "shopping"
        ],
        "country_blacklist": [
            "SG"
        ]
    },
    {
        "alias": "vegan",
        "parents": [
            "restaurants"
        ],
        "title": "Vegan"
    },
    {
        "alias": "vegetarian",
        "parents": [
            "restaurants"
        ],
        "title": "Vegetarian"
    },
    {
        "alias": "vehicleshipping",
        "title": "Vehicle Shipping",
        "parents": [
            "auto"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "alias": "vehiclewraps",
        "title": "Vehicle Wraps",
        "parents": [
            "auto"
        ],
        "country_blacklist": [
            "BE",
            "FR",
            "CH",
            "AT",
            "DE",
            "TR"
        ]
    },
    {
        "country_whitelist": [
            "IT"
        ],
        "title": "Venetian",
        "parents": [
            "italian"
        ],
        "alias": "venetian"
    },
    {
        "country_whitelist": [
            "CA",
            "US"
        ],
        "title": "Venezuelan",
        "parents": [
            "latin"
        ],
        "alias": "venezuelan"
    },
    {
        "country_whitelist": [
            "IT",
            "PL"
        ],
        "title": "Venison",
        "parents": [
            "restaurants"
        ],
        "alias": "venison"
    },
    {
        "alias": "venues",
        "parents": [
            "eventservices"
        ],
        "title": "Venues & Event Spaces"
    },
    {
        "alias": "vet",
        "parents": [
            "pets"
        ],
        "title": "Veterinarians"
    },
    {
        "alias": "videoandgames",
        "parents": [
            "media"
        ],
        "title": "Videos & Video Game Rental"
    },
    {
        "alias": "videofilmproductions",
        "parents": [
            "professional"
        ],
        "title": "Video/Film Production"
    },
    {
        "alias": "videogamestores",
        "parents": [
            "media"
        ],
        "title": "Video Game Stores"
    },
    {
        "alias": "videographers",
        "parents": [
            "eventservices"
        ],
        "title": "Videographers"
    },
    {
        "alias": "vietnamese",
        "parents": [
            "restaurants"
        ],
        "title": "Vietnamese"
    },
    {
        "alias": "vintage",
        "parents": [
            "fashion"
        ],
        "title": "Used, Vintage & Consignment"
    },
    {
        "alias": "vinyl_records",
        "parents": [
            "media"
        ],
        "title": "Vinyl Records"
    },
    {
        "country_whitelist": [
            "SE",
            "US"
        ],
        "title": "Vinyl Siding",
        "parents": [
            "homeservices"
        ],
        "alias": "vinylsiding"
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "NO",
            "JP",
            "DE",
            "TR",
            "IT",
            "US",
            "NZ",
            "ES",
            "BR",
            "SE"
        ],
        "title": "Vitamins & Supplements",
        "parents": [
            "shopping"
        ],
        "alias": "vitaminssupplements"
    },
    {
        "alias": "vocation",
        "parents": [
            "specialtyschools"
        ],
        "title": "Vocational & Technical School"
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "NO",
            "DE",
            "JP",
            "CZ",
            "NZ",
            "AU",
            "AT",
            "BR",
            "FI",
            "SG",
            "SE"
        ],
        "title": "Volleyball",
        "parents": [
            "active"
        ],
        "alias": "volleyball"
    },
    {
        "alias": "walkinclinics",
        "title": "Walk-in Clinics",
        "parents": [
            "medcenters"
        ],
        "country_blacklist": [
            "CH",
            "DE",
            "AT"
        ]
    },
    {
        "alias": "walkingtours",
        "parents": [
            "tours"
        ],
        "title": "Walking Tours"
    },
    {
        "alias": "watch_repair",
        "parents": [
            "localservices"
        ],
        "title": "Watch Repair"
    },
    {
        "alias": "watches",
        "parents": [
            "shopping"
        ],
        "title": "Watches"
    },
    {
        "country_whitelist": [
            "HK",
            "PH",
            "MY",
            "BR",
            "US"
        ],
        "title": "Water Delivery",
        "parents": [
            "localservices"
        ],
        "alias": "waterdelivery"
    },
    {
        "alias": "waterheaterinstallrepair",
        "parents": [
            "homeservices"
        ],
        "title": "Water Heater Installation/Repair"
    },
    {
        "alias": "waterparks",
        "title": "Water Parks",
        "parents": [
            "active"
        ],
        "country_blacklist": [
            "BE",
            "CH",
            "CL",
            "CA",
            "DE",
            "HK",
            "AR",
            "AU",
            "AT",
            "FI",
            "IE",
            "NL",
            "PT",
            "NZ",
            "MY",
            "GB"
        ]
    },
    {
        "alias": "waterproofing",
        "parents": [
            "homeservices"
        ],
        "title": "Waterproofing"
    },
    {
        "alias": "waterpurification",
        "title": "Water Purification Services",
        "parents": [
            "homeservices"
        ],
        "country_blacklist": [
            "CZ"
        ]
    },
    {
        "country_whitelist": [
            "NZ",
            "AU"
        ],
        "title": "Water Taxis",
        "parents": [
            "transport"
        ],
        "alias": "watertaxis"
    },
    {
        "alias": "waxing",
        "parents": [
            "hairremoval"
        ],
        "title": "Waxing"
    },
    {
        "alias": "web_design",
        "parents": [
            "professional"
        ],
        "title": "Web Design"
    },
    {
        "alias": "wedding_planning",
        "parents": [
            "eventservices"
        ],
        "title": "Wedding Planning"
    },
    {
        "country_whitelist": [
            "AU",
            "JP",
            "US"
        ],
        "title": "Wedding Chapels",
        "parents": [
            "eventservices"
        ],
        "alias": "weddingchappels"
    },
    {
        "alias": "weightlosscenters",
        "parents": [
            "health"
        ],
        "title": "Weight Loss Centers"
    },
    {
        "country_whitelist": [
            "DK",
            "CL",
            "NO",
            "IT",
            "US",
            "AR",
            "ES",
            "BR",
            "MX",
            "PL"
        ],
        "title": "Well Drilling",
        "parents": [
            "localservices"
        ],
        "alias": "welldrilling"
    },
    {
        "country_whitelist": [
            "JP",
            "SG",
            "TW"
        ],
        "title": "Western Style Japanese Food",
        "parents": [
            "japanese"
        ],
        "alias": "westernjapanese"
    },
    {
        "country_whitelist": [
            "IT",
            "US",
            "PT"
        ],
        "title": "Wheel & Rim Repair",
        "parents": [
            "auto"
        ],
        "alias": "wheelrimrepair"
    },
    {
        "alias": "wholesale_stores",
        "parents": [
            "shopping"
        ],
        "title": "Wholesale Stores"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "PT",
            "NO",
            "CA",
            "DE",
            "IT",
            "US",
            "CZ",
            "AU",
            "FI",
            "MX",
            "ES"
        ],
        "title": "Wigs",
        "parents": [
            "shopping"
        ],
        "alias": "wigs"
    },
    {
        "country_whitelist": [
            "US"
        ],
        "title": "Wildlife Hunting Ranges",
        "parents": [
            "active"
        ],
        "alias": "wildlifehunting"
    },
    {
        "country_whitelist": [
            "SG",
            "AU",
            "NL",
            "IT",
            "US"
        ],
        "title": "Wills, Trusts, & Probates",
        "parents": [
            "estateplanning"
        ],
        "alias": "willstrustsprobates"
    },
    {
        "alias": "windowsinstallation",
        "parents": [
            "homeservices"
        ],
        "title": "Windows Installation"
    },
    {
        "alias": "windowwashing",
        "parents": [
            "homeservices"
        ],
        "title": "Window Washing"
    },
    {
        "alias": "windshieldinstallrepair",
        "title": "Windshield Installation & Repair",
        "parents": [
            "auto"
        ],
        "country_blacklist": [
            "CZ",
            "CH",
            "DE",
            "AT"
        ]
    },
    {
        "alias": "wine_bars",
        "parents": [
            "bars"
        ],
        "title": "Wine Bars"
    },
    {
        "alias": "wineries",
        "title": "Wineries",
        "parents": [
            "food",
            "arts"
        ],
        "country_blacklist": [
            "FI"
        ]
    },
    {
        "alias": "winetasteclasses",
        "parents": [
            "tastingclasses"
        ],
        "title": "Wine Tasting Classes"
    },
    {
        "alias": "winetastingroom",
        "parents": [
            "wineries"
        ],
        "title": "Wine Tasting Room"
    },
    {
        "alias": "winetours",
        "parents": [
            "tours"
        ],
        "title": "Wine Tours"
    },
    {
        "alias": "wok",
        "title": "Wok",
        "parents": [
            "restaurants"
        ],
        "country_blacklist": [
            "IE",
            "JP",
            "CA",
            "TR",
            "IT",
            "US",
            "HK",
            "NZ",
            "AR",
            "AU",
            "GB",
            "BR",
            "TW",
            "SG",
            "PL"
        ]
    },
    {
        "alias": "womenscloth",
        "parents": [
            "fashion"
        ],
        "title": "Women's Clothing"
    },
    {
        "country_whitelist": [
            "CZ",
            "DK",
            "PT",
            "NO",
            "TR",
            "SE"
        ],
        "title": "Wraps",
        "parents": [
            "restaurants"
        ],
        "alias": "wraps"
    },
    {
        "alias": "xmasmarkets",
        "title": "Christmas Markets",
        "parents": [
            "festivals"
        ],
        "country_blacklist": [
            "NZ",
            "BR",
            "TR",
            "CA",
            "SG",
            "IE",
            "US"
        ]
    },
    {
        "country_whitelist": [
            "JP",
            "SG",
            "TW"
        ],
        "title": "Yakiniku",
        "parents": [
            "japanese"
        ],
        "alias": "yakiniku"
    },
    {
        "country_whitelist": [
            "JP",
            "SG",
            "TW"
        ],
        "title": "Yakitori",
        "parents": [
            "japanese"
        ],
        "alias": "yakitori"
    },
    {
        "alias": "yelpevents",
        "parents": [
            "localflavor"
        ],
        "title": "Yelp Events"
    },
    {
        "alias": "yoga",
        "parents": [
            "fitness"
        ],
        "title": "Yoga"
    },
    {
        "country_whitelist": [
            "FR",
            "DK",
            "PT",
            "NO",
            "FI",
            "IT",
            "SE"
        ],
        "title": "Youth Club",
        "parents": [
            "localservices"
        ],
        "alias": "youth_club"
    },
    {
        "country_whitelist": [
            "MX"
        ],
        "title": "Yucatan",
        "parents": [
            "mexican"
        ],
        "alias": "yucatan"
    },
    {
        "country_whitelist": [
            "BE",
            "FR",
            "AU",
            "PT",
            "IT",
            "SE"
        ],
        "title": "Yugoslav",
        "parents": [
            "restaurants"
        ],
        "alias": "yugoslav"
    },
    {
        "country_whitelist": [
            "PL"
        ],
        "title": "Zapiekanka",
        "parents": [
            "food"
        ],
        "alias": "zapiekanka"
    },
    {
        "alias": "zipline",
        "parents": [
            "active"
        ],
        "title": "Ziplining"
    },
    {
        "alias": "zoos",
        "parents": [
            "active"
        ],
        "title": "Zoos"
    },
    {
        "country_whitelist": [
            "CZ",
            "NZ",
            "PT"
        ],
        "title": "Zorbing",
        "parents": [
            "active"
        ],
        "alias": "zorbing"
    }
  ].forEach(function (obj) {
    YelpCategories.insert(obj);
  });
}
