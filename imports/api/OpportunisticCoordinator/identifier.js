import { Availability } from "./databaseHelpers";

export const getUserAvailabilities = (uid) => {
    Availability.find({"needUserMaps.users.uid": uid});
}
