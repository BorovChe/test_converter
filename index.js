function convert(input) {
  if (!input) return;

  const {
    deviceInfo: { deviceName, deviceProfileName, devEui },
    time,
    data,
  } = input;

  //Timestamp (ts) Conversion
  const timeStamp = Date.parse(time);

  // Base64 Decoding
  const hex = window
    .atob(data)
    .split(``)
    .map(el => {
      return ('0' + el.charCodeAt(0).toString(16)).slice(-2);
    });

  //Channel Parsing
  const channels = { battery: hex.splice(0, 3), temperature: hex.splice(0, 4), humidity: hex.splice(0, 3) };

  //Parsed Values
  const parsedValues = {
    battery: parseInt(channelsParse(channels.battery)[2], 16),
    temperature: parseInt(channelsParse(channels.temperature)[2], 16) / 100,
    humidity: parseInt(channelsParse(channels.humidity)[2], 16),
  };

  const output = {
    deviceName: deviceName,
    deviceType: deviceProfileName,
    attributes: { devEui: devEui },
    telemetry: {
      ts: timeStamp,
      values: parsedValues,
    },
  };

  return JSON.stringify(output);
}

function channelsParse(arr) {
  if (arr.length < 4) {
    return arr.map(el => '0x' + el);
  } else {
    const newArr = arr.splice(0, 2);
    return ['0x' + newArr[0], '0x' + newArr[1], '0x' + arr.join('')];
  }
}
