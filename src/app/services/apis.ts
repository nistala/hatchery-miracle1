const baseUrl = 'http://52.4.57.247:8080/hatchery'
export const apis = {
  //authentication
  ownerLogin: baseUrl + '/users/login',
  driverRegister: baseUrl + '/users/register',
  driversStatusDetails: baseUrl + '/checkin/driver-details',
  driverCheckinFromAvailableList: baseUrl + '/checkin',
  driversList: baseUrl + '/users',
  roundwiseDriverDetails: baseUrl + '/checkin/completed-drivers',
  availableDriversListForCheckIn: baseUrl + '/checkin/available-drivers',
  newRound: baseUrl + '/checkin/start-new-round',
  completeCurrentRound: baseUrl + '/checkin/complete-round',
  ownerRegister: baseUrl + '/users/register',
  ownerList: baseUrl + '/users/owners'
}

