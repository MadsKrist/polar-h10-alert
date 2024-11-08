<script>
  import { HeartRateSensor } from './lib/heartRateSensor';
  import StepHome from './steps/Home.svelte';
  import StepSetup from './steps/Setup.svelte';
  import StepRun from './steps/Run.svelte';
  import { lowBeep, highBeep, high, normal, low } from './lib/sound';

  Howler.autoUnlock = false;

  let highAlerted = false;
  let normalAlerted = false;
  let lowAlerted = false;
  let isConnecting = false;
  let step = 'home';
  let heartRange = [40, 220];
  let volume = [90];
  const cacheHeartRange = localStorage.getItem('heartRange');
  if (cacheHeartRange) {
    heartRange = cacheHeartRange.split(',');
  }
  const cacheVolume = localStorage.getItem('volume');
  if (cacheVolume) {
    volume = cacheVolume.split(',');
  }
  let heartRate = 0;
  let hearRateBeat = false;
  let isTooLow = false;
  let isTooHigh = false;

  const heartRateSensor = new HeartRateSensor();

  async function connect() {
    try {
      isConnecting = true;
      await heartRateSensor.connect();
      await heartRateSensor.enableMultiConnection();
      step = 'setup';
    } catch (err) {
      alert(err);
    }
    isConnecting = false;
	}

  async function start() {
    heartRate = 0;
    isTooLow = false;
    isTooHigh = false;
    highAlerted = false;
    normalAlerted = false;
    lowAlerted = false;
    step = 'run';

    try {
      await heartRateSensor.characteristicHeartRate.startNotifications();
      heartRateSensor.characteristicHeartRate.addEventListener('characteristicvaluechanged', beat);
    } catch (err) {
      alert(err);
      step = 'home';
    }
  }

  async function stop() {
    try {
      await heartRateSensor.characteristicHeartRate.stopNotifications();
      heartRateSensor.characteristicHeartRate.removeEventListener('characteristicvaluechanged', beat);
    } catch (err) {
      alert(err);
    }
    step = 'setup';
  }

  function beat(event) {
    if (hearRateBeat) return;
    hearRateBeat = true;

    var heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value);
    heartRate = heartRateMeasurement.heartRate;
    const [min, max] = heartRange;
    const xVol = 200;

    if(heartRate > 180 && highAlerted == false)
    {
      console.log("alerted high");
	    highAlerted = true;
	    normalAlerted = false;
      lowAlerted = false;
	    high(200);
    }
    else if(heartRate < 150 && heartRate > 130 && normalAlerted == false)
    {
      console.log("alerted normal");
   	  normalAlerted = true;
      highAlerted = false;
	    lowAlerted = false;
	    normal(200);
    }
    else if(heartRate < 130 && lowAlerted == false)
    {
      console.log("alerted low");
    	lowAlerted = true;
	    highAlerted = false;
      normalAlerted = false;
	    low(200);
    }
    

    setTimeout(() => {
      hearRateBeat = false;
    }, 300);
  }
</script>

<div class="container">
  {#if step === 'home'}
  <StepHome connect={connect} />
  {:else if step === 'setup'}
  <StepSetup heartRange={heartRange} volume={volume} start={start} />
  {:else if step === 'run'}
  <StepRun isTooHigh={isTooHigh} isTooLow={isTooLow} hearRateBeat={hearRateBeat} heartRate={heartRate} stop={stop} />
  {/if}
  <div class="footer">
    <a href="https://github.com/nikashitsa/polar-h10-alert">Source code</a>
  </div>
</div>
