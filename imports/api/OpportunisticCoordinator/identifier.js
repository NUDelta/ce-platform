

import { Availability } from "./databaseHelpers";

export const getUserAvailabilities = (uid) => {
    return Availability.find({"needUserMaps.users.uid": uid});
}
