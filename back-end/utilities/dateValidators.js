import { DateTime } from 'luxon';

export function isToday(winnerDetails) {
  if (winnerDetails && winnerDetails.winTime) {
    const winDateTime = DateTime.fromJSDate(winnerDetails.winTime).setZone("Asia/Dubai");

    const nowInDubai = DateTime.now().setZone('Asia/Dubai');

    const isSameDay = winDateTime.hasSame(nowInDubai, 'day');
    return isSameDay;
  }

  return false;
}
