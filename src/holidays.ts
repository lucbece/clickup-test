import { getHolidayRequests, getUserId } from "./cu-endpoints";

export const mainRoutine = async () => {
    try {
        const userId = await getUserId('xoana.terry@nan-labs.com')

        const response = await getHolidayRequests("3014728");

    } catch (err) {
        console.log(err);
      }
};


