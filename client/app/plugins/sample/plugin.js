/* eslint-disable */
function onStart () {
  console.log('Bench Wallet Initated and Started!')
}

function onSelectAccount (account) {
  var localaccount = triggerEvent('getLocalAccount', account.address)
  console.log(localaccount)
}
/* eslint-enable */
